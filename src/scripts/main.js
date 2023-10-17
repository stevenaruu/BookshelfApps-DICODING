const books = [];

const RENDER_EVENT = 'render-todo';
const SAVED_EVENT = 'saved-todo';
const STORAGE_KEY = 'BOOK_APP';

const generateId = () => {
    return +new Date();
}

const generateBookObject = (id, title, author, year, isComplete) => {
    return {
        id,
        title,
        author,
        year,
        isComplete
    }
}

const findBook = (bookId) => {
    for (const book of books) {
        if (book.id === bookId) return book;
    }
    return null;
}

const isStorageExists = () => {
    if (typeof Storage === undefined) {
        alert('Your browser is not support local storage');
        return false
    }
    return true;
}

const saveData = () => {
    if (isStorageExists()) {
        const parsedBooks = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsedBooks);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

const loadDataFromStorage = () => {
    const serializedBooks = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedBooks);

    if (data !== null) {
        for (const book of data) {
            books.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}

const makeBook = (bookObject) => {
    const { id, title, author, year, isComplete } = bookObject;

    const article = document.createElement('article');
    article.classList.add('book-card');

    const h3 = document.createElement('h3');
    h3.textContent = title;

    const authorParagraph = document.createElement('p');
    authorParagraph.textContent = 'Penulis: ' + author;

    const yearParagraph = document.createElement('p');
    yearParagraph.textContent = 'Tahun: ' + year;

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-action');

    const finishAndUnfinishButton = document.createElement('button');

    if (isComplete) {
        finishAndUnfinishButton.classList.add('green-button');
        finishAndUnfinishButton.textContent = 'Belum selesai dibaca';

        buttonContainer.appendChild(finishAndUnfinishButton);

        finishAndUnfinishButton.addEventListener('click', () => {
            addBookToIsCompleteOrInComplete(id);
        })
    } else {
        finishAndUnfinishButton.classList.add('green-button');
        finishAndUnfinishButton.textContent = 'Selesai dibaca';

        buttonContainer.appendChild(finishAndUnfinishButton);

        finishAndUnfinishButton.addEventListener('click', () => {
            addBookToIsCompleteOrInComplete(id);
        })
    }

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('red-button');
    deleteButton.textContent = 'Hapus buku';

    buttonContainer.appendChild(deleteButton);

    article.appendChild(h3);
    article.appendChild(authorParagraph);
    article.appendChild(yearParagraph);
    article.appendChild(buttonContainer);

    return article;
}

const addBookToIsCompleteOrInComplete = (bookId) => {
    const bookTarget = findBook(bookId);

    if (bookTarget === null) return;

    if (bookTarget.isComplete) bookTarget.isComplete = false;
    else bookTarget.isComplete = true;

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

const addBook = () => {
    const id = generateId();
    const title = document.getElementById('inputBookTitle').value;
    const author = document.getElementById('inputBookAuthor').value;
    const year = document.getElementById('inputBookYear').value;
    let isComplete = false;

    const isCompleteValue = document.getElementById('inputBookIsComplete');

    if (isCompleteValue.checked) isComplete = true;

    const bookObject = generateBookObject(id, title, author, year, isComplete);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

document.addEventListener('DOMContentLoaded', () => {
    const submitForm = document.getElementById('inputBook');

    submitForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addBook();
    })

    if (isStorageExists()) loadDataFromStorage();
});

document.addEventListener(SAVED_EVENT, () => {
    console.log('Book stored to local storage.');
});

document.addEventListener(RENDER_EVENT, function () {
    const inComplete = document.getElementById('inCompleteBookshelfList');
    const isComplete = document.getElementById('isCompleteBookshelfList');

    inComplete.innerHTML = '';
    isComplete.innerHTML = '';

    for (const book of books) {
        const bookElement = makeBook(book);

        if (book.isComplete) isComplete.append(bookElement);
        else inComplete.append(bookElement);
    }
})

