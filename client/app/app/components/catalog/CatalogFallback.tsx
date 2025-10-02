import LeftPannel from "../LeftPannel";
import ServiceNav from "~/routes/ServiceNav";
import CatalogEntry from "~/routes/CatalogEntry";

export default function CatalogFallback() {
	return (
		<div className="w-full min-h-screen flex">
			<LeftPannel treeData={undefined}></LeftPannel>
			<div className="grow max-w-4/9">
				<CatalogEntry></CatalogEntry>
			</div>
			<div className="grow max-w-4/9">
				<div className="bg-gray-3 h-[26px]"></div>
				<ServiceNav></ServiceNav>
			</div>
		</div>
	);
}
