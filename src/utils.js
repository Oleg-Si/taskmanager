export const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min)) + min;

export const createElement = (template) => {
  const element = document.createElement(`template`);
  element.innerHTML = template;

  return element.content.firstChild;
};
