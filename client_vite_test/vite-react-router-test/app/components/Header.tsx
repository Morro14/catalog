import { axiosInstance } from "~/main.tsx";
const LOGOUT_URL = "auth/logout";
import { useState } from "react";

export default function Header({ params }: any) {
	const handleAuth = async () => {
		if (params.auth) {
			const response = await axiosInstance.get(LOGOUT_URL).then(() => {
				params.setAuth(false);
				localStorage.removeItem("username");
			});
			console.log(response);
		}
	};
	return (
		<header
			className="flex flex-col items-center h-[32px] w-full"
			aria-hidden="true"
		>
			{/* <div className="gr-gray-line h-[1px] w-full"></div> */}
			<div className="flex w-[1300px] grow ">
				<div className="bg-gray-line w-[1px] h-full"></div>
				{/* <div className="gr-green-medium w-[calc(862px)] h-full opacity-55"></div> */}
				<div className="w-[862px] h-full "></div>
				{/* <div className="bg-gray-line w-[1px] h-full"></div> */}
				{/* <div className="w-30"></div> */}
				<div className="flex grow justify-end pr-4">
					<button
						onClick={handleAuth}
						className="cursor-pointer text-gray-2"
					>
						{params.auth ? "Logout" : "Login"}
					</button>
					{/* <div>{params.auth ? params.username : ""}</div> */}
				</div>
				{/* <div className="bg-gray-line w-[1px] h-full"></div> */}
			</div>
			<div className="gr-gray-line h-[1px] w-full"></div>
		</header>
	);
}
