from fastapi import APIRouter
from src.services import test_services

router = APIRouter()

@router.get("/")
def root():
    return {"message": "Backend API is running"}

@router.get("/test")
def test():
    return test_services.get_test_data()
