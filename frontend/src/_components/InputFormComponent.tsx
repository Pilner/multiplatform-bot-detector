"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import { Input, InputTextArea, InputSelect } from "./Input";
import Loader from "./Loader";

import styles from "./styles/InputFormComponent.module.css";

interface postDataProps {
	post_text: string;
	post_like: number;
	post_retweet: number;
	post_reply: number;
	post_quote: number;
}

interface dataProps {
	username: string;
	screenname: string;
	description: string;
	followers: number;
	followings: number;
	total_likes: number;
	total_posts: number;
	verified: boolean;
	protected: boolean;
	posts: postDataProps[];
}

const header = {
	"Content-Type": "application/json",
};

export default function InputFormComponent() {
	const MAX_POSTS = 5;

	const router = useRouter();
	const [posts, setPosts] = useState<{ id: number }[]>([]);
	const [loading, setLoading] = useState(false);

	const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
		setLoading(true);
		document.body.classList.add(styles.noScroll);
		e.preventDefault();

		const formData = new FormData(e.currentTarget);
		const formValues: Record<string, any> = {};

		formData.forEach((value, key) => {
			formValues[key] = value;
		});

		let generalData = {} as dataProps;

		if (formValues.username != "") {
			if (formValues.username.charAt(0) != "@") {
				formValues.username = "@" + formValues.username;
			}
			generalData["username"] = formValues.username;
		}
		if (formValues.screenname != "") {
			generalData["screenname"] = formValues.screenname;
		}
		if (formValues.description != "") {
			generalData["description"] = formValues.description;
		}
		if (formValues.followers != "" && formValues.followers != 0) {
			generalData["followers"] = Number(formValues.followers);
		}
		if (formValues.followings != "" && formValues.followings != 0) {
			generalData["followings"] = Number(formValues.followings);
		}
		if (formValues.totalLikes != "" && formValues.totalLikes != 0) {
			generalData["total_likes"] = Number(formValues.totalLikes);
		}
		if (formValues.totalPosts != "" && formValues.totalPosts != 0) {
			generalData["total_posts"] = Number(formValues.totalPosts);
		}
		if (formValues.verified != "none") {
			generalData["verified"] = Boolean(formValues.verified);
		}
		if (formValues.protected != "none") {
			generalData["protected"] = Boolean(formValues.protected);
		}

		if (posts.length != 0) {
			const tempPost = posts
				.map((_, i) => {
					const post: Partial<postDataProps> = {};

					// Add fields only if they are not empty
					if (formValues[`postText${i}`])
						post.post_text = formValues[`postText${i}`];
					if (formValues[`postLikes${i}`] !== "")
						post.post_like = Number(formValues[`postLikes${i}`]);
					if (formValues[`postRetweets${i}`] !== "")
						post.post_retweet = Number(
							formValues[`postRetweets${i}`]
						);
					if (formValues[`postReplies${i}`] !== "")
						post.post_reply = Number(formValues[`postReplies${i}`]);
					if (formValues[`postQuotes${i}`] !== "")
						post.post_quote = Number(formValues[`postQuotes${i}`]);

					// Only return post if it has at least one valid property
					return Object.keys(post).length > 0
						? (post as postDataProps)
						: null;
				})
				.filter((post): post is postDataProps => post !== null); // Filter out null values

			if (tempPost.length != 0) {
				generalData["posts"] = tempPost;
			}
		}

		console.log({ generalData });

		fetch("http://localhost:8000/detection", {
			method: "POST",
			body: JSON.stringify(generalData),
			headers: header,
		})
			.then((response) => response.json())
			.then((data) => {
				localStorage.setItem("data", JSON.stringify(data));

				document.body.classList.remove(styles.noScroll);
				router.push("/results");
			});
	};

	const isVerifiedProtectedOptions = [
		{
			label: "True",
			value: "true",
		},
		{
			label: "False",
			value: "false",
		},
		{
			label: "N/A",
			value: "none",
		},
	];

	const addPost = () => {
		if (posts.length < MAX_POSTS) {
			setPosts([...posts, { id: posts.length }]);
		}
	};

	const deletePost = (index: number) => {
		setPosts(posts.filter((_, i) => i !== index));
	};

	return (
		<>
			{loading && (
				<div className={styles.loader}>
					<div>
						<Loader />
					</div>
				</div>
			)}

			<div id={styles.inputForm}>
				<form onSubmit={submitHandler}>
					<div id={styles.inputDiv}>
						<div>
							<Input
								type="text"
								name="username"
								id="username"
								label="Username: "
								placeholder="Enter Username"
							/>
							<Input
								type="text"
								name="screenname"
								id="screenname"
								label="Screen Name: "
								placeholder="Enter Screen Name"
							/>
						</div>
						<div>
							<InputTextArea
								name="description"
								id="description"
								label="Description: "
								placeholder="Enter Description"
							/>
						</div>
						<div>
							<Input
								type="number"
								negative={false}
								name="followers"
								id="followers"
								label="Followers Count: "
								placeholder="Enter Followers Count"
							/>
							<Input
								type="number"
								negative={false}
								name="followings"
								id="followings"
								label="Followings Count: "
								placeholder="Enter Followings Count"
							/>
						</div>
						<div>
							<Input
								type="number"
								negative={false}
								name="totalLikes"
								id="totalLikes"
								label="Total Likes Count: "
								placeholder="Enter Total Likes Count"
							/>
							<Input
								type="number"
								negative={false}
								name="totalPosts"
								id="totalPosts"
								label="Total Post Count: "
								placeholder="Enter Total Post Count"
							/>
						</div>
						<div>
							<InputSelect
								name="verified"
								id="verified"
								label="Verified Account: "
								required={true}
								value=""
								options={isVerifiedProtectedOptions}
							/>
							<InputSelect
								name="protected"
								id="protected"
								label="Protected Account: "
								required={true}
								value=""
								options={isVerifiedProtectedOptions}
							/>
						</div>
					</div>
					<div className={styles.postInputDiv}>
						{posts.map((post, i) => (
							<div className={styles.post} key={post.id}>
								<div className={styles.postInputHeader}>
									<div>
										<h3 className="sectionSubtitleFont">
											Post {i + 1}
										</h3>
									</div>
									<div>
										<button onClick={() => deletePost(i)}>
											<FontAwesomeIcon
												icon={faXmark}
												size="2xl"
											/>
										</button>
									</div>
								</div>
								<div className={styles.postInputContent}>
									<InputTextArea
										name={`postText${i}`}
										id={`postText${i}`}
										label="Post Text: "
										placeholder={`Enter Post Text ${i + 1}`}
									/>
									<div className={styles.postInputCounts}>
										<Input
											type="number"
											negative={false}
											name={`postLikes${i}`}
											id={`postLikes${i}`}
											label="Likes: "
											placeholder="0"
										/>
										<Input
											type="number"
											negative={false}
											name={`postRetweets${i}`}
											id={`postRetweets${i}`}
											label="Retweets: "
											placeholder="0"
										/>
										<Input
											type="number"
											negative={false}
											name={`postReplies${i}`}
											id={`postReplies${i}`}
											label="Replies: "
											placeholder="0"
										/>
										<Input
											type="number"
											negative={false}
											name={`postQuotes${i}`}
											id={`postQuotes${i}`}
											label="Quotes: "
											placeholder="0"
										/>
									</div>
								</div>
							</div>
						))}
						{posts.length < MAX_POSTS && (
							<div id={styles.addPostsDiv}>
								<button type="button" onClick={addPost}>
									<p className="inputLabelFont">
										{posts.length == 0
											? "Add posts"
											: "Add more posts"}
									</p>
								</button>
							</div>
						)}
					</div>
					<div id={styles.submitButtonDiv}>
						<input
							id={styles.submitButton}
							type="submit"
							value="Submit"
						/>
					</div>
				</form>
			</div>
		</>
	);
}
