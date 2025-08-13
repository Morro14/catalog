import { useState } from "react";
import { Outlet } from "react-router";
import { NavLink } from "react-router";

export default function Login() {
	// const [tabActive, setTabActive] = useState<string>("signin");
	// // const tabActiveStyle = "text-green-dark";
	// // const handleTabClick = (e: React.MouseEvent<HTMLDivElement>) => {
	// // 	setTabActive(e.currentTarget.id);
	// // 	const url = e.currentTarget.id === "signin" ? "/" : "/signup";
	// // };
	return (
		<div className="ml-[30px] mt-[38px] bg-[url(../../src/assets/login_lines.svg)] w-[436px] h-[436px]">
			<div className="w-[334px] h-[360px] relative left-[50px] top-[50px] flex flex-col items-center gap-3 pt-4">
				<div className="flex gap-9">
					<NavLink
						className="text-xl text-gray-2 font-semibold hover:cursor-pointer "
						id="signin"
						to="/"
					>
						Sign In
					</NavLink>
					<div className="bg-gray-line w-[1px] h-full"></div>
					<NavLink
						className="text-xl text-gray-2 font-semibold hover:cursor-pointer active:text-green-dark"
						to="/signup"
						id="signup"
					>
						Sign Up
					</NavLink>
				</div>
				<Outlet></Outlet>
			</div>
		</div>
	);
}
