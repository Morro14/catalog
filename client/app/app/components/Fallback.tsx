import { Link } from "react-router";

export default function Fallback({
	message,
	link = undefined,
	linkText = undefined,
	onClick = undefined,
}) {
	console.log(link, linkText, onClick);
	return (
		<div className="flex flex-col justify-center items-center mt-10">
			<div className="text-gray-2 font-semibold">{message}</div>
			{link ?
				<Link
					to={link}
					className="font-light underline"
				>
					{linkText}
				</Link>
			: onClick ?
				<div
					className="font-light underline cursor-pointer"
					onClick={onClick}
				>
					{linkText}
				</div>
			:	""}
		</div>
	);
}
