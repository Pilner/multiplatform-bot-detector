import pandas as pd
import numpy as np
from sklearn.calibration import CalibratedClassifierCV
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, matthews_corrcoef, confusion_matrix
import joblib
import io
import tempfile

model_proposed = joblib.load(
    '../models/Semi_supervised_models_12_13_10.joblib')
model_baseline = joblib.load(
    '../models/Initial_Models_12_11_supervised_dropped_5_2.joblib')
val_df = pd.read_parquet(
    '../data/final/labeled/combined/ROBERTA/val_labeled_LDA_missing_dropped.parquet')

features_LDA = ['user_id', 'username', 'username_uppercase', 'username_lowercase',
                'username_numeric', 'username_special', 'username_length', 'username_se', 'is_missing_username',
                'screenname', 'screenname_uppercase', 'screenname_lowercase',
                'screenname_numeric', 'screenname_special', 'screenname_length',
                'screenname_se', 'screenname_emoji', 'screenname_hashtag',
                'screenname_word', 'is_missing_screenname', 'description', 'description_length',
                'topic_0', 'topic_1', 'topic_2', 'topic_3', 'topic_4',
                'topic_5', 'topic_6', 'topic_7', 'topic_8', 'topic_9', 'is_missing_description',
                'user_md_follower', 'user_md_following', 'user_md_follow_ratio',
                'user_md_total_post', 'user_md_total_like', 'user_md_verified',
                'is_missing_user_metadata', 'post_md_like_mean',
                'post_md_like_std', 'post_md_retweet_mean', 'post_md_retweet_std',
                'post_md_reply_mean', 'post_md_reply_std',
                'is_missing_post_metadata', 'post_text_length_mean', 'post_text_length_std',
                'post_sentiment_score_mean', 'post_sentiment_score_std',
                'post_sentiment_numeric_mean', 'post_sentiment_numeric_std',
                'post_sentiment_numeric_prop_positive',
                'post_sentiment_numeric_prop_neutral',
                'post_sentiment_numeric_prop_negative', 'is_missing_post_text']

feature_sets_LDA = {
    'username': ['username_uppercase', 'username_lowercase', 'username_numeric',
                 # Add all username features
                 'username_special', 'username_length', 'username_se', 'is_missing_username'],
    'screenname': ['screenname_uppercase', 'screenname_lowercase',
                   'screenname_numeric', 'screenname_special', 'screenname_length',
                   'screenname_se', 'is_missing_screenname'],  # Add all screenname features
    'description': ['description_length', 'topic_0', 'topic_1', 'topic_2', 'topic_3', 'topic_4',
                    # Add all description features
                    'topic_5', 'topic_6', 'topic_7', 'topic_8', 'topic_9', 'is_missing_description'],
    'user_metadata': ['user_md_follower', 'user_md_following', 'user_md_follow_ratio',
                      'user_md_total_post', 'user_md_total_like', 'user_md_verified',
                      'is_missing_user_metadata'],  # Add user metadata features
    'post': ['post_md_like_mean', 'post_md_like_std', 'post_md_retweet_mean',
             'post_md_retweet_std', 'post_md_reply_mean', 'post_md_reply_std',
             'is_missing_post_metadata', 'post_text_length_mean', 'post_text_length_std', 'post_sentiment_score_mean',
             'post_sentiment_score_std', 'post_sentiment_numeric_mean', 'post_sentiment_numeric_std',
             'post_sentiment_numeric_prop_positive', 'post_sentiment_numeric_prop_neutral',
             # Add post text features
             'post_sentiment_numeric_prop_negative', 'is_missing_post_text']
}


