import styles from "../styles/Navbar.module.css";
import Link from "next/link";

export default function Navbar() {
	return (
		<nav id={styles.navbar}>
			<div className="container">
				<Link href="/">
					<h1 className={styles.navbarLogoFont}>
						Malicious Bot Detector
					</h1>
				</Link>
			</div>
		</nav>
	);
}
