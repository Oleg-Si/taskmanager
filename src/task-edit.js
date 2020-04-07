import Component from './component.js';
import getDefaultTask from './get-default-task.js';
import flatpickr from 'flatpickr';
import {Russian as flatpickrRuLang} from 'flatpickr/dist/l10n/ru.js';
import moment from 'moment';

const Colors = [
  `black`,
  `blue`,
  `green`,
  `pink`,
  `yellow`
];

export default class TaskEdit extends Component {
  constructor(data, taskNumber) {
    super();
    this._title = data.title;
    this._color = data.color;
    this._tags = data.tags;
    this._picture = data.picture;
    this._dueDate = data.dueDate;
    this._repeatingDays = data.repeatingDays;
    this._taskNumber = taskNumber;

    this._onSubmit = null;
    this._onDelete = null;
    this._state.isDate = true;
    this._state.isRepeated = this._isRepeated();

    this._onSubmitButtonClick = this._onSubmitButtonClick.bind(this);
    this._onDeleteButtonClick = this._onDeleteButtonClick.bind(this);
    this._onChangeDate = this._onChangeDate.bind(this);
    this._onChangeRepeated = this._onChangeRepeated.bind(this);
    this._onChangeColor = this._onChangeColor.bind(this);
    this._onClickTagsList = this._onClickTagsList.bind(this);
    this._onKeydownTagsInput = this._onKeydownTagsInput.bind(this);
  }

  _createHashtags(tags) {
    return [...tags].map((el) => `<span class="card__hashtag-inner">
      <input type="hidden" name="hashtag" value="${el}" class="card__hashtag-hidden-input">
      <button type="button" class="card__hashtag-name">#${el}</button>
      <button type="button" class="card__hashtag-delete">delete</button>
    </span>`.trim()).join(``);
  }

