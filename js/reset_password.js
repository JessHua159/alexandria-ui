import { checkStringNotEmpty, checkPassword, highlightInputField, highlightText, resetStyle } from "./vars_and_helpers.js";

const newPasswordDesc = $("label#password-desc"),
    newPasswordField = $("input#password");

const newPasswordConfirmDesc = $("label#password-confirm-desc"),
    newPasswordConfirmField = $("input#password-confirm");

const submitButton = $("input#submit-button"),
    submitMessage = $("p#submit-message");

$(document).ready(() => {
    submitButton.click(e => {
        e.preventDefault();
        resetElements();

        const { valid, newPassword, newPasswordConfirm } = checkValid();
        if (valid) {
            console.log("New password valid.");
            // sendPasswordReset({ newPassword });
        }
    });
});

// Resets elements that may be updated
const resetElements = () => {
    resetStyle(newPasswordDesc);
    newPasswordDesc.text("Password must have at least 8 characters long, at least 1 uppercase and 1 lowercase letter, at least 1 number");
    highlightText(newPasswordDesc, "gray");
    resetStyle(newPasswordField);

    resetStyle(newPasswordConfirmDesc);
    newPasswordConfirmDesc.text("Re-enter new password");
    highlightText(newPasswordConfirmDesc, "gray");
    resetStyle(newPasswordConfirmField);

    submitMessage.text("");
};

// Checks that the fields are valid
// Highlights and updates respective label text value of invalid fields
const checkValid = () => {
    const newPasswordField = $("input#password");
    const newPassword = newPasswordField.val();
    const newPasswordConfirmField = $("input#password-confirm");
    const newPasswordConfirm = newPasswordConfirmField.val();

    const isPasswordValid = checkPassword(newPassword);
    if (isPasswordValid === false) {
        console.log("Password is not valid.");
        // Change Password text to clarify password requirements
        newPasswordDesc.text("Invalid Password: The password must have at least 8 characters long, at least 1 uppercase and 1 lowercase letter, at least 1 number");
        highlightText(newPasswordDesc, "red");
        highlightInputField(newPasswordField);
    } else {
        newPasswordDesc.css("display", "none");
    }

    const bothPasswordsMatch = (newPassword === newPasswordConfirm);
    if (bothPasswordsMatch === false) {
        newPasswordConfirmDesc.text("Invalid Response: The entered passwords do not match");
        highlightText(newPasswordConfirmDesc, "red");
        highlightInputField(newPasswordConfirmField);
    } else if (checkStringNotEmpty(newPasswordConfirm)) {
        newPasswordConfirmDesc.css("display", "none");
    }

    if (isPasswordValid && bothPasswordsMatch) {
        return { valid: true, newPassword, newPasswordConfirm };
    }
    return { valid: false, newPassword,newPasswordConfirm };
};