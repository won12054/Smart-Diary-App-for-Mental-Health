import unittest
from unittest.mock import MagicMock, patch
import torch
from services.predict_service import PredictService
from utils.roberta_model_utils import RobertaModelUtils

class TestPredictService(unittest.TestCase):

    def setUp(self):
        self.mock_model_utils = MagicMock(spec=RobertaModelUtils)

        self.mock_model = MagicMock()
        self.mock_tokenizer = MagicMock()

        self.label_mapping = {
            0: "Anxiety",
            1: "Suicide Watch",
            2: "Bipolar",
            3: "Depression",
            4: "Off My Chest"
        }

        self.mock_model_utils.load.return_value = (self.mock_model, self.mock_tokenizer, self.label_mapping)

        self.service = PredictService(
            model=self.mock_model,
            tokenizer=self.mock_tokenizer,
            label_mapping=self.label_mapping
        )

    @patch("torch.softmax")
    def test_predict(self, mock_softmax):
        sample_text = "Sample text for prediction"
        encoded_inputs = {
            "input_ids": torch.tensor([[0, 1, 2, 3]]),
            "attention_mask": torch.tensor([[1, 1, 1, 1]])
        }
        self.mock_tokenizer.return_value = encoded_inputs

        mock_logits = torch.tensor([[1.0, 2.0, 3.0, 4.0, 5.0]])
        self.mock_model.return_value.logits = mock_logits

        mock_softmax.return_value = torch.tensor([[0.05, 0.1, 0.15, 0.2, 0.5]])

        predicted_class, predicted_label, confidence, confidence_scores = self.service.predict(sample_text)

        self.mock_tokenizer.assert_called_once_with(
            [sample_text],
            add_special_tokens=True,
            max_length=self.service.max_len,
            padding='max_length',
            truncation=True,
            return_attention_mask=True,
            return_tensors='pt'
        )
        self.mock_model.assert_called_once_with(**encoded_inputs)
        mock_softmax.assert_called_once_with(mock_logits, dim=1)

        self.assertEqual(predicted_class, 4)
        self.assertEqual(predicted_label, "Off My Chest")
        self.assertAlmostEqual(confidence, 0.5, places=2)

        expected_scores = {
            "Anxiety": 0.05,
            "Suicide Watch": 0.1,
            "Bipolar": 0.15,
            "Depression": 0.2,
            "Off My Chest": 0.5
        }
        for label, expected_score in expected_scores.items():
            self.assertAlmostEqual(confidence_scores[label], expected_score, places=2)


if __name__ == "__main__":
    unittest.main()
