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

        # Check if user exists
        existing_user = self.collection.find_one({"_id": id})
        if not existing_user:
            raise Exception(f"User with ID {id} not found")
        
        if len(user) >= 1:
            update_result = self.collection.update_one(
                {"_id": id}, {"$set": user}
            )

            # If unmodified, it means there is nothing to update
            # so just return the user info
            if update_result.modified_count == 0:
                return existing_user

        return self.collection.find_one({"_id": id})
