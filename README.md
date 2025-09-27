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
  - Request body: JSON matching the `SaleRequest` model (see Data contract below).
  - Decrements the `quantity` by the requested sale `quantity` if enough stock is available.
  - Responses: success message with sold quantity and remaining quantity, or an error message if insufficient stock or item not found.

Data contract (Item)

- name: string (unique identifier within collection)
- quantity: integer
- Wprice: float (wholesale price)
- Rprice: float (retail price)

SaleRequest contract

- quantity: integer (number of units to sell)

Edge cases and behavior for selling

- If the requested `quantity` is greater than available stock, the endpoint returns an error and does not change stock.
- The endpoint returns the updated remaining quantity on success.
