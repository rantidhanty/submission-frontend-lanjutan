document.addEventListener("DOMContentLoaded", (event) => {
    const inputBookForm = document.getElementById("inputBook");
    const searchBookForm = document.getElementById("searchBook");
    const inCompleteBookshelfList = document.getElementById(
      "incompleteBookshelfList"
    );
    const completeBookshelfList = document.getElementById(
      "completeBookshelfList"
    );
  
    inputBookForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const inputBookTitle = document.getElementById("inputBookTitle").value;
      const inputBookAuthor = document.getElementById("inputBookAuthor").value;
      const inputBookYear = document.getElementById("inputBookYear").value;
      const inputBookIsComplete = document.getElementById(
        "inputBookIsComplete"
      ).checked;
  
      if (
        inputBookTitle.trim() === "" ||
        inputBookAuthor.trim() === "" ||
        inputBookYear.trim() === ""
      ) {
        alert("Judul, penulis, dan tahun terbit tidak boleh kosong!");
        return;
      }
  
      const book = {
        id: +new Date(),
        title: inputBookTitle,
        author: inputBookAuthor,
        year: inputBookYear,
        isComplete: inputBookIsComplete,
      };
  
      addBookToShelf(book);
      saveDataToStorage();
      inputBookForm.reset();
    });
  
    function addBookToShelf(book) {
      const bookShelfList = book.isComplete
        ? completeBookshelfList
        : inCompleteBookshelfList;
  
      const article = document.createElement("article");
      article.setAttribute("id", book.id)
      article.classList.add("book_item");
      article.innerHTML = `
          <h3>${book.title}</h3>
          <p>Penulis: ${book.author}</p>
          <p>Tahun Terbit: ${book.year}</p>
          <div class="action">
              <button class="read-button">${
                book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca"
              }</button>
              <button class="delete">Hapus Buku </button>
          </div>
          `;
  
      bookShelfList.appendChild(article);
  
      const readButton = article.querySelector(".read-button");
      readButton.addEventListener("click", function (event) {
        toggleReadStatus(article);
      });
  
      const deleteButton = article.querySelector(".delete");
      deleteButton.addEventListener("click", function (event) {
        deleteBook(article);
      });
    }
  
    function toggleReadStatus(article) {
      const readButton = article.querySelector(".read-button");
      const isComplete = readButton.innerText === "Belum selesai dibaca";
  
      if (isComplete) {
        readButton.innerText = "Selesai dibaca";
        readButton.classList.remove("yellow");
        readButton.classList.add("green");
        inCompleteBookshelfList.appendChild(article);
      } else {
        readButton.innerText = "Belum selesai dibaca";
        readButton.classList.remove("green");
        readButton.classList.add("yellow");
        completeBookshelfList.appendChild(article);
      }
      saveDataToStorage();
    }
  
    function deleteBook(article) {
      article.remove();
      saveDataToStorage();
    }
  
    searchBookForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const searchBookTitle = document.getElementById("searchBookTitle").value;
      filterBooks(searchBookTitle);
    });
  
    function filterBooks(searchBookTitle) {
      const allBooks = document.querySelectorAll(".book_item");
      allBooks.forEach((book) => {
        const title = book.querySelector("h3").innerText.toLowerCase();
        if (title.includes(searchBookTitle.toLowerCase())) {
          book.style.display = "block";
        } else {
          book.style.display = "none";
        }
      });
  
      if (searchBookTitle === "") {
        allBooks.forEach((book) => {
          book.style.display = "block";
        });
      }
    }
  
    function loadDataFromStorage() {
      const storedBooks = localStorage.getItem("books");
      if (storedBooks) {
        const books = JSON.parse(storedBooks);
        books.forEach((book) => {
          addBookToShelf(book);
        });
      }
    }
  
    function saveDataToStorage() {
      const books = [];
      const bookItems = document.querySelectorAll(".book_item");
      bookItems.forEach((item) => {
        const id = item.getAttribute("id");
        const title = item.querySelector("h3").innerText;
        const author = item
          .querySelector("p:nth-of-type(1)")
          .innerText.split(": ")[1];
        const year = item
          .querySelector("p:nth-of-type(2)")
          .innerText.split(": ")[1];
        const isComplete =
          item.querySelector(".read-button").innerText === "Belum selesai dibaca";
        const book = {
            id: id,
          title: title,
          author: author,
          year: parseInt(year),
          isComplete: isComplete,
        };
        books.push(book);
      });
      localStorage.setItem("books", JSON.stringify(books));
    }
    loadDataFromStorage();
  });
  