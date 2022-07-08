function initFirebaseAuth() {
  // Listen to auth state changes. called at the buttom at all times
  auth.onAuthStateChanged((user) => {
    if (user) {
      // if user is available, hide login button and get user details to display
      userName.textContent = getUserName();
      profileImage.src = getProfileUrl();

      userName.classList.remove("hide");
      profileImage.classList.remove("hide");
      logoutButton.classList.remove("hide");
      loginButton.classList.add("hide");
      loadBooks();
    } else {
      loginButton.classList.remove("hide");
      logoutButton.classList.add("hide");
      userName.classList.add("hide");
      profileImage.classList.add("hide");
      loader.classList.add("hide");
    }
  });
}
initFirebaseAuth();

const getProfileUrl = function () {
  return auth.currentUser.photoURL;
};

const getUserName = function () {
  return auth.currentUser.displayName;
};

const isUserSignedIn = function () {
  return !!auth.currentUser;
};

const checkSignedIn = function (e) {
  e.preventDefault();
  if (isUserSignedIn()) {
    return true;
  }
  return false;
};

const googleSignIn = async function () {
  const provider = new firebase.auth.GoogleAuthProvider();
  await auth.signInWithPopup(provider);
  const cardsContainer = document.querySelector(".cards");
  cardsContainer.textContent = "";
};

const googleSignOut = function () {
  auth.signOut();
  const cardsContainer = document.querySelector(".cards");
  cardsContainer.textContent = "";
};

const saveBookToDB = function (e) {
  let title = bookTitle.value;
  let author = bookAuthor.value;
  let pages = bookNumber.value;
  let status = bookStatus.value;
  book = createBookObject(title, author, pages, status);
  db.collection("books").add({
    owner: auth.currentUser.uid,
    title: book.title,
    author: book.author,
    pagesNum: book.pagesNum,
    hasRead: book.hasRead,
  });
  clearForm();
  showAddNewBookForm();
};

const displayCardFromDB = function (book) {
  const cardsContainer = document.querySelector(".cards");
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
};

const loadBooks = function () {
  db.collection("books")
    .where("owner", "==", auth.currentUser.uid)
    .onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const book = change.doc.data();
          console.log(book);
          loader.classList.add("hide");
          displayCardFromDB(book);
        }
        if (change.type === "removed") {
          const book = change.doc.data();
          // search all h1 elements and remove the clicked one
          document.querySelectorAll("h1").forEach(function (element) {
            if (element.textContent === book.title) {
              element.closest(".card").remove();
            }
          });
        }
      });
    });
};

const removeBookFromDB = function (e, bookTitle) {
  const selectedBook = db
    .collection("books")
    .where("owner", "==", auth.currentUser.uid)
    .where("title", "==", bookTitle);
  selectedBook.get().then(function (querySnapshot) {
    querySnapshot.forEach(function (doc) {
      doc.ref.delete();
    });
  });
};
