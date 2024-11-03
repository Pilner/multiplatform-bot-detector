import styles from "./styles/CardCluster.module.css";
import { APIDataType } from "@/_types/APIDataType";
import {
	UsernameCard,
	ScreennameCard,
	DescriptionCard,
	MetadataCard,
	PostDetailsCard,
	LabelCard,
} from "./Card";

type CardClusterProps = {
	data?: APIDataType;
};

export default function CardCluster({ data }: CardClusterProps) {
	if (!data) {
		return null;
	}

	const usernameVisibility = Boolean(data.username);
	const screennameVisiblity = Boolean(data.screenname);
	const descriptionVisiblity = Boolean(data.description);
	const metadataVisiblity =
		Boolean(data.followers) ||
		Boolean(data.followings) ||
		Boolean(data.total_likes) ||
		Boolean(data.total_posts) ||
		data.verified != undefined ||
		data.protected != undefined;
	const postDetailsVisibility = Boolean(data.posts);

	console.log(data);
	console.log(
		usernameVisibility,
		screennameVisiblity,
		descriptionVisiblity,
		metadataVisiblity,
		postDetailsVisibility
	);

	return (
		<section id={styles.result}>
			<UsernameCard visible={usernameVisibility} data={data} />
			<ScreennameCard visible={screennameVisiblity} data={data} />
			<DescriptionCard visible={descriptionVisiblity} data={data} />
			<MetadataCard visible={metadataVisiblity} data={data} />
			<PostDetailsCard visible={postDetailsVisibility} data={data} />
			<LabelCard data={data} />
		</section>
	);
}
