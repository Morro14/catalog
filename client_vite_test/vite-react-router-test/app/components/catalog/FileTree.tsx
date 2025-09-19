import { useNavigate } from "react-router";

export default function FileTree({ treeData }: any) {
	if (!treeData) {
		return <div>No data</div>;
	}
	const tree = treeData.data.tree.root;
	const nav = useNavigate();
	const handleEntryClick = (e: React.SyntheticEvent, pk: number) => {
		nav("/catalog/" + pk);
	};

	function formatRow(row: [any], indent: number, path = "") {
		let rowFormatted: any = [];
		row.forEach((file, index) => {
			// TODO animation
			// const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
			// 	const content = document.getElementById(`content-${path}/${file.name}`);
			// 	if (!content) return;

			// 	if (e.target.checked) {
			// 		content.style.height = e.target.scrollHeight + "px";
			// 		const end = () => {
			// 			content.style.height = "auto";
			// 			content.removeEventListener("transitionend", end);
			// 		};
			// 		content.addEventListener("transitionend", end);
			// 	} else {
			// 		content.style.height = e.target.scrollHeight + "px";
			// 		requestAnimationFrame(() => {
			// 			content.style.height = "0px";
			// 		});
			// 	}
			// };
			const indentCalc = file.type === "folder" ? indent : indent + 6;
			const folderChildren =
				file.type === "folder" ?
					formatRow(file.children, 10, path + "/" + file.name)
				:	"";
			const arrow_ =
				file.type === "folder" ?
					// <img
					// 	src={arrow}
					// 	alt="arrow-folder"
					// 	className="arrow mr-3 transition-transform duration-300"
					// />
					<div className="arrow mr-3 transition-transform duration-300">
						{"> "}
					</div>
				:	<div className="text-gray-2 mr-2.5">- </div>;
			rowFormatted.push(
				<div
					className={"cursor-pointer"}
					key={`file-${path}/${file.name}`}
					style={{ paddingLeft: `${indentCalc}px` }}
					id={`file-${path}/${file.name}`}
				>
					<input
						type="checkbox"
						id={`input-${path}/${file.name}`}
						className="peer hidden"
					/>
					<label
						className={
							"flex select-none cursor-pointer peer-checked:[&_.arrow]:rotate-90 text-gray-700" +
							(file.type === "folder" ? " font-semibold" : " font-normal")
						}
						htmlFor={`input-${path}/${file.name}`}
						onClick={(e) =>
							file.type === "entry" ? handleEntryClick(e, file.pk) : ""
						}
					>
						{arrow_}
						{file.name}
					</label>
					<div
						id={`content-${path}/${file.name}`}
						className="hidden peer-checked:block"
					>
						{folderChildren}
					</div>
				</div>
			);
		});
		return rowFormatted;
	}
	const treeF = formatRow(tree, 0);
	return <div>{treeF}</div>;
}
