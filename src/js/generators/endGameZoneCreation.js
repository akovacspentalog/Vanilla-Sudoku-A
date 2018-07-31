const createNewLine = () => document.createElement('br');

const generateEndGameZone = (endGameZoneDiv) => {
  if (!endGameZoneDiv) {
    return;
  }
  endGameZoneDiv.classList.add('endGameImgDiv');

  const imgTag = document.createElement('img');
  imgTag.setAttribute('src', 'images/Winner.jpg');
  endGameZoneDiv.appendChild(createNewLine());
  endGameZoneDiv.appendChild(imgTag);
};

export default generateEndGameZone;
