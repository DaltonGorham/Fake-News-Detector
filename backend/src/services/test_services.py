from src.repository import test_repository

def get_test_data():
    data = test_repository.fetch_data()
    return {"status": "success", "data": data}
