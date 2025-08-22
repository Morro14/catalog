import LeftPannel from "../components/catalog/LeftPannel";
import axios from "axios";
import { serverURL } from "../App";
import type { Route } from "./+types/Catalog";
import { Link, useNavigate } from "react-router";

const TREE_URL = serverURL + "api-v1/catalog/tree";

export async function clientLoader() {
	const res = await axios
		.get(TREE_URL)
		.then((r) => {
			console.log("catalog loader", r);
			return r;
		})
		.catch((r) => {
			console.log("catalog catch", r);
			return r;
		});
	return res;
}

export function HydrateFallback() {
	return <>Loading...</>;
}
export default function Catalog({ loaderData }: Route.ComponentProps) {
	return loaderData.status === 200 ?
			<div className="w-full flex">
				<LeftPannel loaderData={loaderData}></LeftPannel>
				<div className="bg-gray-4 h-[26px] grow"></div>
				<div className="bg-gray-3 h-[26px] grow"></div>
			</div>
		:	<div className="flex flex-col justify-center items-center mt-10">
				<div className="text-xl font-semibold text-gray-2">
					Please, sign up to access the catalog.
				</div>
				<Link
					to={"/"}
					className="font-light underline"
				>
					Back to the main page.
				</Link>
			</div>;
}
