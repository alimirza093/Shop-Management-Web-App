from fastapi import FastAPI, Body, Query
from fastapi.middleware.cors import CORSMiddleware  # 👈 ADD THI
from passlib.context import CryptContext
from validations import Item, SaleRequest, LoginUser, ChangePass
from db import collection, auth_collection


if collection is None and auth_collection is None:
    raise Exception("Database connection failed")
else:
    print("Database connected successfully")

app = FastAPI()

# ✅ Allow requests from your React app
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # React dev server (Vite)
        "http://127.0.0.1:5173",
    ],
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
            "Rprice": item.Rprice,
        }
        if collection.find_one({"name": item.name}):
            return {"error": "آئٹم پہلے سے موجود ہے۔"}
        result = collection.insert_one(item_collection)
        item_collection["_id"] = str(result.inserted_id)
        return {"message": "آئٹم کامیابی سے شامل ہو گیا۔", "data": item_collection}
    except Exception as e:
        return {"error": str(e)}


@app.get("/get_all_items")
def get_all_items():
    try:
        items = list(
            collection.find({}, {"_id": 0})
            .sort("name", 1)
            .collation({"locale": "ur", "strength": 2})
        )
        if items:
            return {"message": "تمام آئٹمز کامیابی سے حاصل ہو گئے۔", "data": items}
        else:
            return {"error": "کوئی آئٹمز نہیں ملے۔"}
    except Exception as e:
        return {"error": str(e)}


@app.get("/get_item_suggestions")
def get_item_suggestions(q: str = Query(..., min_length=1)):
    try:
        # case-insensitive aur starts-with match
        # Urdu characters ke liye bhi regex kaam karega
        items = list(
            collection.find(
                {"name": {"$regex": f"^{q}", "$options": "i"}}, {"_id": 0, "name": 1}
            )
        )
        if items:
            suggestions = [item["name"] for item in items]
            return {"message": "مماثل آئٹمز مل گئی ہیں۔", "data": suggestions}
        else:
            return {"error": "کوئی آئٹم نہیں ملی۔"}
    except Exception as e:
        return {"error": f"خرابی: {str(e)}"}


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
        db_item = collection.find_one({"name": item_name}, {"_id": 0})  # type:ignore
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
                "remaining_quantity": new_quantity,
            },
        }
    except Exception as e:
        return {"error": str(e)}


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


@app.post("/create_password")
def create_password(user: LoginUser):
    try:
        stored = auth_collection.find_one({}, {"_id": 0, "password": 1})
        if stored:
            return {"error": "پاسورڈ پہلے سے سیٹ ہے۔"}
        auth_collection.insert_one({"password": user.password})
        return {"message": "پاسورڈ کامیابی سے سیٹ ہو گیا۔"}
    except Exception as e:
        return {"error": str(e)}


@app.get("/check_password")
def check_password():
    try:
        stored = auth_collection.find_one({}, {"_id": 0, "password": 1})
        if stored:
            return {"data": 1}
        else:
            return {"data": 0}

    except Exception as e:
        return {"error": str(e)}


@app.post("/login")
def login(user: LoginUser):
    try:
        stored = auth_collection.find_one({}, {"_id": 0, "password": 1})
        if not stored:
            return {"error": "پاسورڈ سیٹ نہیں ہے۔ براہ کرم پہلے پاسورڈ سیٹ کریں۔"}
        if user.password == stored["password"]:
            return {"message": "لاگ ان کامیاب ہو گیا۔"}
        else:
            return {"error": "پاسورڈ غلط ہے۔"}
    except Exception as e:
        return {"error": str(e)}


@app.post("/change_password")
def change_password(change_pass: ChangePass):
    try:
        stored = auth_collection.find_one({}, {"_id": 0, "password": 1})
        if not stored:
            return {"error": "پاسورڈ سیٹ نہیں ہے۔ براہ کرم پہلے پاسورڈ سیٹ کریں۔"}
        if change_pass.old_password != stored["password"]:
            return {"error": "پرانا پاسورڈ غلط ہے۔"}
        if change_pass.old_password == change_pass.new_password:
            return {"error": "نیا پاسورڈ پرانے سے مختلف ہونا چاہیے۔"}
        auth_collection.update_one({}, {"$set": {"password": change_pass.new_password}})
        return {"message": "پاسورڈ کامیابی سے تبدیل ہو گیا۔"}
    except Exception as e:
        return {"error": str(e)}
