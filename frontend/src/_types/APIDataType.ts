export type APIDataType = {
	user_id: number;
	username: string;
	screenname: string;
	description: string;
	followers: number;
	followings: number;
	total_likes: number;
	total_posts: number;
	verified: boolean;
	protected: boolean;
	posts: {
		post_like: number;
		post_quote: number;
		post_reply: number;
		post_retweet: number;
		post_text: string;
	}[];
	prediction: {
		username_probability: {
			human: number;
			bot: number;
		};
		screenname_probability: {
			human: number;
			bot: number;
		};
		description_probability: {
			human: number;
			bot: number;
		};
		user_metadata_probability: {
			human: number;
			bot: number;
		};
		post_probability: {
			human: number;
			bot: number;
		};
		final_probability: {
			human: number;
			bot: number;
		};
		final_prediction: string;
		confidence_score: number;
	};
};

export type APIPerformanceDataType = {
	results: {
		overall: {
			accuracy: number;
			precision: number;
			recall: number;
			f1_score: number;
			mcc: number;
		};
		individual: {
			accuracy: number;
			precision: number;
			recall: number;
			f1_score: number;
			mcc: number;
		}[];
	};
	mode: "proposed_model" | "baseline_model";
	confusion_matrix: {
		TP: number;
		TN: number;
		FP: number;
		FN: number;
	};
	excel_download: string;
};
