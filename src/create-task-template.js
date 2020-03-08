const COLORS = [
  `black`,
  `blue`,
  `green`,
  `pink`,
  `yellow`
];

const createHashtags = (tags) => [...tags].map((el) => `<span class="card__hashtag-inner">
  <input type="hidden" name="hashtag" value="repeat" class="card__hashtag-hidden-input">
  <button type="button" class="card__hashtag-name">#${el}</button>
  <button type="button" class="card__hashtag-delete">delete</button>
</span>`).join('');

const createTime = (tmstp) => `<input class="card__time" type="text" placeholder="${new Date(tmstp).toLocaleString('en-US', {hour: 'numeric', minute: 'numeric'})}" name="time" value="${new Date(tmstp).toLocaleString('en-US', {hour: 'numeric', minute: 'numeric'})}">`;

const createRepeatDays = (days, number) => {
  const repeatDaysMarkdown = [];

  for (const day in days) {
    repeatDaysMarkdown.push(`<input class="visually-hidden card__repeat-day-input" type="checkbox"         name="repeat" value="${day}" id="repeat-${day}-${number}" ${days[day] ? 'checked' : ''}>
      <label class="card__repeat-day" for="repeat-${day}-${number}">
        ${day}
      </label>`);
  }

  return repeatDaysMarkdown.join('');
};

const createColorPanel = (colors, number) => {
  const colorPanelMarkdown = [];

  colors.forEach((el) => {
    colorPanelMarkdown.push(`<input type="radio" id="color-${el}-${number}" class="card__color-input card__color-input--${el} visually-hidden" name="color" value="${el}">
    <label for="color-${el}-${number}" class="card__color card__color--${el}">${el}</label>`);
  });

  return colorPanelMarkdown.join('');
};

const createDate = (tmstp) => {
  const date = new Date(tmstp);

  return `<input class="card__date" type="text" placeholder="${date.getDate()} ${date.toLocaleString('ru-RU', {month: 'long'})}" name="date" value="${date.getDate()} ${date.toLocaleString('ru-RU', {month: 'long'})}">`;
};

export default (task, taskNumber) => `<article class="card card--${task.color}">
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
          <textarea class="card__text" placeholder="Start typing your text here..." name="text">${task.title}</textarea>
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
                ${createDate(task.dueDate)}
              </label>

              <label class="card__input-deadline-wrap">
                ${createTime(task.dueDate)}
              </label>
            </fieldset>

            <button class="card__repeat-toggle" type="button">
            repeat:<span class="card__repeat-status">no</span>
            </button>

            <fieldset class="card__repeat-days">
              <div class="card__repeat-days-inner">
                ${createRepeatDays(task.repeatingDays, taskNumber)}
              </div>
            </fieldset>
          </div>

          <div class="card__hashtag">
            <div class="card__hashtag-list">
              ${createHashtags(task.tags)}
            </div>

            <label>
              <input type="text" class="card__hashtag-input" name="hashtag-input" placeholder="Type new hashtag here">
            </label>
          </div>
        </div>

        <label class="card__img-wrap">
          <input type="file" class="card__img-input visually-hidden" name="img">
          <img src="${task.picture}" alt="task picture" class="card__img">
        </label>

        <div class="card__colors-inner">
          <h3 class="card__colors-title">Color</h3>
          <div class="card__colors-wrap">
            ${createColorPanel(COLORS, taskNumber)}
          </div>
        </div>
      </div>

      <div class="card__status-btns">
        <button class="card__save" type="submit">save</button>
        <button class="card__delete" type="button">delete</button>
      </div>
    </div>
  </form>
</article>`;
