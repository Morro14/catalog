import { useNavigate } from "react-router";
import arrow from "/src/assets/arrow_tree.svg";

export default function FileTree({ loaderData }: any) {
	if (!loaderData.data.tree.root) {
		return <div>No data</div>;
	}
	const nav = useNavigate();
	const loadedTree = loaderData.data.tree.root;
	const handleEntryClick = (e: React.SyntheticEvent, pk: number) => {
		nav("/catalog/" + pk);
	};
	const handleFolderClick = (e: any) => {
		const folderContent = e.target.nextSibling;
		console.log(e.target);
		folderContent.hidden = !folderContent.hidden;
		const arrow = e.target.firstChild;
		arrow.style["transform"] =
			arrow.style["transform"] === "rotate(90deg)" ?
				"rotate(0deg)"
			:	"rotate(90deg)";
	};
	function formatRow(row: [any], indent: number) {
		let rowFormatted: any = [];
		row.forEach((file, index) => {
			const indentCalc =
				file.type === "folder" ? indent * 10 : indent * 10 + 16;
			const folderChildren =
				file.type === "folder" ? formatRow(file.children, indent + 1) : "";
			const arrow_ =
				file.type === "folder" ?
					<img
						src={arrow}
						alt="arrow_folder"
						className="mr-2"
					/>
				:	"";
			rowFormatted.push(
				<div
					className="cursor-pointer"
					key={`tree-file-${index}`}
					style={{ paddingLeft: `${indentCalc}px` }}
				>
					<div>
						<div
							className="flex"
							onClick={
								file.type === "entry" ?
									(e) => handleEntryClick(e, file.pk)
								:	handleFolderClick
							}
						>
							{arrow_}
							{file.name}
						</div>
						{folderChildren}
					</div>
				</div>
			);
		});
		return rowFormatted;
	}
	const tree = formatRow(loadedTree, 0);
	return <div>{tree}</div>;
}
