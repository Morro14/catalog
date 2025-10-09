import { useSearchParams } from "react-router";
import GoogleDriveView from "~/components/catalog/services/GoogleView";
import { useFetchV3 } from "~/utils/fetchHook";
import Loading from "~/components/general/Loading";

const USER_SERVICE_INFO_URL = "api-v1/catalog/user-service-info";

export default function ServiceNav() {
	const [params, setParams] = useSearchParams();
	const serviceQuery = params.get("service");

	// fetch user's prefered service if no service in query params
	const { validParams, fetchedData, loading } = useFetchV3(
		!serviceQuery ? USER_SERVICE_INFO_URL : undefined
	);
	const service =
		fetchedData ?
			serviceQuery || fetchedData.data.last_used_service
		:	undefined;

	console.log("service nav", fetchedData);
	return (
		loading ? <Loading />
		: service === "google" ? <GoogleDriveView></GoogleDriveView>
		: <GoogleDriveView></GoogleDriveView>
	);
}
