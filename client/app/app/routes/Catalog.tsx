import LeftPannel from "../components/catalog/LeftPannel";

export default function Catalog() {
	return (
		<div className="w-full grid grid-cols-2">
			<div className="col-span-2 bg-amber-300 h-[26px]"></div>
			<div className="">
				<LeftPannel></LeftPannel>
			</div>
		</div>
	);
}
