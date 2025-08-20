import LeftPannel from "../components/catalog/LeftPannel";
import axios from "axios";
import { serverURL } from "../App";
import type { Route } from "./+types/Catalog";

const TREE_URL = serverURL + "api-v1/catalog/tree";

export async function clientLoader() {
	const res = await axios.get(TREE_URL).then((r) => {
		return r;
	});
	return res;
}

export function HydrateFallback() {
	return <>Loading...</>;
}
export default function Catalog({ loaderData }: Route.ComponentProps) {
	return (
		<div className="w-full flex">
			<LeftPannel loaderData={loaderData}></LeftPannel>
			<div className="bg-gray-4 h-[26px] grow"></div>
			<div className="bg-gray-3 h-[26px] grow"></div>
		</div>
	);
}
