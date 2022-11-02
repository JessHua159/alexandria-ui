import { checkStringNotEmpty, checkEmail, checkPassword, highlightInputField, highlightText, resetStyle } from "./vars_and_helpers.js";
import { sendTokenRequest, sendTokenAndChangePassword } from "./requests.js"


const emailField = $("input#email"),
    emailDesc = $("label#email-desc");

const resetCodeField = $("label#reset-code"),
    resetCodeDesc = $("label#reset-code-desc");


const newPasswordDesc = $("label#password-desc"),
    newPasswordField = $("input#password");

const newPasswordConfirmDesc = $("label#password-confirm-desc"),
    newPasswordConfirmField = $("input#password-confirm");

const submitEmailButton = $("input#submit-email-button"),
    submitEmailMessage = $("p#submit-email-message");

const submitPasswordButton = $("input#submit-password-button"),
    submitPasswordMessage = $("p#submit-password-message");

var displayEmailComponents = true;

$(document).ready(() => {
    displayComponents();

    submitEmailButton.click(e => {
        e.preventDefault();
        resetElements();
        displayComponents();
        const { valid, email } = checkEmailValid();
        console.log(valid);
        console.log(email);
        if (valid) {
            console.log("email is in proper email format.");
            displayEmailComponents = false; // Hide email components
            submitEmailMessage.text("If the email entered is associated with an account, then you were sent an email with a password reset code to enter below");
            displayEmailComponents = false;
            displayComponents();
            sendTokenRequest({ email });
        }
    });

    submitPasswordButton.click(e => {
        e.preventDefault();
        resetElements();
        const { valid, newPassword, newPasswordConfirm } = checkValid();
        if (valid) {
            console.log("New password valid.");
            sendTokenAndChangePassword({ newPassword });
        }
    });
});


const displayComponents = () => {
    if (displayEmailComponents) { //show email input but hide token and password inputs
        hidePasswordComponents();
        showEmailComponents();
    }
    else { //hide email Components
        hideEmailComponents();
        showPasswordComponents();
    }
};

//hide email components
const hideEmailComponents = () => {
    $("label#email").hide();
    $("#email-desc").hide();
    $("input#email").hide();
    $("br#email-label").hide();
    $("br#email-input").hide();
    $("#submit-email-button").hide();

}
const showEmailComponents = () => {
    $("label#email").show();
    $("#email-desc").show();
    $("input#email").show();
    $("br#email-label").show();
    $("br#email-input").show();
    $("#submit-email-button").show();
}

//hide non email components
const hidePasswordComponents = () => {
    $("label#reset-code").hide();
    $("#reset-code-desc").hide();
    $("input#reset-code").hide();

    $("label#password").hide();
    $("#password-desc").hide();
    $("input#password").hide();

    $("label#password-confirm").hide();
    $("#password-confirm-desc").hide();
    $("input#password-confirm").hide();

    $("#submit-password-button").hide();
}
const showPasswordComponents = () => {
    $("label#reset-code").show();
    $("#reset-code-desc").show();
    $("input#reset-code").show();

    $("label#password").show();
    $("#password-desc").show();
    $("input#password").show();

    $("label#password-confirm").show();
    $("#password-confirm-desc").show();
    $("input#password-confirm").show();

    $("#submit-password-button").show();
}

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

    submitPasswordMessage.text("");
};


const checkEmailValid = () => {
    const email = emailField.val();
    const isValid = checkEmail(email);
    if (isValid) {
        return { valid: true, email };
    }
    return { valid: false, email };
}


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