"use client";

import Image from "next/image";
import styles from "./styles/DragDropComponent.module.css";
import DragIcon from "@/public/icons/DragIcon.svg";

export default function DragDropComponent() {
	return (
		<section
			id={styles.dragBox}
			onDrop={dropHandler}
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

function dropHandler(e: any) {
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
			console.log(content);
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
