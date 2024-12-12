import pandas as pd
import numpy as np
import joblib
from transformers import pipeline
from sklearn.calibration import CalibratedClassifierCV

from feature_engineering import uppercase_count, lowercase_count, numeric_count, special_count, emoji_count, hashtag_count, ratio, word_count, string_entropy

dataset_path = "../data/initial_train_data.csv"

train_data_labeled = pd.read_csv(dataset_path)

pipeline_model = "distilbert-base-uncased-finetuned-sst-2-english"

model_path = "../models/Unsupervised_Models_11_04.joblib"
model_tool = joblib.load(model_path)

feature_sets = {
	'username': ['username_uppercase', 'username_lowercase', 'username_numeric',
				 'username_special', 'username_length', 'username_se'],  # Add all username features
	'screenname': ['screenname_uppercase', 'screenname_lowercase',
				   'screenname_numeric', 'screenname_special', 'screenname_length',
				   'screenname_se',],  # Add all screenname features
	# Add all description features
	'description': ['description_length'],
	'user_metadata': ['user_md_follower', 'user_md_following', 'user_md_follow_ratio',
					  'user_md_total_post', 'user_md_total_like', 'user_md_verified',
					  'user_md_protected'],  # Add user metadata features
	'post_metadata': ['post_md_like_mean', 'post_md_like_std', 'post_md_retweet_mean',
					  'post_md_retweet_std', 'post_md_reply_mean', 'post_md_reply_std',
					  'post_md_quote_mean', 'post_md_quote_std'],  # Add post metadata features
	'post_text': ['post_text_length_mean', 'post_text_length_std', 'post_sentiment_score_mean',
				  'post_sentiment_score_std', 'post_sentiment_numeric_mean', 'post_sentiment_numeric_std',
				  # Add post text features (like BERT embeddings)
				  'post_sentiment_numeric_prop_positive', 'post_sentiment_numeric_prop_negative']
}


retrain_threshold = 10  # For example, retrain after 1000 high-confidence accounts
high_confidence_accounts = []  # Store high-confidence predictions


def safe_mean(values):
	if not values:  # Check if the list is empty
		return np.nan
	valid_values = [v for v in values if v >= 0]  # Filter negative values
	return np.mean(valid_values) if valid_values else np.nan


def safe_std(values):
	if not values:  # Check if the list is empty
		return np.nan
	valid_values = [v for v in values if v >= 0]
	if len(valid_values) <= 1:
		return 0.0  # Return 0 for std deviation if there's one or no valid value
	return np.std(valid_values, ddof=0)


def aggregate_sentiment_analysis(sentiment_data):
	# Extract relevant metrics from the sentiment analysis results
	post_md_likes = [post['post_md_like'] for post in sentiment_data]
	post_md_retweets = [post['post_md_retweet'] for post in sentiment_data]
	post_md_replies = [post['post_md_reply'] for post in sentiment_data]
	post_md_quotes = [post['post_md_quote'] for post in sentiment_data]
	post_text_lengths = [post['post_text_length'] for post in sentiment_data]
	post_sentiment_scores = [post['post_sentiment_score']
							 for post in sentiment_data]
	post_sentiment_numerics = [post['post_sentiment_numeric']
							   for post in sentiment_data]

	# Calculate aggregate metrics
	aggregated_results = {
		'post_md_like_mean': safe_mean(post_md_likes),
		'post_md_like_std': safe_std(post_md_likes),
		'post_md_retweet_mean': safe_mean(post_md_retweets),
		'post_md_retweet_std': safe_std(post_md_retweets),
		'post_md_reply_mean': safe_mean(post_md_replies),
		'post_md_reply_std': safe_std(post_md_replies),
		'post_md_quote_mean': safe_mean(post_md_quotes),
		'post_md_quote_std': safe_std(post_md_quotes),
		'post_text_length_mean': safe_mean(post_text_lengths),
		'post_text_length_std': safe_std(post_text_lengths),
		'post_sentiment_score_mean': safe_mean(post_sentiment_scores),
		'post_sentiment_score_std': safe_std(post_sentiment_scores),
		'post_sentiment_numeric_mean': safe_mean(post_sentiment_numerics),
		'post_sentiment_numeric_std': safe_std(post_sentiment_numerics),
		'post_sentiment_numeric_prop_positive': (sum(1 for x in post_sentiment_numerics if x == 1) / len(post_sentiment_numerics)) if post_sentiment_numerics else np.nan,
		'post_sentiment_numeric_prop_negative': (sum(1 for x in post_sentiment_numerics if x == -1) / len(post_sentiment_numerics)) if post_sentiment_numerics else np.nan
	}

	return aggregated_results


