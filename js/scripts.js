const newBookBtn = document.querySelector(".add-btn");
const overlay = document.querySelector(".open-form");
const newBookForm = document.querySelector(".add-a-new-book-form");
const closeBtn = document.querySelector(".closeBtn");

//show add a new book form after clicking add a new book button
// const showAddNewBookForm = function () {
//   newBookBtn.addEventListener("click", function () {
//     overlay.classList.toggle("open");
//     newBookForm.classList.toggle("open");
//   });
// };

const closeFormAndOverlay = function () {
  overlay.classList.remove("open");
  newBookForm.classList.remove("open");
};

const showAddNewBookForm = function () {
  overlay.classList.toggle("open");
  newBookForm.classList.toggle("open");
};

overlay.addEventListener("click", showAddNewBookForm);
closeBtn.addEventListener("click", showAddNewBookForm);
newBookBtn.addEventListener("click", showAddNewBookForm);

// showAddNewBookForm();
// // closeAddNewBookForm();
// closeAddNewBookFormBtn();
