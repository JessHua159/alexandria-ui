import { checkStringNotEmpty, highlightInputField, resetStyle } from "./vars_and_helpers.js";
import { loginUser } from "./requests.js"

$(document).ready(() => {
    $(".submit-button").click(e => {
        e.preventDefault();
        $(".submit-message").text("");

        const { valid, username, password } = checkAccountInfoValid();
        if (valid) {
            console.log("Login information inputted.");
            loginUser({ username, password}, false);
        }
    });

});

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
        $("label#username").text("Username (you did not enter in an username)");
        highlightInputField(usernameField);
    } else {
        $("label#username").text("Username");
        resetStyle(usernameField);
    }

    if (!isPasswordValid) {
        $("label#password").text("Password (you did not enter in a password)");
        highlightInputField(passwordField);
    } else {
        $("label#password").text("Password");
        resetStyle(passwordField);
    }

    return { valid: isUsernameValid && isPasswordValid, 
        username, password };
};