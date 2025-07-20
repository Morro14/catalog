import { useState } from "react";
import serverURL from "../App";
import axios from "axios";

export default function PassReset() {
	const [loading, setLoading] = useState(true);
	const [email, setEmail] = useState("");
	const url = serverURL + "auth/get-token";

	async function getToken() {
		const r = await axios.post(url, { email: email }).then((r) => r);
		return r;
	}

	return;
}
