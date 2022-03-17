// UI element 
let form = document.querySelector('#book-form');
let bookList = document.querySelector('#book-list');

// Book Class
class Book {
    constructor(title, author, isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}
class UI {
    static addToBookList(book){
        let row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><button><a href="#">Delete</a></button></td>
        `
        bookList.appendChild(row);
    }
    static clearFields(){
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }
    static showAlert(message, className){
        let div = document.createElement('div');
        div.className = `alert ${className}`;
        div.appendChild(document.createTextNode(message));
        let container = document.querySelector('.container');
        container.insertBefore(div, form);
        setTimeout(()=>{
            document.querySelector('.alert').remove();
        }, 2000);
    }
    static deleteFromBook(target){
        if(target.hasAttribute('href')){
            target.parentElement.parentElement.parentElement.remove();
            Store.removeBooks(target.parentElement.parentElement.previousElementSibling.textContent.trim());
        }
    }
}
class Store{
    static getBooks(){
        let books;
        if(localStorage.getItem('books') === null){
            books = [];
        }else{
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }
    static addBook(book){
        let books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));

    }
    static displayBook(){
        let books = Store.getBooks();
        books.forEach(book => {
            UI.addToBookList(book);
        })
    }
    static removeBooks(isbn){
        let books = Store.getBooks();

        books.forEach((book, index)=>{
            if(book.isbn === isbn){
                books.splice(index, 1);
            }
        })
        localStorage.setItem('books', JSON.stringify(books));
    }
}

// Event Listener
form.addEventListener('submit', newBook);
bookList.addEventListener('click', removeBook);
document.addEventListener('load', Store.displayBook());

// Define Functions
function newBook(e){
    let title = document.querySelector('#title').value;
    let author = document.querySelector('#author').value;
    let isbn = document.querySelector('#isbn').value;
    let book = new Book(title, author, isbn);

    if(title === '' || author === '' || isbn === ''){
        UI.showAlert('Fill up all the fields!', 'error');
    }else{
        UI.addToBookList(book);
        UI.clearFields();
        Store.addBook(book);
        UI.showAlert('Book Information Added Successfully.', 'success');
    }
    e.preventDefault();
}
function removeBook(e){
    UI.deleteFromBook(e.target);
    if(e.target.hasAttribute('href')){
        UI.showAlert('Book Deleted !', 'delete');
    }
}