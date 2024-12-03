import unittest
from unittest.mock import patch, MagicMock
from services.openai_service import OpenAIService

'''
pytest tests/test_openai_service.py 
pytest tests/test_openai_service.py::TestOpenAIService::test_generate_response_success
pytest tests/test_openai_service.py::TestOpenAIService::test_generate_response_failure
'''
class TestOpenAIService(unittest.TestCase):

    def setUp(self):
        self.service = OpenAIService()

    @patch("openai.chat.completions.create")
    def test_generate_response_success(self, mock_create):
        mock_response = MagicMock()
        mock_response.choices = [MagicMock(message=MagicMock(content="Test response"))]
        mock_create.return_value = mock_response

        system_input = "Hello"
        max_tokens = 50
        temperature = 0.5

        result = self.service.generate_response(system_input, max_tokens, temperature)

        mock_create.assert_called_once_with(
            model="gpt-4o-mini",
            messages=[{"role": "system", "content": system_input}],
            max_completion_tokens=max_tokens,
            temperature=temperature
        )
        self.assertEqual(result, "Test response")

    @patch("openai.chat.completions.create")
    def test_generate_response_failure(self, mock_create):
        mock_create.side_effect = Exception("API Error")

        system_input = "Hello"
        max_tokens = 50
        temperature = 0.5

        result = self.service.generate_response(system_input, max_tokens, temperature)

        self.assertIn("Error: API Error", result)


if __name__ == "__main__":
    unittest.main()
