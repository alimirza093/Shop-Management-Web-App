from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware
from validations import Item , SaleRequest
from db import collection

if collection is None:
    raise Exception("Database connection failed")
else:
    print("Database connected successfully")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for development, allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/add_item")
def add_item(item: Item):
    try:
        item_collection = {
            "name": item.name,
            "quantity": item.quantity,
            "Wprice": item.Wprice,
            "Rprice": item.Rprice
        }
        if collection.find_one({"name": item.name}):
            return {"error": "آئٹم پہلے سے موجود ہے۔"
        }
        result = collection.insert_one(item_collection)
        item_collection["_id"] = str(result.inserted_id)
        return {
            "message": "آئٹم کامیابی سے شامل ہو گیا۔",
            "data": item_collection
        }
    except Exception as e:
        return {"error": str(e)}

@app.get("/get_all_items")
def get_all_items():
    try:
        items = list(collection.find({}, {"_id": 0}).sort("name", 1).collation({"locale": "ur", "strength": 2}))
        if items:
            return {
                "message": "تمام آئٹمز کامیابی سے حاصل ہو گئے۔",
                "data": items
            }
        else:
            return {"error": "کوئی آئٹمز نہیں ملے۔"}
    except Exception as e:
        return {"error": str(e)}

@app.get("/get_item/{item_name}")
def get_item(item_name: str):
    try:
        item = collection.find_one({"name": item_name}, {"_id": 0})
        if item:
            return {
                "message": "آئٹم مل گیا۔",
                "data": item
            }
        else:
            return {"error": "آئٹم نہیں ملا۔"}
    except Exception as e:
        return {"error": str(e)}

@app.put("/update_item/{item_name}")
def update_item(item_name: str, item: dict = Body(...)):
    try:
        update_fields = {}
        for key, value in item.items():
            if value is not None:
                update_fields[key] = value
        if not update_fields:
            return {"error": "کوئی فیلڈ اپڈیٹ کرنے کے لیے فراہم نہیں کی گئی۔"}
        result = collection.update_one({"name": item_name}, {"$set": update_fields})
        db_item = collection.find_one({"name": item_name}, {"_id": 0}) #type:ignore
        if result.matched_count:
            return {
                "message": "آئٹم کامیابی سے اپڈیٹ ہو گیا۔",
                "data": db_item,
            }
        else:
            return {"error": "آئٹم نہیں ملا۔"}
    except Exception as e:
        return {"error": str(e)}

@app.delete("/delete_item/{item_name}")
def delete_item(item_name: str):
    try:
        result = collection.delete_one({"name": item_name})
        if result.deleted_count:
            return {"message": "آئٹم کامیابی سے ختم ہو گیا۔"}
        else:
            return {"error": "آئٹم نہیں ملا۔"}
    except Exception as e:
        return {"error": str(e)}
    


@app.post("/sell_item/{item_name}")
def sell_item(item_name: str, sale: SaleRequest):
    try:
        item = collection.find_one({"name": item_name})
        if not item:
            return {"error": "آئٹم نہیں ملا۔"}
        if item["quantity"] < sale.quantity:
            return {"error": "کافی مقدار میں آئٹم دستیاب نہیں ہے۔"}
        new_quantity = item["quantity"] - sale.quantity
        collection.update_one({"name": item_name}, {"$set": {"quantity": new_quantity}})
        return {
            "message": "آئٹم کامیابی سے بیچ دیا گیا۔",
            "data": {
                "item_name": item_name,
                "sold_quantity": sale.quantity,
                "remaining_quantity": new_quantity
            }
        }
    except Exception as e:
        return {"error": str(e)}
