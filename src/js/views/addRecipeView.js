import View from "./View.js";
import icons from "url:../../img/icons.svg";

class AddRecipeView extends View {
  _parentElement = document.querySelector(".upload");
  _windowElement = document.querySelector(".add-recipe-window");
  _overlayElement = document.querySelector(".overlay");
  _btnOpen = document.querySelector(".nav__btn--add-recipe");
  _btnClose = document.querySelector(".btn--close-modal");
  _errMessage = "please check your inputs";
  _message = "recipe was uploaded";

  constructor() {
    super();
    this._addEventHandlerShowForm();
  }

  toggleForm() {
    this._overlayElement.classList.toggle("hidden");
    this._windowElement.classList.toggle("hidden");
  }

  _addEventHandlerShowForm() {
    const btns = [this._btnClose, this._btnOpen, this._overlayElement];
    btns.forEach((btn) => {
      btn.addEventListener("click", this.toggleForm.bind(this));
    });
  }
  addEventHandlerUpload(handler) {
    const parEl = this._parentElement;
    parEl.addEventListener("submit", function (e) {
      e.preventDefault();
      const userRecipeObj = [...new FormData(this)];
      const newRecipeObject = Object.fromEntries(userRecipeObj);
      handler(newRecipeObject);
    });
  }
  _generateHtml() {
    const html = "";
  }
}

export default new AddRecipeView();
