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
let book;

const showAddNewBookForm = () => {
  overlay.classList.toggle("open");
  newBookForm.classList.toggle("open");
};

overlay.addEventListener("click", showAddNewBookForm);
closeBtn.addEventListener("click", showAddNewBookForm);
newBookBtn.addEventListener("click", showAddNewBookForm);

class Book {
  constructor(title, author, pagesNum, hasRead) {
    this.title = title;
    this.author = author;
    this.pagesNum = pagesNum;
    this.hasRead = hasRead;
  }

  changeStatus(e) {
    if (this.hasRead === "Yes") {
      e.target.textContent = "Not Yet";
      this.hasRead = "No";
    } else {
      e.target.textContent = "Read";
      this.hasRead = "Yes";
    }
  }
}

let myLibrary = [];

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let title = bookTitle.value;
  let author = bookAuthor.value;
  let pages = bookNumber.value;
  let status = bookStatus.value;
  book = new Book(title, author, pages, status);
  addBookToLibrary(book);
  displayCard(e);
  clearForm();
  showAddNewBookForm();
});

// clear form on submit
const clearForm = () => {
  bookTitle.value = "";
  bookAuthor.value = "";
  bookNumber.value = "";
};

const addBookToLibrary = (book) => {
  myLibrary.push(book);
};

const displayCard = function (e) {
  const cardsContainer = document.querySelector(".cards");
  // clear current cards
  cardsContainer.textContent = "";
  // display card from library array
  myLibrary.forEach(function (book) {
    const html = ` 
      <div class="card">
        <h1 class="card-title">${book.title}</h1>
        <p class="card-author">${book.author}</p>
        <div class="card-button">
          <button class="readBtn">${
            book.hasRead === "Yes" ? "Read" : "Not Yet"
          }</button>
          <button class="removeBtn">Remove</button>
        </div>
      </div>
    `;
    cardsContainer.insertAdjacentHTML("beforeend", html);
  });
};

const getCurrentCardTitle = function (e) {
  const cardTitleText = e.target.closest(".card").firstElementChild.textContent;
  return cardTitleText;
};

const getCurrentCardAuthor = function (e) {
  const cardAuthorText =
    e.target.closest(".card").firstElementChild.nextElementSibling.textContent;
  return cardAuthorText;
};

const removeBook = (e) => {
  // get current clicked card name and author and find its index in the myLibrary array
  const curTitle = getCurrentCardTitle(e);
  const curAuthor = getCurrentCardAuthor(e);
  const getCardIndex = myLibrary.findIndex((book) => {
    return book.title === curTitle && book.author === curAuthor;
  });
  // remove the card permernently from MyLibrary array
  myLibrary.splice(getCardIndex);
  e.target.closest(".card").remove();
};

// if card element is clicked
allCards.addEventListener("click", (e) => {
  // if it is book status button,toggle text content
  if (e.target.classList.contains("readBtn")) {
    const currentTitle = getCurrentCardTitle(e);
    const currentAuthor = getCurrentCardAuthor(e);
    const currentBook = myLibrary.filter(function (curBook) {
      return curBook.title === currentTitle && curBook.author === currentAuthor;
    });
    currentBook[0].changeStatus(e);
    return;
  }
  //else if it is remove button, remove card element
  else if (e.target.classList.contains("removeBtn")) {
    removeBook(e);
  } else return;
});
