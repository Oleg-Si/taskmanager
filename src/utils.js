export const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min)) + min;

export const createElement = (template) => {
  const element = document.createElement(`template`);
  element.innerHTML = template;

  return element.content.firstChild;
};

export const renderElements = (elements, container) => {
  const fragment = document.createDocumentFragment();

  if (Array.isArray(elements)) {
    for (const element of elements) {
      fragment.appendChild(element.render());
    }
  } else {
    fragment.appendChild(elements.render());
  }

  container.appendChild(fragment);
};

export const getRandomArrayItems = (array, count) => {
  const newArray = [];
  const copyArray = array.slice(0, array.length);

  for (let i = 0; i < count; i++) {
    const el = copyArray.splice(getRandomInt(0, copyArray.length), 1);
    newArray.push(el[0]);
  }

  return newArray;
}

export const getRandomRGBColor = () => `rgb(${getRandomInt(1, 256)},${getRandomInt(1, 256)},${getRandomInt(1, 256)})`;
