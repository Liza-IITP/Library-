function Book(name,author,type){
    this.name = name;
    this.author = author;
    this.type = type;
}
function Display() {

}
Display.prototype.add = function (book) {
    console.log("Adding to UI");
    let booklist = document.getElementById('bookList');
    let index = booklist.getElementsByTagName('tr').length;
    let uistring = `
    <tr data-id="${book.name}">
        <td>${index + 1}</td>
        <td>${book.name}</td>
        <td>${book.author}</td>
        <td>${book.type}</td>
        <td><button class="btn btn-danger" onclick="deleteBook('${book.name}')">Delete</button></td>
    </tr>
    `;
    booklist.innerHTML += uistring;
};
Display.prototype.clear = function() {
    let libraryForm = document.getElementById('libraryForm');
    libraryForm.reset();
}
Display.prototype.validate = function(book) {
    if (book.name === "" || book.author === "" || book.type === "") {
        return false;
    }
    return true;
}
let libraryForm = document.getElementById('libraryForm');
libraryForm.addEventListener('submit', libraryFormSubmit);

function libraryFormSubmit(e) {
    console.log("You have submitted the library form");
    e.preventDefault();
    let name = document.getElementById('bookName').value;
    let author = document.getElementById('author').value;
    let elementalism = document.getElementById('elementalism');
    let illusioncraft = document.getElementById('Illusioncraft');
    let MysticBindings = document.getElementById('MysticBindings');
    let Astramagia = document.getElementById('Astramagia');
    let type;
    if (elementalism.checked) {
        type = elementalism.value;
    } else if (illusioncraft.checked) { 
        type = illusioncraft.value;
    } else if (MysticBindings.checked) {
        type = MysticBindings.value;
    } else if (Astramagia.checked) {
        type = Astramagia.value;
    }
    let book = new Book(name, author, type);
    console.log(book); 
    let display = new Display();
    if(display.validate(book)){
        display.add(book);
        display.clear();
        display.show("Aventus ! Your book has been added to the library", "success");
        
        let books = JSON.parse(localStorage.getItem('books'));
        if (books == null) {
            books = [];
        }
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
        console.log(books);
    }
    else{
        display.show("Mea Culpa ! You cannot add this book" , "danger");
    }
    e.preventDefault();
}
Display.prototype.show = function(message, type) {
    let messageElement = document.getElementById('message');
    messageElement.innerHTML = `
    <div class="alert alert-${type}" role="alert">
        ${message}
    </div>
    `;
    setTimeout(() => {
        messageElement.innerHTML = '';
    }, 2000);
} 
function showBooksFromLocalStorage() {
    let books = localStorage.getItem('books');
    if (!books) {
        books = [];
    } else {
        try {
            books = JSON.parse(books);
        } catch (error) {
            console.error("Error parsing books from localStorage:", error);
            books = [];
        }
    }

    let display = new Display();
    books.forEach(book => {
        display.add(book);
    });
}

function deleteBook(bookName) {
    console.log("Deleting book with name:", bookName);
    let books = localStorage.getItem('books');
    if (!books) {
        books = [];
    } else {
        books = JSON.parse(books);
    }

    // Remove the book with the matching name from localStorage
    books = books.filter(book => book.name !== bookName);

    // Update localStorage
    localStorage.setItem('books', JSON.stringify(books));

    // Remove the corresponding row from the table
    let booklist = document.getElementById('bookList');
    let rows = booklist.getElementsByTagName('tr');
    for (let row of rows) {
        if (row.getAttribute('data-id') === bookName) {
            row.remove();
            break;
        }
    }

    // Update the serial numbers (S.no.)
    Array.from(booklist.getElementsByTagName('tr')).forEach((row, index) => {
        row.getElementsByTagName('td')[0].innerText = index + 1;
    });
}
// Modify the existing search functionality to reset the list when the search input is cleared
function searchBooks() {
    let searchInput = document.querySelector('input[placeholder="Search"]').value.toLowerCase();
    let booklist = document.getElementById('bookList');
    let rows = booklist.getElementsByTagName('tr');

    if (searchInput === "") {
        // If the search input is empty, reset the list to show all books
        Array.from(rows).forEach(row => {
            row.style.display = '';
        });
        return;
    }

    Array.from(rows).forEach(row => {
        let bookName = row.getElementsByTagName('td')[1]?.innerText.toLowerCase();
        if (bookName && bookName.includes(searchInput)) {
            row.style.display = '';
        } else {
            let authorName = row.getElementsByTagName('td')[2]?.innerText.toLowerCase();
            if (authorName && authorName.includes(searchInput)) {
                row.style.display = '';
            } else {
                let bookType = row.getElementsByTagName('td')[3]?.innerText.toLowerCase();
                if (bookType && bookType.includes(searchInput)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            }
        }
    });
}

// Attach the searchBooks function to the search button
window.onload = function() {
    let searchButton = document.querySelector('button[type="submit"]');
    if (searchButton) {
        searchButton.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent form submission
            searchBooks();
        });
    }

    // Load books from localStorage
    showBooksFromLocalStorage();
};

