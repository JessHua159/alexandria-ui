import { localSpringBootServerUrl } from "./vars.js";

const highlightInputFieldColor = "rgb(29, 39, 48)";

$(document).ready(() => {
    $(".submit-button").click(e => {
        e.preventDefault();
        const { valid, universityName, email, password } = checkAccountInfoValid();
        if (valid) {
            console.log("Account information valid.");
            sendAccountInfo({ universityName, email, password });
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

const highlightInputField = inputField => {
    inputField.css("outline", "none");
    inputField.css("border-color", highlightInputFieldColor);
    inputField.css("box-shadow", `0 0 3px ${highlightInputFieldColor}`);
};

const resetStyle = element => element.attr("style", "");

// Sends account info to respective Spring Boot route
const sendAccountInfo = ({universityName, email, password}) => {
    // Create ajax request with respective info
    // Password is encoded after it is sent to the Spring Boot back-end
    const accountInfo = {
        university: universityName,
        primaryEmail: email,
        password
    };
    
    const accountInfoJSON = JSON.stringify(accountInfo);

    const ajaxRequestToSendAccountInfo = $.ajax({
        type: "POST",
        url: `${localSpringBootServerUrl}/api/signup`,
        headers: {
            "Content-Type": "application/json",
        },
        data: accountInfoJSON
    });

    // .done() for success:
    // .fail() for error:
    // .always() for complete:
    
    ajaxRequestToSendAccountInfo.done(data => {
        console.log("Account has been successfully created.");
        console.log(`Data returned: ${data}`);
        loginUser({ email, password})
    }).fail(err => {
        console.log("Account has not been created.");
        $(".account-creation-error-message").text(`There is an error with account creation. Error: ${err.statusText}.`);
    });
};

const loginUser = ({email, password}) => {
    // Send ajax request to log in user
    const accountInfo = {
        primaryEmail: email,
        password
    };
    
    const accountInfoJSON = JSON.stringify(accountInfo);

    const ajaxRequestToSendLoginInfo = $.ajax({
        type: "GET",
        url: `${localSpringBootServerUrl}/api/signup`,
        headers: {
            "Content-Type": "application/json",
        },
        data: accountInfoJSON
    });

    ajaxRequestToSendLoginInfo.done(data => {
        console.log("Login successful.");
        console.log(`Data returned: ${data}`);
        // Get JWT token and store that in vars.js
        // Redirect user to home page
    }).fail(err => {
        console.log("Login failed.");
        $(".account-creation-error-message").text(`There is an error with login after account creation. Error: ${err.statusText}.`);
    });
}