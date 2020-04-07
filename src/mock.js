import {getRandomInt, getRandomArrayItems} from './utils.js';
import moment from 'moment';

export const filters = [
  {
    title: `ALL`,
    count: `15`,
    checked: true,
    disabled: false,
    id: `filter__all`
  },
  {
    title: `OVERDUE`,
    count: `0`,
    checked: false,
    disabled: false,
    id: `filter__overdue`
  },
  {
    title: `TODAY`,
    count: `0`,
    checked: false,
    disabled: false,
    id: `filter__today`
  },
  {
    title: `FAVORITES`,
    count: `7`,
    checked: false,
    disabled: true,
    id: `filter__favorites`
  },
  {
    title: `Repeating`,
    count: `2`,
    checked: false,
    disabled: false,
    id: `filter__repeating`
  },
  {
    title: `Tags`,
    count: `6`,
    checked: false,
    disabled: true,
    id: `filter__tags`
  },
  {
    title: `ARCHIVE`,
    count: `115`,
    checked: false,
    disabled: true,
    id: `filter__archive`
  }
];

export const taskData = () => ({
  title: [
    `Изучить английский`,
    `Сделать закупки`,
    `Уволиться из МЧС`,
    `Пойти поспать`,
    `Осознать всю боль завтрашнего раннего подъема`,
    `Уволиться из МЧС`,
    `Устроиться frontend разработчиком`,
  ][Math.floor(Math.random() * 7)],
  dueDate: getRandomInt(moment().subtract(2, `days`), moment().add(3, `days`)),
  tags: getRandomArrayItems([
    `МЧС`,
    `увольнение`,
    `frontend`,
    `js`,
    `английский`,
    `htmlacademy`,
    `es2015`
  ], 2),
  picture: `//picsum.photos/100/100?r=${Math.random()}`,
  color: [
    `black`,
    `blue`,
    `green`,
    `pink`,
    `yellow`
  ][Math.floor(Math.random() * 5)],
  repeatingDays: {
    'mo': true,
    'tu': false,
    'we': true,
    'th': false,
    'fr': false,
    'sa': true,
    'su': false,
  },
  isFavorite: false,
  isDone: false
});
