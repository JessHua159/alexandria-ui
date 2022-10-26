import { checkStringNotEmpty, checkEmail, checkPassword, highlightInputField, highlightText, resetStyle } from "./vars_and_helpers.js";
import { sendAccountInfo } from "./requests.js"

const universityDesc = $("label#university-desc"),
    universityNameField = $("input#university");
    
const usernameDesc = $("label#username-desc"),
    usernameField = $("input#username");
    
const firstNameDesc = $("label#first-name-desc"),
    firstNameField = $("input#first-name");

const lastNameDesc = $("label#last-name-desc"),
    lastNameField = $("input#last-name");

const emailDesc = $("label#email-desc"),
    emailField = $("input#email");

const passwordDesc = $("label#password-desc"),
    passwordField = $("input#password");

const confirmPasswordDesc = $("label#confirm-password-desc"),
    confirmPasswordField = $("input#confirm-password");

const submitButton = $("input#submit-button"),
    submitMessage = $("p#submit-message");

$(document).ready(() => {
    submitButton.click(e => {
        e.preventDefault();
        resetElements();

        const { valid, universityName, username, firstName, lastName, email, password } = checkAccountInfoValid();
        if (valid) {
            console.log("Account information valid.");
            sendAccountInfo({ universityName, username, firstName, lastName, email, password });
        }
    });

});

// Resets elements that may be updated
const resetElements = () => {
    resetStyle(universityDesc);
    universityDesc.text("Enter the name of your university");
    highlightText(universityDesc, "gray");
    resetStyle(universityNameField);

    resetStyle(usernameDesc);
    usernameDesc.text("Enter a username");
    highlightText(usernameDesc, "gray");
    resetStyle(usernameField);

    resetStyle(firstNameDesc);
    firstNameDesc.text("Enter your first name");
    highlightText(firstNameDesc, "gray");
    resetStyle(firstNameField);

    resetStyle(lastNameDesc);
    lastNameDesc.text("Enter your last name");
    highlightText(lastNameDesc, "gray");
    resetStyle(lastNameField);

    resetStyle(emailDesc);
    emailDesc.text("Enter your email");
    highlightText(emailDesc, "gray");
    resetStyle(emailField);

    resetStyle(passwordDesc);
    passwordDesc.text("Password must have at least 8 characters long, at least 1 uppercase and 1 lowercase letter, at least 1 number");
    highlightText(passwordDesc, "gray");
    resetStyle(passwordField);

    resetStyle(confirmPasswordDesc);
    confirmPasswordDesc.text("Re-enter password");
    highlightText(confirmPasswordDesc, "gray");
    resetStyle(confirmPasswordField);

    submitMessage.text("");
};

// Checks that the fields are valid
// Highlights and updates respective label text value of invalid fields
const checkAccountInfoValid = () => {
    const universityName = universityNameField.val(),
        username = usernameField.val(),
        firstName = firstNameField.val(),
        lastName = lastNameField.val(),
        email = emailField.val(),
        password = passwordField.val(),
        confirmPassword = confirmPasswordField.val();

    const isUniversityValid = checkStringNotEmpty(universityName),
        isUsernameValid = checkStringNotEmpty(username),
        isFirstNameValid = checkStringNotEmpty(firstName),
        isLastNameValid = checkStringNotEmpty(lastName),
        isEmailValid = checkEmail(email),
        isPasswordValid = checkPassword(password),
        isConfirmPasswordValid = (password === confirmPassword);

    if (!isUniversityValid) {
        universityDesc.text("Invalid Response: Enter the name of your university");
        highlightText(universityDesc, "red");
        highlightInputField(universityNameField);
    } else {
        universityDesc.css("display", "none");
    }

    if (!isUsernameValid) {
        usernameDesc.text("Invalid Response: Enter a username");
        highlightText(usernameDesc, "red");
        highlightInputField(usernameField);
    } else {
        usernameDesc.css("display", "none");
    }

    if (!isFirstNameValid) {
        firstNameDesc.text("Invalid Response: Enter your first name");
        highlightText(firstNameDesc, "red");
        highlightInputField(firstNameField);
    } else {
        firstNameDesc.css("display", "none");
    }

    if (!isLastNameValid) {
        lastNameDesc.text("Invalid Response: Enter your last name");
        highlightText(lastNameDesc, "red");
        highlightInputField(lastNameField);
    } else {
        lastNameDesc.css("display", "none");
    }

    if (!isEmailValid) {
        emailDesc.text("Invalid Response: Email must be in form of <something>@<domain>.<ext> (e.g, username@college.edu)");
        highlightText(emailDesc, "red");
        highlightInputField(emailField);
    } else {
        emailDesc.css("display", "none");
    }

    if (!isPasswordValid) {
        passwordDesc.text("Invalid Response: Password must have at least 8 characters long, at least 1 uppercase and 1 lowercase letter, at least 1 number");
        highlightText(passwordDesc, "red");
        highlightInputField(passwordField);
    } else {
        passwordDesc.css("display", "none");
    }

    if (!isConfirmPasswordValid) {
        confirmPasswordDesc.text("Invalid Response: The entered passwords does not match");
        highlightText(confirmPasswordDesc, "red");
        highlightInputField(confirmPasswordField);
    } else if (checkStringNotEmpty(confirmPassword)) {
        confirmPasswordDesc.css("display", "none");
    }

    return { valid: isUniversityValid && isUsernameValid && isFirstNameValid && isLastNameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid,
        universityName, username, firstName, lastName, email, password };
};