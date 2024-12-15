"use client";

import { APIPerformanceDataType } from "@/_types/APIDataType";
import { useEffect, useState } from "react";

import Navbar from "@/_components/semantics/Navbar";
import Footer from "@/_components/semantics/Footer";
import PerformanceCardCluster from "@/_components/PerformanceCardCluster";

import styles from "./page.module.css";

export default function PerformanceResults() {
	const [data, setData] = useState<APIPerformanceDataType | undefined>(
		undefined
	);

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
						<h1 className="heroTitleFont">Performance</h1>
						<p className="heroSubTitleFont">
							Results of the performance evaluation of the
							<br />
							{data?.mode == "proposed_model"
								? "Proposed"
								: "Baseline"}{" "}
							model.
						</p>
						<div className={styles.downloadButtonDiv}>
							<button type="button">
								<a href={data?.excel_download}>
									Download Excel File
								</a>
							</button>
						</div>
						{data && <PerformanceCardCluster data={data} />}
					</section>
					<section id={styles.confusionMatrixDiv}>
						<h1 className="sectionTitleFont">Confusion Matrix</h1>
						<div className={styles.confusionMatrix}>
							<div>
								<h3 className="cardTitleFont">True Positive</h3>
								<p className="cardTextFont">
									{data?.confusion_matrix.TP}
								</p>
							</div>
							<div>
								<h3 className="cardTitleFont">
									False Negative
								</h3>
								<p className="cardTextFont">
									{data?.confusion_matrix.FN}
								</p>
							</div>
							<div>
								<h3 className="cardTitleFont">
									False Positive
								</h3>
								<p className="cardTextFont">
									{data?.confusion_matrix.FP}
								</p>
							</div>
							<div>
								<h3 className="cardTitleFont">True Negative</h3>
								<p className="cardTextFont">
									{data?.confusion_matrix.TN}
								</p>
							</div>
						</div>
					</section>
				</div>
			</main>
			<Footer />
		</>
	);
}
