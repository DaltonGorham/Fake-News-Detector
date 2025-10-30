import os
import pickle

def get_all():
    return (get_vectorizer(), get_model())

def get_vectorizer():
    # Get the backend directory (parent of src/)
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    file_path = os.path.join(base_dir, "model", "vectorizer.pkl")

    return pickle.load(open(file_path, 'rb'))

def get_model():
    # Get the backend directory (parent of src/)
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    file_path = os.path.join(base_dir, "model", "model.pkl")

    return pickle.load(open(file_path, 'rb'))