from sklearn.preprocessing import LabelEncoder
import numpy as np
import nlpaug.augmenter.word as naw
import pandas as pd

def encode_labels(df_train, df_val, df_test):
    le = LabelEncoder()
    df_train['label'] = le.fit_transform(df_train['label'])
    df_val['label'] = le.transform(df_val['label'])
    df_test['label'] = le.transform(df_test['label'])

    X_train, y_train = df_train['text'].values, df_train['label'].values
    X_val, y_val = df_val['text'].values, df_val['label'].values
    X_test, y_test = df_test['text'].values, df_test['label'].values

    return X_train, y_train, X_val, y_val, X_test, y_test, le

def augment_texts(texts, labels, augmenter, target_count):
    augmented_texts = list(texts)
    augmented_labels = list(labels)

    if len(augmented_texts) >= target_count:
        return augmented_texts[:target_count], augmented_labels[:target_count]

    num_samples = len(texts)
    iterations = (target_count - num_samples) // num_samples + 1

    print(f"Need {iterations} iterations to reach target count {target_count}")

    for i in range(iterations):
        print(f"Iteration {i + 1}/{iterations}")
        for text, label in zip(texts, labels):
            if len(augmented_texts) < target_count:
                augmented_text = augmenter.augment(text)
                if isinstance(augmented_text, list):
                    augmented_text = ' '.join(augmented_text)
                if isinstance(augmented_text, str) and len(augmented_text.strip()) > 0:
                    augmented_texts.append(augmented_text)
                    augmented_labels.append(label)
                else:
                    print(f"Skipping invalid augmentation result: {augmented_text}")
            if len(augmented_texts) >= target_count:
                break

    return augmented_texts[:target_count], augmented_labels[:target_count]


def augment_data(X_train, y_train):
    unique_classes, counts = np.unique(y_train, return_counts=True)
    max_count = counts.max()  # Target is the maximum class size
    augmenter = naw.SynonymAug(aug_src='wordnet')

    augmented_texts, augmented_labels = [], []

    for cls in unique_classes:
        texts = X_train[y_train == cls]
        labels = y_train[y_train == cls]

        print(f"Class {cls} before augmentation: {len(texts)} samples")
        aug_texts, aug_labels = augment_texts(texts, labels, augmenter, max_count)
        print(f"Class {cls} after augmentation: {len(aug_texts)} samples")

        augmented_texts.extend(aug_texts)
        augmented_labels.extend(aug_labels)

    augmented_data = pd.DataFrame({'text': augmented_texts, 'label': augmented_labels})
    return augmented_data

def save_augmented_data(augmented_data, file_path):
    augmented_data.to_csv(file_path, index=False)
    print(f"Augmented data saved to {file_path}")

def load_augmented_data(file_path):
    df_augmented = pd.read_csv(file_path)
    print(f"Augmented data loaded from {file_path}")
    return df_augmented