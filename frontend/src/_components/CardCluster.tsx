import styles from "./styles/CardCluster.module.css";
import Card, { MetadataCard, PostDetailsCard } from "./Card";

type dataProps = {
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

type CardClusterProps = {
	data?: dataProps;
};

export default function CardCluster({ data }: CardClusterProps) {
	if (!data) {
		return null;
	}

	return (
		<section id={styles.result}>
			<div id={styles.firstRow}>
				<Card type="username" data={data} />
				<Card type="screenname" data={data} />
			</div>
			<div id={styles.secondRow}>
				<Card type="description" data={data} />
				<MetadataCard data={data} />
				<PostDetailsCard data={data} />
			</div>
			<div id={styles.thirdRow}>
				<Card type="label" data={data} />
			</div>
		</section>
	);
}
