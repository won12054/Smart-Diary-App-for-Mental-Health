from models.diary_entry import DiaryEntry, DiaryEntryUpdate

class DiaryEntryService:
    def __init__(self, collection):
        self.collection = collection

    def create_diary_entry(self, diaryEntry: DiaryEntry):
        new_diaryEntry = self.collection.insert_one(diaryEntry)
        return self.collection.find_one(
            {"_id": new_diaryEntry.inserted_id}
        )

    def list_diary_entries(self):
        # diaryEntries = list(request.app.database["diary_entries"].find(limit=100))
        diaryEntries = list(self.collection.find(limit=100))
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
