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

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

ASTRA_DB_APPLICATION_TOKEN = os.getenv("ASTRA_DB_APPLICATION_TOKEN")
ASTRA_DB_ENDPOINT = os.getenv("ASTRA_DB_ENDPOINT")
ASTRA_DB_KEYSPACE = os.getenv("ASTRA_DB_KEYSPACE", "SWMH")

client = DataAPIClient(ASTRA_DB_APPLICATION_TOKEN)
db = client.get_database_by_api_endpoint(ASTRA_DB_ENDPOINT, keyspace=ASTRA_DB_KEYSPACE)

class VectoredService:
    def __init__(self):
        if not ASTRA_DB_APPLICATION_TOKEN or not ASTRA_DB_ENDPOINT or not ASTRA_DB_KEYSPACE:
            raise ValueError("AstraDB credentials are not properly set")

        self.embedding_model = SentenceTransformer('paraphrase-distilroberta-base-v1')
        self.temperature = 0.9

    def retrieve_related_data(self, prediction_label: str):
        try:
            logger.info(f"Retrieving data for prediction label (class): {prediction_label}")
            
            collection = db.get_collection("mental_advice")

            document = collection.find_one({"class": prediction_label})

            if document:
                logger.info(f'document: {document}')
                return document
            else:
                logger.warning(f"No related data found for class: {prediction_label}")
                return None
        except Exception as e:
            logger.error(f"Error retrieving related data: {str(e)}")
            raise ValueError(f"Failed to retrieve related data: {str(e)}")

    '''
    Jungyu added
    '''
    async def generate_advice(self, prediction_label: str, diary_content: str) -> str:
        try:
            related_data = self.retrieve_related_data(prediction_label.lower())

            if related_data:
                db_suggestions = related_data['suggestions']
                db_embeddings = self.embedding_model.encode(db_suggestions)

                openai_service = OpenAIService()
                attempt_count = 0
                highest_similarity = 0
                best_response = None

                while highest_similarity < 0.6 and attempt_count < 5:
                    attempt_count += 1

                    system_prompt = f"""
                    You are a helpful and empathetic therapist. Based on the following diary content and emotional prediction, 
                    provide advice tailored to the user's current state of mind.
    
                    Diary Content: {diary_content}
                    Mental Disorder Prediction: {prediction_label}
    
                    To help, refer to these suggestions from vector db:
                    {db_suggestions}
                    
                    - Your response should be guided by the suggestions from the vector database above.
                    - You do not need to use all suggestions, but your response should be based on them.
                    - Provide advice that aligns with the diary content and prediction.
                    - Never deviate from the suggestions from vector database.
                    - Ensure your response closely aligns with the language and tone of the suggestions provided.
                    - Your response should aim to reach at least a 60% similarity score with these examples.
                    - The current highest similarity score so far is {highest_similarity:.2f}.
    
                    If you're unable to provide advice that closely aligns, say "I'm sorry, I can't help you with that."
                    """

                    generated_responses = [
                        openai_service.generate_response(system_prompt, temperature=0.7)
                        for _ in range(3)
                    ]
                    logger.info(f"Attempt {attempt_count}: Generated responses from OpenAI: {generated_responses}")

                    for response in generated_responses:

                        response_embedding = self.embedding_model.encode(response)


                        similarity_scores = [
                            cosine_similarity([response_embedding], [emb])[0][0]
                            for emb in db_embeddings
                        ]
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
                    return "Failed to generate advice that meets the required similarity threshold."

                logger.info(f"Best response selected with highest similarity score: {highest_similarity}")
                return best_response

            else:
                logger.warning(f"No relevant data found for prediction: {prediction_label}")
                return "No relevant data found."

        except Exception as e:
            logger.error(f"Error generating advice for prediction: {prediction_label}, Error: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Failed to generate advice: {str(e)}")

    '''
    Pratheepan
    '''
    async def generate_advice_p(self, prediction_label: str, diary_content: str) -> str:
        """
        Generates advice for a given mental health prediction label.
        Uses the related data from AstraDB and OpenAI to generate a response.
        """
        try:
            content = diary_content
            prediction = prediction_label

            related_data = self.retrieve_related_data(prediction.lower())

            if related_data:
                db_suggestions = related_data['suggestions']
                query_embedding = self.embedding_model.encode(diary_content)
                db_embeddings = self.embedding_model.encode(db_suggestions)

                similarities = [cosine_similarity([query_embedding], [emb])[0][0] for emb in db_embeddings]
                softmax_similarities = torch.nn.functional.softmax(torch.tensor(similarities) / self.temperature, dim=0).numpy()
                best_suggestion = db_suggestions[np.argmax(softmax_similarities)]

                logger.info(f"Best suggestion based on softmax similarity: {best_suggestion}")

                system_prompt = f"""
                You are a helpful and empathetic therapist. Based on the following diary content and emotional prediction, 
                provide advice tailored to the user's current state of mind.

                Diary Content: {content}
                Mental Disorder Prediction: {prediction}

                Previous helpful advice includes: "{best_suggestion}"

                Example 1:
                User: I feel very anxious and overwhelmed.
                Therapist: It's okay to feel this way. Try focusing on small steps, and consider grounding exercises.

                Example 2:
                User: I don't feel motivated.
                Therapist: Sometimes rest is important. Maybe start with a small, manageable task.

                Example 3:
                User: I feel sad and lonely.
                Therapist: Consider reaching out to someone you trust. Small connections can make a big difference.

                Avoid answering out of scope and provide specific advice based on the context. If you don't know or cannot respond, say "I'm sorry, I can't help you with that."
                """

                openai_service = OpenAIService()
                generated_responses = [
                    openai_service.generate_response(system_prompt, temperature=0.7 )
                    for _ in range(3)
                ]

                best_response = None
                highest_similarity = 0
                for response in generated_responses:
                    response_embedding = self.embedding_model.encode(response)
                    similarity_score = cosine_similarity([db_embeddings[np.argmax(softmax_similarities)]], [response_embedding])[0][0]

                    if similarity_score > highest_similarity:
                        highest_similarity = similarity_score
                        best_response = response

                logger.info(f"Best response selected with similarity score: {highest_similarity}")
                return best_response

            else:
                logger.warning(f"No relevant data found for prediction: {prediction}")
                return "No relevant data found."

        except Exception as e:
            logger.error(f"Error generating advice for prediction: {prediction_label}, Error: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Failed to generate advice: {str(e)}")