def sentiment_analysis(data_posts):

	if not data_posts:
		return {
			'post_md_like_mean': np.nan,
			'post_md_like_std': np.nan,
			'post_md_retweet_mean': np.nan,
			'post_md_retweet_std': np.nan,
			'post_md_reply_mean': np.nan,
			'post_md_reply_std': np.nan,
			'post_md_quote_mean': np.nan,
			'post_md_quote_std': np.nan,
			'post_text_length_mean': np.nan,
			'post_text_length_std': np.nan,
			'post_sentiment_score_mean': np.nan,
			'post_sentiment_score_std': np.nan,
			'post_sentiment_numeric_mean': np.nan,
			'post_sentiment_numeric_std': np.nan,
			'post_sentiment_numeric_prop_positive': np.nan,
			'post_sentiment_numeric_prop_negative': np.nan
		}

	# Load the sentiment-analysis pipeline
	sentiment_pipeline = pipeline("sentiment-analysis", model=pipeline_model)

	# Analyze sentiment for the posts
	sentiment_results = sentiment_pipeline(
		[post["post_text"] for post in data_posts])

	output = []
	sentiment_mapping = {
		"POSITIVE": 1,
		"NEGATIVE": -1,
		"NEUTRAL": 0
	}

	# Append the existing data with the sentiment score
	for i, result in enumerate(sentiment_results):
		post_sentiment_score = result['score']
		post_sentiment_numeric = sentiment_mapping.get(result['label'], 0)
		output.append({
			"post_md_like": data_posts[i]["post_md_like"],
			"post_md_retweet": data_posts[i]["post_md_retweet"],
			"post_md_reply": data_posts[i]["post_md_reply"],
			"post_md_quote": data_posts[i]["post_md_quote"],
			"post_text": data_posts[i]["post_text"],
			"post_text_length": data_posts[i]["post_text_length"],
			"post_sentiment_score": post_sentiment_score,
			"post_sentiment_numeric": post_sentiment_numeric
		})

		# Aggregate the sentiment analysis results
	aggregated_results = aggregate_sentiment_analysis(output)
	return aggregated_results


