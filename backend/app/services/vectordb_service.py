import os
import logging
import random
import numpy as np
import torch
from fastapi import HTTPException, Request
from dotenv import load_dotenv
from astrapy import DataAPIClient
from services.openai_service import OpenAIService
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import openai
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

ASTRA_DB_APPLICATION_TOKEN = os.getenv("ASTRA_DB_APPLICATION_TOKEN")
ASTRA_DB_ENDPOINT = os.getenv("ASTRA_DB_ENDPOINT")
ASTRA_DB_KEYSPACE = os.getenv("ASTRA_DB_KEYSPACE", "SWMH")
OPENAI_API_KEY= os.getenv("OPENAI_API_KEY")
client = DataAPIClient(ASTRA_DB_APPLICATION_TOKEN)
db = client.get_database_by_api_endpoint(ASTRA_DB_ENDPOINT, keyspace=ASTRA_DB_KEYSPACE)

class VectoredService:
    def __init__(self):
        if not ASTRA_DB_APPLICATION_TOKEN or not ASTRA_DB_ENDPOINT or not ASTRA_DB_KEYSPACE:
            raise ValueError("AstraDB credentials are not properly set")

        self.openai_api_key = OPENAI_API_KEY
        openai.api_key = self.openai_api_key

        self.temperature = 1.5

    def retrieve_related_data(self, prediction_label: str):
        try:
            logger.info(f"Retrieving data for prediction label (class): {prediction_label}")
            
            collection = db.get_collection("mental_advice1")

            document = collection.find_one({"class": prediction_label},
                                             projection= {"$vector": True, "suggestions": True, "_id": False}  # Only fetch required fields
            )

            if document:
                #logger.info(f'document: {document}')
                return document
            else:
                logger.warning(f"No related data found for class: {prediction_label}")
                return None
        except Exception as e:
            logger.error(f"Error retrieving related data: {str(e)}")
            raise ValueError(f"Failed to retrieve related data: {str(e)}")

    def generate_openai_embedding(self, text: str) -> np.ndarray:
            """
            Generates embeddings for the given text using OpenAI's embedding model.
            """
            try:
                response = openai.embeddings.create(
                    input=[text],
                    model="text-embedding-ada-002"
                )
                # Access the embedding from the response
                
                embedding = response.data[0].embedding
                
                return np.array(embedding)
            except Exception as e:
                logger.error(f"Error generating OpenAI embedding: {str(e)}")
                raise ValueError(f"Failed to generate OpenAI embedding: {str(e)}")


    async def generate_advice(self, prediction_label: str, diary_content: str) -> str:
        try:
            related_data = self.retrieve_related_data(prediction_label.lower())

            if related_data:
                db_suggestions = related_data['suggestions']
                db_embeddings = np.array(related_data.get("$vector", []))

                if db_embeddings.ndim == 1:
                        db_embeddings = db_embeddings.reshape(1, -1)  # Single sample case
                elif db_embeddings.ndim != 2: 
                  raise ValueError("Database embeddings must be 2D.") 

                openai_service = OpenAIService()
                attempt_count = 0
                highest_similarity = 0
                best_response = "We couldn't process your request at this time. Please try again or share more details for better advice."

                while highest_similarity < 0.6 and attempt_count < 5:
                    attempt_count += 1

                    system_prompt = f"""
                    You are a helpful and empathetic therapist. Based on the following diary content and emotional prediction, 
                    provide advice tailored to the user's current state of mind.
    
                    Diary Content: {diary_content}
                    Mental Disorder Prediction Label: {prediction_label}
    
                    To help, refer to these suggestions from vector db:
                    {db_suggestions}
                    
                    - Your response should be guided by the suggestions from the vector database above.
                    - You do not need to use all suggestions, but your response should be based on them.
                    - Provide advice that aligns with the diary content and the prediction label.
                    - Keep in mind that the prediction may not always be accurate; consider the diary content carefully.
                    - We use four prediction labels: anxiety, bipolar, suicide watch, and depression.
                    - If you determine that the content is definitely not about anxiety, bipolar disorder, suicide watch, or depression and instead discusses positive feelings, ignore the suggestions from the vector database and do not generate advice. In this case, simply acknowledge and go along with the user’s content, even if the prediction label is anxiety, bipolar, suicide watch, or depression.
                    - Otherwise, ensure that your response closely aligns with the language and tone of the suggestions provided by the vector database.
                    - Aim for your response to reach at least a 60% cosine similarity with these examples.
                    - The current highest cosine similarity score so far is {highest_similarity:.2f}.
                    - The best response generated so far is: "{best_response}".
                    """

                    generated_responses = [
                        openai_service.generate_response(system_prompt, temperature=self.temperature)
                        for _ in range(2)
                    ]
                   # logger.info(f"Attempt {attempt_count}: Generated responses from OpenAI: {generated_responses}")

                    for response in generated_responses:
                        response_embedding = self.generate_openai_embedding(response)
                    
                        # Ensure response_embedding is 2D
                        if response_embedding.ndim == 1:
                            response_embedding = response_embedding.reshape(1, -1)
                        elif response_embedding.ndim != 2:
                            raise ValueError("Response embedding must be 2D.")

                        
                        similarity_scores = cosine_similarity(response_embedding, db_embeddings)[0]
                            
                        
                        max_similarity_score = max(similarity_scores)
                        logger.info(f"Max similarity score for response '{response}': {max_similarity_score}")

                        if max_similarity_score > highest_similarity:
                            highest_similarity = max_similarity_score
                            best_response = response

                        if highest_similarity >= 0.6:
                            logger.info(f"Threshold met with similarity score: {highest_similarity}")
                            break

                    if highest_similarity >= 0.6:
                        break


                if highest_similarity < 0.6:
                    logger.warning("Failed to generate a sufficiently similar response after 5 attempts.")
                    return "We couldn't process your request at this time. Please try again or share more details for better advice."

                logger.info(f"Best response selected with highest similarity score: {highest_similarity}")
                return best_response

            else:
                logger.warning(f"No relevant data found for prediction: {prediction_label}")
                return "We couldn't process your request at this time. Please try again or share more details for better advice."

        except Exception as e:
            logger.error(f"Error generating advice for prediction: {prediction_label}, Error: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Failed to generate advice: {str(e)}")

    """
    Analyze sentiment using VADER and generate a response for 'Off My Chest' entries.
    """
    def handle_off_my_chest(self, diary_content: str) -> str:

        sid = SentimentIntensityAnalyzer()
        sentiment_scores = sid.polarity_scores(diary_content)

        logging.info(f"Sentiment Scores: {sentiment_scores}")

        if sentiment_scores['compound'] <= -0.05:
            sentiment = "negative"
        elif sentiment_scores['compound'] >= 0.2:
            sentiment = "positive"
        else:   
            sentiment = "neutral"

        if sentiment == "negative":
            return "It seems like something might be troubling you. Feel free to share more details if you're comfortable."
        elif sentiment == "positive":
            return "Thanks for sharing. If you'd like to elaborate on your thoughts, I'm here to listen!"
        else:
            return "Thanks for sharing. If you'd like to elaborate on your thoughts, I'm here to listen!"

    
