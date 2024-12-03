import unittest
from unittest.mock import patch, MagicMock, AsyncMock
from fastapi.testclient import TestClient
from main import app
from services.diary_entry_service import DiaryEntryService
from unittest.mock import ANY
import uuid
from main import get_current_active_user

client = TestClient(app)


class TestDiaryEntryRoutes(unittest.TestCase):
    def setUp(self):
        app.diary_entry_service = DiaryEntryService(MagicMock())
        app.predict_service = MagicMock()
        app.vectored_service = MagicMock()

        app.dependency_overrides[get_current_active_user] = lambda: {"_id": "test_user_id", "role": "user"}

    def tearDown(self):
        app.dependency_overrides = {}

    @patch("services.diary_entry_service.DiaryEntryService.create_diary_entry")
    def test_create_diary_entry(self, mock_create_diary_entry):
        mock_create_diary_entry.return_value = {
            "author": "test_user_id",
            "content": "Sample diary content"
        }

        response = client.post("/diary_entry", json={"author": "test_user_id", "content": "Sample diary content"})

        self.assertEqual(response.status_code, 201)
        response_json = response.json()
        self.assertEqual(response_json["author"], "test_user_id")
        self.assertEqual(response_json["content"], "Sample diary content")

        self.assertIn("_id", response_json)

        mock_create_diary_entry.assert_called_once_with({
            "_id": ANY,
            "author": "test_user_id",
            "entry_date": ANY,
            "content": "Sample diary content",
            "predicted_class_number": ANY,
            "prediction_class": ANY,
            "confidence": ANY,
            "confidence_scores": ANY,
            "advice": ANY,
            "created": ANY,
            "updated": ANY
        })

    @patch("services.diary_entry_service.DiaryEntryService.list_diary_entries")
    def test_list_diary_entries(self, mock_list_diary_entries):
        mock_list_diary_entries.return_value = [
            {
                "_id": str(uuid.uuid4()),
                "author": "test_user_id",
                "content": "Sample diary content",
                "entry_date": "2024-11-11T10:00:00",
                "predicted_class_number": 0,
                "prediction_class": "Test Prediction",
                "confidence": 0.9,
                "confidence_scores": {"some_class": 0.9},
                "advice": "Sample advice",
                "created": "2024-11-11T10:00:00",
                "updated": "2024-11-11T10:00:00"
            }
        ]

        response = client.get("/diary_entry")

        self.assertEqual(response.status_code, 200)
        response_json = response.json()

        self.assertIsInstance(response_json, list)
        self.assertEqual(len(response_json), 1)

        entry = response_json[0]
        self.assertEqual(entry["author"], "test_user_id")
        self.assertEqual(entry["content"], "Sample diary content")
        self.assertIn("entry_date", entry)
        self.assertIn("_id", entry)

        mock_list_diary_entries.assert_called_once()


    @patch("services.diary_entry_service.DiaryEntryService.find_diary_entry")
    def test_find_diary_entry_success(self, mock_find_diary_entry):
        mock_diary_entry = {
            "_id": "771bf8c6-12d0-4ac5-8686-14ce4071ba02",
            "author": "test_user_id",
            "content": "Sample diary content",
            "created": "2024-11-11T15:32:10.950881",
            "updated": "2024-11-11T15:32:10.950881"
        }
        mock_find_diary_entry.return_value = mock_diary_entry

        response = client.get("/diary_entry/771bf8c6-12d0-4ac5-8686-14ce4071ba02")

        self.assertEqual(response.status_code, 200)
        response_json = response.json()
        self.assertEqual(response_json["_id"], "771bf8c6-12d0-4ac5-8686-14ce4071ba02")
        self.assertEqual(response_json["author"], "test_user_id")
        self.assertEqual(response_json["content"], "Sample diary content")

        mock_find_diary_entry.assert_called_once_with("771bf8c6-12d0-4ac5-8686-14ce4071ba02")

    @patch("services.diary_entry_service.DiaryEntryService.find_diary_entry")
    def test_find_diary_entry_not_found(self, mock_find_diary_entry):
        mock_find_diary_entry.return_value = None

        response = client.get("/diary_entry/non-existing-id")

        self.assertEqual(response.status_code, 404)
        response_json = response.json()
        self.assertEqual(response_json["detail"], "Diary Entry with ID non-existing-id not found")

        mock_find_diary_entry.assert_called_once_with("non-existing-id")

    @patch("services.predict_service.PredictService.predict")
    @patch("services.vectordb_service.VectoredService.generate_advice", new_callable=AsyncMock)
    def test_update_diary_entry(self, mock_generate_advice, mock_predict):
        mock_predict.return_value = (
            3,
            "Depression",
            0.85,
            {
                "Anxiety": 0.05,
                "Suicide Watch": 0.1,
                "Bipolar": 0.0,
                "Depression": 0.85,
                "Off My Chest": 0.0
            }
        )

        mock_generate_advice.return_value = "This is a sample advice based on prediction."
        original_data = {
            "_id": "62d6b427-a606-4323-a675-2ed40108e1ab",
            "author": "test_user_id",
            "content": "original content",
            "predicted_class_number": 3,
            "prediction_class": "Off My Chest",
            "confidence": 0.97,
            "confidence_scores": {
                "Anxiety": 0.01,
                "Suicide Watch": 0.01,
                "Bipolar": 0.01,
                "Depression": 0.00,
                "Off My Chest": 0.97
            },
            "advice": "This is a sample advice based on prediction.",
            "created": "2024-11-11T15:32:10.950881",
            "updated": "2024-11-11T15:32:10.950881"
        }
        updated_data = {
            "_id": "62d6b427-a606-4323-a675-2ed40108e1ab",
            "author": "test_user_id",
            "content": "Updated content",
            "predicted_class_number": 3,
            "prediction_class": "Depression",
            "confidence": 0.85,
            "confidence_scores": {
                "Anxiety": 0.05,
                "Suicide Watch": 0.1,
                "Bipolar": 0.0,
                "Depression": 0.85,
                "Off My Chest": 0.0
            },
            "advice": "This is a sample advice based on prediction.",
            "created": "2024-11-11T15:32:10.950881",
            "updated": "2024-11-11T15:32:10.950881"
        }
        app.diary_entry_service.find_diary_entry = MagicMock(return_value=original_data)
        app.diary_entry_service.update_diary_entry = MagicMock(return_value=updated_data)

        response = client.put(
            "/diary_entry/62d6b427-a606-4323-a675-2ed40108e1ab",
            json={"content": "Updated content"}
        )

        self.assertEqual(response.status_code, 200)
        response_json = response.json()

        self.assertEqual(response_json["prediction_class"], "Depression")
        self.assertEqual(response_json["confidence"], 0.85)
        self.assertEqual(response_json["confidence_scores"], {
            "Anxiety": 0.05,
            "Suicide Watch": 0.1,
            "Bipolar": 0.0,
            "Depression": 0.85,
            "Off My Chest": 0.0
        })
        self.assertEqual(response_json["advice"], "This is a sample advice based on prediction.")

        mock_predict.assert_called_once_with("Updated content")

        mock_generate_advice.assert_called_once_with("Depression", "Updated content")

        app.diary_entry_service.update_diary_entry.assert_called_once_with(
            "62d6b427-a606-4323-a675-2ed40108e1ab",
            {
                "content": "Updated content",
                "updated": ANY,
                "predicted_class_number": 3,
                "prediction_class": "Depression",
                "confidence": 0.85,
                "confidence_scores": {
                    "Anxiety": 0.05,
                    "Suicide Watch": 0.1,
                    "Bipolar": 0.0,
                    "Depression": 0.85,
                    "Off My Chest": 0.0
                },
                "advice": "This is a sample advice based on prediction."
            }
        )

    @patch("services.diary_entry_service.DiaryEntryService.delete_diary_entry")
    def test_delete_diary_entry_success(self, mock_delete_diary_entry):
        mock_delete_diary_entry.return_value = None

        response = client.delete("/diary_entry/771bf8c6-12d0-4ac5-8686-14ce4071ba02")

        self.assertEqual(response.status_code, 204)

        mock_delete_diary_entry.assert_called_once_with("771bf8c6-12d0-4ac5-8686-14ce4071ba02")

    @patch("services.diary_entry_service.DiaryEntryService.delete_diary_entry")
    def test_delete_diary_entry_not_found(self, mock_delete_diary_entry):
        mock_delete_diary_entry.side_effect = Exception("Diary Entry with ID non-existing-id not found")

        response = client.delete("/diary_entry/non-existing-id")

        self.assertEqual(response.status_code, 404)
        response_json = response.json()
        self.assertEqual(response_json["detail"], "Diary Entry with ID non-existing-id not found")

        mock_delete_diary_entry.assert_called_once_with("non-existing-id")

if __name__ == "__main__":
    unittest.main()