def feature_engineering(input_data):
	data = {}
	data["user_id"] = input_data["user_id"] if "user_id" in input_data else None

	data["username"] = input_data["username"] if "username" in input_data and input_data["username"] != "" else None
	data["username_uppercase"] = uppercase_count(
		input_data["username"]) if "username" in input_data and input_data["username"] != "" else None
	data["username_lowercase"] = lowercase_count(
		input_data["username"]) if "username" in input_data and input_data["username"] != "" else None
	data["username_numeric"] = numeric_count(
		input_data["username"]) if "username" in input_data and input_data["username"] != "" else None
	data["username_special"] = special_count(
		input_data["username"]) if "username" in input_data and input_data["username"] != "" else None
	data["username_length"] = len(
		input_data["username"]) if "username" in input_data and input_data["username"] != "" else None
	data["username_se"] = string_entropy(
		input_data["username"]) if "username" in input_data and input_data["username"] != "" else None

	data["screenname"] = input_data["screenname"] if "screenname" in input_data and input_data["screenname"] != "" else None
	data["screenname_uppercase"] = uppercase_count(
		input_data["screenname"]) if "screenname" in input_data and input_data["screenname"] != "" else None
	data["screenname_lowercase"] = lowercase_count(
		input_data["screenname"]) if "screenname" in input_data and input_data["screenname"] != "" else None
	data["screenname_numeric"] = numeric_count(
		input_data["screenname"]) if "screenname" in input_data and input_data["screenname"] != "" else None
	data["screenname_special"] = special_count(
		input_data["screenname"]) if "screenname" in input_data and input_data["screenname"] != "" else None
	data["screenname_length"] = len(
		input_data["screenname"]) if "screenname" in input_data and input_data["screenname"] != "" else None
	data["screenname_se"] = string_entropy(
		input_data["screenname"]) if "screenname" in input_data and input_data["screenname"] != "" else None
	data["screenname_emoji"] = emoji_count(
		input_data["screenname"]) if "screenname" in input_data and input_data["screenname"] != "" else None
	data["screenname_hashtag"] = hashtag_count(
		input_data["screenname"]) if "screenname" in input_data and input_data["screenname"] != "" else None
	data["screenname_word"] = word_count(
		input_data["screenname"]) if "screenname" in input_data and input_data["screenname"] != "" else None

	data["description"] = input_data["description"] if "description" in input_data and input_data["description"] != "" else None
	data["description_length"] = len(
		input_data["description"]) if "description" in input_data and input_data["description"] != "" else None

	data["user_md_follower"] = input_data["followers"] if "followers" in input_data else None
	data["user_md_following"] = input_data["followings"] if "followings" in input_data else None
	data["user_md_follow_ratio"] = ratio(
		input_data["followers"], input_data["followings"]) if "followers" in input_data and "followings" in input_data else None
	data["user_md_total_post"] = input_data["total_posts"] if "total_posts" in input_data else None
	data["user_md_total_like"] = input_data["total_likes"] if "total_likes" in input_data else None
	data["user_md_verified"] = input_data["verified"] if "verified" in input_data else None
	data["user_md_protected"] = input_data["protected"] if "protected" in input_data else None

	data_posts = []
	if "posts" in input_data:

		for post in input_data["posts"]:
			post_data = {}
			post_data["post_md_like"] = post["post_like"] if "post_like" in post else None
			post_data["post_md_retweet"] = post["post_retweet"] if "post_retweet" in post else None
			post_data["post_md_reply"] = post["post_reply"] if "post_reply" in post else None
			post_data["post_md_quote"] = post["post_quote"] if "post_quote" in post else None
			post_data["post_text"] = post["post_text"] if "post_text" in post and post["post_text"] != "" else None
			post_data["post_text_length"] = len(
				post["post_text"]) if "post_text" in post and post["post_text"] != "" else None

			data_posts.append(post_data)
	else:
		data_posts = None

	sentiment_results = sentiment_analysis(data_posts)
	# replace np.float64 with float
	sentiment_results = {k: float(v) for k, v in sentiment_results.items()}

	data.update(sentiment_results)

	return data


