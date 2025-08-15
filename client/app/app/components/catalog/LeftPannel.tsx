import axios from "axios";
import { useState } from "react";
import { serverURL } from "../../App";

const TREE_URL = serverURL + "api-v1/catalog/tree";

export async function clientLoader() {
	const res = await axios.get(TREE_URL).then((r) => {
		console.log(r);
		return r;
	});
	return res;
}

export function HydrateFallback() {
	return <>Loading...</>;
}

export default function LeftPannel({ loaderData }: any) {
	const [blockVisible, setBlockVisible] = useState({
		menu: true,
		files: true,
		tags: true,
		categories: true,
	});
	const handleClick = (e: any) => {
		const id: "menu" | "files" | "tags" | "categories" = e.target.id;
		setBlockVisible({ ...blockVisible, [id]: !blockVisible[id] });
	};
	console.log("got loader data", loaderData);
	// TODO fixed max height for transition to work
	const visibleStyle =
		"flex flex-col text-sm font-mono pl-2 transition duration-300 ease-out bg-gray-4 min-h-[26px] max-h-fit";
	const hiddenStyle =
		"flex flex-col text-sm font-mono pl-2 transition duration-300 ease-out bg-gray-4 max-h-0 overflow-hidden";

	return (
		<div className="flex flex-col w-[188px]">
			<div>
				<div
					id="menu"
					className="font-sans text-base bg-gray-3 h-[26px] pl-2"
					onClick={handleClick}
				>
					My Catalog
				</div>
				<div className={blockVisible.menu ? visibleStyle : hiddenStyle}>
					content
				</div>
			</div>
			<div>
				<div
					id="files"
					className="font-sans text-base bg-gray-3 h-[26px] pl-2"
					onClick={handleClick}
				>
					Files
				</div>
				<div className={blockVisible.files ? visibleStyle : hiddenStyle}>
					files
				</div>
			</div>
		</div>
	);
}
