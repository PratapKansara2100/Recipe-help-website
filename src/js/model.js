import {
  SEARCH_API_URL,
  SEARCH_RESULT_PER_PAGE,
  API_URL,
  DEFAULT_CURRENT_PAGE_SEARCH_RES,
  API_KEY,
} from "./config.js";
import { getJson, sendJSON } from "./helpers.js";
export const state = {
  recipe: {},
  search: {
    query: "",
    results: [],
    currentPage: DEFAULT_CURRENT_PAGE_SEARCH_RES,
    resultsPerPage: SEARCH_RESULT_PER_PAGE,
  },
  bookmarked: [],
  userRecipes: [],
};

const formattingRecipe = function (data) {
  let { recipe } = data.data;
  return (recipe = {
    id: recipe.id,
    title: recipe.title,
    cookingTime: recipe.cooking_time,
    servings: recipe.servings,
    publisher: recipe.publisher,
    ingredients: recipe.ingredients,
    sourceUrl: recipe.source_url,
    imageUrl: recipe.image_url,
    ...(recipe.key && { key: recipe.key }),
  });
};
export const fetchRecipe = async function (id) {
  try {
    const data = await getJson(`${API_URL}/${id}?key=${API_KEY}`);

    state.recipe = formattingRecipe(data);
    if (state.bookmarked.some((recipeSummary) => recipeSummary.id === id))
      state.recipe.bookmark = true;
    else state.recipe.bookmark = false;
  } catch (err) {
    // console.error(`234`, err);
    throw err;
  }
};

export const loadSearchResult = async function (searchTerm) {
  try {
    state.search.query = searchTerm;
    const data = await getJson(
      `${SEARCH_API_URL.replace("word", searchTerm)}&key=${API_KEY}`
    );
    state.search.results = data.data.recipes.map((rec) => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        imageUrl: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.currentPage = DEFAULT_CURRENT_PAGE_SEARCH_RES;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getSearchResultPage = function (page = state.search.currentPage) {
  state.search.currentPage = page;

  const start = (page - 1) * SEARCH_RESULT_PER_PAGE;
  const end = page * SEARCH_RESULT_PER_PAGE;

  return state.search.results.slice(start, end);
};

export const updateServings = function (servingValueChange) {
  newServingValue = state.recipe.servings + servingValueChange;
  if (newServingValue < 1) return;
  state.recipe.ingredients.forEach((ingredient) => {
    ingredient.quantity =
      (ingredient.quantity * newServingValue) / state.recipe.servings;
  });

  state.recipe.servings = newServingValue;
};

export const updateBookmarkStat = function () {
  // changing bookmark state of the current recipe
  state.recipe.bookmark = !state.recipe.bookmark;

  // adding or deleting recepies from bookmarks array
  if (
    state.bookmarked.some(
      (recipeSummary) => recipeSummary.id === state.recipe.id
    )
  ) {
    const value = state.bookmarked.findIndex(
      (recipeSummary) => recipeSummary.id === state.recipe.id
    );
    state.bookmarked.splice(value, 1);
  } else {
    state.bookmarked.push({
      imageUrl: state.recipe.imageUrl,
      title: state.recipe.title,
      id: state.recipe.id,
      publisher: state.recipe.publisher,
      ...(state.recipe.key && { key: state.recipe.key }),
    });
  }

  // storing the bookmarks array to local storage
  localStorage.setItem("bookmarkedRecepies", JSON.stringify(state.bookmarked));
};

export const saveUserGeneratedRecipe = async function (userRecipe) {
  try {
    const ingredients = Object.entries(userRecipe)
      .filter(
        (entries) => entries[0].startsWith("ingredient") && entries[1] !== ""
      )
      .map((entry) => {
        const tempArray = entry[1].replaceAll(" ", "").split(",");
        if (tempArray.length !== 3) {
          throw new Error(
            "Wrong ingredient format! Please rectify your inputs"
          );
        }
        const [quantity, unit, description] = tempArray;
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    const recipe = {
      title: userRecipe.title,
      source_url: userRecipe.sourceUrl,
      image_url: userRecipe.imageUrl,
      publisher: userRecipe.publisher,
      cooking_time: +userRecipe.cookingTime,
      servings: +userRecipe.servings,
      ingredients: ingredients,
    };

    const data = await sendJSON(`${API_URL}?key=${API_KEY}`, recipe);
    state.recipe = formattingRecipe(data);
    updateBookmarkStat();
  } catch (err) {
    throw err;
  }
};

const init = function () {
  const storage = localStorage.getItem("bookmarkedRecepies");
  if (storage) state.bookmarked = JSON.parse(storage);
};

init();
