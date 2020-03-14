import {createElement} from './utils.js';

export default class Component {
  constructor() {
    if (new.target === Component) {
      throw new Error(`Can't instantiate Component, only concrete one.`);
    }

    this._element = null;
  }

  get element() {
    return this._element;
  }

  get template() {
    throw new Error(`You have to define template.`);
  }

  render() {
    this._element = createElement(this.template);
    this.setListener();

    return this._element;
  }

  unrender() {
    this.removeListener();
    this._element = null;
  }

  setListener() {}

  removeListener() {}
}
