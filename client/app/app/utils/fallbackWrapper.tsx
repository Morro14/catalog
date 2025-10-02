import { useState, useEffect } from "react";
import Fallback from "~/components/Fallback";
import Loading from "~/components/general/Loading";

export default function fallbackWrapper(component: React.ElementType) {
	const [hydrated, setHydrated] = useState(false);
	useEffect(() => setHydrated(true), []);
	if (!hydrated) {
		// return <Fallback message={"Loading..."}></Fallback>;
		return <Loading />;
	}
	const email = localStorage.getItem("email");
	console.log("fallback wrapper", email);
	if (email) {
		return component;
	}
	return <Loading />;
}
