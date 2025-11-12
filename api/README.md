Shop Management Web App


Small FastAPI application for managing shop inventory items stored in MongoDB.

Project overview

# Shop Management Web App

A small full-stack inventory management app. Backend is a FastAPI service that uses MongoDB for storage. Frontend is a small React app (Vite) that consumes the backend API.

## Project structure (high level)

- `main.py` - FastAPI backend exposing CRUD endpoints and a `sell_item` endpoint.
- `db.py` - MongoDB connection (defaults to `mongodb://localhost:27017/`, database `inventory`, collection `items`).
- `validations.py` - Pydantic models (`Item`, `SaleRequest`).
- `frontend/` - Vite + React frontend that talks to the backend on `http://127.0.0.1:8000` by default.

## Requirements

- Python 3.9+
- Node.js 16+ (for frontend/dev)
- MongoDB running (default connection: `mongodb://localhost:27017/`)

Backend Python dependencies

See `requirements.txt` for pinned versions. Minimal runtime dependencies include:

- fastapi
- uvicorn
- pymongo
- pydantic

## Backend: usage & endpoints

Start the backend (from project root):

```powershell
python -m venv .venv; .\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload
```

Available endpoints (as implemented in `main.py`):

- POST /add_item
  - Body: `Item` JSON
  - Adds a new item.

- GET /get_all_items
  - Returns all items (response excludes MongoDB `_id`).

- GET /get_item/{item_name}
  - Retrieve a single item by `name`.

- PUT /update_item/{item_name}
  - Body: partial JSON with fields to update. Null values are ignored.

- DELETE /delete_item/{item_name}
  - Deletes item by `name`.

- POST /sell_item/{item_name}
  - Body: `SaleRequest` JSON (example: `{ "quantity": 2 }`).
  - Decrements `quantity` of the named item if stock is sufficient and returns remaining quantity.

Data models (`validations.py`)

- `Item`:
  - `name`: str
  - `quantity`: int
  - `Wprice`: float (wholesale price)
  - `Rprice`: float (retail price)

- `SaleRequest`:
  - `quantity`: int

Notes & recommendations (backend)

- The backend treats `name` as the logical unique key. For production use, add a unique index on `name` in MongoDB to prevent duplicate inserts.
- The `add_item` function currently returns simple dicts with `message`/`data` or `error` strings. Consider using proper HTTP status codes (201, 400, 404, 409) and a consistent response schema.

## Frontend: usage & notes

The frontend is a Vite + React app located in `frontend/`. It expects the backend at `http://127.0.0.1:8000` by default (see `frontend/src/api.js`).

Install and run the frontend (from project root or inside the `frontend/` folder):

```powershell
cd frontend
- [ ] Add tests (unit and integration) and CI.
npm install
npm run dev
```

The frontend exposes a simple UI (RTL layout, Urdu labels) with the following features:

- List all items
- Add an item (name, quantity, retail and wholesale price)
- Edit an item
- Delete an item
- Sell (decrease quantity) via the `sell_item` backend endpoint

Implementation notes (frontend)

- API base URL: `frontend/src/api.js` - update `API_URL` if backend runs on a different host/port.
- `sellItem` in `api.js` sends a POST to `/sell_item/{name}` with a JSON body `{ quantity: N }` as required by the backend.
- The project uses Vite + React; configuration is in `frontend/vite.config.js`.

## Running the full stack locally

1. Start MongoDB (ensure it listens at `mongodb://localhost:27017/` or change `db.py`).
2. Start the backend (see instructions above).
3. Start the frontend in a separate terminal.
4. Open the frontend dev server URL that `npm run dev` prints (usually http://localhost:5173).

## Troubleshooting

- If fetch requests from the frontend fail, confirm the backend is running and CORS is configured if you serve frontend and backend on different origins. The current backend does not include an explicit CORS policy.
- If `add_item` or `sell_item` behave unexpectedly, check MongoDB data (collection `items`) and review API responses for `error` messages.

## Next improvements

- Add CORS support on the backend to enable cross-origin fetches in different environments.
- Add tests for backend endpoints and integration tests covering frontend-backend flows.
- Add a unique index on `name` in MongoDB.
- Standardize HTTP response codes and response schema.

---

If you'd like, I can now: (A) run `git status` and `git log -1` and push the README update, or (B) just leave the README update in the workspace and you can push. I will not modify any source code unless you ask.

License

MIT License  

Copyright (c) 2025  

Ali Mirza (Backend Developer)  
Amir Malik (Frontend Developer)  

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
