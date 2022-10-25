import { highlightInputField, highlightText, resetStyle, checkStringNotEmpty } from "./vars_and_helpers.js";
import { sendAccountInfo } from "./requests.js"

$(document).ready(() => {
    $(".submit-button").click(e => {
        e.preventDefault();
        resetElements();

        const { valid, universityName, username, firstName, lastName, email, password } = checkAccountInfoValid();
        if (valid) {
            console.log("Account information valid.");
            sendAccountInfo({ universityName, username, firstName, lastName, email, password });
        }
    });

});

// Resets elements that may be updated by this script
const resetElements = () => {
    $("label#university-desc").text("Enter the name of your university");
    highlightText("university-desc", "gray");
    resetStyle($("input#university"));

    $("label#username-desc").text("Enter a username");
    highlightText("username-desc", "gray");
    resetStyle($("input#username"));

    $("label#first-name-desc").text("Enter your first name");
    highlightText("first-name-desc", "gray");
    resetStyle($("input#first-name"));

    $("label#last-name-desc").text("Enter your last name");
    highlightText("last-name-desc", "gray");
    resetStyle($("input#last-name"));

    $("label#email-desc").text("Enter your email");
    highlightText("email-desc", "gray");
    resetStyle($("input#email"));

    $("label#password-desc").text("Password must have at least 8 characters long, at least 1 uppercase and 1 lowercase letter, at least 1 number");
    highlightText("password-desc", "gray");
    resetStyle($("input#password"));

    $("label#confirm-password-desc").text("Re-enter password");
    highlightText("confirm-password-desc", "gray");
    resetStyle($("input#confirm-password"));

    $(".submit-message").text("");
}

// Checks that the fields have been correctly entered
// Highlights and updates respective label text value of invalid fields
const checkAccountInfoValid = () => {
    const universityNameField = $("input#university"),
            universityName = universityNameField.val(),
            usernameField = $("input#username"),
            username = usernameField.val(),
            firstNameField = $("input#first-name"),
            firstName = firstNameField.val(),
            lastNameField = $("input#last-name"),
            lastName = lastNameField.val(),
            emailField = $("input#email"),
            email = emailField.val(),
            passwordField = $("input#password"),
            password = passwordField.val(),
            confirmPasswordField = $("input#confirm-password"),
            confirmPassword = confirmPasswordField.val();

    const isUniversityValid = checkStringNotEmpty(universityName),
        isUsernameValid = checkStringNotEmpty(username),
        isFirstNameValid = checkStringNotEmpty(firstName),
        isLastNameValid = checkStringNotEmpty(lastName),
        isEmailValid = checkEmail(email),
        isPasswordValid = checkPassword(password),
        isConfirmPasswordValid = (password === confirmPassword);

    if (!isUniversityValid) {
        $("label#university-desc").text("Invalid Response: Enter the name of your University");
        highlightText("university-desc", "red");
        highlightInputField(universityNameField);
    }

    if (!isUsernameValid) {
        $("label#username-desc").text("Invalid Response: Enter a username");
        highlightText("username-desc", "red");
        highlightInputField(usernameField);
    }

    if (!isFirstNameValid) {
        $("label#first-name-desc").text("Invalid Response: Enter your first name");
        highlightText("first-name-desc", "red");
        highlightInputField(firstNameField);
    }

    if (!isLastNameValid) {
        $("label#last-name-desc").text("Invalid Response: Enter your last name");
        highlightText("last-name-desc", "red");
        highlightInputField(lastNameField);
    }

    if (!isEmailValid) {
        $("label#email-desc").text("Invalid Response: Email must be in form of <something>@<domain>.<ext> (e.g, username@college.edu)");
        highlightText("email-desc", "red");
        highlightInputField(emailField);
    }

    if (!isPasswordValid) {
        $("label#password-desc").text("Invalid Response: Password must have at least 8 characters long, at least 1 uppercase and 1 lowercase letter, at least 1 number");
        highlightText("password-desc", "red");
        highlightInputField(passwordField);
    }

    if (!isConfirmPasswordValid) {
        $("label#confirm-password-desc").text("Invalid Response: The entered passwords does not match");
        highlightText("confirm-password-desc", "red");
        highlightInputField(confirmPasswordField);
    }

    return { valid: isUniversityValid && isUsernameValid && isFirstNameValid && isLastNameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid,
        universityName, username, firstName, lastName, email, password };
};

// Checks that the email field is valid.
const checkEmail = email => {
    if (email == null && email.length == 0) {
        return false;
    }

    let atSymbolIndex = email.indexOf("@");
    if (atSymbolIndex == -1) {
        return false;
    } 

    let dotSymbolIndex = email.indexOf(".");
    if (dotSymbolIndex == -1) {
        return false;
    }

    let beforeAtSymbol = email.substring(0, atSymbolIndex);
    if (beforeAtSymbol.length == 0) {
        return false;
    }

    let afterAtSymbolBeforeDot = email.substring(atSymbolIndex + 1, dotSymbolIndex);
    if (afterAtSymbolBeforeDot.length == 0) {
        return false;
    }

    let afterDotSymbol = email.substring(dotSymbolIndex + 1);
    if (afterDotSymbol.length == 0) {
        return false;
    }

    return true;
};

// Checks that the password is valid.
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