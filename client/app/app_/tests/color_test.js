const getTagColor = (tags, tagPallete) => {
  const tagsNum = tags.length;
  let prevColor = "";

  const tagColors = tags.map(() => {
    const currentPallete = tagPallete.filter((color) => color !== prevColor);
    const currentPalleteLen = prevColor === "" ? tagsNum : (tagsNum - 1)
    const randInt = Math.floor(Math.random() * (currentPalleteLen))
    const randColor = currentPallete[randInt];
    prevColor = randColor;
    return randColor;
  });
  return tagColors;
};
for (let i = 0; i < 10; i++) {
  console.log(getTagColor(["cat", "dog"], ["green", "red"]));

}