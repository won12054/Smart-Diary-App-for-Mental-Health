import openai
from dotenv import load_dotenv
import os
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class OpenAIService:
    def __init__(self):
        load_dotenv()
        self.api_key = os.getenv("OPENAI_API_KEY")
        if not self.api_key:
            raise ValueError("No OpenAI API key provided")
        openai.api_key = self.api_key

    def generate_response(self, system_input: str, max_completion_tokens: int = 100, temperature: float = 0.7) -> str:
        try:
            messages = [
                {"role": "system", "content": f"{system_input}"},
            ]
            response = openai.chat.completions.create(
                model="gpt-4o-mini",
                messages=messages,
                max_completion_tokens=max_completion_tokens,
                temperature=temperature
            )

            return response.choices[0].message.content.strip()
        except Exception as e:
            return f"Error: {str(e)}"

