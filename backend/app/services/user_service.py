from models.user import User, UserUpdate

class UserService:
    def __init__(self, collection):
        self.collection = collection

    def create_user(self, user: User):
        new_diaryEntry = self.collection.insert_one(user)
        return self.collection.find_one(
            {"_id": new_diaryEntry.inserted_id}
        )

    def list_users(self):
        return list(self.collection.find(limit=100))

    def find_user(self, id: str):
        return self.collection.find_one({"_id": id})
    
    def find_user_by_username(self, username: str):
        return self.collection.find_one({"username": username})

    def update_user(self, id: str, user: UserUpdate):
        user = {k: v for k, v in user.items() if v is not None}
        if len(user) >= 1:
            update_result = self.collection.update_one(
                {"_id": id}, {"$set": user}
            )
            if update_result.modified_count == 0:
                raise Exception(f"User with ID {id} not found")

        return self.collection.find_one({"_id": id})

    def delete_user(self, id: str):
        delete_result = self.collection.delete_one({"_id": id})
        if delete_result.deleted_count != 1:
           raise Exception(f"User with ID {id} not found")
        return delete_result
