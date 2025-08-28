import "../styles/buttons.css";
import Auth from "../components/Auth";
import Header from "../components/Header";
import type { Route } from "./+types/Index";
import { useState } from "react";
import { axiosInstance } from "../App";

const PROFILE_URL = "auth/profile";

export async function clientLoader() {
	const userInfo = axiosInstance
		.get(PROFILE_URL, { withCredentials: true })
		.then((r) => {
			console.log(r);

			return r;
		})
		.catch((r) => {
			console.log("user is not authorized", r);
		});
	return userInfo;
}

export default function Index({ loaderData }: any) {
	const username = loaderData ? loaderData.data.email : null;
	console.log(loaderData);
	const [auth, setAuth] = useState(username ? true : false);
	return (
		<div>
			<Header
				params={{ username: username, auth: auth, setAuth: setAuth }}
			></Header>
			<div className="flex justify-center text-left w-full">
				<div className="gr-gray-line-v w-[1px] h-dvh mt-[117px]"></div>
				<div className="grid grid-cols-[862px_auto] gap-4 w-[1284px] ">
					<div className="">
						{/* <div className="h-2 gr-green-medium opacity-35"></div> */}
						<div className="">
							<h1 className="font-semibold mt-7 px-9">
								Organize your cloud files in a virtual catalog
							</h1>
						</div>

						<div>
							<div className="grid grid-rows-subgrid gap-5 text-lg italic font-serif mt-8 px-9">
								<p>
									Create your own remote file tree to sort files from one or
									multiple cloud storage provider.
								</p>
								<p>
									Add descriptions, tags, categories and dates to files in your
									catalog to make navigation easier.
								</p>
								<p>Export or download your catalog.</p>
							</div>
						</div>
						<div
							aria-hidden="true"
							className="mt-12"
						>
							<div className="h-[1px] gr-gray-line w-[calc(105%+2.25rem)] relative left-[calc(-5%-2.25rem)]"></div>
						</div>
						<div className="grid grid-rows-subgrid mt-8 px-9">
							<h3>What this app is for</h3>
							<p className="mt-5 font-sans">
								This application is designed to help you with managing files
								that are stored with cloud storage services (etc. google drive
								or yandex disk).
							</p>
						</div>
						<div
							aria-hidden="true"
							className="mt-12"
						>
							{/* <div className="h-[1px] gr-gray-line w-[calc(105%+2.25rem)] relative left-[calc(-5%-2.25rem)]"></div> */}
						</div>
						<div className="mt-8 px-9">
							<h3>How it works</h3>
							<p className="mt-5 font-sans">
								The App allows you to create your personal catalog with entries
								which are connected to your remote file, files or directory (via
								link provided by the service). The catalog is saved on the App’s
								server side. It does not store any of your files from cloud
								services, only the data created in the App and the link to the
								remote file are stored. In order to navigate through your cloud
								storage the App will request you to connect to the service (with
								oAuth protocol) and ask for read-only permissions.
							</p>
						</div>
						<div
							aria-hidden="true"
							className="mt-12"
						>
							{/* <div className="h-[1px] gr-gray-line w-[calc(105%+2.25rem)] relative left-[calc(-5%-2.25rem)]"></div> */}
						</div>
						<div className="mt-8 px-9">
							<h3>Preview</h3>
							<p></p>
						</div>
						<div
							aria-hidden="true"
							className="mt-12"
						>
							{/* <div className="h-[1px] gr-gray-line w-[calc(105%+2.25rem)] relative left-[calc(-5%-2.25rem)]"></div> */}
						</div>
						<div className="mt-8 px-9">
							<h3>Github</h3>
							<p></p>
						</div>
					</div>
					<div className="col-auto">
						<Auth
							params={{ auth: auth, username: username, setAuth: setAuth }}
						></Auth>
					</div>
				</div>
			</div>
		</div>
	);
}
