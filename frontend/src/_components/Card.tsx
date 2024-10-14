import Image from "next/image";
import styles from "./styles/Card.module.css";

import UserIcon from "@/public/icons/User.svg";
import DocumentIcon from "@/public/icons/Document.svg";
import InformationIcon from "@/public/icons/Information.svg";
import MonitorIcon from "@/public/icons/Monitor.svg";
import RobotIcon from "@/public/icons/Robot.svg";
import MagnifyIcon from "@/public/icons/Magnify.svg";

type CardProps = {
	title:
		| "Username"
		| "Screen Name"
		| "User Description"
		| "Metadata"
		| "Post Details";
};

type LabelCardProps = {
	// JSON data
	data: JSON;
};

export default function Card(props: CardProps) {
	let icon;

	switch (props.title) {
		case "Username":
			icon = UserIcon;
			break;
		case "Screen Name":
			icon = MonitorIcon;
			break;
		case "User Description":
			icon = DocumentIcon;
			break;
		case "Metadata":
			icon = InformationIcon;
			break;
		case "Post Details":
			icon = MagnifyIcon;
			break;
	}

	return (
		<div id={styles.cardDiv}>
			<div className={styles.front}>
				<div className={styles.cardPicture}>
					<Image src={icon} alt="UserIcon" />
				</div>
				<div className={styles.cardText}>
					<h1 className={styles.cardTitleFont}>{props.title}</h1>
					<p className={styles.cardTextFont}>@raaailey</p>
				</div>
			</div>
			<div className={styles.back}>
				<p>Pogi</p>
			</div>
		</div>
	);
}

export function LabelCard() {
	return (
		<div id={styles.cardDiv}>
			<div className={styles.front}>
				<div className={styles.cardPicture}>
					<Image src={RobotIcon} alt="UserIcon" />
				</div>
				<div className={styles.cardText}>
					<h1 className={styles.cardTitleFont}>Label</h1>
					<p className={styles.cardTextFont}>Human</p>
				</div>
			</div>
			<div className={styles.back}>
				<p>Pogi</p>
			</div>
		</div>
	);
}
