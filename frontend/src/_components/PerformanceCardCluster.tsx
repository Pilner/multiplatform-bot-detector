import { APIPerformanceDataType } from "@/_types/APIDataType";
import styles from "./styles/PerformanceCardCluster.module.css";
import {
	AccuracyCard,
	PrecisionCard,
	RecallCard,
	F1ScoreCard,
	MCCCard,
} from "./PerformanceCard";

type PerformanceCardProps = {
	data: APIPerformanceDataType;
};

export default function PerformanceCardCluster(props: PerformanceCardProps) {
	return (
		<section id={styles.result}>
			<AccuracyCard data={props.data} />
			<PrecisionCard data={props.data} />
			<RecallCard data={props.data} />
			<F1ScoreCard data={props.data} />
			<MCCCard data={props.data} />
		</section>
	);
}
