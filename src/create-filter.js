export default (filterInfo) => `<input
type="radio"
id="${filterInfo.id}"
class="filter__input visually-hidden"
name="filter"
${filterInfo.checked ? `checked` : ``}
${filterInfo.disabled ? `disabled` : ``}
>
<label for="${filterInfo.id}" class="filter__label">
${filterInfo.title} <span class="${filterInfo.id}-count">${filterInfo.count}</span>
</label>`;
