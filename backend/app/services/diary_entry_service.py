from models.diary_entry import DiaryEntry, DiaryEntryUpdate

class DiaryEntryService:
    def __init__(self, collection):
        self.collection = collection

    def create_diary_entry(self, diaryEntry: DiaryEntry):
        new_diaryEntry = self.collection.insert_one(diaryEntry)
        return self.collection.find_one(
            {"_id": new_diaryEntry.inserted_id}
        )
    
    def list_diary_entries(self, current_user):
        if current_user["role"] == "admin":
            diaryEntries = list(self.collection.find(limit=100))
        else:
            diaryEntries = list(self.collection.find({"author": current_user["_id"]}))
        sortedDiaryEntries = sorted(diaryEntries, key=lambda x: x['created'], reverse=True)
        return sortedDiaryEntries

    def find_diary_entry(self, id: str):
        return self.collection.find_one({"_id": id})

    def update_diary_entry(self, id: str, diaryEntry: DiaryEntryUpdate):
        diaryEntry = {k: v for k, v in diaryEntry.items() if v is not None}
        if len(diaryEntry) >= 1:
            update_result = self.collection.update_one(
                {"_id": id}, {"$set": diaryEntry}
            )
            if update_result.modified_count == 0:
                raise Exception(f"Diary Entry with ID {id} not found")

        return self.collection.find_one({"_id": id})

    def delete_diary_entry(self, id: str):
        delete_result = self.collection.delete_one({"_id": id})
        if delete_result.deleted_count != 1:
           raise Exception(f"Diary Entry with ID {id} not found")
        return delete_result
    
    def get_prediction_summary(self):
        summary = self.collection.aggregate([
            {
                "$group": {
                    "_id": "$author",
                    "anxiety_count": {
                        "$sum": {
                        "$cond": [{ "$eq": ["$predicted_class_number", 0] }, 1, 0]
                        }
                    },
                    "suicide_count": {
                        "$sum": {
                        "$cond": [{ "$eq": ["$predicted_class_number", 1] }, 1, 0]
                        }
                    },
                    "bipolar_count": {
                        "$sum": {
                        "$cond": [{ "$eq": ["$predicted_class_number", 2] }, 1, 0]
                        }
                    },
                    "depression_count": {
                        "$sum": {
                        "$cond": [{ "$eq": ["$predicted_class_number", 3] }, 1, 0]
                        }
                    },
                    "other_count": {
                        "$sum": {
                        "$cond": [{ "$eq": ["$predicted_class_number", 4] }, 1, 0]
                        }
                    }
                }
            },
            {
                "$project": {
                    "_id": 0,
                    "username": "$_id",
                    "anxiety_count": 1,
                    "suicide_count": 1,
                    "bipolar_count": 1,
                    "depression_count": 1,
                    "other_count": 1
                }
            },
            {
                "$sort": { "suicide_count": -1 }
            },
        ])
        return summary
