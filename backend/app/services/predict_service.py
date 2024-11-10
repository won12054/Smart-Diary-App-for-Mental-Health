from utils.roberta_model_utils import RobertaModelUtils
import torch

class PredictService:
    def __init__(self, model, tokenizer, label_mapping, max_len=256):
        self.model = model
        self.tokenizer = tokenizer
        self.label_mapping = label_mapping
        self.max_len = max_len

    def encode_texts(self, texts):
        return self.tokenizer(
            list(texts),
            add_special_tokens=True,
            max_length=self.max_len,
            padding='max_length',
            truncation=True,
            return_attention_mask=True,
            return_tensors='pt'
        )

    def predict(self, text: str):
        inputs = self.encode_texts([text])
        with torch.no_grad():
            outputs = self.model(**inputs)
            logits = outputs.logits
            probabilities = torch.softmax(logits, dim=1)
            confidence, predicted_class = torch.max(probabilities, dim=1)

        predicted_label = self.label_mapping[predicted_class.item()]
        confidence_scores = {self.label_mapping[i]: prob.item() for i, prob in enumerate(probabilities[0])}

        return predicted_class.item(), predicted_label, confidence.item(), confidence_scores

def load_text_predictor():
    model_loader = RobertaModelUtils()
    model, tokenizer, label_mapping = model_loader.load()
    return PredictService(model, tokenizer, label_mapping)

predict_service = load_text_predictor()