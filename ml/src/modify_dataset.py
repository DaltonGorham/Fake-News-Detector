import os
import kagglehub
import pandas as pd

def modify_dataset():
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

def download_dataset():
    path = kagglehub.dataset_download('clmentbisaillon/fake-and-real-news-dataset')
    os.mkdir('../data')
    for file in os.listdir(path):
        os.rename(os.path.join(path, file), os.path.join('../data', file))
    os.rmdir(path)
    print("Datasets downloaded and saved to '../data' directory.")

def main():
    if not os.path.exists('../data/Fake.csv') and not os.path.exists('../data/True.csv'):
        download_dataset()
    modify_dataset()

if __name__ == "__main__":
    main()