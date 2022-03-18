const newBookBtn = document.querySelector(".add-btn");
const overlay = document.querySelector(".open-form");
const newBookForm = document.querySelector(".add-a-new-book-form");
const closeBtn = document.querySelector(".closeBtn");
const form = document.querySelector(".book-information");
const bookTitle = document.querySelector("#title");
const bookAuthor = document.querySelector("#author");
const bookNumber = document.querySelector("#number-of-pages");
const bookStatus = document.querySelector("#status");
const allCards = document.querySelector(".cards");

const showAddNewBookForm = function () {
  overlay.classList.toggle("open");
  newBookForm.classList.toggle("open");
};

overlay.addEventListener("click", showAddNewBookForm);
closeBtn.addEventListener("click", showAddNewBookForm);
newBookBtn.addEventListener("click", showAddNewBookForm);

const Book = function (title, author, pagesNum, hasRead) {
  this.title = title;
  this.author = author;
  this.pagesNum = pagesNum;
  this.hasRead = hasRead;
};

let myLibrary = [];

form.addEventListener("submit", function (e) {
  e.preventDefault();
  let title = bookTitle.value;
  let author = bookAuthor.value;
  let pages = bookNumber.value;
  let status = bookStatus.value;
  const book = new Book(title, author, pages, status);
  addBookToLibrary(book);
  createCard(book);
  clearForm();
  showAddNewBookForm();
});

const clearForm = function () {
  bookTitle.value = "";
  bookAuthor.value = "";
  bookNumber.value = "";
};

const addBookToLibrary = function (book) {
  myLibrary.push(book);
};

const createCard = function (book) {
  const cardsContainer = document.querySelector(".cards");
  const divContainer = document.createElement("div");
  divContainer.classList.add("card");
  cardsContainer.appendChild(divContainer);
  const cardHeader = document.createElement("h1");
  cardHeader.style.textAlign = "center";
  cardHeader.textContent = book.title;
  cardHeader.classList.add("card-title");
  const paragraph = document.createElement("p");
  paragraph.textContent = book.author;
  paragraph.classList.add("card-author");
  const buttonDivContainer = document.createElement("div");
  buttonDivContainer.classList.add("card-button");
  const ReadBtn = document.createElement("button");
  ReadBtn.classList.add("readBtn");
  ReadBtn.textContent = `${book.hasRead === "Yes" ? "Read" : "Not Yet"}`;
  const RemoveBtn = document.createElement("button");
  RemoveBtn.textContent = "Remove";
  RemoveBtn.classList.add("removeBtn");
  buttonDivContainer.append(ReadBtn, RemoveBtn);
  divContainer.append(cardHeader, paragraph, buttonDivContainer);
};

const toggleRead = function (e) {
  if (e.target.textContent === "Read") e.target.textContent = "Not Yet";
  else e.target.textContent = "Read";
};

const removeBook = function (e) {
  // get current clicked card name and author and filter it out of the remaining library content
  const cardTitleText = e.target.closest(".card").firstElementChild.textContent;
  const cardAuthorText =
    e.target.closest(".card").firstElementChild.nextElementSibling.textContent;
  e.target.textContent = "Removed";
  //  get the cards index
  const selectedCardIndex = myLibrary.findIndex((book) => {
    return book.title === cardTitleText && book.author === cardAuthorText;
  });
  // remove the card permernently from MyLibrary array
  myLibrary.splice(selectedCardIndex);
  e.target.closest(".card").remove();
};

// if card element is clicked
allCards.addEventListener("click", function (e) {
  // if it is book status button,toggle text content
  if (e.target.classList.contains("readBtn")) {
    toggleRead(e);
    return;
  }
  //else if it is remove button, remove card element
  else if (e.target.classList.contains("removeBtn")) {
    removeBook(e);
  } else return;
});