def predict(data):

	initial_cleaned_data = feature_engineering(data)
	cleaned_data = pd.DataFrame(initial_cleaned_data, index=[0])

	X_train = train_data_labeled.drop(columns=['label'])
	y_train = train_data_labeled['label']

	# Initialize arrays to accumulate probabilities
	# Replace 'test_data' with your testing data

	bot_prob_sum = np.zeros(len(cleaned_data))
	human_prob_sum = np.zeros(len(cleaned_data))
	# To normalize the weighted sums
	total_weights = np.zeros(len(cleaned_data))

	# Define completeness threshold for assigning full weights
	completeness_threshold = 0.80

	calibrated_models = {}
	for feature_name, model in model_tool.items():
		# Apply Platt's scaling using CalibratedClassifierCV
		calibrated_model = CalibratedClassifierCV(
			estimator=model, method='sigmoid', cv='prefit')
		# Fit the model with training data
		calibrated_model.fit(X_train[feature_sets[feature_name]], y_train)
		calibrated_models[feature_name] = calibrated_model

	# Step 1: Process each model for its feature subset
	probabilities = {feature_name: [] for feature_name in model_tool.keys()}

	for feature_name, model in calibrated_models.items():
		feature_columns = feature_sets[feature_name]

		# Calculate feature completeness per instance (account)
		completeness = cleaned_data[feature_columns].notnull().mean(axis=1)

		# Assign weights based on completeness
		weights = np.where(
			completeness >= completeness_threshold, 1.0, completeness)

		# Predict probabilities for the test data
		probas = model.predict_proba(cleaned_data[feature_columns])

		# Store probabilities for each feature subset
		probabilities[feature_name] = probas

		# Accumulate weighted probabilities
		human_prob_sum += probas[:, 0] * \
			weights  # Probability of being human
		# Probability of being a bot
		bot_prob_sum += probas[:, 1] * weights

		if feature_name == 'post_text':
			post_text_human_prob = probas[:, 0] * weights
			post_text_bot_prob = probas[:, 1] * weights
		elif feature_name == 'post_metadata':
			post_text_human_prob = probas[:, 0] * weights
			post_text_bot_prob = probas[:, 1] * weights

		post_metadata_probas = probabilities['post_metadata']
		post_text_probas = probabilities['post_text']

		# Accumulate total weights for normalization
		total_weights += weights

	# Step 2: Normalize probabilities to avoid division by zero
	total_weights_safe = np.where(
		total_weights == 0, 1, total_weights)  # Handle zero weights
	avg_human_prob = human_prob_sum / total_weights_safe
	avg_bot_prob = bot_prob_sum / total_weights_safe

	# Calculate average probabilities for post (weighted by completeness if needed)
	post_human_prob = (post_metadata_probas[:, 0] + post_text_probas[:, 0]) / 2
	post_bot_prob = (post_metadata_probas[:, 1] + post_text_probas[:, 1]) / 2

	# Add combined post probabilities to the dictionary
	probabilities['post'] = np.column_stack([post_human_prob, post_bot_prob])

	# Optionally remove individual post_metadata and post_text from the final output
	# del probabilities['post_metadata']
	# del probabilities['post_text']

	# Step 3: Output final classification probabilities and assign final labels
	# Stores final predicted labels (0 for Human, 1 for Bot)
	final_predictions = []
	# Stores probabilities of both classes [Human_prob, Bot_prob]
	final_probabilities = []
	confidence_scores = []        # Stores penalized confidence scores

	for i in range(len(avg_human_prob)):
		completeness = max(
			0.0, cleaned_data[feature_sets[feature_name]].notnull().mean(axis=1)[i])

		# Calculate and store the probabilities for both classes
		human_prob = avg_human_prob[i]
		bot_prob = avg_bot_prob[i]

		# Append both class probabilities to the list
		final_probabilities.append([human_prob, bot_prob])

		# Final classification: 0 (Human) or 1 (Bot)
		if human_prob > bot_prob:
			final_predictions.append(False)  # Human
			confidence = human_prob * completeness  # Penalize confidence by completeness
		else:
			final_predictions.append(True)  # Bot
			confidence = bot_prob * completeness  # Penalize confidence by completeness

		# Store the confidence score
		confidence_scores.append(confidence)

	for i in range(len(final_predictions)):
		print(f"Index: {i + 1}")  # Print the index
		print(f"Prediction: {
			'Human' if final_predictions[i] == False else 'Bot'}")
		print(f"Probabilities - Human: {final_probabilities[i][0]:.4f}, Bot: {
			final_probabilities[i][1]:.4f}")
		print(f"Confidence Score: {confidence_scores[i]:.4f}\n")

		# Output feature probabilities
		print(f"Feature Probabilities:\nUsername - Human: {
			probabilities['username'][i][0]:.4f}, Bot: {probabilities['username'][i][1]:.4f}")
		print(f"Screenname - Human: {probabilities['screenname'][i][0]:.4f}, Bot: {
			probabilities['screenname'][i][1]:.4f}")
		print(f"Description - Human: {probabilities['description'][i][0]:.4f}, Bot: {
			probabilities['description'][i][1]:.4f}")
		print(f"User Metadata - Human: {probabilities['user_metadata'][i][0]:.4f}, Bot: {
			probabilities['user_metadata'][i][1]:.4f}")
		print(f"Post - Human: {probabilities['post'][i][0]              :.4f}, Bot: {probabilities['post'][i][1]:.4f}")

	result_data = {
		"username_probability": {
			"human": probabilities['username'][0][0],
			"bot": probabilities['username'][0][1]
		},
		"screenname_probability": {
			"human": probabilities['screenname'][0][0],
			"bot": probabilities['screenname'][0][1]
		},
		"description_probability": {
			"human": probabilities['description'][0][0],
			"bot": probabilities['description'][0][1]
		},
		"user_metadata_probability": {
			"human": probabilities['user_metadata'][0][0],
			"bot": probabilities['user_metadata'][0][1]
		},
		"post_probability": {
			"human": probabilities['post'][0][0],
			"bot": probabilities['post'][0][1]
		},
		"final_probability": {
			"human": final_probabilities[0][0],
			"bot": final_probabilities[0][1]
		},
		"final_prediction": "Malicious Bot" if final_predictions[0] else "Human/Non-Malicious Bot",
		"confidence_score": confidence_scores[0],
	}

	return result_data
