import tarfile
import pandas as pd


def load_csv_from_tar(tar, file_path):
    """Extract a specific CSV file from a tar.gz archive."""
    for member in tar.getmembers():
        if file_path in member.name:
            file = tar.extractfile(member)
            return pd.read_csv(file)
    return None


def load_data(tar_gz_path):
    """Load train, validation, and test datasets from a tar.gz archive."""
    with tarfile.open(tar_gz_path, 'r:gz') as tar:
        df_train = load_csv_from_tar(tar, 'swmh/train.csv')
        df_val = load_csv_from_tar(tar, 'swmh/val.csv')
        df_test = load_csv_from_tar(tar, 'swmh/test.csv')

    return df_train, df_val, df_test




