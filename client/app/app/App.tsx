// import "../src/styles/App.css";
import { Outlet } from "react-router";
export const serverURL = "http://127.0.0.1:8000/";
import axios from "axios";

axios.defaults.withCredentials = true;
export const axiosInstance = axios.create({
	baseURL: serverURL,
	timeout: 10000,
});
axios.interceptors.response.use((r) => {
	console.log("interseptor");
	const authExceptionsStatuses = [401, 403];
	if (authExceptionsStatuses.includes(r.status)) {
		console.log(r);
		localStorage.removeItem("username");
	}
	return r;
});
export default function App() {
	return (
		<>
			<Outlet />
		</>
	);
}
