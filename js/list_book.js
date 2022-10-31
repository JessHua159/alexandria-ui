import { minimumBookDescriptionLength, maximumBookDescriptionLength,
    checkStringNotEmpty, checkISBN, checkBookDescriptionNotTooShort, checkBookDescriptionNotTooLong, 
    highlightInputField, highlightText, resetStyle } from "./vars_and_helpers.js";
// import { sendAccountInfo } from "./requests.js"

const isbnDesc = $("label#isbn-desc"), originalIsbnDescText = isbnDesc.text(),
    isbnField = $("input#isbn");
    
const nameDesc = $("label#name-desc"), originalNameDescText = nameDesc.text(),
    nameField = $("input#name");

const conditionDesc = $("label#condition-desc"), originalConditionDescText = conditionDesc.text(),
    conditionField = $("select#condition");

const descriptionDesc = $("label#description-desc"), originalDesciptionDescText = descriptionDesc.text(),
    descriptionField = $("textarea#description");

const listingOptionDesc = $("label#listing-option-desc"), originalListingOptionDescText = listingOptionDesc.text(),
    listingOptionField = $("input[name=listing-type]");

const submitButton = $("input#submit-button"),
    submitMessage = $("p#submit-message");

$(document).ready(() => {
    submitButton.click(e => {
        e.preventDefault();
        resetElements();

        const { valid, isbn, name, condition, description, listingOption } = checkBookInfoValid();
        if (valid) {
            console.log("Book information valid.");
            // sendBookInfo({ isbn, name, condition, description, listingOption });
        }
    });

});

// Resets elements that may be updated
const resetElements = () => {
    resetStyle(isbnDesc);
    isbnDesc.text(originalIsbnDescText);
    highlightText(isbnDesc, "gray");
    resetStyle(isbnField);

    resetStyle(nameDesc);
    nameDesc.text(originalNameDescText);
    highlightText(nameDesc, "gray");
    resetStyle(nameField);

    resetStyle(conditionDesc);
    conditionDesc.text(originalConditionDescText);
    highlightText(conditionDesc, "gray");
    resetStyle(conditionField);

    resetStyle(descriptionDesc);
    descriptionDesc.text(`${originalDesciptionDescText} (between ${minimumBookDescriptionLength} and ${maximumBookDescriptionLength} characters long)`);
    highlightText(descriptionDesc, "gray");
    resetStyle(descriptionField);

    resetStyle(listingOptionDesc);
    listingOptionDesc.text(originalListingOptionDescText);
    highlightText(listingOptionDesc, "gray");
    resetStyle(listingOptionField);

    submitMessage.text("");
};

// Checks that the fields are valid
// Highlights and updates respective label text value of invalid fields
const checkBookInfoValid = () => {
    const isbn = isbnField.val(),
        name = nameField.val(),
        condition = $("select#condition option:selected").text(),
        description = descriptionField.val(),
        listingOption = $("input[name=listing-type]:checked").val();

    const isISBNValid = checkISBN(isbn),
        isNameValid = checkStringNotEmpty(name),
        isConditionValid = checkStringNotEmpty(condition),
        descriptionNotTooShort = checkBookDescriptionNotTooShort(description),
        descriptionNotTooLong = checkBookDescriptionNotTooLong(description),
        isDescriptionValid = descriptionNotTooShort && descriptionNotTooLong,
        isListingOptionValid = listingOption !== undefined;

    if (!isISBNValid) {
        isbnDesc.text(`Invalid ISBN Format: ${originalIsbnDescText}`);
        highlightText(isbnDesc, "red");
        highlightInputField(isbnField);
    } else {
        isbnDesc.css("display", "none");
    }

    if (!isNameValid) {
        nameDesc.text(`Invalid Response: ${originalNameDescText}`);
        highlightText(nameDesc, "red");
        highlightInputField(nameField);
    } else {
        nameDesc.css("display", "none");
    }

    if (!isConditionValid) {
        conditionDesc.text(`Invalid Response: ${originalConditionDescText}`);
        highlightText(conditionDesc, "red");
        highlightInputField(conditionField);
    } else {
        conditionDesc.css("display", "none");
    }

    if (!isDescriptionValid) {
        highlightText(descriptionDesc, "red");
        highlightInputField(descriptionField);

        if (!descriptionNotTooShort) {
            descriptionDesc.text(`Invalid Response: Book description too short (less than ${minimumBookDescriptionLength} characters, should be between ${minimumBookDescriptionLength} and ${maximumBookDescriptionLength} characters long)`);
        } else if (!descriptionNotTooLong) {
            descriptionDesc.text(`Invalid Response: Book description too long (more than ${maximumBookDescriptionLength} characters, should be between ${minimumBookDescriptionLength} and ${maximumBookDescriptionLength} characters long)`);
        }
    } else {
        descriptionDesc.css("display", "none");
    }

    if (!isListingOptionValid) {
        listingOptionDesc.text(`Invalid Response: ${originalListingOptionDescText}`);
        highlightText(listingOptionDesc, "red");
        highlightInputField(listingOptionField);
    } else {
        listingOptionDesc.css("display", "none");
    }

    return { valid: isISBNValid && isNameValid && isConditionValid && isDescriptionValid && isListingOptionValid,
            isbn, name, condition, description, listingOption };
};