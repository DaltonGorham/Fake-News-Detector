'''
Jesus this will be a complicated one

Jackson Rudnick
Dataset: https://www.kaggle.com/datasets/clmentbisaillon/fake-and-real-news-dataset
Transformer model: https://huggingface.co/docs/transformers/model_doc/distilbert

Dataset is modified to remove unneeded columns and add a label column
'''

import os
import pandas as pd
import pickle

from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

from sklearn.svm import SVC
from sklearn.linear_model import LogisticRegression
from sklearn.naive_bayes import MultinomialNB
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier

from sklearn.feature_extraction.text import TfidfVectorizer
from transformers import DistilBertTokenizer

import modify_dataset

def read_data():
    if not os.path.exists('../data/combined_news.csv'):
        modify_dataset.main()
    df = pd.read_csv('../data/combined_news.csv')
    return df

def data_splits(df):
    X, y = df['text'], df['label']

    train_X, temp_X, train_y, temp_y = train_test_split(X, y, train_size=0.7, test_size=0.3)
    val_X, test_X, val_y, test_y = train_test_split(temp_X, temp_y, train_size=0.5, test_size=0.5)
    
    return train_X, val_X, test_X, train_y, val_y, test_y

def check_embeddings():
    return os.path.exists('../data/embeddings.pkl')

def create_embeddings_Transformer(train_X, val_X, test_X):
    tokenizer = DistilBertTokenizer.from_pretrained("distilbert-base-uncased")
    
    train_encodings = tokenizer(train_X.tolist(), truncation=True, padding=True)
    val_encodings = tokenizer(val_X.tolist(), truncation=True, padding=True)
    test_encodings = tokenizer(test_X.tolist(), truncation=True, padding=True)

    embeddings = {
        'train': train_encodings,
        'val': val_encodings,
        'test': test_encodings
    }
    with open('../data/embeddings.pkl', 'wb') as f:
        pickle.dump(embeddings, f)

    return train_encodings, val_encodings, test_encodings

def create_embeddings_TFIDF(train_X, val_X, test_X):
    vectorizer = TfidfVectorizer()
    train_encodings = vectorizer.fit_transform(train_X).toarray()
    val_encodings = vectorizer.transform(val_X).toarray()
    test_encodings = vectorizer.transform(test_X).toarray()

    embeddings = {
        'train': train_encodings,
        'val': val_encodings,
        'test': test_encodings
    }
    with open('../data/embeddings.pkl', 'wb') as f:
        pickle.dump(embeddings, f)

    return train_encodings, val_encodings, test_encodings

def save_targets(train_y, val_y, test_y):
    save_targets = {
        'train_y': train_y,
        'val_y': val_y,
        'test_y': test_y
    }
    with open('../data/targets.pkl', 'wb') as f:
        pickle.dump(save_targets, f)

def get_embeddings_from_file():
    with open('../data/embeddings.pkl', 'rb') as f:
        embeddings = pickle.load(f)
    return embeddings['train'], embeddings['val'], embeddings['test']

def get_targets_from_file():
    with open('../data/targets.pkl', 'rb') as f:
        targets = pickle.load(f)
    return targets['train_y'], targets['val_y'], targets['test_y']

def train_model_SVC(train_encodings, train_y):
    clf = SVC()
    clf.fit(train_encodings['input_ids'], train_y)
    return clf

def train_model_LogisticRegression(train_encodings, train_y):
    clf = LogisticRegression(max_iter=1000)
    clf.fit(train_encodings['input_ids'], train_y)
    return clf

def train_model_MultinomialNB(train_encodings, train_y):
    clf = MultinomialNB()
    clf.fit(train_encodings['input_ids'], train_y)
    return clf

def train_model_DecisionTree(train_encodings, train_y):
    clf = DecisionTreeClassifier()
    clf.fit(train_encodings['input_ids'], train_y)
    return clf

def train_model_RandomForest(train_encodings, train_y):
    clf = RandomForestClassifier()
    clf.fit(train_encodings['input_ids'], train_y)
    return clf

def evaluate_model(clf, val_encodings, val_y):
    val_preds = clf.predict(val_encodings['input_ids'])
    print("Validation Set Classification Report:")
    print(classification_report(val_y, val_preds))

def test_model(clf, test_encodings, test_y):
    test_preds = clf.predict(test_encodings['input_ids'])
    print("Test Set Classification Report:")
    print(classification_report(test_y, test_preds))

def main():
    train_encodings, val_encodings, test_encodings = None, None, None
    train_y, val_y, test_y = None, None, None

    if not check_embeddings():
        df = read_data()
        train_X, val_X, test_X, train_y, val_y, test_y = data_splits(df)
        train_encodings, val_encodings, test_encodings = create_embeddings_Transformer(train_X, val_X, test_X)
        save_targets(train_y, val_y, test_y)

        train_y, val_y, test_y = train_y, val_y, test_y
    else:
        train_encodings, val_encodings, test_encodings = get_embeddings_from_file()
        train_y, val_y, test_y = get_targets_from_file()

    clf = train_model_RandomForest(train_encodings, train_y)
    evaluate_model(clf, val_encodings, val_y)
    test_model(clf, test_encodings, test_y)

if __name__ == "__main__":
    main()