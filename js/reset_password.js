import { highlightInputField, highlightText, resetStyle, checkStringNotEmpty } from "./vars_and_helpers.js";

const newPasswordDesc = $("label#password-desc"),
    newPasswordField = $("input#password"),
    newPasswordConfirmDesc = $("label#password-confirm-desc"),
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
    newPasswordDesc.text("Password must have at least 8 characters long, at least 1 uppercase and 1 lowercase letter, at least 1 number");
    highlightText(newPasswordDesc, "gray");
    resetStyle(newPasswordField);

    newPasswordConfirmDesc.text("Re-enter new password");
    highlightText(newPasswordConfirmDesc, "gray");
    resetStyle(newPasswordConfirmField);

    submitMessage.text("");
}

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
    }

    const bothPasswordsMatch = (newPassword === newPasswordConfirm);
    if (bothPasswordsMatch === false) {
        newPasswordConfirmDesc.text("Invalid Response: The entered passwords do not match");
        highlightText(newPasswordConfirmDesc, "red");
        highlightInputField(newPasswordConfirmField);
    }

    if (isPasswordValid && bothPasswordsMatch) {
        return { valid: true, newPassword, newPasswordConfirm };
    }
    return { valid: false, newPassword,newPasswordConfirm };
}

const checkPassword = password => {
   const passwordLength = password.length;
   if (password == null || passwordLength < 8) {
       return false;
   }

   let numUppercaseLetters = 0, numLowercaseLetters = 0, numNumbers = 0;
   for (let i = 0; i < passwordLength; i++) {
       const c = password[i];
       if (!isNaN(c)) {
           numNumbers++;
       } else {
           if (c === c.toUpperCase()) {
               numUppercaseLetters++;
           } else {
               numLowercaseLetters++;
           }
       }
   }

   return (numUppercaseLetters > 0 && numLowercaseLetters > 0 && numNumbers > 0);
};