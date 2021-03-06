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
const loginButton = document.querySelector(".login");
const logoutButton = document.querySelector(".logout");
const profileImage = document.querySelector(".profile-img");
const userName = document.querySelector(".user-name");
const loader = document.querySelector(".loader-container");
let book;

loginButton.addEventListener("click", googleSignIn);
logoutButton.addEventListener("click", googleSignOut);

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
      e.target.textContent = "Not Read";
      this.hasRead = "No";
    } else {
      e.target.textContent = "Read";
      this.hasRead = "Yes";
    }
  }
}

let myLibrary = [];

const createBookObject = function (title, author, pages, status) {
  const newBook = new Book(title, author, pages, status);
  return newBook;
};

const submitLibrary = function (e) {
  e.preventDefault();
  let title = bookTitle.value;
  let author = bookAuthor.value;
  let pages = bookNumber.value;
  let status = bookStatus.value;
  book = createBookObject(title, author, pages, status);
  addBookToLibrary(book);
  displayCard();
  clearForm();
  showAddNewBookForm();
};

// clear form on submit
const clearForm = () => {
  bookTitle.value = "";
  bookAuthor.value = "";
  bookNumber.value = "";
};

const addBookToLibrary = (book) => {
  myLibrary.push(book);
};

const displayCard = function () {
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
            book.hasRead === "Yes" ? "Read" : "Not Read"
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

  // if user is signed in, remove from the database
  if (checkSignedIn(e)) {
    removeBookFromDB(curTitle);
  } else {
    const getCardIndex = myLibrary.findIndex((book) => {
      return book.title === curTitle && book.author === curAuthor;
    });
    // remove the card permernently from MyLibrary array
    myLibrary.splice(getCardIndex);
    e.target.closest(".card").remove();
  }
};

// if card element is clicked
allCards.addEventListener("click", (e) => {
  // if it is book status button,toggle text content
  if (e.target.classList.contains("readBtn")) {
    const currentTitle = getCurrentCardTitle(e);
    const currentAuthor = getCurrentCardAuthor(e);
    // if user is signed in, update book in the server
    if (checkSignedIn(e)) {
      updateBookInDB(currentTitle, e);
      return;
    }
    const currentBook = myLibrary.filter(function (curBook) {
      return curBook.title === currentTitle && curBook.author === currentAuthor;
    });
    currentBook[0].changeStatus(e);
    // return;
  }
  //else if it is remove button, remove card element
  else if (e.target.classList.contains("removeBtn")) {
    removeBook(e);
  } else return;
});

// Error
const titleError = document.querySelector(".title-error");
const authorError = document.querySelector(".author-error");
const pagesError = document.querySelector(".pages-error");

const clearAllErrorMessage = function () {
  const errorsElement = document.querySelectorAll(".error");
  errorsElement.forEach((element) => {
    element.textContent = "";
  });
};

// We validate data input based as it is being typed
bookTitle.addEventListener("input", () => {
  if (bookTitle.validity.valid) {
    titleError.textContent = "Entered value needs to be a text";
  } else {
    showError(bookTitle, titleError);
  }
});

bookAuthor.addEventListener("input", () => {
  if (bookAuthor.validity.valid) {
    authorError.textContent = "Entered value needs to be a text";
  } else {
    showError(bookAuthor, authorError);
  }
});

bookNumber.addEventListener("input", () => {
  if (bookTitle.validity.valid) {
    pagesError.textContent = "Entered value needs to be a number";
  } else {
    showError(bookNumber, pagesError);
  }
});

// form client side validation
form.addEventListener("submit", (e) => {
  // if any of the input's is not valid(does not satify all HTML written guides)
  if (!bookTitle.validity.valid) {
    showError(bookTitle, titleError);
    e.preventDefault();
    return;
  } else if (!bookAuthor.validity.valid) {
    showError(bookAuthor, authorError);
    e.preventDefault();
    return;
  } else if (!bookNumber.validity.valid) {
    showError(bookNumber, pagesError);
    e.preventDefault();
    return;
  }
  if (checkSignedIn(e)) {
    saveBookToDB(e);
  } else {
    submitLibrary(e);
  }
  clearAllErrorMessage();
});

const showError = function (formInput, element) {
  if (formInput.validity.valueMissing) {
    element.textContent = "This field is required";
  } else if (formInput.validity.typeMismatch) {
    element.textContent = `This field is required`;
  } else if (formInput.validity.tooLong) {
    element.textContent = `${formInput.maxLength} characters are required; you entered ${formInput.value.length}`;
  } else if (formInput.validity.rangeUnderflow) {
    element.textContent = `${formInput.min} is the minimum number that can be entered`;
  }
};
