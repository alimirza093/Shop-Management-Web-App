from pydantic import BaseModel

class Item(BaseModel):
    name: str
    quantity: int
    Wprice: float # Wholesale price
    Rprice: float # Retail price


class SaleRequest(BaseModel):
    quantity: int


class LoginUser(BaseModel):
    password : str 


class ChangePass(BaseModel):
    old_password : str
    new_password : str