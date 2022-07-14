let elSelect = document.querySelector(".js-select");
let elSelectSort = document.querySelector(".js-select2");
let elList = document.querySelector(".list");
let elBookmarkList = document.querySelector(".bookmark-list");
let elModal = document.querySelector(".modal");

const localList = JSON.parse(window.localStorage.getItem("bookmarkList"));
const bookmarkList = localList || [];

const moviesFragment = document.createDocumentFragment();

function domlaration(array, node) {
  elList.innerHTML = null;
  for (film of array) {
    let newItem = document.createElement("li");
    newItem.setAttribute("class", "item");
    let newPost = document.createElement("img");
    newPost.setAttribute("alt", "Image");
    newPost.style.width = "200px";
    newPost.style.height = "250px";
    newPost.style.borderRadius = "10px";
    let newId = document.createElement("p");
    let newTitle = document.createElement("h3");
    const bookmarkBtn = document.createElement("button");
    const modalBtn = document.createElement("button");
    bookmarkBtn.textContent = "Bookmark";
    bookmarkBtn.setAttribute("class", "bookmark-btn");
    bookmarkBtn.dataset.filmId = film.id;
    modalBtn.textContent = "Modal";
    modalBtn.setAttribute("class", "modal-btn");
    modalBtn.dataset.filmId = film.id;
    newPost.src = `${film.poster}`;
    newId.textContent = `Id: ${film.id}`;
    newTitle.textContent = `Title: ${film.title}`;

    newItem.appendChild(newPost);
    newItem.appendChild(newId);
    newItem.appendChild(newTitle);
    newItem.appendChild(bookmarkBtn);
    newItem.appendChild(modalBtn);
    moviesFragment.appendChild(newItem);
  }
  node.appendChild(moviesFragment);
}
domlaration(films, elList);
const getBookmarkMovie = (array, node) => {
  node.innerHTML = "";
  window.localStorage.setItem("bookmarkList", JSON.stringify(bookmarkList));
  array.forEach((e) => {
    const newBookmarkItem = document.createElement("li");
    const newBookmarkBtn = document.createElement("button");
    newBookmarkItem.textContent = e.title;
    newBookmarkBtn.textContent = "Delete";
    newBookmarkBtn.setAttribute("class", "bookmark-delete");
    newBookmarkBtn.dataset.bookId = e.id;

    newBookmarkItem.appendChild(newBookmarkBtn);
    node.appendChild(newBookmarkItem);
  });
};

getBookmarkMovie(bookmarkList, elBookmarkList);

let myArray = [];

for (let film of films) {
  myArray.push(...film.genres);
}

let mySet = new Set(myArray);

for (const item of Array.from(mySet)) {
  let option = document.createElement("option");
  option.textContent = item;
  elSelect.appendChild(option);
}

let result = [];

elSelect.addEventListener("change", function () {
  elList.innerHTML = "";
  result = [];
  let selectVal = elSelect.value;

  films.forEach((fil) => {
    if (fil.genres.includes(selectVal)) {
      result.push(fil);
    }
  });
  domlaration(result, elList);
});

elSelectSort.addEventListener("change", function () {
  let selectValSort = elSelectSort.value;

  let sortedFilms = films.sort((a, b) => {
    if (selectValSort === "A-Z") {
      if (a.title > b.title) {
        return 1;
      } else {
        return -1;
      }
    } else {
      if (a.title < b.title) {
        return 1;
      } else {
        return -1;
      }
    }
  });

  domlaration(sortedFilms, elList);
});

elList.addEventListener("click", function (evt) {
  if (evt.target.matches(".bookmark-btn")) {
    const filmId = evt.target.dataset.filmId;

    const findedFilm = films.find((e) => e.id == filmId);

    if (!bookmarkList.includes(findedFilm)) {
      bookmarkList.push(findedFilm);
      getBookmarkMovie(bookmarkList, elBookmarkList);
    }
  }
  if (evt.target.matches(".modal-btn")) {
    elModal.classList.add("open");
    elModal.innerHTML = "";
    const idd = evt.target.dataset.filmId;
    const element = films.find((e) => e.id == idd);

    const newImg = document.createElement("img")
    const newitem = document.createElement("h3");
    const newP = document.createElement("p");
    const newButton = document.createElement("button");
    newButton.setAttribute("class", "close-btn");
    newImg.src = element.poster;
    newitem.textContent = element.title;
    newP.textContent = element.overview;
    newButton.textContent = "x";

    elModal.appendChild(newButton);
    elModal.appendChild(newitem);
    elModal.appendChild(newP);
  }
});

elBookmarkList.addEventListener("click", function (evt) {
  if (evt.target.matches(".bookmark-delete")) {
    const bookId = evt.target.dataset.bookId;

    const findedBtn = bookmarkList.findIndex((e) => e.id == bookId);

    bookmarkList.splice(findedBtn, 1);
    getBookmarkMovie(bookmarkList, elBookmarkList);
  }
});

elModal.addEventListener("click", function (evt) {
  if (evt.target.matches(".close-btn")) {
    elModal.classList.remove("open");
  }
});
