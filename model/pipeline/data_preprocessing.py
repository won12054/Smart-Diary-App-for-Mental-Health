from bs4 import BeautifulSoup
from langdetect import detect, LangDetectException

'''
This part is the extension of the data exploration part.
However, it also has data preprocessing steps.
'''
def preprocess_text(text):
    # Normalize special characters
    text = text.replace('İ', 'I').replace('ı', 'i')

    text = contractions.fix(text)
    text = text.replace("\\'", "'")
    text = text.replace('\n', ' ').replace('\r', ' ').replace('\t', ' ')
    text = re.sub(' +', ' ', text)

    return text.strip()
def preprocess_data(df_train, df_val, df_test):
    # Step 1: Remove duplicates
    print("Removing duplicates...")
    df_train = df_train.drop_duplicates(subset='text', keep='first')
    df_val = df_val.drop_duplicates(subset='text', keep='first')
    df_test = df_test.drop_duplicates(subset='text', keep='first')

    # Verify remaining duplicates
    duplicate_train_remaining = df_train[df_train.duplicated(subset='text', keep=False)]
    duplicate_val_remaining = df_val[df_val.duplicated(subset='text', keep=False)]
    duplicate_test_remaining = df_test[df_test.duplicated(subset='text', keep=False)]

    print(f"Number of duplicates remaining in Train DataFrame: {len(duplicate_train_remaining)}")
    print(f"Number of duplicates remaining in Validation DataFrame: {len(duplicate_val_remaining)}")
    print(f"Number of duplicates remaining in Test DataFrame: {len(duplicate_test_remaining)}")

    # Step 2: Rows with empty/whitespace text
    df_train = df_train[df_train['text'].str.strip() != '']
    df_val = df_val[df_val['text'].str.strip() != '']
    df_test = df_test[df_test['text'].str.strip() != '']

    # Step 3: Missing values
    df_train = df_train.dropna(subset=['text'])
    df_val = df_val.dropna(subset=['text'])
    df_test = df_test.dropna(subset=['text'])

    # Step 4: HTML tags
    def has_html(text):
        return bool(BeautifulSoup(text, "html.parser").find())

    df_train = df_train[~df_train['text'].apply(has_html)]
    df_val = df_val[~df_val['text'].apply(has_html)]
    df_test = df_test[~df_test['text'].apply(has_html)]

    print(f"Number of rows with HTML tags removed in Train DataFrame: {len(df_train)}")
    print(f"Number of rows with HTML tags removed in Validation DataFrame: {len(df_val)}")
    print(f"Number of rows with HTML tags removed in Test DataFrame: {len(df_test)}")

    # Step 5: Check non-English text
    def is_english(text):
        try:
            return detect(text) == 'en'
        except LangDetectException:
            return False

    df_train = df_train[df_train['text'].apply(is_english)]
    df_val = df_val[df_val['text'].apply(is_english)]
    df_test = df_test[df_test['text'].apply(is_english)]

    print(f"Number of non-English rows removed in Train DataFrame: {len(df_train)}")
    print(f"Number of non-English rows removed in Validation DataFrame: {len(df_val)}")
    print(f"Number of non-English rows removed in Test DataFrame: {len(df_test)}")

    # Step 6: Preprocess text (normalize special characters, fix contractions, etc.)
    print("Preprocessing text...")
    df_train['text'] = df_train['text'].apply(preprocess_text)
    df_val['text'] = df_val['text'].apply(preprocess_text)
    df_test['text'] = df_test['text'].apply(preprocess_text)

    return df_train, df_val, df_test


