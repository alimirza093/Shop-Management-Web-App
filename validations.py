from pydantic import BaseModel

class Item(BaseModel):
    name: str
    quantity: int
    Wprice: float # Wholesale price
    Rprice: float # Retail price


class SaleRequest(BaseModel):
    quantity: int
