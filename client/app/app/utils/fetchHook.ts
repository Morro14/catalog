import { useState, useEffect } from "react";
import { axiosInstance } from "~/main";

export default function useFetch(url: string) {
	const [loading, setLoading] = useState(true);
	const [data, setData] = useState(undefined);
	useEffect(() => {
		axiosInstance
			.get(url, { timeout: 30000 })
			.then((r) => {
				console.log("service response:", r);
				setData({ data: r.data, status: r.status, message: "success" });
				setLoading(false);
			})
			.catch((r) => {
				setData({ data: r.data, status: r.status, message: r.message });
				setLoading(false);
			});

		// setData("data");
		// setLoading(false);
	});
	return { data, loading };
}
export function useFetchV2(url: string) {
	const [loading, setLoading] = useState<"idle" | "loading">("idle");
	const [data, setData] = useState(undefined);
	console.log("loading", loading);
	if (loading === "idle") {
		useEffect(() => {
			setLoading("loading");
			console.log("useEffect timeout");
			setTimeout(() => {
				console.log("useEffect timeout over");
			}, 3000);
			setData("data");
			setLoading("idle");
		}, [url]);
	}
	return { data, loading };
}
export function useFetchV3(url: string) {
	const [loading, setLoading] = useState(true);
	const [fetchedData, setFetchedData] = useState(undefined);
	console.log("loading", loading);

	useEffect(() => {
		console.log("sending request");

		axiosInstance
			.get(url, { timeout: 30000 })
			.then((r) => {
				console.log("fetch:", r);

				setFetchedData({ data: r.data, status: r.status, message: "success" });

				setLoading(false);
			})
			.catch((r) => {
				setFetchedData({ data: r.data, status: r.status, message: r.message });
				setLoading(false);
			});
	}, [url]);
	console.log("data", fetchedData);
	return { fetchedData, loading };
}
