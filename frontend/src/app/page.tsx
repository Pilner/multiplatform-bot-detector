import Image from "next/image";
import styles from "./page.module.css";
import DragDropComponent from "@/_components/DragDropComponent";

export default function Home() {
	return (
		<main id={styles.page}>
			<div className="container">
				<section id={styles.hero}>
					<h1 className="heroTitleFont">DetectIfAI</h1>
					<p className="heroSubTitleFont">
						A MULTIPLATFORM ENSEMBLE-BASED MALICIOUS BOT
						<br />
						DETECTION SYSTEM USING SEMI-SUPERVISED
						<br />
						SELF-TRAINING APPROACH
					</p>
				</section>
				<DragDropComponent />
				<section id={styles.information}>
					<div>
						<h3 className="sectionTitleFont">About</h3>
						<p className="sectionTextFont">
							DetectifAI is a novel approach in identifying and
							classifying the risks posed by malicious social bots
							on social media. As bots continue to evolve and
							mimic human behavior, they create significant
							challenges in areas like public opinion, democracy,
							and online safety. This tool aims to efficiently
							identify these threats and aid in malicious social
							bot detection on various platforms. With the use of
							a Semi-Supervised Self-Training approach, the
							program becomes able to detect and adapt to the
							constant change in behavior between bots across
							platforms.
						</p>
					</div>
					<div>
						<h3 className="sectionTitleFont">Objectives</h3>
						<p className="sectionTextFont">
							DetectifAI aims to focus on enhancing the detection
							of malicious social media bots by leveraging
							Semi-Supervised Self-Learning to identify patterns
							across various platforms. This approach aims to
							improve the distinction between bots and genuine
							users, contributing to the integrity of social media
							by helping platforms detect and ban harmful bots. By
							preventing the spread of misinformation, spam, and
							trend manipulation, DetectifAI also strives to
							protect individuals and the public from misleading
							content. Additionally, the study seeks to advance
							the fields of Machine Learning, Self-Training, and
							Semi-Supervised Learning, providing valuable
							insights for future research in combating
							bot-related challenges on digital platforms.
						</p>
					</div>
				</section>
			</div>
		</main>
	);
}
