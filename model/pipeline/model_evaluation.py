import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score
import pandas as pd

def load_best_model(best_model_load_path, device):
    model = RobertaForSequenceClassification.from_pretrained(best_model_load_path)
    tokenizer = RobertaTokenizer.from_pretrained(best_model_load_path)
    model.to(device)
    print('Best model loaded successfully')
    return model, tokenizer

def evaluate_on_test(model, test_loader, device, target_names):
    y_test_pred = []
    y_test_true = []

    model.eval()
    with torch.no_grad():
        for batch in test_loader:
            input_ids = batch['input_ids'].to(device)
            attention_mask = batch['attention_mask'].to(device)
            labels = batch['labels'].to(device)

            outputs = model(input_ids=input_ids, attention_mask=attention_mask)
            logits = outputs.logits
            _, preds = torch.max(logits, dim=1)

            y_test_pred.extend(preds.cpu().numpy())
            y_test_true.extend(labels.cpu().numpy())

    print(classification_report(y_test_true, y_test_pred, target_names=target_names))

    return y_test_true, y_test_pred

def plot_confusion_matrix(y_test_true, y_test_pred, target_names):
    conf_matrix_test = confusion_matrix(y_test_true, y_test_pred)
    conf_matrix_test_percentage = conf_matrix_test.astype('float') / conf_matrix_test.sum(axis=1)[:, np.newaxis] * 100

    plt.figure(figsize=(14, 10))
    ax = sns.heatmap(conf_matrix_test, annot=False, fmt='d', cmap='Blues', xticklabels=target_names, yticklabels=target_names)

    annotate_heatmap(conf_matrix_test, conf_matrix_test_percentage, ax=ax)

    plt.xlabel('Predicted')
    plt.ylabel('True')
    plt.title('Confusion Matrix with Counts and Percentages - Test Set')
    plt.show()

def annotate_heatmap(data, percentages, ax, **kwargs):
    for i in range(data.shape[0]):
        for j in range(data.shape[1]):
            count = data[i, j]
            percentage = percentages[i, j]
            color = 'white' if data[i, j] > np.max(data) / 2 else 'black'
            ax.text(j + 0.5, i + 0.5, f'{count}\n{percentage:.2f}%', ha='center', va='center', color=color)

def compute_roc_auc(y_test_true, y_test_pred):
    y_test_pred_onehot = pd.get_dummies(y_test_pred)
    roc_auc_test = roc_auc_score(y_test_true, y_test_pred_onehot, multi_class='ovr')
    print(f'ROC-AUC for Test Set: {roc_auc_test}')
    return roc_auc_test

def plot_training_validation(epochs, train_loss, val_loss, train_accuracy, val_accuracy):
    plt.figure(figsize=(12, 5))

    plt.subplot(1, 2, 1)
    plt.plot(epochs, train_loss, label='Train Loss', marker='o')
    plt.plot(epochs, val_loss, label='Validation Loss', marker='o')
    plt.xlabel('Epochs')
    plt.ylabel('Loss')
    plt.title('Training and Validation Loss')
    plt.legend()
    plt.xticks(epochs)

    plt.subplot(1, 2, 2)
    plt.plot(epochs, train_accuracy, label='Train Accuracy', marker='o')
    plt.plot(epochs, val_accuracy, label='Validation Accuracy', marker='o')
    plt.xlabel('Epochs')
    plt.ylabel('Accuracy')
    plt.title('Training and Validation Accuracy')
    plt.legend()
    plt.xticks(epochs)

    plt.tight_layout()
    plt.show()
