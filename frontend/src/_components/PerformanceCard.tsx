import { APIPerformanceDataType } from "@/_types/APIDataType";

import styles from "./styles/PerformanceCard.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faBullseye,
	faMagnifyingGlassChart,
	faBasketShopping,
	faScaleBalanced,
	faLink,
} from "@fortawesome/free-solid-svg-icons";

import { Bar } from "react-chartjs-2";
import {
	Chart,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

type PerformanceCardProps = {
	data: APIPerformanceDataType;
};

Chart.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	ChartDataLabels
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
				weight: 600,
			},
		},
	},
};

const divergingBarOptions = {
	indexAxis: "y" as const, // Horizontal bar chart
	scales: {
		x: {
			stacked: false, // No stacking for diverging bars
			min: -1, // Allow negative values
			max: 1,
			grid: {
				drawTicks: true,
				drawBorder: false,
				color: (context: any) => {
					// Highlight the gridline at 0
					return context.tick.value === 0
						? "rgba(0, 0, 0, 0.5)"
						: "rgba(200, 200, 200, 0.5)";
				},
				lineWidth: (context: any) => {
					// Make the midline thicker
					return context.tick.value === 0 ? 2 : 1;
				},
			},
		},
		y: {
			stacked: false, // No stacking
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
				return value !== 0 ? (value * 100).toFixed(2) + "%" : null; // Show percentage only if value is non-zero
			},
			font: {
				size: 14,
				weight: 600,
			},
		},
	},
};

export function AccuracyCard(props: PerformanceCardProps) {
	const { accuracy } = props.data.results.overall;

	const data = {
		labels: [""],
		datasets: [
			{
				label: "Accuracy",
				data: [accuracy ?? 0],
				backgroundColor: ["rgba(99, 255, 132, 0.4)"],
				borderColor: ["rgba(99, 255, 132, 0.4)"],
				borderWidth: 1,
			},
		],
	};

	return (
		<div className={styles.cardRow}>
			<div className={styles.card}>
				<div className={styles.cardIcon}>
					<FontAwesomeIcon icon={faBullseye} />
				</div>
				<div className={styles.cardInfo}>
					<h3 className="cardTitleFont">Accuracy</h3>
					<p className="cardTextFont">
						{accuracy.toFixed(4) ?? "N/A"}
					</p>
				</div>
			</div>
			<div className={styles.cardChart}>
				<Bar data={data} options={options}></Bar>
			</div>
		</div>
	);
}

export function PrecisionCard(props: PerformanceCardProps) {
	const { precision } = props.data.results.overall;

	const data = {
		labels: [""],
		datasets: [
			{
				label: "Precision",
				data: [precision ?? 0],
				backgroundColor: ["rgba(99, 255, 132, 0.4)"],
				borderColor: ["rgba(99, 255, 132, 0.4)"],
				borderWidth: 1,
			},
		],
	};

	return (
		<div className={styles.cardRow}>
			<div className={styles.card}>
				<div className={styles.cardIcon}>
					<FontAwesomeIcon icon={faMagnifyingGlassChart} />
				</div>
				<div className={styles.cardInfo}>
					<h3 className="cardTitleFont">Precision</h3>
					<p className="cardTextFont">
						{precision.toFixed(4) ?? "N/A"}
					</p>
				</div>
			</div>
			<div className={styles.cardChart}>
				<Bar data={data} options={options}></Bar>
			</div>
		</div>
	);
}

export function RecallCard(props: PerformanceCardProps) {
	const { recall } = props.data.results.overall;

	const data = {
		labels: [""],
		datasets: [
			{
				label: "Recall",
				data: [recall ?? 0],
				backgroundColor: ["rgba(99, 255, 132, 0.4)"],
				borderColor: ["rgba(99, 255, 132, 0.4)"],
				borderWidth: 1,
			},
		],
	};

	return (
		<div className={styles.cardRow}>
			<div className={styles.card}>
				<div className={styles.cardIcon}>
					<FontAwesomeIcon icon={faBasketShopping} />
				</div>
				<div className={styles.cardInfo}>
					<h3 className="cardTitleFont">Recall</h3>
					<p className="cardTextFont">{recall.toFixed(4) ?? "N/A"}</p>
				</div>
			</div>
			<div className={styles.cardChart}>
				<Bar data={data} options={options}></Bar>
			</div>
		</div>
	);
}

export function F1ScoreCard(props: PerformanceCardProps) {
	const { f1_score } = props.data.results.overall;

	const data = {
		labels: [""],
		datasets: [
			{
				label: "F1 Score",
				data: [f1_score ?? 0],
				backgroundColor: ["rgba(99, 255, 132, 0.4)"],
				borderColor: ["rgba(99, 255, 132, 0.4)"],
				borderWidth: 1,
			},
		],
	};

	return (
		<div className={styles.cardRow}>
			<div className={styles.card}>
				<div className={styles.cardIcon}>
					<FontAwesomeIcon icon={faScaleBalanced} />
				</div>
				<div className={styles.cardInfo}>
					<h3 className="cardTitleFont">F1 Score</h3>
					<p className="cardTextFont">
						{f1_score.toFixed(4) ?? "N/A"}
					</p>
				</div>
			</div>
			<div className={styles.cardChart}>
				<Bar data={data} options={options}></Bar>
			</div>
		</div>
	);
}

export function MCCCard(props: PerformanceCardProps) {
	const { mcc } = props.data.results.overall;

	const data = {
		labels: [""],
		datasets: [
			{
				label: "Matthews Correlation Coefficient",
				data: [mcc ?? 0],
				backgroundColor: [
					mcc >= 0
						? "rgba(99, 255, 132, 0.4)"
						: "rgba(255, 99, 132, 0.4)",
				],
				borderColor: [
					mcc >= 0
						? "rgba(99, 255, 132, 0.4)"
						: "rgba(255, 99, 132, 0.4)",
				],
				borderWidth: 1,
			},
		],
	};

	return (
		<div className={styles.cardRow}>
			<div className={styles.card}>
				<div className={styles.cardIcon}>
					<FontAwesomeIcon icon={faLink} />
				</div>
				<div className={styles.cardInfo}>
					<h3 className="cardTitleFont">
						Matthews Correlation Coefficient
					</h3>
					<p className="cardTextFont">{mcc.toFixed(4) ?? "N/A"}</p>
				</div>
			</div>
			<div className={styles.cardChart}>
				<Bar data={data} options={divergingBarOptions}></Bar>
			</div>
		</div>
	);
}
