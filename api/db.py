from pymongo import MongoClient
import os

MONGO_URI = os.environ.get("DB_URL")
if not MONGO_URI:
    print("Warning: DB_URL environment variable not set")
    client = None
    db = None
    collection = None
    auth_collection = None
else:
    try:
        client = MongoClient(MONGO_URI)  
        db = client["inventory"] 
        collection = db["items"]
        auth_collection = db["auth"]
        print("Database connection initialized successfully")
    except Exception as e:
        print(f"Database connection error: {str(e)}")
        client = None
        db = None
        collection = None
        auth_collection = None