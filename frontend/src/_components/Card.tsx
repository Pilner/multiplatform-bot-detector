import { APIDataType } from "@/_types/APIDataType";

import { Bar } from "react-chartjs-2";
import {
	Chart,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faUser,
	faSignature,
	faFileLines,
	faCircleInfo,
	faComments,
	faRobot,
} from "@fortawesome/free-solid-svg-icons";

import styles from "./styles/Card.module.css";

type CardProps = {
	data: APIDataType;
	visible?: boolean;
};

Chart.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	ChartDataLabels,
	Legend
);

const options = {
	indexAxis: "y" as const,
	scales: {
		x: {
			stacked: true,
			min: 0,
			max: 1,
		},
		y: {
			stacked: true,
		},
	},
	responsive: true,
	maintainAspectRatio: false,
	plugins: {
		tooltip: {
			callbacks: {
				title: () => [],
				label: function (context: any) {
					const value = context.raw; // Access the raw value of the data point
					return value;
				},
			},
			bodyFont: {
				size: 14,
			},
		},
		datalabels: {
			formatter: function (value: number) {
				return value !== 0 ? (value * 100).toFixed(2) + "%" : null;
			},
			font: {
				size: 14,
				weight: 500,
			},
		},
	},
};

const emptyGraph = {
	labels: [" "],
	datasets: [
		{
			label: "Human/Non-Malicious Bot",
			data: [0],
			backgroundColor: ["rgba(99, 255, 132, 0.2)"],
			borderWidth: 1,
		},
		{
			label: "Malicious Bot",
			data: [0],
			backgroundColor: ["rgba(255, 99, 132, 0.2)"],
			borderWidth: 1,
		},
	],
};

export function UsernameCard(props: CardProps) {
	const data = {
		labels: [" "],
		datasets: [
			{
				label: "Human/Non-Malicious Bot",
				data: [props.data.username_probability.human],
				backgroundColor: ["rgba(99, 255, 132, 0.2)"],
				borderWidth: 1,
			},
			{
				label: "Malicious Bot",
				data: [props.data.username_probability.bot],
				backgroundColor: ["rgba(255, 99, 132, 0.2)"],
				borderWidth: 1,
			},
		],
	};

	return (
		<div className={styles.cardRow}>
			<div className={styles.card}>
				<div className={styles.cardIcon}>
					<FontAwesomeIcon icon={faUser} />
				</div>
				<div className={styles.cardInfo}>
					<h3 className="cardTitleFont">Username</h3>
					<p className="cardTextFont">
						{props.data.username ?? "N/A"}
					</p>
				</div>
			</div>
			<div className={styles.cardChart}>
				<Bar
					data={props.visible ? data : emptyGraph}
					options={options}
				></Bar>
			</div>
		</div>
	);
}
export function ScreennameCard(props: CardProps) {
	const data = {
		labels: [" "],
		datasets: [
			{
				label: "Human/Non-Malicious Bot",
				data: [props.data.screenname_probability.human],
				backgroundColor: ["rgba(99, 255, 132, 0.2)"],
				borderWidth: 1,
			},
			{
				label: "Malicious Bot",
				data: [props.data.screenname_probability.bot],
				backgroundColor: ["rgba(255, 99, 132, 0.2)"],
				borderWidth: 1,
			},
		],
	};

	return (
		<div className={styles.cardRow}>
			<div className={styles.card}>
				<div className={styles.cardIcon}>
					<FontAwesomeIcon icon={faSignature} />
				</div>
				<div className={styles.cardInfo}>
					<h3 className="cardTitleFont">Screen Name</h3>
					<p className="cardTextFont">
						{props.data.screenname ?? "N/A"}
					</p>
				</div>
			</div>
			<div className={styles.cardChart}>
				<Bar
					data={props.visible ? data : emptyGraph}
					options={options}
				></Bar>
			</div>
		</div>
	);
}

