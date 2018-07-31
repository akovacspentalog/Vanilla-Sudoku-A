const generateTitleText = () => {
  const contentTag = document.createElement('div');
  const titleTag = document.createElement('span');
  titleTag.innerHTML = 'SUDOKU';
  contentTag.appendChild(titleTag);
  return contentTag;
};

const generateTitlePicture = () => {
  const contentTag = document.createElement('div');
  const imgTag = document.createElement('img');
  imgTag.classList.add('titlePicture');
  imgTag.setAttribute('src', 'images/VanillaJs.jpg');
  contentTag.appendChild(imgTag);
  return contentTag;
};

const generateTitle = (titleDiv) => {
  if (!titleDiv) {
    return;
  }
  titleDiv.classList.add('titleZone');
  titleDiv.appendChild(generateTitleText());
  titleDiv.appendChild(generateTitlePicture());
};

export default generateTitle;
