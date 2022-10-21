import { highlightInputField, resetStyle, checkStringNotEmpty } from "./vars_and_helpers.js";
import { sendAccountInfo } from "./requests.js"

$(document).ready(() => {
    $(".submit-button").click(e => {
        e.preventDefault();
        $(".submit-message").text("");

        const { valid, universityName, username, firstName, lastName, email, password } = checkAccountInfoValid();
        if (valid) {
            console.log("Account information valid.");
            sendAccountInfo({ universityName, username, firstName, lastName, email, password });
        }
    });

});

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
            password = passwordField.val();

    const isUniversityValid = checkStringNotEmpty(universityName),
        isUsernameValid = checkStringNotEmpty(username),
        isFirstNameValid = checkStringNotEmpty(firstName),
        isLastNameValid = checkStringNotEmpty(lastName),
        isEmailValid = checkEmail(email),
        isPasswordValid = checkPassword(password);

    if (!isUniversityValid) {
        $("label#university").text(`University (value invalid)`);  
        highlightInputField(universityNameField);
    } else {
        $("label#university").text("University");
        resetStyle(universityNameField);
    }

    if (!isUsernameValid) {
        $("label#username").text("Username (value invalid)");
        highlightInputField(usernameField);
    } else {
        $("label#username").text("Username");
        resetStyle(usernameField);
    }

    if (!isFirstNameValid) {
        $("label#first-name").text("First name (value invalid)");
        highlightInputField(firstNameField);
    } else {
        $("label#first-name").text("First name");
        resetStyle(firstNameField);
    }

    if (!isLastNameValid) {
        $("label#last-name").text("Last name (value invalid)"); 
        highlightInputField(lastNameField);
    } else {
        $("label#last-name").text("Last name");
        resetStyle(lastNameField);
    }

    if (!isEmailValid) {
        $("label#email").text("Email (invalid email, must be in form of <something>@<something>.<domain>)");
        highlightInputField(emailField);
    } else {
        $("label#email").text("Email");
        resetStyle(emailField);
    }

    if (!isPasswordValid) {
        $("label#password").text("Password (password does not meet requirements: at least 8 characters long, at least 1 uppercase and 1 lowercase letter, at least 1 number)");
        highlightInputField(passwordField);
    } else {
        $("label#password").text("Password");
        resetStyle(passwordField);
    }

    return { valid: isUniversityValid && isEmailValid && isPasswordValid, 
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