import { highlightInputField, highlightText, resetStyle, checkStringNotEmpty } from "./vars_and_helpers.js";
import { sendAccountInfo } from "./requests.js"

const labelUniversityDesc = $("label#university-desc"),
    universityNameField = $("input#university"),
    labelUsernameDesc = $("label#username-desc"),
    usernameField = $("input#username"),
    firstNameDesc = $("label#first-name-desc"),
    firstNameField = $("input#first-name"),
    lastNameDesc = $("label#last-name-desc"),
    lastNameField = $("input#last-name"),
    emailDesc = $("label#email-desc"),
    emailField = $("input#email"),
    passwordDesc = $("label#password-desc"),
    passwordField = $("input#password"),
    confirmPasswordDesc = $("label#confirm-password-desc"),
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
    labelUniversityDesc.text("Enter the name of your university");
    highlightText("university-desc", "gray");
    resetStyle(universityNameField);

    labelUsernameDesc.text("Enter a username");
    highlightText("username-desc", "gray");
    resetStyle(usernameField);

    firstNameDesc.text("Enter your first name");
    highlightText("first-name-desc", "gray");
    resetStyle(firstNameField);

    lastNameDesc.text("Enter your last name");
    highlightText("last-name-desc", "gray");
    resetStyle(lastNameField);

    emailDesc.text("Enter your email");
    highlightText("email-desc", "gray");
    resetStyle(emailField);

    passwordDesc.text("Password must have at least 8 characters long, at least 1 uppercase and 1 lowercase letter, at least 1 number");
    highlightText("password-desc", "gray");
    resetStyle(passwordField);

    confirmPasswordDesc.text("Re-enter password");
    highlightText("confirm-password-desc", "gray");
    resetStyle(confirmPasswordField);

    submitMessage.text("");
}

// Checks that the fields have been correctly entered
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
        labelUniversityDesc.text("Invalid Response: Enter the name of your university");
        highlightText("university-desc", "red");
        highlightInputField(universityNameField);
    }

    if (!isUsernameValid) {
        labelUsernameDesc.text("Invalid Response: Enter a username");
        highlightText("username-desc", "red");
        highlightInputField(usernameField);
    }

    if (!isFirstNameValid) {
        firstNameDesc.text("Invalid Response: Enter your first name");
        highlightText("first-name-desc", "red");
        highlightInputField(firstNameField);
    }

    if (!isLastNameValid) {
        lastNameDesc.text("Invalid Response: Enter your last name");
        highlightText("last-name-desc", "red");
        highlightInputField(lastNameField);
    }

    if (!isEmailValid) {
        emailDesc.text("Invalid Response: Email must be in form of <something>@<domain>.<ext> (e.g, username@college.edu)");
        highlightText("email-desc", "red");
        highlightInputField(emailField);
    }

    if (!isPasswordValid) {
        passwordDesc.text("Invalid Response: Password must have at least 8 characters long, at least 1 uppercase and 1 lowercase letter, at least 1 number");
        highlightText("password-desc", "red");
        highlightInputField(passwordField);
    }

    if (!isConfirmPasswordValid) {
        confirmPasswordDesc.text("Invalid Response: The entered passwords does not match");
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