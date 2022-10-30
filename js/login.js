import { checkStringNotEmpty, highlightInputField, highlightText, resetStyle } from "./vars_and_helpers.js";
import { loginUser } from "./requests.js"

const emailDesc = $("label#email-desc"),
    emailField = $("input#email");

const passwordDesc = $("label#password-desc"),
    passwordField = $("input#password");

const submitButton = $("input#submit-button"),
    submitMessage = $("p#submit-message");

$(document).ready(() => {
    submitButton.click(e => {
        e.preventDefault();
        resetElements();

        const { valid, email, password } = checkAccountInfoValid();
        if (valid) {
            console.log("Login information inputted.");
            loginUser({ email, password}, false);
        }
    });

});

// Resets elements that may be updated
const resetElements = () => {
    resetStyle(emailDesc);
    emailDesc.text("Enter your email");
    highlightText(emailDesc, "gray");
    resetStyle(emailField);

    resetStyle(passwordDesc);
    passwordDesc.text("Enter your password");
    highlightText(passwordDesc, "gray");
    resetStyle(passwordField);

    submitMessage.text("");
};

// Checks that the fields are valid (not if the email or password are correct)
// Highlights and updates respective label text value of invalid fields
const checkAccountInfoValid = () => {
    const email = emailField.val(),
        password = passwordField.val();

    const isEmailValid = checkStringNotEmpty(email),
        isPasswordValid = checkStringNotEmpty(password);

    if (!isEmailValid) {
        emailDesc.text("Invalid Response: Enter your email");
        highlightText(emailDesc, "red");
        highlightInputField(emailField);
    } else {
        emailDesc.css("display", "none");
    }

    if (!isPasswordValid) {
        passwordDesc.text("Invalid Response: Enter your password");
        highlightText(passwordDesc, "red");
        highlightInputField(passwordField);
    } else {
        passwordDesc.css("display", "none");
    }

    return { valid: isEmailValid && isPasswordValid, 
        email, password };
};