def output_to_excel(X_test, y_test, final_predictions):
    # store all to an excel file combining X_test, y_test, final_predictions
    test_df = X_test.copy()
    print(test_df.dtypes)
    test_df['label'] = y_test
    test_df['predictions'] = final_predictions

    right_count = 0
    wrong_count = 0

    # Create a temporary file to save the Excel file
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".xlsx")
    temp_file.close()  # Close the file so it can be used later

    output = io.BytesIO()

    # Writing DataFrame to Excel and applying conditional formatting
    with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
        test_df.to_excel(writer, sheet_name='Predictions', index=False)

        # Access the Excel sheet
        worksheet = writer.sheets['Predictions']

        # Get the workbook to create formats
        workbook = writer.book

        # Define formatting for matching and non-matching rows
        match_format = workbook.add_format({'bg_color': '#90EE90'})
        mismatch_format = workbook.add_format({'bg_color': '#FF474C'})

        # Apply formatting row by row (start from row 1 to skip header)
        for row in range(1, len(test_df) + 1):  # Add 1 because Excel rows are 1-based
            if test_df['label'].iloc[row - 1] == test_df['predictions'].iloc[row - 1]:
                right_count += 1
                for col_num, value in enumerate(test_df.iloc[row - 1]):
                    # Check if value is NaN, if so, write an empty cell
                    value_to_write = value if pd.notna(value) else ''
                    worksheet.write(row, col_num, value_to_write, match_format)
            else:
                wrong_count += 1
                for col_num, value in enumerate(test_df.iloc[row - 1]):
                    # Check if value is NaN, if so, write an empty cell
                    value_to_write = value if pd.notna(value) else ''
                    worksheet.write(
                        row, col_num, value_to_write, mismatch_format)

        # count all the correct and incorrect predictions in the last column
        worksheet.write(1, len(test_df.columns) + 2,
                        "Correct Predictions", match_format)
        worksheet.write(1, len(test_df.columns) + 3,
                        right_count, match_format)
        worksheet.write(2, len(test_df.columns) + 2,
                        "Wrong Predictions", mismatch_format)
        worksheet.write(2, len(test_df.columns) + 3,
                        wrong_count, mismatch_format)
        worksheet.write(3, len(test_df.columns) + 3,
                        wrong_count + right_count)

    # Save the workbook to the buffer
    output.seek(0)

    # Save the buffer to the temporary file
    with open(temp_file.name, 'wb') as f:
        f.write(output.getbuffer())

    # Return the filename so it can be used in the URL
    return temp_file.name


