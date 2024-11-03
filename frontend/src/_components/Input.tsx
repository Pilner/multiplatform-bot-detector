import styles from "./styles/Input.module.css";

interface dataProps {
	name: string;
	id: string;
	label: string;
	value?: string;
	placeholder?: string;
	required?: boolean;
	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
	noSpace?: boolean;
}

interface InputProps extends dataProps {
	type: "text" | "number";
	negative?: boolean;
}

type OptionsTuple = { value: string; label: string };

interface InputSelectProps extends dataProps {
	options: OptionsTuple[];
}

export function Input(props: InputProps) {
	return (
		<div className={styles.inputDiv}>
			<label className="inputLabelFont" htmlFor={props.id}>
				{props.label}
			</label>
			<input
				id={props.id}
				name={props.name}
				type={props.type}
				min={props.negative ? undefined : "0"}
				defaultValue={props.value ?? ""}
				placeholder={props.placeholder}
				required={props.required ?? false}
				onChange={props.onChange}
				onKeyDown={(event) => {
					if (props.noSpace && event.key === " ") {
						event.preventDefault(); // Prevent space character from being entered
					}
				}}
			/>
		</div>
	);
}

export function InputTextArea(props: dataProps) {
	return (
		<div className={styles.inputDiv}>
			<label className="inputLabelFont" htmlFor={props.id}>
				{props.label}
			</label>
			<textarea
				id={props.id}
				name={props.name}
				defaultValue={props.value ?? ""}
				placeholder={props.placeholder}
				required={props.required ?? false}
			/>
		</div>
	);
}

export function InputSelect(props: InputSelectProps) {
	return (
		<div className={styles.inputDiv}>
			<label className="inputLabelFont" htmlFor={props.id}>
				{props.label}
			</label>
			<select
				name={props.name}
				id={props.id}
				defaultValue={props.value}
				required={props.required ?? false}
			>
				<option value="" disabled>
					Please Select an Option
				</option>
				{props.options.map((option) => (
					<option value={option.value}>{option.label}</option>
				))}
			</select>
		</div>
	);
}
