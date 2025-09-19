import { Outlet } from "react-router";

export default function Main() {
	return (
		<div className="w-full">
			{/* <Header></Header> */}
			<Outlet></Outlet>
		</div>
	);
}
