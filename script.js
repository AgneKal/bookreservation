// App functionalities

const usersKey = 'users';
const booksKey = 'books';
let currentUser = null;

document.getElementById("auth-form").addEventListener("submit", function (e) {
    e.preventDefault();
    registerUser();
});

document.getElementById("login-form").addEventListener("submit", function (e) {
    e.preventDefault();
    loginUser();
});

document.getElementById("logout-button").addEventListener("click", logoutUser);
document.getElementById("book-form").addEventListener("submit", function (e) {
    e.preventDefault();
    addBook();
});

document.getElementById("toggle-login").addEventListener("click", function () {
    toggleLoginForm();
});
document.getElementById("toggle-register").addEventListener("click", function () {
    toggleRegisterForm();
});

// Funkcija perjungti į prisijungimo langą
function toggleLoginForm() {
    document.getElementById("auth-section").style.display = 'none';
    document.getElementById("login-section").style.display = 'block';
}

// Funkcija perjungti į registracijos langą
function toggleRegisterForm() {
    document.getElementById("auth-section").style.display = 'block';
    document.getElementById("login-section").style.display = 'none';
}

// Registracijos funkcija
function registerUser() {
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (validateUser(username, email, password)) {
        const users = JSON.parse(localStorage.getItem(usersKey)) || [];
        users.push({ username, email, password });
        localStorage.setItem(usersKey, JSON.stringify(users));
        currentUser = username;
        displayUser();
        clearAuthInputs();
    } else {
        alert("Įveskite tinkamą informaciją!");
    }
}

// Vartotojo prisijungimo funkcija
function loginUser() {
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    const users = JSON.parse(localStorage.getItem(usersKey)) || [];
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        currentUser = username;
        displayUser();
        clearLoginInputs();
    } else {
        alert("Neteisingas vartotojo vardas arba slaptažodis!");
    }
}

// Valyti registracijos įvestis
function clearAuthInputs() {
    document.getElementById("username").value = '';
    document.getElementById("email").value = '';
    document.getElementById("password").value = '';
}

// Valyti prisijungimo įvestis
function clearLoginInputs() {
    document.getElementById("login-username").value = '';
    document.getElementById("login-password").value = '';
}

// Ši funkcija parodo vartotojo informaciją
function displayUser() {
    document.getElementById("auth-section").style.display = 'none';
    document.getElementById("login-section").style.display = 'none';
    document.getElementById("welcome-section").style.display = 'block';
    document.getElementById("welcome-message").innerText = `Sveiki, ${currentUser}!`;
    document.getElementById("logout-button").style.display = 'block';
    displayBooks();
}

// Atsijungimo funkcija
function logoutUser() {
    currentUser = null;
    document.getElementById("auth-section").style.display = 'block';
    document.getElementById("welcome-section").style.display = 'none';
    document.getElementById("logout-button").style.display = 'none';
    toggleRegisterForm(); // Rodo registracijos formą pagal nutylėjimą
}

// Naujos knygos pridėjimo funkcija
function addBook() {
    const title = document.getElementById("book-title").value;
    const author = document.getElementById("book-author").value;
    const year = parseInt(document.getElementById("book-year").value);

    const books = JSON.parse(localStorage.getItem(booksKey)) || [];
    books.push({ title, author, year, owner: currentUser, status: 'Laisva' });
    localStorage.setItem(booksKey, JSON.stringify(books));
    displayBooks();
    document.getElementById("book-form").reset();
}

// Ši funkcija rodo knygas
function displayBooks() {
    const books = JSON.parse(localStorage.getItem(booksKey)) || [];
    const booksList = document.getElementById("books-list");
    booksList.innerHTML = '';

    books.forEach((book, index) => {
        const bookDiv = document.createElement('div');
        bookDiv.className = 'book-item';
        bookDiv.innerHTML = `<strong>${book.title}</strong> - ${book.author} (${book.year}) - Statusas: ${book.status}`;
        booksList.appendChild(bookDiv);

        if (book.owner === currentUser) {
            const editButton = document.createElement('button');
            editButton.innerText = 'Redaguoti';
            editButton.onclick = () => editBook(index);
            bookDiv.appendChild(editButton);

            if (book.status === 'Nori rezervuoti') {
                const approveButton = document.createElement('button');
                approveButton.innerText = 'Paskolinti';
                approveButton.onclick = () => approveReservation(index);
                bookDiv.appendChild(approveButton);
            } else if (book.status === 'Paskolinta') {
                const freeButton = document.createElement('button');
                freeButton.innerText = 'Grąžinta (laisva)';
                freeButton.onclick = () => setBookToFree(index);
                bookDiv.appendChild(freeButton);
            }
        } else if (book.status === 'Laisva') {
            const reserveButton = document.createElement('button');
            reserveButton.innerText = 'Rezervuoti';
            reserveButton.onclick = () => reserveBook(index);
            bookDiv.appendChild(reserveButton);
        }
    });
}

// Knygos redagavimo funkcija
function editBook(index) {
    const books = JSON.parse(localStorage.getItem(booksKey));
    const title = prompt("Įveskite naują knygos pavadinimą:", books[index].title);
    const author = prompt("Įveskite naują autorių:", books[index].author);
    const year = prompt("Įveskite naujus metus:", books[index].year);

    if (title && author && year) {
        books[index].title = title;
        books[index].author = author;
        books[index].year = parseInt(year);
        localStorage.setItem(booksKey, JSON.stringify(books));
        displayBooks();
    }
}

// Knygos rezervavimo funkcija
function reserveBook(index) {
    const books = JSON.parse(localStorage.getItem(booksKey));
    books[index].status = 'Nori rezervuoti';
    localStorage.setItem(booksKey, JSON.stringify(books));
    displayBooks();
}

// Knygos rezervacijos patvirtinimo funkcija
function approveReservation(index) {
    const books = JSON.parse(localStorage.getItem(booksKey));
    books[index].status = 'Paskolinta';
    localStorage.setItem(booksKey, JSON.stringify(books));
    displayBooks();
}

// Knygos būsenos keitimo į laisva funkcija
function setBookToFree(index) {
    const books = JSON.parse(localStorage.getItem(booksKey));
    books[index].status = 'Laisva';
    localStorage.setItem(booksKey, JSON.stringify(books));
    displayBooks();
}

// Vartotojo validacijos funkcija
function validateUser(username, email, password) {
    // Paprasta validacija, kad patikrintų ar laukai nėra tušti
    return username !== '' && email !== '' && password !== '';
}
