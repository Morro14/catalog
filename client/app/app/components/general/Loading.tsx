import { useState } from "react";

export default function Loading() {
	const [dots, setDots] = useState(".");
	const [intervalId, setIntervalId] = useState();
	const dotsAdd = dots.length < 3 ? dots + "." : ".";

	const intervalId_ = setTimeout(
		setDots,

		710,
		dotsAdd
	);

	return (
		<div className="flex items-center justify-center">
			<div className="text-gray-400 font-mono w-[100px]">Loading{dots}</div>
		</div>
	);
}
