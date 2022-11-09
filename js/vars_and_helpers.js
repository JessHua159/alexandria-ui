const localSpringBootServerUrl = "http://localhost:8080";
const highlightInputFieldColor = "rgb(255, 0, 0)";
const minimumBookDescriptionLength = 10, maximumBookDescriptionLength = 250;
const indexPageFilename = "index.html", loginPageFilename = "login.html", listBookPageFilename = "list_book.html", personalListingsPageFilename = "personal_listings.html";

const checkStringNotEmpty = x => x != null && x.length > 0;

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

const checkISBN = isbn => {
    let numNumbers = 0;
    for (let i = 0; i < isbn.length; i++) {
        const c = isbn[i];
        if (!isNaN(c)) {
            numNumbers++;
        }   
    }

    return (numNumbers == 13);
}

const checkBookDescriptionNotTooShort = bookDescription => {
    return bookDescription.length >= minimumBookDescriptionLength;
}

const checkBookDescriptionNotTooLong = bookDescription => {
    return bookDescription.length <= maximumBookDescriptionLength;
}

const highlightInputField = inputField => {
    inputField.css("outline", "none");
    inputField.css("border-color", highlightInputFieldColor);
    inputField.css("box-shadow", `0 0 3px ${highlightInputFieldColor}`);
};

const highlightText = (ele, newColor) => ele.css("color", newColor);

const resetStyle = element => element.attr("style", "");



export { localSpringBootServerUrl, minimumBookDescriptionLength, maximumBookDescriptionLength, 
    indexPageFilename, loginPageFilename, listBookPageFilename, personalListingsPageFilename,
    checkStringNotEmpty, checkEmail, checkPassword, checkISBN, 
    checkBookDescriptionNotTooShort, checkBookDescriptionNotTooLong, 
    highlightInputField, highlightText, resetStyle };

