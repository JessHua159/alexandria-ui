import { checkStringNotEmpty, highlightText, highlightInputField, resetStyle } from "./vars_and_helpers.js";
import { loginUser } from "./requests.js"

$(document).ready(() => {
    $(".submit-button").click(e => {
        e.preventDefault();
        resetElements();

        const { valid, username, password } = checkAccountInfoValid();
        if (valid) {
            console.log("Login information inputted.");
            loginUser({ username, password}, false);
        }
    });

});

// Resets elements that may be updated by this script
const resetElements = () => {
    $("label#username-desc").text("Enter your username");
    highlightText("username-desc", "gray");
    resetStyle($("input#username"));

    $("label#password-desc").text("Enter your password");
    highlightText("password-desc", "gray");
    resetStyle($("input#password"));

    $(".submit-message").text("");
}

// Checks that the fields have been correctly entered
// Highlights and updates respective label text value of invalid fields
const checkAccountInfoValid = () => {
    const usernameField = $("input#username"),
            username = usernameField.val(),
            passwordField = $("input#password"),
            password = passwordField.val();

    const isUsernameValid = checkStringNotEmpty(username),
            isPasswordValid = checkStringNotEmpty(password);

    if (!isUsernameValid) {
        $("label#username-desc").text("Invalid Response: Enter your username");
        highlightText("username-desc", "red");
        highlightInputField(usernameField);
    }

    if (!isPasswordValid) {
        $("label#password-desc").text("Invalid Response: Enter your password");
        highlightText("password-desc", "red");
        highlightInputField(passwordField);
    } 

    return { valid: isUsernameValid && isPasswordValid, 
        username, password };
};