import os
import pandas as pd

if os.path.exists('../data/Fake.csv') and os.path.exists('../data/True.csv'):
    df_fake = pd.read_csv('../data/Fake.csv')
    df_true = pd.read_csv('../data/True.csv')

    df_fake = df_fake.drop(columns=['subject', 'date'])
    df_true = df_true.drop(columns=['subject', 'date'])

    for row in df_fake.itertuples():
        df_fake.at[row.Index, 'text'] = "Headline: " + row.title + " Content: " + row.text
        df_fake.at[row.Index, 'label'] = 1  # Fake news labeled as 1

    for row in df_true.itertuples():
        df_true.at[row.Index, 'text'] = "Headline: " + row.title + " Content: " + row.text
        df_true.at[row.Index, 'label'] = 0  # True news labeled as 0

    df_fake = df_fake.drop(columns=['title'])
    df_true = df_true.drop(columns=['title'])

    df = pd.concat([df_fake, df_true])

    df = df.sample(frac=1).reset_index(drop=True)  # Shuffle the dataset
    df.to_csv('../data/combined_news.csv', index=False)
    print("Combined dataset saved to '../data/combined_news.csv'")
else:
    print("Source datasets not found. Please ensure 'Fake.csv' and 'True.csv' are in the '../data/' directory.")
    print("Contact Jackson, this shouldn't ever happen.")