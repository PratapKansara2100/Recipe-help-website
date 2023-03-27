import icons from "url:../../img/icons.svg";

export default class View {
  _data;

  _clear(element = "") {
    if (element) {
      element.value = "";
    } else this._parentElement.innerHTML = "";
  }

  render(data, elementToClear = "") {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    this._clear(elementToClear);
    this._parentElement.insertAdjacentHTML("afterbegin", this._generateHtml());
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateHtml();

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll("*"));
    const curElements = Array.from(this._parentElement.querySelectorAll("*"));

    newElements.forEach((newEl, i) => {
      let curEl = curElements[i];
      // updating text content of elements that change due to change in serving
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ""
      ) {
        curEl.textContent = newEl.textContent;
      }

      // updating attributes of elements
      if (!newEl.isEqualNode(curEl))
        Array.from(newEl.attributes).forEach((attr) =>
          curEl.setAttribute(attr.name, attr.value)
        );
    });
  }

  renderSpinner() {
    const html = `
          <div class="spinner">
            <svg>
              <use href="${icons}#icon-loader"></use>
            </svg>
          </div> 
          `;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", html);
  }

  renderError(errMessage = this._errMessage) {
    const html = `
          <div class="error">
          <div>
          <svg>
          <use href="${icons}#icon-alert-triangle"></use>
          </svg>
          </div>
          <p>${errMessage}</p>
          </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", html);
  }

  renderMessage(message = this._message) {
    const html = `
          <div class="message">
          <div>
          <svg>
          <use href="${icons}#icon-smile"></use>
          </svg>
          </div>
          <p>${message}</p>
          </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", html);
  }
}
