export default function Tag({ name, color }: { name: string; color: string }) {
	console.log("tag name:", name, "color:", color);
	const bgColor = `var(--color-tag-${color})`;
	// const tagColor = `bg-tag-${color}`;
	return (
		<div
			style={{ backgroundColor: bgColor }}
			className={`rounded-sm px-1.5`}
		>
			{name}
		</div>
	);
}
