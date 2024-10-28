"use client";

import { useEffect, useState } from "react";

import styles from "./page.module.css";
import Navbar from "@/_components/semantics/Navbar";
import Footer from "@/_components/semantics/Footer";
import CardCluster from "@/_components/CardCluster";

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

export default function Results() {
	const [data, setData] = useState<dataProps | undefined>(undefined);

	useEffect(() => {
		const data = localStorage.getItem("data");
		if (data) {
			setData(JSON.parse(data));
			console.log(JSON.parse(data));
		}
	}, []);

	return (
		<>
			<Navbar />
			<main id={styles.page}>
				<div className="container">
					<section id={styles.hero}>
						<h1 className="heroTitleFont">Results</h1>
						<p className="heroSubTitleFont">
							Upon submission of the .json file or input form, the
							user can then
							<br />
							see whether the profile identified is a malicious
							social
							<br />
							bot or a genuine user/human
						</p>
					</section>
					<CardCluster data={data} />
				</div>
			</main>
			<Footer />
		</>
	);
}
