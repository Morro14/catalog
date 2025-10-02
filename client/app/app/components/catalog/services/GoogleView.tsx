import { useFetchV3 } from "~/utils/fetchHook";

const GOOGLE_DRIVE_URL = "api-v1/catalog/google/get-files";

export default function GoogleDriveView() {
	const fetchResults = useFetchV3(GOOGLE_DRIVE_URL);
	const data =
		fetchResults.fetchedData && fetchResults.fetchedData.status === 200 ?
			fetchResults.fetchedData.data
		:	undefined;
	console.log("google data", data);
	return;
}
