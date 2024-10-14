import styles from "./styles/CardCluster.module.css";
import Card, { LabelCard } from "./Card";

type CardClusterProps = {
	data?: JSON;
};

export default function CardCluster({ data }: CardClusterProps) {
	return (
		<section id={styles.result}>
			<div id={styles.firstRow}>
				<Card title="Username" />
				<Card title="Screen Name" />
			</div>
			<div id={styles.secondRow}>
				<Card title="User Description" />
				<Card title="Metadata" />
				<Card title="Post Details" />
			</div>
			<div id={styles.thirdRow}>
				<LabelCard />
			</div>
		</section>
	);
}
