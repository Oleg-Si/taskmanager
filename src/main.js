import {renderElements, getRandomRGBColor} from './utils.js';
import {filters, taskData} from './mock.js';
import moment from 'moment';
import flatpickr from 'flatpickr';
import {Russian as flatpickrRuLang} from 'flatpickr/dist/l10n/ru.js';

import Task from './task.js';
import TaskEdit from './task-edit.js';
import Filter from './filter.js';
import Statistic from './statistic.js';

const createFilter = () => {
  const allFilters = [];

  filters.forEach((it) => {
    const filter = new Filter(it);

    filter.onFilter = (e) => {
      const filterName = e.currentTarget.querySelector(`.filter__input`).getAttribute(`id`);
      const filteredTasks = filterTasks(filterName);

      tasksContainer.innerHTML = ``;
      renderElements(filteredTasks, tasksContainer);
    };

    allFilters.push(filter);
  });

  return allFilters;
};

const createTask = (countTask) => {
  const allTask = [];

  for (let i = 0; i < countTask; i++) {
    let data = taskData();
    const task = new Task(data);
    const taskEdit = new TaskEdit(data, i);

    task.onEdit = () => {
      taskEdit.render();
      tasksContainer.replaceChild(taskEdit.element, task.element);
      task.unrender();
    };

    taskEdit.onSubmit = (newData) => {
      data = Object.assign(newData);

      task.update(data);
      task.render();
      tasksContainer.replaceChild(task.element, taskEdit.element);
      taskEdit.unrender();
    };

    taskEdit.onDelete = () => {
      const index = allTask.findIndex((it) => it === task);
      allTask.splice(index, 1);
      tasksContainer.removeChild(taskEdit.element);
      taskEdit.unrender();
    };

    allTask.push(task);
  }

  return allTask;
};

const filterTasks = (name) => {
  switch (name) {
    case `filter__all`: {
      return allTasks;
    }

    case `filter__overdue`: {
      return allTasks.filter((it) => it._dueDate < Date.now());
    }

    case `filter__today`: {
      return allTasks.filter((it) => it._dueDate > moment().startOf(`day`) && it._dueDate < moment().endOf(`day`));
    }

    case `filter__repeating`: {
      return allTasks.filter((it) => it._isRepeated());
    }
  }
};

const allTasks = createTask(11);
const allFilters = createFilter();

const filterContainer = document.querySelector(`.main__filter`);
const tasksContainer = document.querySelector(`.board__tasks`);

renderElements(allFilters, filterContainer);
renderElements(allTasks, tasksContainer);

const controlForm = document.querySelector(`.control__form`);
const bordContainer = document.querySelector(`.board`);
const statisticContainer = document.querySelector(`.statistic`);
const statisticInput = document.querySelector(`.statistic__period-input`);

const weekStart = moment().weekday(1);
const weekEnd = moment().weekday(7);

const filterTasksByDay = (timeStart, timeEnd) => allTasks.filter((it) => it._dueDate >= timeStart && it._dueDate <= timeEnd);

flatpickr(statisticInput, {
  mode: `range`,
  dateFormat: `d.m.Y`,
  locale: flatpickrRuLang,
  defaultDate: [weekStart.format(`DD.MM.YYYY`), weekEnd.format(`DD.MM.YYYY`)],
  onClose: (e) => {
    colorsStatistic.unrender();
    tagsStatistic.unrender();
    daysStatistic.unrender();

    const timeStart = moment(e[0]).format(`x`);
    const timeEnd = moment(e[1]).format(`x`);

    const filteredTasks = filterTasksByDay(timeStart, timeEnd);

    colorsStatistic.update(getStatisticData(`colors`, filteredTasks));
    tagsStatistic.update(getStatisticData(`tags`, filteredTasks));
    daysStatistic.update(getStatisticData(`line`, filteredTasks));

    colorsStatistic.render();
    tagsStatistic.render();
    daysStatistic.render();
  }
});

