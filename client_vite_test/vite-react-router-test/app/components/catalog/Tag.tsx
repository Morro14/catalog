export default function Tag({ name, color }: { name: string; color: string }) {
	// console.log("tag name", name);
	// const bgColor = `bg-tag-${color}`;
	return (
		<div
			style={{ backgroundColor: `var(--color-tag-${color})` }}
			className="rounded-b-sm px-1.5"
		>
			{name}
			{/* <div className="text-tag-green">test</div> */}
		</div>
	);
}
