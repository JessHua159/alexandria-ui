import { checkStringNotEmpty, checkISBN, highlightInputField, highlightText, resetStyle } from "./vars_and_helpers.js";
import { sendBookSearchInfo } from "./requests.js";

const bookSearchDesc = $("label#book-search-desc"), originalBookSearchDescText = bookSearchDesc.text(),
    bookSearchField = $("input#book-search");

const submitButton = $("input#submit-button"),
    submitMessage = $("p#submit-message");

const collectionList = $("table.collection-list");

$(document).ready(() => {
    submitButton.click(e => {
        e.preventDefault();
        resetElements();

        const { valid, searchTerm, isISBN } = checkBookSearchInfoValid();
        if (valid) {
            console.log("Search information valid.");
            collectionList.html("<tbody></tbody>");
            sendBookSearchInfo({ searchTerm, isISBN });
        }
    });
});

// Resets elements that may be updated
const resetElements = () => {
    resetStyle(bookSearchDesc);
    bookSearchDesc.text(originalBookSearchDescText);
    highlightText(bookSearchDesc, "gray");
    resetStyle(bookSearchField);

    submitMessage.text("");
};

// Checks that the fields are valid
// Highlights and updates respective label text value of invalid fields
const checkBookSearchInfoValid = () => {
    const searchTerm = bookSearchField.val();

    const isSearchTermValid = checkStringNotEmpty(searchTerm);

    if (!isSearchTermValid) {
        bookSearchDesc.text(`Invalid Response: ${originalBookSearchDescText}`);
        highlightText(bookSearchDesc, "red");
        highlightInputField(bookSearchField);
    } else {
        bookSearchDesc.css("display", "none");
    }

    return { valid: isSearchTermValid, searchTerm, isISBN: checkISBN(searchTerm) }
}