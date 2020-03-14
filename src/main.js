import {getRandomInt} from './utils.js';
import {filters, taskData} from './mock.js';
import createFilter from './create-filter.js';

import Task from './task.js';
import TaskEdit from './task-edit.js';

const filterContainer = document.querySelector(`.main__filter`);

filters.forEach((filter) => {
  filterContainer.insertAdjacentHTML(`beforeend`, createFilter(filter));
});

const tasksContainer = document.querySelector(`.board__tasks`);

const createTask = (countTask) => {
  const allTask = [];

  for (let i = 0; i < countTask; i++) {
    const taskDataw = taskData();
    const task = new Task(taskDataw);
    const taskEdit = new TaskEdit(taskDataw, i);

    task.onEdit = () => {
      taskEdit.render();
      tasksContainer.replaceChild(taskEdit.element, task.element);
      task.unrender();
    };

    taskEdit.onSubmit = () => {
      task.render();
      tasksContainer.replaceChild(task.element, taskEdit.element);
      taskEdit.unrender();
    };

    allTask.push(task);
  }

  const fragment = document.createDocumentFragment();
  for (const task of allTask) {
    fragment.appendChild(task.render());
  }

  return fragment;
};

tasksContainer.appendChild(createTask(7));

const filtersLabels = document.querySelectorAll(`.filter__label`);

filtersLabels.forEach((filterLabel) => {
  filterLabel.addEventListener(`click`, () => {
    tasksContainer.innerHTML = ``;
    createTask(getRandomInt(1, 8));
  });
});
