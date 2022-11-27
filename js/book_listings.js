import { checkStringNotEmpty, checkISBN, highlightInputField, highlightText, resetStyle } from "./vars_and_helpers.js";
import { getPersonalCollection, sendBookSearchInfo } from "./requests.js"

const bookSearchDesc = $("label#book-search-desc"), originalBookSearchDescText = bookSearchDesc.text(),
    bookSearchField = $("input#book-search");

const submitButton = $("input#submit-button"),
    submitMessage = $("p#submit-message");

const searchResultsList = $("table.search-results-list");

let otherSelectors = null;

let ownerInfo = $("#owner-info");
let requestOption = $("#request-option");

$(document).ready(() => {
    getPersonalCollection();

    $('.remove-element-button').click(function() {
        console.log("TEST");
    });

    $('.search_bar').keyup(e => {
        var keyId = e.keyCode || 0;
        if(keyId == 13){
            e.preventDefault();
            resetSearchInformationElements();
    
            const { valid, searchTerm, isISBN } = checkBookSearchInfoValid();
            if (valid) {
                console.log("Search information valid.");
    
                searchResultsList.html("<tbody></tbody>");
                sendBookSearchInfo({ searchTerm, isISBN });
            }
        }
    });
});

// Resets search information elements that may be updated
const resetSearchInformationElements = () => {
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