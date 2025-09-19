import { useState } from "react";
import FileTree from "./FileTree";
import createEntryIcon from "../../../src/assets/add_entry.svg";
import createFolderIcon from "../../../src/assets/add_folder.svg";

export default function LeftPannel({ treeData }: any) {
	const [blockVisible, setBlockVisible] = useState({
		menu: true,
		files: true,
		tags: true,
		categories: true,
	});
	const handleClick = (e: any) => {
		const id: "menu" | "files" | "tags" | "categories" = e.currentTarget.id;
		setBlockVisible({ ...blockVisible, [id]: !blockVisible[id] });
	};
	// TODO fixed max height for transition to work
	const visibleStyle = " min-h-[26px] max-h-fit";
	const hiddenStyle = " max-h-0 overflow-hidden";

	return (
		<div className="flex flex-col min-w-1/9 h-screen bg-gray-4">
			<div>
				<div
					id="menu"
					className="font-sans text-base bg-gray-3 h-[26px] pl-2 cursor-pointer"
					onClick={handleClick}
				>
					My Catalog
				</div>
				<div
					className={`lex flex-col text-sm font-mono pl-2 transition duration-300 ease-out bg-gray-4 ${blockVisible.menu ? visibleStyle : hiddenStyle}`}
				>
					content
				</div>
			</div>
			<div>
				<div
					id="files"
					className="flex items-center font-sans text-base bg-gray-3 h-[26px] px-2 cursor-pointer"
					onClick={handleClick}
				>
					<div className="grow">Files</div>
					<div className="flex gap-1">
						<div>
							<img
								src={createEntryIcon}
								alt="create-entry-icon"
							/>
						</div>
						<div>
							<img
								src={createFolderIcon}
								alt="create-folder-icon"
							/>
						</div>
					</div>
				</div>
				<div
					className={`flex flex-col text-sm font-mono pl-2 transition duration-300 ease-out bg-gray-4 ${blockVisible.files ? visibleStyle : hiddenStyle}`}
				>
					<FileTree treeData={treeData} />
				</div>
			</div>
		</div>
	);
}
