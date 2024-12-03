from models.user import UserPwdReset

class AdminService:

    def __init__(self, database):
        self.database = database

    def list_users(self):
        summary = self.database["users"].aggregate([
            {
                "$match": { "role": "user" }
            },
            {
                "$lookup": {
                    "from": "diary_entries",
                    "localField": "_id",
                    "foreignField": "author",
                    "as": "diaryEntries"
                }
            },
            {
                "$unwind": {
                    "path": "$diaryEntries",
                    "preserveNullAndEmptyArrays": True
                }
            },
            {
                "$group": {
                    "_id": { "user_id": "$_id", "username": "$username" },
                    "anxiety_count": {
                        "$sum": {
                            "$cond": [{ "$eq": ["$diaryEntries.predicted_class_number", 0] }, 1, 0]
                        }
                    },
                    "suicide_count": {
                        "$sum": {
                            "$cond": [{ "$eq": ["$diaryEntries.predicted_class_number", 1] }, 1, 0]
                        }
                    },
                    "bipolar_count": {
                        "$sum": {
                            "$cond": [{ "$eq": ["$diaryEntries.predicted_class_number", 2] }, 1, 0]
                        }
                    },
                    "depression_count": {
                        "$sum": {
                            "$cond": [{ "$eq": ["$diaryEntries.predicted_class_number", 3] }, 1, 0]
                        }
                    },
                    "other_count": {
                        "$sum": {
                            "$cond": [{ "$eq": ["$diaryEntries.predicted_class_number", 4] }, 1, 0]
                        }
                    },
                },
            },
            {
                "$project": {
                    "user_id": "$_id.user_id",
                    "username": "$_id.username",
                    "anxiety_count": 1,
                    "suicide_count": 1,
                    "bipolar_count": 1,
                    "depression_count": 1,
                    "other_count": 1
                }
            },
            {
                "$sort": { "suicide_count": -1 }
            }
        ])
        return summary
    
    def reset_user_pwd(self, id: str, user: UserPwdReset):
        user = {k: v for k, v in user.items() if v is not None}
        if len(user) >= 1:
            update_result = self.database["users"].update_one(
                {"_id": id}, {"$set": user}
            )
            if update_result.modified_count == 0:
                raise Exception(f"User with ID {id} not found")

        return self.database["users"].find_one({"_id": id})
    
    def delete_user(self, id: str):
        delete_diary = self.database["diary_entries"].delete_many({"author": id})
        delete_user = self.database["users"].delete_one({"_id": id})
        if delete_user.deleted_count != 1:
           raise Exception(f"User with ID {id} not found")
        return delete_user