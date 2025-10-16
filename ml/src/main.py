'''
Jesus this will be a complicated one

Jackson Rudnick
Dataset: https://www.kaggle.com/datasets/abaghyangor/fake-news-dataset/data
Transformer model: https://huggingface.co/docs/transformers/model_doc/distilbert
'''

import os
import kagglehub

df = None

if os.path.exists('dataset.csv'):
    print("Dataset already exists. Skipping download.")
else:
    print("Downloading dataset...")
    # Download latest version
    df = kagglehub.dataset_load(kagglehub.KaggleDatasetAdapter.HUGGING_FACE, 'abaghyangor/fake-news-dataset')