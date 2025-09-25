import { axiosInstance } from "~/main";
import type { Route } from "./+types/OauthSuccess";
import { Link } from "react-router";

const TOKEN_CONVERT_URL = "auth/temp-token-convert";

export async function clientLoader({ request }: any) {
	const url = new URL(request.url);
	const temp_token = url.searchParams.get("token");
	const response = await axiosInstance
		.post(TOKEN_CONVERT_URL, { token: temp_token }, { withCredentials: true })
		.then((r) => {
			console.log(r);
			if (r.status === 200) {
				return r;
			}
		})
		.catch((r) => {
			console.log(r);
			return r;
		});
	return response;
}

export default function OauthSuccess({ loaderData }: Route.ComponentProps) {
	console.log(loaderData);

	return (
		<div className="flex justify-center text-center text-gray-2">
			{loaderData.status !== 200 ?
				<div>
					<div>Authorization error</div>
					<div>Something went wrong</div>
					<Link
						to="/"
						className="underline"
					>
						back to main page
					</Link>
				</div>
			:	<div className="">
					<div>You have successfully signed in</div>
					<Link
						to="/catalog"
						className="button-login text-center"
					>
						Open catalog
					</Link>
				</div>
			}
		</div>
	);
}
