import View from "./View.js";
import icons from "url:../../img/icons.svg";

class PaginationView extends View {
  _parentElement = document.querySelector(".pagination");

  addEventHandlerPagination(HandlerFunc) {
    this._parentElement.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn--inline");
      if (!btn) return;

      const goToPage = +btn.dataset.goto;
      HandlerFunc(goToPage);
    });
  }
  _generateHtml() {
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    // page 1, there are other pages
    if (this._data.currentPage === 1 && numPages > 1) {
      return `
        <button data-goto="${
          this._data.currentPage + 1
        }" class="btn--inline pagination__btn--next ">
            <span> page ${this._data.currentPage + 1}</span>
            <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>`;
    }
    // page 1, no other  pages
    if (this._data.currentPage === 1 && numPages === 1) {
      return;
    }

    // last page
    if (this._data.currentPage === numPages && numPages > 1) {
      return `
        <button data-goto="${
          this._data.currentPage - 1
        }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>page ${this._data.currentPage - 1}</span>
        </button>`;
    }
    // other page
    if (this._data.currentPage < numPages) {
      return `
        <button data-goto="${
          this._data.currentPage - 1
        }"class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>page ${this._data.currentPage - 1}</span>
        </button>
        <button data-goto="${
          this._data.currentPage + 1
        }" class="btn--inline pagination__btn--next">
            <span> page ${this._data.currentPage + 1}</span>
            <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>`;
    }
  }
}

export default new PaginationView();
