import { useState } from "react";
import howItWorksText from "../texts/how_it_works.txt?raw";
import "../styles/buttons.css";

export default function Index() {
	// TODO Preview and GitHub component
	const previewContent = "Preview";
	const gitHubLink = "GitHub link";

	const [infoTab, setInfoTab] = useState<"howItWorks" | "preview" | "gitHub">(
		"howItWorks"
	);

	const activeTabStyle = " tab text-dark-green";
	const inactiveTabStyle = "tab text-gray-inactive";

	const getBlockContent = (infoTab: "howItWorks" | "preview" | "gitHub") => {
		switch (infoTab) {
			case "howItWorks":
				return howItWorksText;
			case "preview":
				return previewContent;
			case "gitHub":
				return gitHubLink;
		}
	};
	const blockContent = getBlockContent(infoTab);
	return (
		<div className="flex flex-col justify-center text-center gap-8 w-container-middle">
			<h1 className="text-title mt-8 font-semibold">
				Organize your cloud files in a virtual catalog
			</h1>
			<div className="flex justify-center">
				<div className="flex flex-col text-center text-lg font-[550] gap-4 max-w-[582px]">
					<p>
						Create your own remote file tree to sort files from one or multiple
						cloud storage provider.
					</p>
					<p>
						Add descriptions, tags, categories and dates to files in your
						catalog to make navigation easier.
					</p>
					<p>Export or download your catalog.</p>
				</div>
			</div>
			<div className="flex justify-center">
				<button className="button-signup">Sign Up</button>
			</div>
			{/* <div className="flex flex-col text-justify  gap-4 p-5 bg-white rounded-md"> */}
			<div>
				This application is designed to help you with managing files that are
				stored with cloud storage services (etc. google drive or yandex disk).
			</div>
			<div className="text-xl font-semibold flex flex-row justify-center gap-7">
				<div
					onClick={() => setInfoTab("howItWorks")}
					className={
						infoTab == "howItWorks" ? activeTabStyle : inactiveTabStyle
					}
				>
					How it works
				</div>
				<div
					onClick={() => setInfoTab("preview")}
					className={infoTab == "preview" ? activeTabStyle : inactiveTabStyle}
				>
					Example preview
				</div>
				<div
					onClick={() => setInfoTab("gitHub")}
					className={infoTab == "gitHub" ? activeTabStyle : inactiveTabStyle}
				>
					GitHub
				</div>
			</div>
			{/* info block */}

			<div className="">{blockContent}</div>
		</div>
		// </div>
	);
}
