import View from "./View.js";
import icons from "url:../../img/icons.svg";

class ResultView extends View {
  _parentElement = document.querySelector(".results");
  _errMessage = `No recipes found for the query, Please try again.`;
  _message = "";

  _generateHtml() {
    return this._data.reduce((string, recipeListItem) => {
      string =
        string +
        `
        <li class="preview">
          <a class="preview__link " href="#${recipeListItem.id}">
          <figure class="preview__fig">
            <img src="${recipeListItem.imageUrl}" alt="${
          recipeListItem.title
        }" />
          </figure>
          <div class="preview__data">
            <h4 class="preview__title">${recipeListItem.title}</h4>
            <p class="preview__publisher">${recipeListItem.publisher}</p>
            <div class="preview__user-generated ${
              recipeListItem.key ? "" : "hidden"
            } ">
              <svg>
              <use href="${icons}#icon-user"></use>
              </svg>
            </div>
          </div>
          </a>
        </li>
    `;
      return string;
    }, "");
  }
}

export default new ResultView();
