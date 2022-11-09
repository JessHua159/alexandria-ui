import { checkStringNotEmpty, checkBookDescriptionNotTooShort, checkBookDescriptionNotTooLong,
    highlightInputField, highlightText, resetStyle } from "./vars_and_helpers.js";
import { getPersonalCollection } from "./requests.js"


const submitButton = $("input#submit-button"),
    submitMessage = $("p#submit-message");

$(document).ready(() => {
    getPersonalCollection();

    $('.remove-element-button').click(function() {
        console.log("TEST");
    });
});


function forExchangeString(book) {
    if ( book.forExchange ) { return "For Exchange"; }
    return "For Give Away";
}

const displayPersonalBooks = () => {
    var bookList = JSON.parse(window.sessionStorage.getItem("bookList"));
    if (!bookList || bookList.length === 0) {
        //If No Books
    }
    else {
        for (var book of bookList) {
            $('.collection-list').find('tbody').append(
                '<tr class="collection-row">'+
                    '<td>'+
                        '<button class="collection-row-content">'+
                            ' <div class="list-div">'+
                                '<img src="images/book-add.png" class="collection-book-image">'+
                                //'<img src="images/minus-button.png" class="remove-element-button">'+
                                `<div>${book.name}</div>`+
                                `<div class="collection-book-attr">ISBN: ${book.isbn}</div>`+
                                `<div class="collection-book-attr">Condition: ${book.condition}</div>`+
                                `<div class="collection-book-attr">${forExchangeString(book)}</div>`+
                                `<div class="collection-book-attr">Description: ${book.description}</div>`+
                                '</div>'+
                            '</button>'+
                        '</td>'+
                   '</tr>'
            );
        }
    }
};

export { displayPersonalBooks }



