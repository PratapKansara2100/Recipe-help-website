import "core-js/stable";
import "regenerator-runtime/runtime";
import { MODAL_CLOSING_SECONDS } from "./config.js";
import * as model from "./model.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";
import bookmarksView from "./views/bookmarksView.js";
import addRecipeView from "./views/addRecipeView.js";

const recipeShowHandler = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // setep 1 :loading the recipe
    await model.fetchRecipe(id);

    // step 2 rendering the recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError(err);
  }
};

const searchResHandler = async function () {
  try {
    resultsView.renderSpinner();
    // 1 get query
    const query = searchView.getQuery();

    // 2 get data
    await model.loadSearchResult(query);

    //3 render results
    resultsView.render(model.getSearchResultPage());

    //4 render the pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

const searchResPaginationHandler = function (goToPage) {
  //1 render new results
  resultsView.render(model.getSearchResultPage(goToPage));

  //2 render the pagination buttons
  paginationView.render(model.state.search);
};

const servingsHandler = function (value) {
  // update the recipe serving in state
  model.updateServings(value);
  // update the recipe view
  recipeView.update(model.state.recipe);
};

const bookmarkBtnHandler = function () {
  // update the bookmark recipe in state
  model.updateBookmarkStat();
  // update the recipe view - bookmarks indicator btn
  recipeView.update(model.state.recipe);
};

const bookmarksListHandler = function () {
  // render bookmarks
  bookmarksView.render(model.state.bookmarked);
};

const uploadRecipeBtnHandler = async function (data) {
  try {
    // render spinner
    addRecipeView.renderSpinner();
    // send the data to model
    await model.saveUserGeneratedRecipe(data);
    // step 2 rendering the recipe
    recipeView.render(model.state.recipe);
    // render success message
    addRecipeView.renderMessage();
    // change id in url
    window.history.pushState(null, "", `#${model.state.recipe.id}`);
    // close the modal
    setTimeout(function () {
      addRecipeView.toggleForm();
    }, 1000 * MODAL_CLOSING_SECONDS);
  } catch (err) {
    addRecipeView.renderError(err.message);
    console.log(err);
  }
};

const init = function () {
  recipeView.addEventHandlerMainRender(recipeShowHandler);
  recipeView.addEventHandlerChangeServings(servingsHandler);
  recipeView.addEventHandlerBookmarkButton(bookmarkBtnHandler);
  searchView.addEventHandlerSearch(searchResHandler);
  paginationView.addEventHandlerPagination(searchResPaginationHandler);
  bookmarksView.addEventHandlerHover(bookmarksListHandler);
  addRecipeView.addEventHandlerUpload(uploadRecipeBtnHandler);
};

init();
