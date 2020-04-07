import Component from './component.js';

export default class Filter extends Component {
  constructor(data) {
    super();
    this._title = data.title;
    this._id = data.id;

    this._state.isChecked = data.checked;
    this._state.isDisabled = data.disabled;

    this._onFilter = null;
    this._onFilterClick = this._onFilterClick.bind(this);
  }

  set onFilter(fn) {
    if (typeof fn === `function`) {
      this._onFilter = fn;
    }
  }

  get template() {
    return `
    <div class="filter__item">
      <input type="radio" id="${this._id}" class="filter__input visually-hidden" name="filter"       ${this._state.isChecked ? `checked` : ``} ${this._state.isDisabled ? `disabled` : ``}>
      <label for="${this._id}" class="filter__label">
        ${this._title} <span class="${this._id}-count">0</span>
      </label>
    </div>`.trim();
  }

  _onFilterClick(e) {
    typeof this._onFilter === `function` && this._onFilter(e);
  }

  setListener() {
    this._element.addEventListener(`click`, this._onFilterClick);
  }

  removeListener() {
    this._element.querySelector(`.filter__label`)
      .removeEventListener(`click`, this._onFilterClick);
  }
}
