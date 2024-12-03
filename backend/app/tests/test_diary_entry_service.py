import unittest
from unittest.mock import MagicMock, patch
from services.diary_entry_service import DiaryEntryService
from models.diary_entry import DiaryEntry, DiaryEntryUpdate

class TestDiaryEntryService(unittest.TestCase):


    def setUp(self):
        self.mock_collection = MagicMock()
        self.service = DiaryEntryService(collection=self.mock_collection)

    def test_create_diary_entry(self):
        sample_entry = DiaryEntry(author="Test Author", content="Sample diary content")
        self.mock_collection.insert_one.return_value.inserted_id = "1234"
        self.mock_collection.find_one.return_value = sample_entry

        result = self.service.create_diary_entry(sample_entry)

        self.mock_collection.insert_one.assert_called_once_with(sample_entry)
        self.mock_collection.find_one.assert_called_once_with({"_id": "1234"})
        self.assertEqual(result, sample_entry)

    def test_list_diary_entries(self):
        sample_entries = [
            {"created": "2024-11-11T10:00:00", "content": "Entry 1"},
            {"created": "2024-11-10T10:00:00", "content": "Entry 2"}
        ]
        current_user = {"_id": "user_id", "role": "admin"}  
        self.mock_collection.find.return_value = sample_entries

        result = self.service.list_diary_entries(current_user)

        self.mock_collection.find.assert_called_once_with(limit=100)
        self.assertEqual(result, sorted(sample_entries, key=lambda x: x['created'], reverse=True))

    def test_find_diary_entry(self):
        sample_id = "1234"
        sample_entry = {"_id": sample_id, "content": "Sample diary content"}
        self.mock_collection.find_one.return_value = sample_entry

        result = self.service.find_diary_entry(sample_id)

        self.mock_collection.find_one.assert_called_once_with({"_id": sample_id})
        self.assertEqual(result, sample_entry)

    def test_update_diary_entry(self):
        sample_id = "1234"
        sample_update = DiaryEntryUpdate(content="Updated content")

        update_data = sample_update.dict(exclude_unset=True)

        self.mock_collection.update_one.return_value.modified_count = 1
        self.mock_collection.find_one.return_value = update_data

        result = self.service.update_diary_entry(sample_id, update_data)

        self.mock_collection.update_one.assert_called_once_with({"_id": sample_id}, {"$set": update_data})
        self.mock_collection.find_one.assert_called_once_with({"_id": sample_id})
        self.assertEqual(result, update_data)

    def test_update_diary_entry_not_found(self):
        sample_id = "1234"
        sample_update = DiaryEntryUpdate(content="Updated content")

        update_data = sample_update.dict(exclude_unset=True)

        self.mock_collection.update_one.return_value.modified_count = 0

        with self.assertRaises(Exception) as context:
            self.service.update_diary_entry(sample_id, update_data)

        self.assertTrue("Diary Entry with ID 1234 not found" in str(context.exception))

    def test_delete_diary_entry(self):
        sample_id = "1234"
        self.mock_collection.delete_one.return_value.deleted_count = 1

        result = self.service.delete_diary_entry(sample_id)

        self.mock_collection.delete_one.assert_called_once_with({"_id": sample_id})
        self.assertEqual(result.deleted_count, 1)

    def test_delete_diary_entry_not_found(self):
        sample_id = "1234"
        self.mock_collection.delete_one.return_value.deleted_count = 0

        with self.assertRaises(Exception) as context:
            self.service.delete_diary_entry(sample_id)

        self.assertTrue("Diary Entry with ID 1234 not found" in str(context.exception))


if __name__ == '__main__':
    unittest.main()
