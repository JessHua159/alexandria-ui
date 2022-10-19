const highlightInputFieldColor = "rgb(29, 39, 48)";

$(document).ready(() => {
    $(".submit-button").click(e => {
        e.preventDefault();
        const { valid, universityName, email, password } = checkAccountInfoValid();
        if (valid) {
            console.log("Account information valid.");
            createAccount({ universityName, email, password });
        }
    });

});

// Checks that the fields have been correctly entered
// Highlights and updates respective label text value of invalid fields
const checkAccountInfoValid = () => {
    const universityNameField = $("input#university"),
        universityName = universityNameField.val(),
            emailField = $("input#email"),
            email = emailField.val(),
            passwordField = $("input#password"),
            password = passwordField.val();

    const isUniversityValid = checkUniversityName(universityName),
        isEmailValid = checkEmail(email),
        isPasswordValid = checkPassword(password);

    if (!isUniversityValid) {
        $("label#university").text("University (value invalid)");    // or university name is not in database
        highlightInputField(universityNameField);
    } else {
        $("label#university").text("University");
        resetStyle(universityNameField);
    }

    if (!isEmailValid) {
        $("label#email").text("Email (invalid email)");
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
        universityName, email, password };
};

// Checks that the universityName value is valid.
const checkUniversityName = universityName => {
    // Gets valid university names from back-end
    // const validUniversityNames = <result of ajax request to back-end for university names>
    // Checks that universityName is in validUniversityNames

    return (universityName != null && universityName.length > 0)
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

    let beforeAtSymbol = email.substring(0, atSymbolIndex);
    if (beforeAtSymbol.length == 0) {
        return false;
    }

    let afterAtSymbol = email.substring(atSymbolIndex + 1);
    if (afterAtSymbol.length == 0) {
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
        c = password[i];
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

const highlightInputField = inputField => {
    inputField.css("outline", "none");
    inputField.css("border-color", highlightInputFieldColor);
    inputField.css("box-shadow", `0 0 3px ${highlightInputFieldColor}`);
};

const resetStyle = element => element.attr("style", "");

const createAccount = ({universityName, email, password}) => {
    console.log(universityName);
    console.log(email);
    console.log(password);
};