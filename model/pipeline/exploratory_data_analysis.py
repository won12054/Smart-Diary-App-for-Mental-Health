import matplotlib.pyplot as plt
import seaborn as sns
from wordcloud import WordCloud

def plot_label_distribution(df, title):
    plt.figure(figsize=(10, 6))
    sns.countplot(x='label', data=df, hue='label', order=df['label'].value_counts().index, palette="rainbow", dodge=False)
    plt.title(title)
    plt.xlabel('Label')
    plt.ylabel('Count')
    plt.xticks(rotation=45)
    plt.legend([],[], frameon=False)
    plt.show()

def plot_label_distribution_percentage(df, title):
    label_counts = df['label'].value_counts()
    label_percentages = 100 * label_counts / len(df)
    colors = sns.color_palette("rainbow", len(label_counts))

    plt.figure(figsize=(10, 6))
    sns.barplot(x=label_percentages.index, y=label_percentages.values, hue=label_percentages.index, dodge=False, palette=colors)
    plt.title(title)
    plt.xlabel('Label')
    plt.ylabel('Percentage')
    plt.xticks(rotation=45)

    for i in range(len(label_percentages)):
        plt.text(i, label_percentages.values[i] + 0.5, f'{label_percentages.values[i]:.2f}%', ha='center')
    plt.legend([],[], frameon=False)
    plt.show()

def plot_word_count_distribution(df, title):
    df['word_count'] = df['text'].apply(lambda x: len(x.split()))

    percentile_50 = df['word_count'].quantile(0.50)
    percentile_75 = df['word_count'].quantile(0.75)
    percentile_90 = df['word_count'].quantile(0.90)

    plt.figure(figsize=(10, 6))
    sns.histplot(df['word_count'], bins=50, kde=True)
    plt.axvline(percentile_50, color='red', linestyle='--', label=f'50th percentile: {int(percentile_50)} words')
    plt.axvline(percentile_75, color='green', linestyle='--', label=f'75th percentile: {int(percentile_75)} words')
    plt.axvline(percentile_90, color='blue', linestyle='--', label=f'90th percentile: {int(percentile_90)} words')

    plt.title(title)
    plt.xlabel('Word Count')
    plt.ylabel('Frequency')
    plt.legend()
    plt.show()

    print(f"50th percentile: {int(percentile_50)} words")
    print(f"75th percentile: {int(percentile_75)} words")
    print(f"90th percentile: {int(percentile_90)} words")

def plot_word_count_per_label(df, title):
    df['text_length'] = df['text'].apply(lambda x: len(x.split()))

    plt.figure(figsize=(14, 8))
    colors = sns.color_palette("rainbow", len(df['label'].unique()))
    sns.boxplot(x='label', y='text_length', data=df, order=df['label'].value_counts().index, hue='label', palette=colors)
    plt.title(title)
    plt.xlabel('Label')
    plt.ylabel('Text Length (Number of Words)')
    plt.xticks(rotation=45)
    plt.legend([],[], frameon=False)
    plt.show()

def plot_wordcloud(df, title):
    text = ' '.join(df['text'].values)
    wordcloud = WordCloud(stopwords='english', background_color='white', width=800, height=400).generate(text)
    plt.figure(figsize=(10, 6))
    plt.imshow(wordcloud, interpolation='bilinear')
    plt.title(f'Word Cloud - {title}')
    plt.axis('off')
    plt.show()