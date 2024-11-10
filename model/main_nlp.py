import os
from dotenv import load_dotenv
from data_loading import load_data
from data_exploration import explore_data
from data_preprocessing import preprocess_data
from exploratory_data_analysis import plot_label_distribution, plot_label_distribution_percentage, plot_word_count_distribution, plot_word_count_per_label, plot_wordcloud
from data_augmentation import encode_labels, augment_data, save_augmented_data, load_augmented_data
from model_training import encode_texts, TextDataset, train_epoch, eval_model, save_model
from model_evaluation import load_best_model, evaluate_on_test, plot_confusion_matrix, compute_roc_auc, plot_training_validation
from transformers import RobertaForSequenceClassification, RobertaTokenizer, AdamW, get_linear_schedule_with_warmup
import torch
from torch.utils.data import DataLoader

load_dotenv()

tar_gz_path = os.getenv('TAR_GZ_PATH')
augmented_data_path = os.getenv('AUGMENTED_DATA_PATH')
best_model_save_path = os.getenv('BEST_MODEL_SAVE_PATH')
best_model_load_path = os.getenv('BEST_MODEL_LOAD_PATH')

# Step 1: Load the dataset
df_train, df_val, df_test = load_data(tar_gz_path)

# Step 2: Explore the dataset
explore_data(df_train, df_val, df_test)

# Step 3: Preprocess the data
df_train, df_val, df_test = preprocess_data(df_train, df_val, df_test)

# Step 4: Exploratory Data Analysis (Visualizations)
plot_label_distribution(df_train, 'Label Distribution in Train Data')
plot_label_distribution_percentage(df_train, 'Label Distribution in Train Data (Percentage)')
plot_word_count_distribution(df_train, 'Word Count Distribution in Train Data')
plot_word_count_per_label(df_train, 'Text Length Distribution per Label in Train Data')
plot_wordcloud(df_train, 'Word Cloud for Train Data')

# Step 5: Encode labels
X_train, y_train, X_val, y_val, X_test, y_test, le = encode_labels(df_train, df_val, df_test)

# Step 6: Perform Data Augmentation
augmented_data = augment_data(X_train, y_train)

# Step 7: Save Augmented Data
save_augmented_data(augmented_data, augmented_data_path)

# Step 8: Load Augmented Data for Later Use
df_augmented = load_augmented_data(augmented_data_path)

# Step 9: Tokenizer and model initialization
tokenizer = RobertaTokenizer.from_pretrained('roberta-base')
model = RobertaForSequenceClassification.from_pretrained('roberta-base', num_labels=len(le.classes_))
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model.to(device)

# Step 10: Encode texts
X_augmented, y_augmented = df_augmented['text'].values, df_augmented['label'].values
encoded_train = encode_texts(X_augmented, tokenizer)
encoded_val = encode_texts(X_val, tokenizer)

# Step 11: Create Datasets and DataLoaders
train_dataset = TextDataset(encoded_train['input_ids'], encoded_train['attention_mask'], torch.tensor(y_augmented, dtype=torch.long))
val_dataset = TextDataset(encoded_val['input_ids'], encoded_val['attention_mask'], torch.tensor(y_val, dtype=torch.long))
train_loader = DataLoader(train_dataset, batch_size=16, shuffle=True)
val_loader = DataLoader(val_dataset, batch_size=16, shuffle=False)

# Step 12: Optimizer, scheduler, and training
optimizer = AdamW(model.parameters(), lr=2e-5)
total_steps = len(train_loader) * 3  # Assuming 3 epochs
scheduler = get_linear_schedule_with_warmup(optimizer, num_warmup_steps=0, num_training_steps=total_steps)

# Step 13: Training loop
best_val_acc = 0
for epoch in range(3):
    print(f"Epoch {epoch + 1}/3")

    train_acc, train_loss = train_epoch(model, train_loader, optimizer, device, scheduler)
    print(f"Train loss: {train_loss}, accuracy: {train_acc}")

    val_acc, val_loss = eval_model(model, val_loader, device)
    print(f"Val loss: {val_loss}, accuracy: {val_acc}")

    if val_acc > best_val_acc:
        best_val_acc = val_acc
        save_model(model, tokenizer, best_model_save_path)

# Step 14: Load the best model and evaluate on test set
model, tokenizer = load_best_model(best_model_load_path, device)

target_names = ['self.Anxiety', 'self.SuicideWatch', 'self.bipolar', 'self.depression', 'self.offmychest']
y_test_true, y_test_pred = evaluate_on_test(model, test_loader, device, target_names)

# Step 15: Plot confusion matrix and compute ROC-AUC
plot_confusion_matrix(y_test_true, y_test_pred, target_names)
roc_auc_test = compute_roc_auc(y_test_true, y_test_pred)

# Step 16: Plot training and validation curves
epochs = [1, 2, 3]
train_loss = [0.699864793565851, 0.46436320786717467, 0.3099567768682991]
val_loss = [0.7603498032206998, 0.7762529412558412, 0.8371890788377427]
train_accuracy = [0.7381351668623176, 0.82824081838001, 0.8859131309743417]
val_accuracy = [0.7158620689655172, 0.720919540229885, 0.7249425287356321]

plot_training_validation(epochs, train_loss, val_loss, train_accuracy, val_accuracy)
