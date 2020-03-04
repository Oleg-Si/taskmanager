import {getRandomInt} from './utils.js';
import {filters} from './mock.js';
import createFilter from './create-filter.js';
import createTaskTemplate from './create-task-template.js';

const filterContainer = document.querySelector('.main__filter');

filters.forEach((filter) => {
  filterContainer.insertAdjacentHTML('beforeend', createFilter(filter));
});

const taskContainer = document.querySelector('.board__tasks');

const createTask = (countTask) => {
  for (let i = 0; i < countTask; i++) {
    taskContainer.insertAdjacentHTML('beforeend', createTaskTemplate());
  }
};

createTask(7);

const filtersLabels = document.querySelectorAll('.filter__label');

filtersLabels.forEach((filterLabel) => {
  filterLabel.addEventListener('click', () => {
    taskContainer.innerHTML = '';
    createTask(getRandomInt(1, 8));
  });
});
