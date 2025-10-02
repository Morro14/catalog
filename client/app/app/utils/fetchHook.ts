import { useState, useEffect } from "react";
import { axiosInstance } from "~/main";

export function useFetchV3(url: string) {
	const [loading, setLoading] = useState(true);
	const [fetchedData, setFetchedData] = useState(undefined);

	useEffect(() => {
		if (!url) {
			setLoading(false);
			return;
		}
		if (!loading) {
			return;
		}

		console.log("sending request");

		axiosInstance
			.get(url, { timeout: 30000 })
			.then((r) => {
				setFetchedData({ data: r.data, status: r.status, message: "success" });

				setLoading(false);
			})
			.catch((r) => {
				setFetchedData({ data: r.data, status: r.status, message: r.message });
				setLoading(false);
			});
	}, [url]);
	return { validParams: url, fetchedData, loading };
}
