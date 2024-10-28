"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./styles/DragDropComponent.module.css";
import DragIcon from "@/public/icons/DragIcon.svg";

const header = {
	"Content-Type": "application/json",
};

export default function DragDropComponent() {
	const router = useRouter();
	return (
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
	);
}

function dropHandler(e: any, router: any) {
	console.log("File dropped");

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

					router.push("/results");
				});
		};
		reader.readAsText(file);
	} else {
		alert("File must be a .json file");
	}
}

function dragOverHandler(e: any) {
	console.log("File in drop zone");

	// Prevent default behavior (Prevent file from being opened)
	e.preventDefault();
}
