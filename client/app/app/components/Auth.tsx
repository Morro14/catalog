import { Outlet } from "react-router";
import { NavLink } from "react-router";
import Authorized from "./Authorized";
import Login from "../routes/Login";

export default function Auth({ params }: any) {
	return (
		<div className="ml-[30px] mt-[38px] bg-[url(../../src/assets/login_lines.svg)] w-[436px] h-[436px]">
			{params.auth ?
				<Authorized
					username={params.username}
					auth={params.auth}
					setAuth={params.setAuth}
				></Authorized>
			:	<div className="w-[334px] h-[360px] relative left-[50px] top-[50px] flex flex-col items-center gap-3 pt-4">
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
					<Login></Login>
				</div>
			}
		</div>
	);
}
