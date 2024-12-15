"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Image from "next/image";
import styles from "./styles/DragDropComponent.module.css";
import DragIcon from "@/public/icons/DragIcon.svg";
import Loader from "./Loader";

const header = {
	// file is a parquet file
	"Content-Type": "application/json",
};

type Mode = "proposed" | "baseline";

export default function DragDropComponent({ mode }: { mode: Mode }) {
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	function dropHandler(e: any, router: any) {
		console.log("File dropped");
		setLoading(true);
		document.body.classList.add(styles.noScroll);

		// Prevent default behavior (Prevent file from being opened)
		e.preventDefault();

		// Get only one file from the dropped files
		// File must be a .parquet file
		const file = e.dataTransfer.files[0];
		console.log(file);
		if (file.name.endsWith(".parquet")) {
			console.log("File is a .parquet file");
			const formData = new FormData();
			formData.append("file", file);
			fetch(
				`http://localhost:8000/performance/${
					mode == "proposed" ? "proposed" : "baseline"
				}`,
				{
					method: "POST",
					body: formData,
				}
			)
				.then((response) => response.json())
				.then((data) => {
					localStorage.setItem("data", JSON.stringify(data));
					document.body.classList.remove(styles.noScroll);
					router.push("/results/performance");
				})
				.catch((error) => {
					console.error("Error:", error);
					setLoading(false);
					document.body.classList.remove(styles.noScroll);
				});
		} else {
			alert("File must be a .parquet file");
			setLoading(false);
			document.body.classList.remove(styles.noScroll);
		}
	}

	function dragOverHandler(e: any) {
		console.log("File in drop zone");

		// Prevent default behavior (Prevent file from being opened)
		e.preventDefault();
	}

	return (
		<>
			{loading && (
				<div className={styles.loader}>
					<div>
						<Loader />
					</div>
				</div>
			)}
			<section
				id={styles.dragBox}
				onDrop={(e) => dropHandler(e, router)}
				onDragOver={dragOverHandler}
			>
				<div>
					<Image src={DragIcon} alt="DragIcon" />
				</div>
				<div>
					<p className={styles.dragText}>
						Insert .parquet file here.
					</p>
				</div>
			</section>
		</>
	);
}
