import LeftPannel from "~/components/LeftPannel";
import { axiosInstance } from "~/main";
import type { Route } from "./+types/Catalog";
import { Link, Outlet, useNavigate } from "react-router";
import ServiceNav from "./ServiceNav";
import type { ApiResponse } from "~/types/loader_data";
import type { ShouldRevalidateFunctionArgs } from "react-router";
import Fallback from "~/components/Fallback";
import CatalogEntry from "./CatalogEntry";
import CatalogFallback from "~/components/catalog/CatalogFallback";
import fallbackWrapper from "~/utils/fallbackWrapper";

const TREE_URL = "api-v1/catalog/tree";

interface CatalogLoaderData {
	treeData: ApiResponse<any>;
	serviceData?: ApiResponse<any>;
	entryData?: ApiResponse<any>;
}

export function shouldRevalidate({
	currentUrl,
	nextUrl,
}: ShouldRevalidateFunctionArgs) {
	return !(
		currentUrl.pathname.startsWith("/catalog") &&
		nextUrl.pathname.startsWith("/catalog")
	);
}
export async function clientLoader({
	params,
}: Route.ClientLoaderArgs): Promise<CatalogLoaderData> {
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
	return fallbackWrapper(CatalogFallback);
}

export default function Catalog({ loaderData }: Route.ComponentProps) {
	const email = localStorage.getItem("email");
	console.log("email", email);
	return loaderData.treeData.status === 200 ?
			<div className="w-full min-h-screen flex">
				<LeftPannel treeData={loaderData.treeData}></LeftPannel>
				<div className="grow max-w-4/9">
					<CatalogEntry></CatalogEntry>
				</div>
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