const Blocks = [
  `statistic`,
  `result`,
  `board`
];

controlForm.addEventListener(`click`, (e) => {
  if (e.target.tagName.toLowerCase() === `input`) {
    const menuPageId = e.target.id;

    Blocks.forEach((el) => {
      document.querySelector(`.${el}`).classList.add(`visually-hidden`);
    });

    switch (menuPageId) {
      case `control__task` : {
        bordContainer.classList.remove(`visually-hidden`);
        break;
      }

      case `control__statistic` : {
        statisticContainer.classList.remove(`visually-hidden`);

        const filteredTasks = filterTasksByDay(weekStart.format(`x`), weekEnd.format(`x`));

        colorsStatistic.update(getStatisticData(`colors`, filteredTasks));
        tagsStatistic.update(getStatisticData(`tags`, filteredTasks));
        daysStatistic.update(getStatisticData(`line`, filteredTasks));

        colorsStatistic.render();
        tagsStatistic.render();
        daysStatistic.render();
        break;
      }
    }
  }
});

const getStatisticData = (type, tasks) => {

  const ColorsPalette = {
    pink: `#ff3cb9`,
    yellow: `#ffe125`,
    blue: `#0c5cdd`,
    black: `#000000`,
    green: `#31b55c`
  };

  const datasets = {
    data: [],
    backgroundColor: []
  };

  const data = {
    labels: [],
    datasets: [datasets]
  };

  const dataBox = new Map();

  if (type === `colors`) {
    for (const task of tasks) {
      if (dataBox.has(task._color)) {
        let count = dataBox.get(task._color);
        dataBox.set(task._color, ++count);
      } else {
        dataBox.set(task._color, 1);
      }
    }

    for (const item of dataBox) {
      data.labels.push(item[0]);
      datasets.data.push(item[1]);
      datasets.backgroundColor.push(ColorsPalette[item[0]]);
    }
  }

  if (type === `tags`) {
    for (const task of tasks) {
      const tags = task._tags;

      tags.forEach((el) => {
        if (dataBox.has(el)) {
          let count = dataBox.get(el);
          dataBox.set(el, ++count);
        } else {
          dataBox.set(el, 1);
        }
      });
    }

    for (const item of dataBox) {
      data.labels.push(item[0]);
      datasets.data.push(item[1]);
      datasets.backgroundColor.push(getRandomRGBColor());
    }
  }

  if (type === `line`) {
    for (const task of tasks) {
      const date = moment(task._dueDate).format(`DD MMM`);

      if (dataBox.has(date)) {
        let count = dataBox.get(date);
        dataBox.set(date, ++count);
      } else {
        dataBox.set(date, 1);
      }
    }

    for (const item of dataBox) {
      data.labels.push(item[0]);
      datasets.data.push(item[1]);
      datasets.backgroundColor = `transparent`;
      datasets.borderColor = `#000000`;
      datasets.borderWidth = 1;
      datasets.lineTension = 0;
      datasets.pointRadius = 8;
      datasets.pointHoverRadius = 8;
      datasets.pointBackgroundColor = `#000000`;
    }
  }

  return data;
};

const colorsCtx = document.querySelector(`.statistic__colors`);
const tagsCtx = document.querySelector(`.statistic__tags`);
const daysCtx = document.querySelector(`.statistic__days`);

const colorsStatistic = new Statistic({
  target: colorsCtx,
  title: `DONE BY: COLORS`,
  type: `pie`,
  data: getStatisticData(`colors`, allTasks)
});
const tagsStatistic = new Statistic({
  target: tagsCtx,
  title: `DONE BY: TAGS`,
  type: `pie`,
  data: getStatisticData(`tags`, allTasks)
});
const daysStatistic = new Statistic({
  target: daysCtx,
  type: `line`,
  data: getStatisticData(`line`, allTasks)
});
