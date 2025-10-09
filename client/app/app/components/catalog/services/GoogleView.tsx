import type { link } from "fs";
import Fallback from "~/components/Fallback";
import Loading from "~/components/general/Loading";
import { useFetchV3 } from "~/utils/fetchHook";
import startGoogleAuthFlow from "~/utils/google/authflow";
import DriveTree from "./DriveTree";

const GOOGLE_DRIVE_URL = "api-v1/catalog/google/get-files";

export default function GoogleDriveView() {
	// const fetchResults = useFetchV3(GOOGLE_DRIVE_URL);
	const { validParams, fetchedData, loading } = useFetchV3(
		GOOGLE_DRIVE_URL,
		true
		// 120000
	);
	const data =
		fetchedData && fetchedData.status === 200 ? fetchedData.data : undefined;

	console.log("google data", data);

	return (
		data ?
			<div>
				<DriveTree tree={data}></DriveTree>
			</div>
		: loading ? <Loading></Loading>
		: fetchedData.status === 500 ?
			<div>
				<Fallback
					message={"You need to complete Google authorization."}
					linkText={"Authorize with Google."}
					onClick={startGoogleAuthFlow}
				></Fallback>
			</div>
		:	<Fallback
				message={"Could not get the files from Google Drive."}
			></Fallback>
	);

	// <Fallback message={"Getting files from Google Drive. It can take a few minutes"}></Fallback>
}
