import Image from "next/image";
import styles from "./styles/DragDropComponent.module.css";
import DragIcon from "@/public/icons/DragIcon.svg";

export default function DragDropComponent() {
	return (
		<section id={styles.dragBox}>
			<div>
				<Image src={DragIcon} alt="DragIcon" />
			</div>
			<div>
				<p className={styles.dragText}>Insert .json file here.</p>
			</div>
		</section>
	);
}
