import LeftPannel from "../components/catalog/LeftPannel";

export default function Catalog() {
	return (
		<div className="w-full flex">
			<LeftPannel></LeftPannel>
			<div className="bg-gray-4 h-[26px] grow"></div>
			<div className="bg-gray-3 h-[26px] grow"></div>
		</div>
	);
}
