import { useState } from "react";
import serverURL from "../main";
import axios from "axios";

export default function PassReset() {
	const [loading, setLoading] = useState(true);
	const [email, setEmail] = useState("");
	const url = serverURL + "auth/get-token";
	// Form

	async function getToken() {
		const r = await axios.post(url, { email: email }).then((r) => r);
		return r;
	}

	return (
		<>
			<h3>
				To reset your password please enter your email address that you
				previously used to sign in.
			</h3>
			<div>
				<form>
					<input
						type="text"
						placeholder="email"
					/>
				</form>
			</div>
		</>
	);
}
