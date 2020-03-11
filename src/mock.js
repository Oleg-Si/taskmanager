export const filters = [
  {
    title: 'ALL',
    count: '15',
    checked: true,
    disabled: false,
    id: 'filter__all'
  },
  {
    title: 'OVERDUE',
    count: '0',
    checked: false,
    disabled: true,
    id: 'filter__overdue'
  },
  {
    title: 'TODAY',
    count: '0',
    checked: false,
    disabled: true,
    id: 'filter__today'
  },
  {
    title: 'FAVORITES',
    count: '7',
    checked: false,
    disabled: false,
    id: 'filter__favorites'
  },
  {
    title: 'Repeating',
    count: '2',
    checked: false,
    disabled: false,
    id: 'filter__repeating'
  },
  {
    title: 'Tags',
    count: '6',
    checked: false,
    disabled: false,
    id: 'filter__tags'
  },
  {
    title: 'ARCHIVE',
    count: '115',
    checked: false,
    disabled: false,
    id: 'filter__archive'
  }
];

export const taskData = () => ({
  title: [
    `Изучить английский`,
    `Сделать закупки`,
    `Уволиться из МЧС`,
    `Обнять жену`,
    `Осознать всю боль завтрвшнего раннего подъема`,
    `Уволиться из МЧС`,
    `Устроиться frontend разработчиком`,
  ][Math.floor(Math.random() * 7)],
  dueDate: Date.now() + 1 + Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000,
  tags: new Set([
    `МЧС`,
    `увольнение`,
    `frontend`,
    `английский`
  ]),
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
