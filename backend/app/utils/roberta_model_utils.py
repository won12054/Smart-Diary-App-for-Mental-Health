from transformers import RobertaTokenizer, RobertaForSequenceClassification
from dotenv import load_dotenv
import os
class RobertaModelUtils:
    def __init__(self):
        load_dotenv()
        self.model_path = os.getenv('MODEL_PATH')
        if self.model_path is None:
            raise ValueError("MODEL_PATH is not set in the .env file.")

        self.model = None
        self.tokenizer = None
        self.label_mapping = {
            0: "Anxiety",
            1: "Suicide Watch",
            2: "Bipolar",
            3: "Depression",
            4: "Off My Chest"
        }

    def load(self):
        self.tokenizer = RobertaTokenizer.from_pretrained(self.model_path)
        self.model = RobertaForSequenceClassification.from_pretrained(self.model_path)
        self.model.eval()
        return self.model, self.tokenizer, self.label_mapping
