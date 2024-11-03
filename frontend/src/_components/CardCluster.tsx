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

	return (
		<section id={styles.result}>
			{data.username && <UsernameCard data={data} />}
			{data.screenname && <ScreennameCard data={data} />}
			{data.description && <DescriptionCard data={data} />}
			{(data.followings ||
				data.followers ||
				data.total_likes ||
				data.total_posts ||
				data.protected != null ||
				data.verified != null) && <MetadataCard data={data} />}
			{data.total_posts != 0 && <PostDetailsCard data={data} />}
			<LabelCard data={data} />
		</section>
	);
}
