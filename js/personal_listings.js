import { checkStringNotEmpty, checkBookDescriptionNotTooShort, checkBookDescriptionNotTooLong,
    highlightInputField, highlightText, resetStyle, displayBooks } from "./vars_and_helpers.js";
import { getPersonalCollection } from "./requests.js"


const submitButton = $("input#submit-button"),
    submitMessage = $("p#submit-message");

$(document).ready(() => {
    getPersonalCollection();
    displayBooks();

    $('.remove-element-button').click(function() {
        console.log("TEST");
    });
});