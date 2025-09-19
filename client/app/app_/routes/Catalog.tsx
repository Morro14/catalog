import LeftPannel from "../components/catalog/LeftPannel";
import { axiosInstance } from "../main";
import type { Route } from "./+types/Catalog";
import { Link, Outlet, useNavigate } from "react-router";
import ServiceNav from "./ServiceNav";
import type { ApiResponse } from "../types/loader_data";

const TREE_URL = "api-v1/catalog/tree";
const ENTRY_URL = "api-v1/catalog/entry";

interface CatalogLoaderData {
	treeData: ApiResponse<any>;
	entryData?: ApiResponse<any>;
}

export async function clientLoader({
	params,
}: Route.ClientLoaderArgs): Promise<CatalogLoaderData> {
	console.log("catalog loader");
	const treeData = await axiosInstance
		.get(TREE_URL)
		.then((r) => {
			return { data: r.data, status: r.status, message: "success" };
		})
		.catch((r) => {
			// console.log(r);
			return { data: r.data, status: r.status, message: r.message };
		});

	return { treeData };
}

export function HydrateFallback() {
	return <>Loading...</>;
}
export default function Catalog({ loaderData }: Route.ComponentProps) {
	console.log("catalog render");
	return loaderData.treeData.status === 200 ?
			<div className="w-full min-h-screen flex">
				<LeftPannel treeData={loaderData.treeData}></LeftPannel>
				<Outlet></Outlet>
				{/* <FilesView data={loaderData.entryData}></FilesView> */}

				<div className="grow max-w-4/9">
					<div className="bg-gray-3 h-[26px]"></div>
					<ServiceNav></ServiceNav>
				</div>
			</div>
		:	<div className="flex flex-col justify-center items-center mt-10">
				<div className="text-xl font-semibold text-gray-2">
					Please, sign up to access the catalog
				</div>
				<Link
					to={"/"}
					className="font-light underline"
				>
					Back to the main page
				</Link>
			</div>;
}
