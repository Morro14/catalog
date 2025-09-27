export const getTagColor = (tags: Array<string>) => {
	const tagPallete = ["pink", "blue", "green", "orange"];
	const tagColors = tags.map((t, i) => {
		return tagPallete[i % tagPallete.length];
	});
	console.log("gen colors", tagColors);
	return tagColors;
};
