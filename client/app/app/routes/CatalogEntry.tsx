import { Link, useSearchParams } from "react-router";
import Tag from "~/components/catalog/Tag";
import { getTagColor } from "~/components/catalog/tagColors";
import { useFetchV3 } from "~/utils/fetchHook";

import Fallback from "~/components/Fallback";

const ENTRY_URL = "api-v1/catalog/entry";

export default function CatalogEntry() {
	const [params, setParams] = useSearchParams();
	const entryId = params.get("entry");
	if (!entryId) {
		return (
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
		);
	}
	const fetchedResults = useFetchV3(ENTRY_URL + "/" + entryId);

	const fetchedDataCheck =
		fetchedResults && fetchedResults.fetchedData ? true : false;

	const entryData =
		fetchedDataCheck && fetchedResults.fetchedData.status === 200 ?
			fetchedResults.fetchedData.data
		:	undefined;

	const loading = fetchedResults?.loading;
	if (loading) {
		return (
			<div className="grow">
				<div className="bg-gray-4 h-[26px] ">
					<div className="font-sans text-sm ml-3"></div>
				</div>
				<div className="text-center">
					<h5 className="text-gray-400 font-mono">Loading...</h5>
				</div>
			</div>
		);
	}
	const tagColors = entryData ? getTagColor(entryData.tags) : undefined;
	console.log("fetch results", fetchedResults);
	console.log(loading);
	return (
		!fetchedResults ?
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
		: fetchedResults.fetchedData.status !== 200 ?
			<div className="grow">
				<div className="bg-gray-4 h-[26px] ">
					<div className="font-sans text-sm ml-3"></div>
				</div>
				<div className="text-center">
					<h5 className="text-gray-400 font-mono">
						<Fallback
							message={
								Math.floor(fetchedResults.fetchedData.status / 100) === 5 ?
									"Could not fetch the data."
								:	"Something went wrong."
							}
						></Fallback>
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
			</div>
	);
}
