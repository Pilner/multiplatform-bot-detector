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
