// import "../src/styles/App.css";
import { Outlet } from "react-router";
export const serverURL = "http://127.0.0.1:8000/";
import axios from "axios";

axios.defaults.withCredentials = true;
export const axiosInstance = axios.create({
	baseURL: serverURL,
	timeout: 10000,
});

export default function App() {
	return (
		<>
			<Outlet />
		</>
	);
}