  _createDate(tmstp) {
    return `
    <fieldset class="card__date-deadline" ${this._state.isDate ? `` : `disabled`}>
      <label class="card__input-deadline-wrap">
        <input class="card__date" type="text" placeholder="${new Date(tmstp).getDate()} ${new Date(tmstp).toLocaleString(`ru-RU`, {month: `long`})}" name="date" value="${new Date(tmstp).getDate()} ${new Date(tmstp).toLocaleString(`ru-RU`, {month: `long`})}" disabled>
      </label>

      <label class="card__input-deadline-wrap">
        <input class="card__time" type="text" placeholder="${new Date(tmstp).toLocaleString(`en-US`, {hour: `numeric`, minute: `numeric`})}" name="time" value="${new Date(tmstp).toLocaleString(`en-US`, {hour: `numeric`, minute: `numeric`})}" disabled>
      </label>
    </fieldset>`.trim();
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
      colorPanelMarkdown.push(`<input type="radio" id="color-${el}-${number}" class="card__color-input card__color-input--${el} visually-hidden" name="color" value="${el}" ${el === this._color ? `checked` : ``}>
      <label for="color-${el}-${number}" class="card__color card__color--${el}">${el}</label>`);
    });

    return colorPanelMarkdown.join(``);
  }

  _isRepeated() {
    return Object.entries(this._repeatingDays).some((el) => el[1] === true);
  }

  static createMapper(entry) {
    return {
      text: (value) => entry.title = value,
      hashtag: (value) => entry.tags.add(value),
      color: (value) => entry.color = value,
      dueDate: (value) => {
        moment.locale(`ru`);
        entry.dueDate = moment(value, `D MMM h:m a`).valueOf();
      },
      repeat: (value) => entry.repeatingDays[value] = true
    };
  }

  _transformData(formData) {
    const entry = getDefaultTask();
    const mapper = TaskEdit.createMapper(entry);
    let dueDateFlag = 0;
    let dueDate = ``;

    for (const pair of formData.entries()) {
      let [key, value] = pair;

      if (key === `date` || key === `time`) {
        dueDate += ` ${value}`;
        dueDateFlag++;

        if (dueDateFlag === 2) {
          key = `dueDate`;
          value = dueDate.trim();
        }
      }

      if (mapper[key]) {
        mapper[key](value);
      }
    }

    return entry;
  }

  get template() {
    return `
    <article class="card card--${this._color} card--edit ${this._state.isRepeated ? `card--repeat` : ``}">
      <form class="card__form" method="get">
        <div class="card__inner">
          <div class="card__control">
            <button type="button" class="card__btn card__btn--edit card__btn--disabled">
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
                  date: <span class="card__date-status">${this._state.isDate ? `yes` : `no`}</span>
                </button>

                ${this._createDate(this._dueDate)}

                <button class="card__repeat-toggle" type="button">
                  repeat: <span class="card__repeat-status">${this._state.isRepeated ? `yes` : `no`}</span>
                </button>

                <fieldset class="card__repeat-days" ${this._state.isRepeated ? `` : `disabled`}>
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

  set onSubmit(fn) {
    if (typeof fn === `function`) {
      this._onSubmit = fn;
    }
  }

  set onDelete(fn) {
    if (typeof fn === `function`) {
      this._onDelete = fn;
    }
  }

  _onSubmitButtonClick(e) {
    e.preventDefault();

    const form = this._element.querySelector(`.card__form`);
    const formData = new FormData(form);

    const newData = this._transformData(formData);

    this.update(newData);
    this._state.isRepeated = this._isRepeated();

    typeof this._onSubmit === `function` && this._onSubmit(newData);
  }

  _onDeleteButtonClick(e) {
    e.preventDefault();
    typeof this._onDelete === `function` && this._onDelete();
  }

  _partialUpdate() {
    this.removeListener();

    const wrap = document.createElement(`div`);
    wrap.innerHTML = this.template;
    this._element.innerHTML = ``;
    this._element.appendChild(wrap.querySelector(`.card__form`));

    this.setListener();
  }

  _onChangeDate() {
    this._state.isDate = !this._state.isDate;
    this._partialUpdate();
  }

  _onChangeRepeated() {
    if (this._state.isRepeated === true) {
      this._element.classList.remove(`card--repeat`);
      for (const pair of Object.entries(this._repeatingDays)) {
        const [key] = pair;

        this._repeatingDays[key] = false;
      }
    } else {
      this._element.classList.add(`card--repeat`);
    }

    this._state.isRepeated = !this._state.isRepeated;
    this._partialUpdate();
  }

  _onChangeColor(e) {
    if (e.target.tagName.toLowerCase() === `input`) {
      this._color = e.target.value;

      Colors.forEach((el) => {
        this._element.classList.remove(`card--${el}`);
      });

      this._element.classList.add(`card--${this._color}`);
    }
  }

  _onClickTagsList(e) {
    const target = e.target;
    const input = this._element.querySelector(`.card__hashtag-input`);

    if (target.classList.contains(`card__hashtag-delete`)) {
      target.parentElement.remove();
    }

    if (target.classList.contains(`card__hashtag-name`)) {
      const element = e.target;
      const elementInput = element.parentElement.querySelector(`.card__hashtag-hidden-input`);

      element.classList.add(`edit`);
      input.classList.add(`edit`);
      const oldText = element.textContent;

      input.value = oldText;
      input.focus();

      input.addEventListener(`focusout`, () => {
        if (element.classList.contains(`edit`)) {
          const newText = input.value;

          element.textContent = newText;
          elementInput.value = newText;
          element.classList.remove(`edit`);

          input.value = ``;
          input.classList.remove(`edit`);
        }
      });
    }
  }

  _onKeydownTagsInput(e) {
    if (e.keyCode === 13) {
      e.preventDefault();

      const container = this._element.querySelector(`.card__hashtag-list`);
      const value = e.target.value;
      e.target.value = ``;

      const newTag = `
      <span class="card__hashtag-inner">
        <input type="hidden" name="hashtag" value="${value}" class="card__hashtag-hidden-input">
        <button type="button" class="card__hashtag-name">#${value}</button>
        <button type="button" class="card__hashtag-delete">delete</button>
      </span>`.trim();

      container.insertAdjacentHTML(`beforeend`, newTag);

    }
  }

  _setFlatpickr() {
    const cartDate = this._element.querySelector(`.card__date`);
    const cartTime = this._element.querySelector(`.card__time`);

    flatpickr(cartDate, {
      locale: flatpickrRuLang,
      dateFormat: `j F`
    });

    flatpickr(cartTime, {
      enableTime: true,
      noCalendar: true,
      dateFormat: `h:i K`,
    });
  }

  setListener() {
    this._element.querySelector(`.card__save`).addEventListener(`click`, this._onSubmitButtonClick);
    this._element.querySelector(`.card__delete`).addEventListener(`click`, this._onDeleteButtonClick);
    this._element.querySelector(`.card__date-deadline-toggle`).addEventListener(`click`, this._onChangeDate);
    this._element.querySelector(`.card__repeat-toggle`).addEventListener(`click`, this._onChangeRepeated);
    this._element.querySelector(`.card__colors-wrap`).addEventListener(`click`, this._onChangeColor);
    this._element.querySelector(`.card__hashtag-list`).addEventListener(`click`, this._onClickTagsList);
    this._element.querySelector(`.card__hashtag-input`).addEventListener(`keydown`, this._onKeydownTagsInput);

    this._setFlatpickr();
  }

  removeListener() {
    this._element.querySelector(`.card__save`).removeEventListener(`click`, this._onSubmitButtonClick);
    this._element.querySelector(`.card__delete`).removeEventListener(`click`, this._onDeleteButtonClick);
    this._element.querySelector(`.card__date-deadline-toggle`).removeEventListener(`click`, this._onChangeDate);
    this._element.querySelector(`.card__repeat-toggle`).removeEventListener(`click`, this._onChangeRepeated);
    this._element.querySelector(`.card__colors-wrap`).removeEventListener(`click`, this._onChangeColor);
    this._element.querySelector(`.card__hashtag-list`).removeEventListener(`click`, this._onClickTagsList);
    this._element.querySelector(`.card__hashtag-input`).removeEventListener(`keydown`, this._onKeydownTagsInput);
  }

  update(data) {
    this._title = data.title;
    this._color = data.color;
    this._tags = data.tags;
    this._dueDate = data.dueDate;
    this._repeatingDays = data.repeatingDays;
  }
}
