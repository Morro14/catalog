import { useNavigate } from "react-router";

export default function TestTree() {
	const nav = useNavigate();
	const handleClick = () => {
		nav("/test-catalog/3");
	};
	return (
		<div className="flex flex-col items-center w-full">
			<div>Test Tree</div>
			<button
				onClick={handleClick}
				className="cursor-pointer bg-gray-3 rounded-sm px-3"
			>
				nav button
			</button>
		</div>
	);
}
