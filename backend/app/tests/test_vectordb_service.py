import unittest
from unittest.mock import MagicMock, patch
from services.vectordb_service import VectoredService
from services.openai_service import OpenAIService

class TestVectoredService(unittest.TestCase):

    def setUp(self):
        with patch("services.vectordb_service.SentenceTransformer") as MockTransformer:
            self.mock_embedding_model = MockTransformer.return_value
            self.mock_embedding_model.encode.return_value = [[0.1, 0.2, 0.3]]
            self.service = VectoredService()

    @patch("services.vectordb_service.db.get_collection")
    def test_retrieve_related_data(self, mock_get_collection):
        mock_collection = MagicMock()
        mock_get_collection.return_value = mock_collection
        sample_document = {"class": "depression", "suggestions": ["Stay positive", "Take it easy"]}
        mock_collection.find_one.return_value = sample_document

        result = self.service.retrieve_related_data("depression")

        mock_get_collection.assert_called_once_with("mental_advice")
        mock_collection.find_one.assert_called_once_with({"class": "depression"})
        self.assertEqual(result, sample_document)

    @patch.object(OpenAIService, "generate_response")
    @patch("services.vectordb_service.cosine_similarity")
    @patch("services.vectordb_service.db.get_collection")
    async def test_generate_advice_successful(self, mock_get_collection, mock_cosine_similarity,
                                              mock_generate_response):

        mock_collection = MagicMock()
        mock_get_collection.return_value = mock_collection
        mock_collection.find_one.return_value = {
            "class": "depression",
            "suggestions": ["Stay positive", "Take care of yourself"]
        }

        mock_generate_response.return_value = "Take time to relax and care for yourself."

        mock_cosine_similarity.return_value = [[0.7]]

        advice = await self.service.generate_advice("depression", "Feeling down lately")

        self.assertEqual(advice, "Take time to relax and care for yourself.")
        mock_generate_response.assert_called()
        mock_cosine_similarity.assert_called()

    @patch.object(OpenAIService, "generate_response")
    @patch("services.vectordb_service.cosine_similarity")
    @patch("services.vectordb_service.db.get_collection")
    async def test_generate_advice_fails_similarity_threshold(self, mock_get_collection, mock_cosine_similarity,
                                                              mock_generate_response):

        mock_collection = MagicMock()
        mock_get_collection.return_value = mock_collection
        mock_collection.find_one.return_value = {
            "class": "depression",
            "suggestions": ["Stay positive", "Take care of yourself"]
        }

        mock_generate_response.return_value = "Some unrelated advice."
        mock_cosine_similarity.side_effect = [[0.3], [0.4], [0.5], [0.55],
                                              [0.59]]

        advice = await self.service.generate_advice("depression", "Feeling down lately")

        self.assertEqual(advice, "Failed to generate advice that meets the required similarity threshold.")
        self.assertEqual(mock_generate_response.call_count, 5)
        mock_cosine_similarity.assert_called()

    @patch("services.vectordb_service.db.get_collection")
    async def test_generate_advice_no_related_data(self, mock_get_collection):
        mock_collection = MagicMock()
        mock_get_collection.return_value = mock_collection
        mock_collection.find_one.return_value = None

        advice = await self.service.generate_advice("unknown_label", "Feeling uncertain")

        self.assertEqual(advice, "No relevant data found.")
        mock_get_collection.assert_called_once_with("mental_advice")


if __name__ == "__main__":
    unittest.main()
