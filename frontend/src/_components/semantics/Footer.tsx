import styles from "../styles/Footer.module.css";

export default function Footer() {
	return (
		<footer id={styles.footer}>
			<div className="container">
				<div>
					<p className={styles.footerTextFont}>Copyright © 2024</p>
				</div>
			</div>
		</footer>
	)
}
