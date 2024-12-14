"use client";

import { useState } from "react";

import styles from "./page.module.css";
import DragDropComponent from "@/_components/DragDropComponent";
import Navbar from "@/_components/semantics/Navbar";
import Footer from "@/_components/semantics/Footer";
import InputFormComponent from "@/_components/InputFormComponent";

enum InputMode {
	DragDrop,
	InputForm,
}

export default function Home() {
	const [inputMode, setInputMode] = useState<InputMode>(InputMode.DragDrop);

	return (
		<>
			<Navbar />
			<main id={styles.page}>
				<div className="container">
					<section id={styles.hero}>
						<p className="heroSubTitleFont">
							A Multiplatform Ensemble-Based Malicious Bot
							<br />
							Detection System Using Semi-Supervised
							<br />
							Self-Training Approach
						</p>
					</section>
					<div id={styles.modeSelector}>
						<button
							type="button"
							onClick={() => setInputMode(InputMode.DragDrop)}
							className={
								inputMode == InputMode.DragDrop
									? styles.activeButton
									: ""
							}
						>
							Drag & Drop
						</button>
						<button
							type="button"
							onClick={() => setInputMode(InputMode.InputForm)}
							className={
								inputMode == InputMode.InputForm
									? styles.activeButton
									: ""
							}
						>
							Input Form
						</button>
					</div>
					{inputMode == InputMode.DragDrop && <DragDropComponent />}
					{inputMode == InputMode.InputForm && <InputFormComponent />}
					<section id={styles.information}>
						<div id={styles.aboutDiv}>
							<h3 className="sectionTitleFont">About</h3>
							<p className="sectionTextFont">
								This tool is a novel approach in identifying and
								classifying the risks posed by malicious social
								bots on social media. As bots continue to evolve
								and mimic human behavior, they create
								significant challenges in areas like public
								opinion, democracy, and online safety. This tool
								aims to efficiently identify these threats and
								aid in malicious social bot detection on various
								platforms. With the use of a Semi-Supervised
								Self-Training approach, the program becomes able
								to detect and adapt to the constant change in
								behavior between bots across platforms.
							</p>
						</div>
						<div id={styles.objectivesDiv}>
							<h3 className="sectionTitleFont">Objectives</h3>
							<p className="sectionTextFont">
								This tool aims to focus on enhancing the
								detection of malicious social media bots by
								leveraging Semi-Supervised Self-Learning to
								identify patterns across various platforms. This
								approach aims to improve the distinction between
								bots and genuine users, contributing to the
								integrity of social media by helping platforms
								detect and ban harmful bots. By preventing the
								spread of misinformation, spam, and trend
								manipulation, this tool also strives to protect
								individuals and the public from misleading
								content. Additionally, the study seeks to
								advance the fields of Machine Learning,
								Self-Training, and Semi-Supervised Learning,
								providing valuable insights for future research
								in combating bot-related challenges on digital
								platforms.
							</p>
						</div>
						<div id={styles.resultsDiv}>
							<h3 className="sectionTitleFont">Result</h3>
							<p className="sectionTextFont">
								The Results section will showcase the model's
								performance and its improvements over a baseline
								model, using key metrics such as{" "}
								<b>
									accuracy, precision, recall, F1-score, and
									Matthews Correlation Coefficient (MCC)
								</b>
								. The confusion matrix will highlight the
								classification accuracy between malicious and
								non-malicious social bots. The model was tested
								on various datasets from platforms like Twitter,
								Instagram, and TikTok, where features such as{" "}
								<b>
									usernames, screen names, descriptions, user
									metadata (followers, posts), and post
									details (likes, retweets, sentiment)
								</b>{" "}
								were extracted. Statistical validation,
								including the one-sample proportion test and
								paired t-test, will confirm the significance of
								the results.
							</p>
						</div>
					</section>
				</div>
			</main>
			<Footer />
		</>
	);
}
