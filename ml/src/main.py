'''
Jesus this will be a complicated one

Jackson Rudnick
Dataset: https://www.kaggle.com/datasets/clmentbisaillon/fake-and-real-news-dataset
Transformer model: https://huggingface.co/docs/transformers/model_doc/distilbert

Dataset is modified to remove unneeded columns and add a label column
'''

import os
import pandas as pd
from sklearn.model_selection import train_test_split
from transformers import DistilBertTokenizer, DistilBertForSequenceClassification, Trainer, TrainingArguments

df = pd.DataFrame()

if os.path.exists('../data/combined_news.csv'):
    df = pd.read_csv('../data/combined_news.csv')
else:
    print("Dataset not found. Please run 'modify_dataset.py' to create the combined dataset.")

train_df, temp_df = train_test_split(df, test_size=0.3, random_state=42)
val_df, test_df = train_test_split(temp_df, test_size=0.5, random_state=42)

tokenizer = DistilBertTokenizer.from_pretrained("distilbert-base-uncased")

train_encodings = tokenizer(train_df['text'].tolist(), truncation=True, padding=True)
val_encodings = tokenizer(val_df['text'].tolist(), truncation=True, padding=True)
test_encodings = tokenizer(test_df['text'].tolist(), truncation=True, padding=True)

model = DistilBertForSequenceClassification.from_pretrained("distilbert-base-uncased", num_labels=2)

training_args = TrainingArguments(
    output_dir='./results',
    evaluation_strategy="epoch",
    learning_rate=2e-5,
    per_device_train_batch_size=16,
    per_device_eval_batch_size=16,
    num_train_epochs=3,
    weight_decay=0.01,
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_encodings,
    eval_dataset=val_encodings,
)

trainer.train()

trainer.evaluate(eval_dataset=test_encodings)
predictions = trainer.predict(test_encodings)

preds = predictions.predictions.argmax(-1)
accuracy = (preds == test_df['label'].values).mean()
print(f"Test Accuracy: {accuracy:.4f}")

save = input("Save model? (y/n): ")
if save.lower() == 'y':
    model.save_pretrained('../model')
    tokenizer.save_pretrained('../model')
    print("Model and tokenizer saved to '../model'")