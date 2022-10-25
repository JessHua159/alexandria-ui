import { checkStringNotEmpty, highlightInputField, highlightText, resetStyle } from "./vars_and_helpers.js";
import { loginUser } from "./requests.js"

const usernameDesc = $("label#username-desc"),
    usernameField = $("input#username");

const passwordDesc = $("label#password-desc"),
    passwordField = $("input#password");

const submitButton = $("input#submit-button"),
    submitMessage = $("p#submit-message");

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
    resetStyle(usernameDesc);
    usernameDesc.text("Enter your username");
    highlightText(usernameDesc, "gray");
    resetStyle(usernameField);

    resetStyle(passwordDesc);
    passwordDesc.text("Enter your password");
    highlightText(passwordDesc, "gray");
    resetStyle(passwordField);

    submitMessage.text("");
};

// Checks that the fields are valid (not if the username or password are correct)
// Highlights and updates respective label text value of invalid fields
const checkAccountInfoValid = () => {
    const username = usernameField.val(),
        password = passwordField.val();

    const isUsernameValid = checkStringNotEmpty(username),
        isPasswordValid = checkStringNotEmpty(password);

    if (!isUsernameValid) {
        usernameDesc.text("Invalid Response: Enter your username");
        highlightText(usernameDesc, "red");
        highlightInputField(usernameField);
    } else {
        usernameDesc.css("display", "none");
    }

    if (!isPasswordValid) {
        passwordDesc.text("Invalid Response: Enter your password");
        highlightText(passwordDesc, "red");
        highlightInputField(passwordField);
    } else {
        passwordDesc.css("display", "none");
    }

    return { valid: isUsernameValid && isPasswordValid, 
        username, password };
};