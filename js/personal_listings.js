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