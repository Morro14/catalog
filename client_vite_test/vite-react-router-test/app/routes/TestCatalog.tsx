import TestTree from "./TestTree";
import { Outlet } from "react-router";

export default function TestCatalog() {
	console.log("test catalog");
	return (
		<div className="flex flex-col items-center w-full">
			Test Catalog
			<TestTree></TestTree>
			<Outlet></Outlet>
		</div>
	);
}
