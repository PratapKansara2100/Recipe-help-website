import View from "./View.js";
class SearchView extends View {
  _parentElement = document.querySelector(".search");
  _SearchBoxElement = this._parentElement.querySelector(".search__field");
  _errorMessage = "No recipes found for your query! Please try again ;)";

  getQuery() {
    const value = this._SearchBoxElement.value;
    this._clear(this._SearchBoxElement);
    return value;
  }

  addEventHandlerSearch(HandlerFunc) {
    this._parentElement.addEventListener("submit", function (e) {
      e.preventDefault();
      HandlerFunc();
    });
  }
}
export default new SearchView();
