import Component from './component.js';

export default class Task extends Component {
  constructor(data) {
    super();
    this._title = data.title;
    this._color = data.color;
    this._tags = data.tags;
    this._picture = data.picture;
    this._dueDate = data.dueDate;
    this._repeatingDays = data.repeatingDays;

    this._onEdit = null;
    this._state.isDate = true;
    this._state.isRepeated = this._isRepeated();

    this._onEditButtonClick = this._onEditButtonClick.bind(this);
  }

  _createDate(tmstp) {
    return `
    <fieldset class="card__date-deadline" ${this._state.isDate ? '' : 'disabled'}>
      <label class="card__input-deadline-wrap">
        <input class="card__date" type="text" placeholder="${new Date(tmstp).getDate()} ${new Date(tmstp).toLocaleString(`ru-RU`, {month: `long`})}" name="date" value="${new Date(tmstp).getDate()} ${new Date(tmstp).toLocaleString(`ru-RU`, {month: `long`})}" disabled>
      </label>

      <label class="card__input-deadline-wrap">
        <input class="card__time" type="text" placeholder="${new Date(tmstp).toLocaleString(`en-US`, {hour: `numeric`, minute: `numeric`})}" name="time" value="${new Date(tmstp).toLocaleString(`en-US`, {hour: `numeric`, minute: `numeric`})}" disabled>
      </label>
    </fieldset>`.trim();
  }

  _createHashtags(tags) {
    return [...tags].map((el) => `<span class="card__hashtag-inner">
      <button type="button" class="card__hashtag-name">#${el}</button>
    </span>`).join(``);
  }

  _isRepeated() {
    return Object.entries(this._repeatingDays).some((el) => el[1] === true);
  }

  get template() {
    return `
    <article class="card card--${this._color} ${this._isRepeated() ? `card--repeat` : ``}">
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
              <textarea class="card__text" placeholder="Start typing your text here..." name="text" disabled>${this._title}</textarea>
            </label>
          </div>

          <div class="card__settings">
            <div class="card__details">
              <div class="card__dates">
                ${this._createDate(this._dueDate)}
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
          </div>
        </div>
      </form>
    </article>`.trim();
  }

  set onEdit(fn) {
    if (typeof fn === `function`) {
      this._onEdit = fn;
    }
  }

  _onEditButtonClick() {
    typeof this._onEdit === `function` && this._onEdit();
  }

  setListener() {
    this._element.querySelector(`.card__btn--edit`)
      .addEventListener(`click`, this._onEditButtonClick);
  }

  removeListener() {
    this._element.querySelector(`.card__btn--edit`)
      .removeEventListener(`click`, this._onEditButtonClick);
  }

  update(data) {
    console.log(data);
    this._title = data.title;
    this._color = data.color;
    this._tags = data.tags;
    this._dueDate = data.dueDate;
    this._repeatingDays = data.repeatingDays;
  }
}
