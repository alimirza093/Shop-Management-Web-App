Shop Management Web App

Small FastAPI application for managing shop inventory items stored in MongoDB.

Project overview

- Built with FastAPI and PyMongo.
- Provides simple CRUD endpoints for items.
- Data model uses Pydantic (`Item`) with fields: `name` (str), `quantity` (int), `Wprice` (float), `Rprice` (float).

Dependencies

- Python 3.9+ (project tested with 3.11/3.13)
- FastAPI
- Uvicorn (ASGI server for development)
- pymongo
- pydantic

Quick start

1. Create and activate a virtual environment (Windows PowerShell):

```powershell
python -m venv .venv; .\.venv\Scripts\Activate.ps1
```

2. Install dependencies:

```powershell
pip install -r requirements.txt
```

3. Ensure MongoDB is running locally at mongodb://localhost:27017/ or update `db.py` to point to your MongoDB URI.

4. Start the app (development):

```powershell
uvicorn main:app --reload
```

API Endpoints

- POST /add_item
  - Request body: JSON matching the `Item` model.
  - Creates a new item if the `name` is not already present.
  - Responses: success message with inserted item data or an error message.

- GET /get_all_items
  - Returns all items (excludes `_id` in the response).

- GET /get_item/{item_name}
  - Path param: `item_name` (string)
  - Returns the item with the given name.

- PUT /update_item/{item_name}
  - Path param: `item_name` (string)
  - Body: partial object with fields to update (any of `name`, `quantity`, `Wprice`, `Rprice`).
  - Fields with `null` or missing values are ignored.

- DELETE /delete_item/{item_name}
  - Path param: `item_name` (string)
  - Deletes the item with the given name.

- POST /sell_item/{item_name}
  - Path param: `item_name` (string)
  - Request body: JSON matching the `SaleRequest` model (quantity:int).
  - Behavior: verifies item exists and that requested quantity is available, subtracts the sold quantity from the stored `quantity`, and returns the sold and remaining quantities.
  - Responses: success message with `item_name`, `sold_quantity`, and `remaining_quantity`, or an error message if item not found or insufficient stock.

Data contract (Item)

- name: string (unique identifier within collection)
- quantity: integer
- Wprice: float (wholesale price)
- Rprice: float (retail price)

SaleRequest model

- quantity: integer (number of units to sell)

Edge cases and notes

- The `sell_item` endpoint checks availability and updates `quantity` atomically via a read-then-update pattern; consider using a MongoDB transaction or findOneAndUpdate with conditional update for concurrency safety.
- The app currently considers `name` as the unique key but does not enforce a MongoDB unique index. Consider adding a unique index on `name` in production.
- Input validation uses Pydantic for create requests and `SaleRequest` for sell requests. The update endpoint accepts a raw JSON body and skips keys with `null` values.
- Responses are simple dictionaries with either a `message` and `data` or an `error` message. Consider standardizing to a consistent response schema and adding proper HTTP status codes.

Developer checklist

- [ ] Fix concurrency in `sell_item` to prevent race conditions (use conditional update or transactions).
- [ ] Add a unique index for `name` in the collection.
- [ ] Add more robust error handling and HTTP status codes.
- [ ] Add tests (unit and integration) and CI.

License

MIT License  

Copyright (c) 2025 Ali  

Permission is hereby granted, free of charge, to any person obtaining a copy  
of this software and associated documentation files (the "Software"), to deal  
in the Software without restriction, including without limitation the rights  
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell  
copies of the Software, and to permit persons to whom the Software is  
furnished to do so, subject to the following conditions:  

The above copyright notice and this permission notice shall be included in all  
copies or substantial portions of the Software.  

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR  
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,  
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE  
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER  
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,  
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE  
SOFTWARE.  
