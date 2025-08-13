import { useState } from "react";

export default function LeftPannel() {
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
	return (
		<div className="flex flex-col w-[188px]">
			<div>
				<div
					id="menu"
					className="font-sans text-sm peer"
					// onClick={handleClick}
				>
					My Catalog
				</div>
				<div className="hidden peer-has-active:block">content</div>
			</div>
		</div>
	);
}
