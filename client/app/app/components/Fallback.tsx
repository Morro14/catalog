import { Link } from "react-router";

export default function Fallback({ message, link = "", linkText = "" }) {
	return (
		<div className="flex flex-col justify-center items-center mt-10">
			<div className="text-xl font-semibold text-gray-2">{message}</div>

			<Link
				to={link}
				className="font-light underline"
			>
				{linkText}
			</Link>
		</div>
	);
}
