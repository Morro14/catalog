import { Form } from "react-router";
import v from "~/utils/validators";
import axios from "axios";
import { serverURL } from "~/main";
import { useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router";
import startGoogleAuthFlow from "~/utils/google/authflow";

const loginURL = serverURL + "/auth/login";

export default function Login() {
	const nav = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState<{
		email: boolean | string;
		password: boolean | string;
	}>({ email: false, password: false });

	const handleSubmit = (e: React.SyntheticEvent) => {
		e.preventDefault();
		console.log("submitting");
		const emailValid = v.validateEmail(email);
		const passwordValid = v.validatePassword(password);
		console.log("valid data; password", passwordValid, "email:", emailValid);
		if (emailValid && passwordValid) {
			console.log("sending request");
			axios
				.post(loginURL, { email: email, password: password })
				.then((r) => {
					console.log("login:", r.status);
					if (r.status === 200) {
						localStorage.setItem("username", email);
						nav("/catalog");
					} else {
						setErrors({
							email: "Incorrect user data.",
							password: "Incorrect user data.",
						});
					}
				})
				.catch((r) => {
					console.log("login: caught", r);
					setErrors({
						email: "Incorrect user data.",
						password: "Incorrect user data.",
					});
				});
		} else {
			if (!emailValid) {
				setErrors({ ...errors, email: "Please enter correct email." });
			}
			if (!passwordValid) {
				setErrors({ ...errors, password: "Please enter correct password." });
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
				className="flex flex-col items-center gap-2.5 mt-2.5"
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
					// type="submit"
				>
					Sign In
				</button>
			</Form>
			<div className="mt-3 text-center">or log in via:</div>
			<div className="flex gap-7 justify-center mt-3">
				<div onClick={startGoogleAuthFlow}>Google</div>
				<div>Yandex</div>
				<div>Microsoft</div>
			</div>
		</div>
	);
}
