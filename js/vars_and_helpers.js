const localSpringBootServerUrl = "http://localhost:8080";
const highlightInputFieldColor = "rgb(255, 0, 0)";
const minimumBookDescriptionLength = 10, maximumBookDescriptionLength = 250;
const indexPageFilename = "index.html", loginPageFilename = "login.html", 
    listBookPageFilename = "list_book.html", bookListingsPageFilename = "book_listings.html";

const otherLeftNavbarItems = `<li><a href=${listBookPageFilename}>List Book</a></li>` + 
`<li><a href=${bookListingsPageFilename}>Book Listings</a></li>`;

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
    if (!checkStringNotEmpty(isbn)) {
        return false;
    }

    let numNumbers = 0;
    for (let i = 0; i < isbn.length; i++) {
        const c = isbn[i];
        if (!isNaN(c) && c !== " ") {
            numNumbers++;
        } else if (c !== "-" && c !== " ") {
            return false;
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

const displayBookListings = isSearchResult => {
    var bookList = isSearchResult ? JSON.parse(window.sessionStorage.getItem("searchedBookList")) :
                    JSON.parse(window.sessionStorage.getItem("personalBookList"));

    if (!bookList || bookList.length === 0) {
        //If No Books
    }
    else {
        for (var book of bookList) {
            let ownerInfoEntry = '';
            if (isSearchResult) {
                ownerInfoEntry = `<div class="collection-book-attr owner-info">Owner: ${book.owner}</div>`;
                if (sessionStorage.getItem("email") == book.owner) {
                    ownerInfoEntry = '<div class="collection-book-attr">Your Listing</div>';
                }
            }

            let optionEntry = '<div class="collection-book-attr select-option"></div>';
            if (isSearchResult) {  
                if (sessionStorage.getItem("email") == book.owner) { optionEntry = '' }
                else { optionEntry = `<div class="collection-book-attr request-option"><a>Request Book</a></div>` }
            }

            $(isSearchResult ? '.search-results-list' : '.collection-list').find('tbody').append(
                '<tr class="collection-row">'+
                    '<td>'+
                        '<button class="collection-row-content">'+
                            ' <div class="list-div">'+
                                '<img src="images/book-add.png" class="collection-book-image">'+
                                //'<img src="images/minus-button.png" class="remove-element-button">'+
                                `<div class="book-id">${book.id}</div>`+
                                `<div class="book-name">${book.name}</div>`+
                                `<div class="collection-book-attr book-isbn">ISBN: ${book.isbn}</div>`+
                                `<div class="collection-book-attr">Condition: ${book.condition}</div>`+
                                `<div class="collection-book-attr">${(book.forExchange) ? "For Exchange" : "For Give Away"}</div>`+
                                `<div class="collection-book-attr">Description: ${book.description}</div>`+
                                ownerInfoEntry +
                                optionEntry +
                                '</div>'+
                            '</button>'+
                        '</td>'+
                   '</tr>'
            );
        }
    }

    return { selectOption: $(".select-option"), requestOption: $(".request-option") };
};

export { localSpringBootServerUrl, minimumBookDescriptionLength, maximumBookDescriptionLength, 
    indexPageFilename, loginPageFilename, listBookPageFilename, bookListingsPageFilename,
    otherLeftNavbarItems,
    checkStringNotEmpty, checkEmail, checkPassword, checkISBN, 
    checkBookDescriptionNotTooShort, checkBookDescriptionNotTooLong, 
    highlightInputField, highlightText, resetStyle,
    displayBookListings };