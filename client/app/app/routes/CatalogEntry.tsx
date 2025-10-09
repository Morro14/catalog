import { Link, useSearchParams } from "react-router";
import Tag from "~/components/catalog/Tag";
import { getTagColor } from "~/components/catalog/tagColors";
import { useFetchV3 } from "~/utils/fetchHook";

import Fallback from "~/components/Fallback";

const ENTRY_URL = "api-v1/catalog/entry";

export default function CatalogEntry() {
	const [params, setParams] = useSearchParams();
	const entryId = params.get("entry");

	const fetchedResults = useFetchV3(
		ENTRY_URL + "/" + entryId,
		Boolean(entryId)
	);

	const entryData =
		fetchedResults.fetchedData && fetchedResults.fetchedData.status === 200 ?
			fetchedResults.fetchedData.data
		:	undefined;

	const loading = fetchedResults?.loading;

	const tagColors = entryData ? getTagColor(entryData.tags) : undefined;
	return (
		!fetchedResults.validParams ?
			<div>
				<div className="bg-gray-4 h-[26px] ">
					<div className="font-sans text-sm ml-3"></div>
				</div>
				<div className="text-center">
					<h5 className="text-gray-400 font-mono">
						Choose a folder or an entry to display
					</h5>
				</div>
			</div>
		: loading ?
			<div>
				<div className="bg-gray-4 h-[26px] ">
					<div className="font-sans text-sm ml-3"></div>
				</div>
				<div className="text-center">
					<h5 className="text-gray-400 font-mono">Loading...</h5>
				</div>
			</div>
		: !entryData ?
			<div>
				<div className="bg-gray-4 h-[26px] ">
					<div className="font-sans text-sm ml-3"></div>
				</div>

				<Fallback
					message={
						fetchedResults.fetchedData.status === 404 ?
							"Data not found."
						:	"Something went wrong."
					}
				></Fallback>
			</div>
		:	<div>
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
