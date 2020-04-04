import {getRandomInt, renderElements, getRandomRGBColor} from './utils.js';
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

const Blocks = [
  `statistic`,
  `result`,
  `board`
]

controlForm.addEventListener(`click`, (e) => {
  if (e.target.tagName.toLowerCase() === `input`) {
    const menuPageId = e.target.id;

    Blocks.forEach((el) => {
      document.querySelector(`.${el}`).classList.add(`visually-hidden`);
    })

    switch (menuPageId) {
      case `control__task` : {
        bordContainer.classList.remove(`visually-hidden`);
        break;
      }

      case `control__statistic` : {
        statisticContainer.classList.remove(`visually-hidden`);
        colorsStatistic.update(getStatisticData(`colors`, allTasks));
        tagsStatistic.update(getStatisticData(`tags`, allTasks));
        colorsStatistic.render();
        tagsStatistic.render();
        break;
      }
    }
  }
})

const getStatisticData = (type, tasks) => {

  const ColorsPalette = {
    pink: `#ff3cb9`,
    yellow: `#ffe125`,
    blue: `#0c5cdd`,
    black: `#000000`,
    green: `#31b55c`
  }

  const Colors = [
    `ff3cb9`,
    `ffe125`,
    `000000`,
    `0c5cdd`,
    `31b55c`
  ];

  const datasets = {
    data: [],
    backgroundColor: []
  }

  const data = {
    labels: [],
    datasets: [datasets]
  }

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
      })
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

  console.log(data)

  return data;
};

const colorsCtx = document.querySelector(`.statistic__colors`);
const tagsCtx = document.querySelector(`.statistic__tags`);

const colorsStatistic = new Statistic({
  target: colorsCtx,
  title: `DONE BY: COLORS`,
  data: getStatisticData(`colors`, allTasks)
});
const tagsStatistic = new Statistic({
  target: tagsCtx,
  title: `DONE BY: TAGS`,
  data: getStatisticData(`tags`, allTasks)
});

const statisticInput = document.querySelector(`.statistic__period-input`);

flatpickr(statisticInput, {
  mode: "range",
  dateFormat: "d.m.Y",
  locale: flatpickrRuLang,
  defaultDate: [moment().weekday(-6).format(`DD.MM.YYYY`), moment().weekday(0).format(`DD.MM.YYYY`)],
  onClose: (e) => {
    const timeStart = moment(e[0]).format(`x`);
    const timeEnd = moment(e[1]).format(`x`);

    const filteredTasks = allTasks.filter((it) => it._dueDate >= timeStart && it._dueDate <= timeEnd);


    colorsStatistic.unrender();
    tagsStatistic.unrender();
    colorsStatistic.update(getStatisticData(`colors`, filteredTasks));
    tagsStatistic.update(getStatisticData(`tags`, filteredTasks));
    colorsStatistic.render();
    tagsStatistic.render();

    console.log(filteredTasks);


    return filteredTasks;
  }
});

import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
const daysCtx = document.querySelector(`.statistic__days`);

const daysChart = new Chart(daysCtx, {
  plugins: [ChartDataLabels],
  type: `line`,
  data: getStatisticData(`line`, allTasks),
  options: {
    plugins: {
      datalabels: {
        font: {
          size: 8
        },
        color: `#ffffff`
      }
    },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero:true,
          display: false
        },
        gridLines: {
          display: false,
          drawBorder: false
        }
      }],
      xAxes: [{
        ticks: {
          fontStyle: `bold`,
          fontColor: `#000000`
        },
        gridLines: {
          display: false,
          drawBorder: false
        }
      }]
    },
    legend: {
      display: false
    },
    layout: {
      padding: {
        top: 10
      }
    },
    tooltips: {
      enabled: false
    }
  }
});
