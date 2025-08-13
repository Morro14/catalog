import "./styles/global.css";
import { Scripts, Links } from "react-router";
import App from "./App.tsx";

export default function Root() {
	return (
		<html>
			<head>
				<title>Catalog App</title>
				<meta charSet="utf-8" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1"
				/>
				<Links />
			</head>
			<body>
				<App></App>
				<Scripts />
			</body>
		</html>
	);
}
