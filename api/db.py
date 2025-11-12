from pymongo import MongoClient
import os

MONGO_URI = os.environ.get("DB_URL")
client = MongoClient(MONGO_URI)  
db = client["inventory"] 
collection = db["items"]
auth_collection = db["auth"]