import { Form } from "react-router";
import v from "../utils/validators";
import axios from "axios";
import { serverURL } from "../App";
import { useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router";

const loginURL = serverURL + "/auth/login";

export default function Login() {
	const nav = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState<{
		email: boolean | string;
		password: boolean | string;
	}>({ email: false, password: false });

	const handleSubmit = () => {
		console.log("submitting");
		const emailValid = v.validateEmail(email);
		const passwordValid = v.validatePassword(password);
		console.log("valid data; password", passwordValid, "email:", emailValid);
		if (emailValid && passwordValid) {
			axios.post(loginURL, { email: email, password: password }).then((r) => {
				console.log(r, document.cookie);
				if (r.status === 200) {
					nav("/catalog");
				} else {
					setErrors({
						email: "Incorrect user data.",
						password: "Incorrect user data.",
					});
				}
			});
		} else {
			if (!emailValid) {
				setErrors({ ...errors, email: "Please, enter a correct email." });
			}
			if (!passwordValid) {
				setErrors({ ...errors, password: "Please, enter a correct password." });
			}
		}
	};
	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		const { name, value } = e.target;
		if (name === "email") {
			setEmail(value);
		} else if (name === "password") {
			setPassword(value);
		}
	};
	return (
		<div>
			<Form
				className="flex flex-col items-center gap-5 mt-2.5"
				onSubmit={handleSubmit}
				navigate={false}
			>
				<div>
					<input
						className="input-login"
						type="text"
						placeholder="email"
						name="email"
						onChange={handleChange}
						value={email}
					/>
					<div className="h-3.5 mt-1 text-sm text-red-error font-sans">
						{errors.email || ""}
					</div>
				</div>
				<div>
					<input
						className="input-login"
						type="password"
						placeholder="password"
						name="password"
						onChange={handleChange}
						value={password}
					/>
					<div className="h-3.5 mt-1 text-sm text-red-error font-sans">
						{errors.password || ""}
					</div>
				</div>
				<button
					className="button-login mt-3"
					type="submit"
				>
					Sign In
				</button>
			</Form>
			<div className="mt-3 text-center">or log in via:</div>
			<div className="flex gap-7 justify-center mt-3">
				<div>Google</div>
				<div>Yandex</div>
				<div>Microsoft</div>
			</div>
		</div>
	);
}
