import { checkStringNotEmpty, checkISBN, highlightInputField, highlightText, resetStyle } from "./vars_and_helpers.js";
// import { sendAccountInfo } from "./requests.js"

const isbnDesc = $("label#isbn-desc"), originalIsbnDescText = isbnDesc.text(),
    isbnField = $("input#isbn");
    
const nameDesc = $("label#name-desc"), originalNameDescText = nameDesc.text(),
    nameField = $("input#name");

const conditionDesc = $("label#condition-desc"), originalConditionDescText = conditionDesc.text(),
    conditionDropdown = $("select#condition");

const descriptionDesc = $("label#description-desc"), originalDesciptionDescText = descriptionDesc.text(),
    descriptionField = $("textarea#description");

const listingOptionDesc = $("label#listing-option-desc"), originalListingOptionDescText = listingOptionDesc.text(),
    listingOptionField = $("input[name=listing-method]");

const submitButton = $("input#submit-button"),
    submitMessage = $("p#submit-message");

$(document).ready(() => {
    submitButton.click(e => {
        e.preventDefault();
        resetElements();

        const { valid } = checkBookInfoValid();
        if (valid) {
            console.log("Book information valid.");
            // sendBookInfo();
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
    resetStyle(conditionDropdown);

    resetStyle(descriptionDesc);
    descriptionDesc.text(originalDesciptionDescText);
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
    const isbn = isbnField.val();
        // firstName = firstNameField.val(),
        // lastName = lastNameField.val(),
        // email = emailField.val(),
        // password = passwordField.val(),
        // confirmPassword = confirmPasswordField.val();

    const isISBNValid = checkISBN(isbn);
        // isFirstNameValid = checkStringNotEmpty(firstName),
        // isLastNameValid = checkStringNotEmpty(lastName),
        // isEmailValid = checkEmail(email),
        // isPasswordValid = checkPassword(password),
        // isConfirmPasswordValid = (password === confirmPassword);

    if (!isISBNValid) {
        isbnDesc.text(`Invalid ISBN Format: ${originalIsbnDescText}`);
        highlightText(isbnDesc, "red");
        highlightInputField(isbnField);
    } else {
        isbnDesc.css("display", "none");
    }

    // here

    // if (!isFirstNameValid) {
    //     firstNameDesc.text("Invalid Response: Enter your first name");
    //     highlightText(firstNameDesc, "red");
    //     highlightInputField(firstNameField);
    // } else {
    //     firstNameDesc.css("display", "none");
    // }

    // if (!isLastNameValid) {
    //     lastNameDesc.text("Invalid Response: Enter your last name");
    //     highlightText(lastNameDesc, "red");
    //     highlightInputField(lastNameField);
    // } else {
    //     lastNameDesc.css("display", "none");
    // }

    // if (!isEmailValid) {
    //     emailDesc.text("Invalid Response: Email must be in form of <something>@<domain>.<ext> (e.g, username@college.edu)");
    //     highlightText(emailDesc, "red");
    //     highlightInputField(emailField);
    // } else {
    //     emailDesc.css("display", "none");
    // }

    // if (!isPasswordValid) {
    //     passwordDesc.text("Invalid Response: Password must have at least 8 characters long, at least 1 uppercase and 1 lowercase letter, at least 1 number");
    //     highlightText(passwordDesc, "red");
    //     highlightInputField(passwordField);
    // } else {
    //     passwordDesc.css("display", "none");
    // }

    // if (!isConfirmPasswordValid) {
    //     confirmPasswordDesc.text("Invalid Response: The entered passwords does not match");
    //     highlightText(confirmPasswordDesc, "red");
    //     highlightInputField(confirmPasswordField);
    // } else if (checkStringNotEmpty(confirmPassword)) {
    //     confirmPasswordDesc.css("display", "none");
    // }

    return { valid: isISBNValid };
};