def explore_data(df_train, df_val, df_test):
    # Print the description of the dataframes
    print("Train DataFrame Description:")
    print(df_train.describe(), "\n")
    print("Validation DataFrame Description:")
    print(df_val.describe(), "\n")
    print("Test DataFrame Description:")
    print(df_test.describe(), "\n")

    # Print the first few rows of each dataframe
    print("Train DataFrame Head:")
    print(df_train.head(), "\n")
    print("Validation DataFrame Head:")
    print(df_val.head(), "\n")
    print("Test DataFrame Head:")
    print(df_test.head(), "\n")

    # Print the label value counts
    print("Train DataFrame Label Value Counts:")
    print(df_train['label'].value_counts(), "\n")
    print("Validation DataFrame Label Value Counts:")
    print(df_val['label'].value_counts(), "\n")
    print("Test DataFrame Label Value Counts:")
    print(df_test['label'].value_counts(), "\n")

    # Checking for empty text
    empty_text_train = df_train[df_train['text'].str.strip() == '']
    empty_text_val = df_val[df_val['text'].str.strip() == '']
    empty_text_test = df_test[df_test['text'].str.strip() == '']

    print(f"Number of empty text rows in Train DataFrame: {len(empty_text_train)}")
    print(f"Number of empty text rows in Validation DataFrame: {len(empty_text_val)}")
    print(f"Number of empty text rows in Test DataFrame: {len(empty_text_test)}")

    # Checking for missing text
    missing_text_train = df_train[df_train['text'].isna()]
    missing_text_val = df_val[df_val['text'].isna()]
    missing_text_test = df_test[df_test['text'].isna()]

    print(f"Number of missing text rows in Train DataFrame: {len(missing_text_train)}")
    print(f"Number of missing text rows in Validation DataFrame: {len(missing_text_val)}")
    print(f"Number of missing text rows in Test DataFrame: {len(missing_text_test)}")
