import { useEffect } from "react";
import { axiosInstance } from "~/main";
import { useState } from "react";
import { useSearchParams } from "react-router";
import GoogleDriveView from "~/components/catalog/services/GoogleView";
import { useFetchV3 } from "~/utils/fetchHook";
import Loading from "~/components/general/Loading";

const USER_SERVICE_INFO_URL = "api-v1/catalog/user-service-info";

export default function ServiceNav() {
	const [params, setParams] = useSearchParams();
	const service = params.get("service");

	const { validParams, fetchedData, loading } = useFetchV3(
		USER_SERVICE_INFO_URL
	);

	console.log("service nav", fetchedData);
	return loading ? <Loading /> : <Loading />;
}
