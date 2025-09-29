from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")  
db = client["inventory"] 
collection = db["items"]
auth_collection = db["auth"]