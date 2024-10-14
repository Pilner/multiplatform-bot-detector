import styles from "./page.module.css";
import Navbar from "@/_components/semantics/Navbar";
import Footer from "@/_components/semantics/Footer";
import CardCluster from "@/_components/CardCluster";

export default function Results() {
	return (
		<>
			<Navbar />
			<main id={styles.page}>
				<div className="container">
					<section id={styles.hero}>
						<h1 className="heroTitleFont">Results</h1>
						<p className="heroSubTitleFont">
							Upon uploading of the .csv or .json file, the user
							can then
							<br />
							see whether the profile identified is a malicious
							social
							<br />
							bot or a genuine user/human
						</p>
					</section>
					<CardCluster />
				</div>
			</main>
			<Footer />
		</>
	);
}
