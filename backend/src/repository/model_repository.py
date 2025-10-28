from email.mime import base
import os
import pickle

def get_all():
    return (get_vectorizer(), get_model())

def get_vectorizer():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    base_dir = base_dir.split("src")[0]
    file_path = os.path.join(base_dir, "model", "vectorizer.pkl")

    return pickle.load(open(file_path, 'rb'))

def get_model():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    base_dir = base_dir.split("src")[0]
    file_path = os.path.join(base_dir, "model", "model.pkl")

    return pickle.load(open(file_path, 'rb'))