export function DescriptionCard(props: CardProps) {
	const data = {
		labels: [" "],
		datasets: [
			{
				label: "Human/Non-Malicious Bot",
				data: [props.data.description_probability.human],
				backgroundColor: ["rgba(99, 255, 132, 0.2)"],
				borderWidth: 1,
			},
			{
				label: "Malicious Bot",
				data: [props.data.description_probability.bot],
				backgroundColor: ["rgba(255, 99, 132, 0.2)"],
				borderWidth: 1,
			},
		],
	};

	return (
		<div className={styles.cardRow}>
			<div className={styles.card}>
				<div className={styles.cardIcon}>
					<FontAwesomeIcon icon={faFileLines} />
				</div>
				<div className={styles.cardInfo}>
					<h3 className="cardTitleFont">User Description</h3>
					<p className="cardTextFont">
						{props.data.description ?? "N/A"}
					</p>
				</div>
			</div>
			<div className={styles.cardChart}>
				<Bar
					data={props.visible ? data : emptyGraph}
					options={options}
				></Bar>
			</div>
		</div>
	);
}
export function MetadataCard(props: CardProps) {
	const data = {
		labels: [" "],
		datasets: [
			{
				label: "Human/Non-Malicious Bot",
				data: [props.data.user_metadata_probability.human],
				backgroundColor: ["rgba(99, 255, 132, 0.2)"],
				borderWidth: 1,
			},
			{
				label: "Malicious Bot",
				data: [props.data.user_metadata_probability.bot],
				backgroundColor: ["rgba(255, 99, 132, 0.2)"],
				borderWidth: 1,
			},
		],
	};

	return (
		<div className={styles.cardRow}>
			<div className={styles.card}>
				<div className={styles.cardIcon}>
					<FontAwesomeIcon icon={faCircleInfo} />
				</div>
				<div className={styles.cardInfo}>
					<h3 className="cardTitleFont">Metadata</h3>
					<div className={styles.metadataCardInfo}>
						<p className="cardTextFont">
							Following: {props.data.followings ?? "N/A"}
						</p>
						<p className="cardTextFont">
							Followers: {props.data.followers ?? "N/A"}
						</p>
						<p className="cardTextFont">
							Likes: {props.data.total_likes ?? "N/A"}
						</p>
						<p className="cardTextFont">
							Posts: {props.data.total_posts ?? "N/A"}
						</p>
						<p className="cardTextFont">
							Verified:{" "}
							{props.data.verified != undefined
								? String(props.data.verified)
								: "N/A"}
						</p>
					</div>
				</div>
			</div>
			<div className={styles.cardChart}>
				<Bar
					data={props.visible ? data : emptyGraph}
					options={options}
				></Bar>
			</div>
		</div>
	);
}

export function PostDetailsCard(props: CardProps) {
	const data = {
		labels: [" "],
		datasets: [
			{
				label: "Human/Non-Malicious Bot",
				data: [props.data.post_probability.human],
				backgroundColor: ["rgba(99, 255, 132, 0.2)"],
				borderWidth: 1,
			},
			{
				label: "Malicious Bot",
				data: [props.data.post_probability.bot],
				backgroundColor: ["rgba(255, 99, 132, 0.2)"],
				borderWidth: 1,
			},
		],
	};

	return (
		<div className={styles.cardRow}>
			<div className={styles.card}>
				<div className={styles.cardIcon}>
					<FontAwesomeIcon icon={faComments} />
				</div>
				<div className={styles.cardInfo}>
					<h3 className="cardTitleFont">Post Details</h3>
					<p className="cardTextFont">
						{props.data.posts
							? `There are ${props.data.posts.length} post/s.`
							: "There are no posts given."}
					</p>
				</div>
			</div>
			<div className={styles.cardChart}>
				<Bar
					data={props.visible ? data : emptyGraph}
					options={options}
				></Bar>
			</div>
		</div>
	);
}

export function LabelCard(props: CardProps) {
	const data = {
		labels: [" "],
		datasets: [
			{
				label: "Human/Non-Malicious Bot",
				data: [props.data.final_probability.human],
				backgroundColor: ["rgba(99, 255, 132, 0.2)"],
				borderWidth: 1,
			},
			{
				label: "Malicious Bot",
				data: [props.data.final_probability.bot],
				backgroundColor: ["rgba(255, 99, 132, 0.2)"],
				borderWidth: 1,
			},
		],
	};

	return (
		<div className={styles.cardRow}>
			<div className={styles.card}>
				<div className={styles.cardIcon}>
					{props.data.final_prediction == "Human" ? (
						<FontAwesomeIcon icon={faUser} />
					) : (
						<FontAwesomeIcon icon={faRobot} />
					)}
				</div>
				<div className={styles.cardInfo}>
					<h3 className="cardTitleFont">Final Label</h3>
					<p className="cardTextFont">
						{props.data.final_prediction}
					</p>
				</div>
			</div>
			<div className={styles.cardChart}>
				<Bar data={data} options={options}></Bar>
			</div>
		</div>
	);
}
