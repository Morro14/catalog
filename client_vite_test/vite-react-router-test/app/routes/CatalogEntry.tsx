import { Link } from "react-router";
import Tag from "~/components/catalog/Tag";
import { getTagColor } from "~/components/catalog/tagColors";
import type { Route } from "./+types/CatalogEntry";
import { axiosInstance } from "~/main";

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
	// console.log("FilesView data:", data);
	console.log("file view", loaderData);
	const entryData = loaderData.entryData?.data;
	const tagPallete = ["pink", "green", "blue", "orange"];
	const tagColors = entryData ? getTagColor(entryData.tags, tagPallete) : [];
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
				<h3 className="font-sans font-normal">{entryData.name}</h3>
				<p>{entryData.context_description}</p>
				<div className="flex justify-between font-mono text-xs">
					<Link to="catalog/entry/edit">edit</Link>
					<div>
						<div>tags: </div>
						<div>
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
			</div>;
}
