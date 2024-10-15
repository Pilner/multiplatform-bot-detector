import Image from "next/image";
import styles from "./styles/Card.module.css";

import UserIcon from "@/public/icons/User.svg";
import DocumentIcon from "@/public/icons/Document.svg";
import InformationIcon from "@/public/icons/Information.svg";
import MonitorIcon from "@/public/icons/Monitor.svg";
import RobotIcon from "@/public/icons/Robot.svg";
import MagnifyIcon from "@/public/icons/Magnify.svg";

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

type CardProps = {
	type: "username" | "screenname" | "description" | "label";
	data: dataProps;
};

export default function Card(props: CardProps) {
	let title, icon, alt, text, bot_probability, human_probability;
	switch (props.type) {
		case "username":
			title = "Username";
			icon = UserIcon;
			alt = "User Icon";
			text = props.data.username;
			bot_probability = props.data.username_probability.bot;
			human_probability = props.data.username_probability.human;

			break;
		case "screenname":
			title = "Screen Name";
			icon = DocumentIcon;
			alt = "Document Icon";
			text = props.data.screenname;
			bot_probability = props.data.screenname_probability.bot;
			human_probability = props.data.screenname_probability.human;

			break;
		case "description":
			title = "User Description";
			icon = MonitorIcon;
			alt = "Monitor Icon";
			text = props.data.description;
			bot_probability = props.data.description_probability.bot;
			human_probability = props.data.description_probability.human;

			break;
		case "label":
			title = "Label";
			icon = RobotIcon;
			alt = "Robot Icon";
			text = props.data.final_prediction;
			bot_probability = props.data.final_probability.bot;
			human_probability = props.data.final_probability.human;

			break;
	}
	return (
		<div id={styles.cardDiv}>
			<div className={styles.front}>
				<div className={styles.cardPicture}>
					<Image
						src={icon}
						alt={alt}
						width={0}
						height={0}
						style={{ width: "50px" }}
					/>
				</div>
				<div className={styles.cardText}>
					<h1 className={styles.cardTitleFont}>{title}</h1>
					<p className={styles.cardTextFont}>{text}</p>
				</div>
			</div>
			<div className={styles.back}>
				<div>
					<h1 className="sectionSubTitleFont">Bot</h1>
					<p className="sectionTextFont">
						{`${(bot_probability * 100).toFixed(2)}%`}
					</p>
				</div>
				<div>
					<h1 className="sectionSubTitleFont">Human</h1>
					<p className="sectionTextFont">
						{`${(human_probability * 100).toFixed(2)}%`}
					</p>
				</div>
			</div>
		</div>
	);
}

type MetadataCardProps = {
	data: dataProps;
};

export function MetadataCard({ data }: MetadataCardProps) {
	let bot_probability = data.user_metadata_probability.bot;
	let human_probability = data.user_metadata_probability.human;

	return (
		<div id={styles.cardDiv}>
			<div className={styles.front}>
				<div className={styles.cardPicture}>
					<Image src={InformationIcon} alt="Information Icon" />
				</div>
				<div className={styles.cardText}>
					<h1 className={styles.cardTitleFont}>Metadata</h1>
					<p className={styles.cardTextFont}>
						Following: {data.followings}
					</p>
					<p className={styles.cardTextFont}>
						Followers: {data.followers}
					</p>
					<p className={styles.cardTextFont}>
						Posts: {data.total_posts}
					</p>
				</div>
			</div>
			<div className={styles.back}>
				<div>
					<h1 className="sectionSubTitleFont">Bot</h1>
					<p className="sectionTextFont">
						{`${(bot_probability * 100).toFixed(2)}%`}
					</p>
				</div>
				<div>
					<h1 className="sectionSubTitleFont">Human</h1>
					<p className="sectionTextFont">
						{`${(human_probability * 100).toFixed(2)}%`}
					</p>
				</div>
			</div>
		</div>
	);
}

type PostDetailsCardProps = {
	data: dataProps;
};

export function PostDetailsCard(data: PostDetailsCardProps) {
	let bot_probability = data.data.post_probability.bot;
	let human_probability = data.data.post_probability.human;

	return (
		<div id={styles.cardDiv}>
			<div className={styles.front}>
				<div className={styles.cardPicture}>
					<Image src={MagnifyIcon} alt="Magnify Icon" />
				</div>
				<div className={styles.cardText}>
					<h1 className={styles.cardTitleFont}>Post Details</h1>
					<p className={styles.cardTextFont}>
						Post metadata includes information such as the author,
						publication date, tags, and categories.
					</p>
				</div>
			</div>
			<div className={styles.back}>
				<div>
					<h1 className="sectionSubTitleFont">Bot</h1>
					<p className="sectionTextFont">
						{`${(bot_probability * 100).toFixed(2)}%`}
					</p>
				</div>
				<div>
					<h1 className="sectionSubTitleFont">Human</h1>
					<p className="sectionTextFont">
						{`${(human_probability * 100).toFixed(2)}%`}
					</p>
				</div>
			</div>
		</div>
	);
}
