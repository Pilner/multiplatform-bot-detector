"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Image from "next/image";
import styles from "./styles/DragDropComponent.module.css";
import DragIcon from "@/public/icons/DragIcon.svg";
import Loader from "./Loader";

const header = {
	"Content-Type": "application/json",
};

export default function DragDropComponent() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	function dropHandler(e: any, router: any) {
		console.log("File dropped");
		setLoading(true);
		document.body.classList.add(styles.noScroll);

		// Prevent default behavior (Prevent file from being opened)
		e.preventDefault();

		// Get only one file from the dropped files
		// File must be a .json file
		const file = e.dataTransfer.files[0];
		if (file.type === "application/json") {
			// Read the file
			const reader = new FileReader();

			reader.onload = (e) => {
				if (!e.target?.result) {
					return;
				}

				const content = e.target.result;
				const parsed_content = JSON.parse(content as string);

				fetch("http://localhost:8000/detection", {
					method: "POST",
					body: JSON.stringify(parsed_content),
					headers: header,
				})
					.then((response) => response.json())
					.then((data) => {
						localStorage.setItem("data", JSON.stringify(data));

						document.body.classList.remove(styles.noScroll);
						router.push("/results");
					});
			};
			reader.readAsText(file);
		} else {
			alert("File must be a .json file");
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
					<p className={styles.dragText}>Insert .json file here.</p>
				</div>
			</section>
		</>
	);
}
