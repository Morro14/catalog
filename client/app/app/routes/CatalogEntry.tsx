import { Link } from "react-router";
import Tag from "~/components/catalog/Tag";
import { getTagColor } from "~/components/catalog/tagColors";
import type { Route } from "./+types/CatalogEntry";
import { axiosInstance } from "~/main";
import { useMemo } from "react";

const ENTRY_URL = "api-v1/catalog/entry";

export async function clientLoader({ params }: Route.ClientActionArgs) {
	const entryID = params.entryId;
	if (entryID === undefined) {
		const entryData = undefined;
		return { entryData };
	}
	const entryData = await axiosInstance
		.get(ENTRY_URL + "/" + entryID)
		.then((r) => {
			return { data: r.data, status: r.status, message: "success" };
		})
		.catch((r) => {
			// console.log(r);
			return { data: r.data, status: r.status, message: r.message };
		});
	return { entryData };
}
export function HydrateFallback() {
	return <div className="text-center grow">Loading...</div>;
}

export default function CatalogEntry({ loaderData }: Route.ComponentProps) {
	console.log("file view", loaderData);
	const entryData = loaderData.entryData?.data;

	const tagColors = useMemo(
		() => (entryData ? getTagColor(entryData.tags) : []),
		[loaderData]
	);
	return !loaderData ?
			<div className="grow">
				<div className="bg-gray-4 h-[26px] ">
					<div className="font-sans text-sm ml-3"></div>
				</div>
				<div className="text-center">
					<h5 className="text-gray-400 font-mono">
						Choose a folder or an entry to display
					</h5>
				</div>
			</div>
		:	<div className="grow max-w-4/9">
				<div className="bg-gray-4 h-[26px] ">
					<div className="font-sans text-sm ml-3">{entryData.path}</div>
				</div>
				<div className="px-[38px] py-[21px]">
					<div className="font-sans font-normal text-2xl">{entryData.name}</div>
					<p className="font-sans mt-4">{entryData.context_description}</p>
					<div className="h-[1px] bg-gray-4 mt-4"></div>
					<div className="flex justify-between font-mono text-xs mt-1">
						<Link to="catalog/entry/edit">edit</Link>
						<div className="flex gap-1">
							<div>tags: </div>
							<div className="flex gap-1">
								{entryData.tags.map((tag: any, i: number) => (
									<Tag
										name={tag}
										color={tagColors[i]}
										key={`tag-${tag}`}
									></Tag>
								))}
							</div>
						</div>
						<div>category: {entryData.category}</div>
						<div>date: {entryData.context_date}</div>
					</div>
				</div>
			</div>;
}
