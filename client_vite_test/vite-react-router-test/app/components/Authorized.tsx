import { Link } from "react-router";
import { axiosInstance } from "~/main.tsx";
const LOGOUT_URL = "auth/logout";
export default function Authorized({ username, auth, setAuth }: any) {
	const handleLogout = async () => {
		if (auth) {
			const response = await axiosInstance.get(LOGOUT_URL).then(() => {
				setAuth(false);
				localStorage.removeItem("username");
			});
			console.log(response);
		}
	};
	return (
		<div className="flex flex-col items-center text-gray-2 text-base relative top-[110px]">
			<div className=" flex flex-col gap-2">
				<div className="text-center">You are signed in as</div>
				<div className="text-xl font-semibold">{username}</div>
			</div>
			<div className="flex flex-col relative top-[50px] gap-2">
				<Link
					to="/catalog"
					className="button-login text-center"
				>
					Open catalog
				</Link>
				<div
					className="font-light underline text-center cursor-pointer"
					onClick={handleLogout}
				>
					logout
				</div>
			</div>
		</div>
	);
}
