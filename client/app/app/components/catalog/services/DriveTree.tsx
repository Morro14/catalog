export default function DriveTree({ tree }) {
	const handleClick = () => {};
	function formatRow(row: [any], indent = 0, path = "") {
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
			const indentCalc =
				file.mimeType === "application/vnd.google-apps.folder" ?
					indent
				:	indent + 6;
			const folderChildren =
				file.mimeType === "application/vnd.google-apps.folder" ?
					formatRow(file.children, 10, path + "/" + file.name)
				:	"";
			const arrow_ =
				file.mimeType === "application/vnd.google-apps.folder" ?
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
					{file.mimeType === "application/vnd.google-apps.folder" ?
						<label
							className="flex select-none cursor-pointer peer-checked:[&_.arrow]:rotate-90 text-gray-700 font-semibold"
							htmlFor={`input-${path}/${file.name}`}
						>
							{arrow_}
							{file.name}
						</label>
					:	<label
							className={
								"flex select-none cursor-pointer peer-checked:[&_.arrow]:rotate-90 text-gray-700 font-normal"
							}
							htmlFor={`input-${path}/${file.name}`}
							onClick={handleClick}
						>
							{arrow_}
							{file.name}
						</label>
					}
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
	const root = tree.files;
	const treeFormatted = formatRow(root);
	return <div>{treeFormatted}</div>;
}