def statistics(X_test, y_test, X_val, y_val, mode):

    model_used = model_proposed

    if mode == "proposed_model":
        model_used = model_proposed
    elif mode == "baseline_model":
        model_used = model_baseline
    else:
        return "Invalid mode"

    # Initialize arrays to accumulate weighted probabilities
    bot_prob_sum = np.zeros(len(X_test))
    human_prob_sum = np.zeros(len(X_test))
    total_weights = np.zeros(len(X_test))  # To normalize the weighted sums

    # Define completeness threshold for assigning full weights
    completeness_threshold = 0.75

    # Initialize array for calibrated models
    calibrated_models = {}

    # Initialize a dictionary to store metrics for each individual model
    individual_model_metrics = {}

    # Apply Platt's scaling to each model using CalibratedClassifierCV
    # Change model
    for feature_name, models in model_used.items():
        calibrated_model = CalibratedClassifierCV(
            estimator=models, method='sigmoid', cv='prefit')
        # Assuming models are already trained
        calibrated_model.fit(X_val[feature_sets_LDA[feature_name]], y_val)
        calibrated_models[feature_name] = calibrated_model

    # Generate predictions for each model using calibrated models
    for feature_name, models in calibrated_models.items():
        feature_columns = feature_sets_LDA[feature_name]

        # Calculate feature completeness per instance (user) for X_test
        completeness = X_test[feature_columns].notnull().mean(axis=1)

        # Get the is_missing indicator for the subset (e.g., user_metadata, post_text)
        # is_missing_subset = X_test[f'is_missing_{feature_name}']

        # Adjust weights based on completeness and is_missing indicator
        weights = np.where(
            completeness >= completeness_threshold, 1.0, completeness)
        # If the subset is missing entirely (is_missing == 1), reduce weight (set it to 0)
        # weights = np.where(is_missing_subset == 1, 0.0, weights)

        # Predict calibrated probabilities for X_test
        probas = models.predict_proba(X_test[feature_columns])

        # Accumulate weighted probabilities for bot and human predictions
        human_prob_sum += probas[:, 0] * weights  # Human probabilities
        bot_prob_sum += probas[:, 1] * weights    # Bot probabilities

        # Accumulate total weights for normalization
        total_weights += weights

        # Make predictions based on probabilities for individual model performance
        individual_predictions = np.where(
            probas[:, 1] > probas[:, 0], True, False)

        # Calculate performance metrics for the individual model
        accuracy = accuracy_score(y_test, individual_predictions)
        precision = precision_score(
            y_test, individual_predictions, pos_label=True)
        recall = recall_score(y_test, individual_predictions, pos_label=True)
        f1 = f1_score(y_test, individual_predictions, pos_label=True)
        mcc = matthews_corrcoef(y_test, individual_predictions)

        # Store metrics for the individual model
        individual_model_metrics[feature_name] = {
            "accuracy": accuracy,
            "precision": precision,
            "recall": recall,
            "f1_score": f1,
            "mcc": mcc
        }

    # Normalize the weighted probabilities
    # Avoid division by zero in case no weights were assigned
    total_weights_safe = np.where(total_weights == 0, 1, total_weights)
    avg_human_prob = human_prob_sum / total_weights_safe
    avg_bot_prob = bot_prob_sum / total_weights_safe

    # Assign final predictions based on aggregated weighted probabilities
    final_predictions = np.where(avg_bot_prob > avg_human_prob, True, False)

    # Evaluate the overall ensemble performance
    ensemble_accuracy = accuracy_score(y_test, final_predictions)
    ensemble_precision = precision_score(
        y_test, final_predictions, pos_label=True)
    ensemble_recall = recall_score(y_test, final_predictions, pos_label=True)
    ensemble_f1 = f1_score(y_test, final_predictions, pos_label=True)
    ensemble_mcc = matthews_corrcoef(y_test, final_predictions)

    # store to an object
    results = {
        "overall": {
            "accuracy": ensemble_accuracy,
            "precision": ensemble_precision,
            "recall": ensemble_recall,
            "f1_score": ensemble_f1,
            "mcc": ensemble_mcc
        },
        "individual": individual_model_metrics
    }

    cm = confusion_matrix(y_test, final_predictions).tolist()

    print(cm)

    excel_file = output_to_excel(X_test, y_test, final_predictions)

    # Return the results with the mode
    return {
        "results": results,
        "mode": mode,
        "confusion_matrix": {
            "TP": cm[1][1],
            "TN": cm[0][0],
            "FP": cm[0][1],
            "FN": cm[1][0]
        }
    }, excel_file


def performance(data, mode):
    # data is a parquet file
    # Load the data
    test_df = pd.read_parquet(data)

    # For the testing data
    # All feature columns from the validation dataset
    X_test = test_df[features_LDA]
    y_test = test_df['label']    # Label column from the validation dataset

    # For the validation data
    # All feature columns from the validation dataset
    X_val = val_df[features_LDA]
    y_val = val_df['label']    # Label column from the validation dataset

    return statistics(X_test, y_test, X_val, y_val, mode)


# # Print evaluation results for the ensemble
# print(f"Baseline Model Ensemble Performance:")
# print(f'Accuracy: {ensemble_accuracy:.2f}')
# print(f'Precision: {ensemble_precision:.2f}')
# print(f'Recall: {ensemble_recall:.2f}')
# print(f'F1 Score: {ensemble_f1:.2f}')
# print(f'MCC: {ensemble_mcc:.2f}')

# baseline_model_metrics = {
# 	"accuracy": ensemble_accuracy,
# 	"precision": ensemble_precision,
# 	"recall": ensemble_recall,
# 	"f1_score": ensemble_f1,
# 	"mcc": ensemble_mcc
# }

# # Print evaluation results for each individual model
# print("\nIndividual Model Performance:")
# for feature_name, metrics in individual_model_metrics.items():
# 	print(f"Performance for {feature_name} model:")
# 	for metric, value in metrics.items():
# 		print(f"  {metric}: {value:.2f}")
