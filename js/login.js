import { checkStringNotEmpty, highlightText, highlightInputField, resetStyle } from "./vars_and_helpers.js";
import { loginUser } from "./requests.js"

const labelUsernameDesc = $("label#username-desc"),
    usernameField = $("input#username"),
    passwordDesc = $("label#password-desc"),
    passwordField = $("input#password");

const submitButton = $(".submit-button"),
    submitMessage = $(".submit-message");

$(document).ready(() => {
    submitButton.click(e => {
        e.preventDefault();
        resetElements();

        const { valid, username, password } = checkAccountInfoValid();
        if (valid) {
            console.log("Login information inputted.");
            loginUser({ username, password}, false);
        }
    });

});

// Resets elements that may be updated
const resetElements = () => {
    labelUsernameDesc.text("Enter your username");
    highlightText("username-desc", "gray");
    resetStyle(usernameField);

    passwordDesc.text("Enter your password");
    highlightText("password-desc", "gray");
    resetStyle(passwordField);

    submitMessage.text("");
}

// Checks that the fields have been correctly entered
// Highlights and updates respective label text value of invalid fields
const checkAccountInfoValid = () => {
    const username = usernameField.val(),
        password = passwordField.val();

    const isUsernameValid = checkStringNotEmpty(username),
        isPasswordValid = checkStringNotEmpty(password);

    if (!isUsernameValid) {
        labelUsernameDesc.text("Invalid Response: Enter your username");
        highlightText("username-desc", "red");
        highlightInputField(usernameField);
    }

    if (!isPasswordValid) {
        passwordDesc.text("Invalid Response: Enter your password");
        highlightText("password-desc", "red");
        highlightInputField(passwordField);
    } 

    return { valid: isUsernameValid && isPasswordValid, 
        username, password };
};