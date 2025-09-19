export const getTagColor = (tags: Array<string>, tagPallete: Array<string>) => {
	const tagsNum = tags.length;
	let prevColor = "";
	console.log("gen colors");
	const tagColors = tags.map(() => {
		const currentPallete = tagPallete.filter((color) => color !== prevColor);
		const currentPalleteLen = prevColor === "" ? tagsNum : tagsNum - 1;
		const randInt = Math.floor(Math.random() * currentPalleteLen);
		const randColor = currentPallete[randInt];
		prevColor = randColor;
		return randColor;
	});
	return tagColors;
};
