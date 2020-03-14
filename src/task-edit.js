import {createElement} from './utils.js';

const Colors = [
  `black`,
  `blue`,
  `green`,
  `pink`,
  `yellow`
];

export default class TaskEdit {
  constructor(data, taskNumber) {
    this._title = data.title;
    this._color = data.color;
    this._tags = data.tags;
    this._picture = data.picture;
    this._dueDate = data.dueDate;
    this._repeatingDays = data.repeatingDays;
    this._taskNumber = taskNumber;

    this._element = null;
    this._onSubmit = null;
  }

  _createHashtags(tags) {
    return [...tags].map((el) => `<span class="card__hashtag-inner">
      <input type="hidden" name="hashtag" value="repeat" class="card__hashtag-hidden-input">
      <button type="button" class="card__hashtag-name">#${el}</button>
      <button type="button" class="card__hashtag-delete">delete</button>
    </span>`.trim()).join(``);
  }

  _createTime(tmstp) {
    return `<input class="card__time" type="text" placeholder="${new Date(tmstp).toLocaleString(`en-US`, {hour: `numeric`, minute: `numeric`})}" name="time" value="${new Date(tmstp).toLocaleString(`en-US`, {hour: `numeric`, minute: `numeric`})}">`;
  }

  _createRepeatDays(days, number) {
    const repeatDaysMarkdown = [];

    for (const day of Object.keys(days)) {
      repeatDaysMarkdown.push(`<input class="visually-hidden card__repeat-day-input" type="checkbox"     name="repeat" value="${day}" id="repeat-${day}-${number}" ${days[day] ? `checked` : ``}>
      <label class="card__repeat-day" for="repeat-${day}-${number}">
        ${day}
      </label>`.trim());
    }

    return repeatDaysMarkdown.join(``);
  }

  _createColorPanel(colors, number) {
    const colorPanelMarkdown = [];

    colors.forEach((el) => {
      colorPanelMarkdown.push(`<input type="radio" id="color-${el}-${number}" class="card__color-input card__color-input--${el} visually-hidden" name="color" value="${el}">
      <label for="color-${el}-${number}" class="card__color card__color--${el}">${el}</label>`);
    });

    return colorPanelMarkdown.join(``);
  }

  _createDate(tmstp) {
    return `<input class="card__date" type="text" placeholder="${new Date(tmstp).getDate()} ${new Date(tmstp).toLocaleString(`ru-RU`, {month: `long`})}" name="date" value="${new Date(tmstp).getDate()} ${new Date(tmstp).toLocaleString(`ru-RU`, {month: `long`})}">`;
  }

  get template() {
    return `
    <article class="card card--${this._color} card--edit">
      <form class="card__form" method="get">
        <div class="card__inner">
          <div class="card__control">
            <button type="button" class="card__btn card__btn--edit">
            edit
            </button>

            <button type="button" class="card__btn card__btn--archive">
            archive
            </button>

            <button type="button" class="card__btn card__btn--favorites card__btn--disabled">
            favorites
            </button>
          </div>

          <div class="card__color-bar">
            <svg class="card__color-bar-wave" width="100%" height="10">
              <use xlink:href="#wave"></use>
            </svg>
          </div>

          <div class="card__textarea-wrap">
            <label>
              <textarea class="card__text" placeholder="Start typing your text here..." name="text">${this._title}</textarea>
            </label>
          </div>

          <div class="card__settings">
            <div class="card__details">
              <div class="card__dates">
                <button class="card__date-deadline-toggle" type="button">
                date: <span class="card__date-status">no</span>
                </button>

                <fieldset class="card__date-deadline">
                  <label class="card__input-deadline-wrap">
                    ${this._createDate(this._dueDate)}
                  </label>

                  <label class="card__input-deadline-wrap">
                    ${this._createTime(this._dueDate)}
                  </label>
                </fieldset>

                <button class="card__repeat-toggle" type="button">
                repeat:<span class="card__repeat-status">no</span>
                </button>

                <fieldset class="card__repeat-days">
                  <div class="card__repeat-days-inner">
                    ${this._createRepeatDays(this._repeatingDays, this._taskNumber)}
                  </div>
                </fieldset>
              </div>

              <div class="card__hashtag">
                <div class="card__hashtag-list">
                  ${this._createHashtags(this._tags)}
                </div>

                <label>
                  <input type="text" class="card__hashtag-input" name="hashtag-input" placeholder="Type new hashtag here">
                </label>
              </div>
            </div>

            <label class="card__img-wrap">
              <input type="file" class="card__img-input visually-hidden" name="img">
              <img src="${this._picture}" alt="task picture" class="card__img">
            </label>

            <div class="card__colors-inner">
              <h3 class="card__colors-title">Color</h3>
              <div class="card__colors-wrap">
                ${this._createColorPanel(Colors, this._taskNumber)}
              </div>
            </div>
          </div>

          <div class="card__status-btns">
            <button class="card__save" type="submit">save</button>
            <button class="card__delete" type="button">delete</button>
          </div>
        </div>
      </form>
    </article>`.trim();
  }

  get element() {
    return this._element;
  }

  set onSubmit(fn) {
    if (typeof fn === `function`) {
      this._onSubmit = fn;
    }
  }

  setListener() {
    this._element.querySelector(`.card__save`)
      .addEventListener(`click`, this._onSubmit.bind(this));
  }

  removeListener() {

  }

  render() {
    this._element = createElement(this.template);
    this.setListener();

    return this._element;
  }

  unrender() {
    this._element = null;
  }
}
