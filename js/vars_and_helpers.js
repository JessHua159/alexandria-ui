const localSpringBootServerUrl = "http://localhost:8080";
const highlightInputFieldColor = "rgb(255, 0, 0)";
const minimumBookDescriptionLength = 10, maximumBookDescriptionLength = 250;
const indexPageFilename = "index.html", loginPageFilename = "login.html", 
    listBookPageFilename = "list_book.html", bookListingsPageFilename = "book_listings.html",
    exchangesPageFilename = "book_exchange.html";

const otherLeftNavbarItems = `<li><a href=${listBookPageFilename}>List Book</a></li>` + 
`<li><a href=${bookListingsPageFilename}>Book Listings</a></li>` + 
`<li><a href=${exchangesPageFilename}>Exchanges</a></li>`;

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
                if(book.status==2)continue;
                ownerInfoEntry = `<div class="collection-book-attr owner-info">Owner: ${book.owner}</div>`;
                if (sessionStorage.getItem("email") == book.owner) {
                    ownerInfoEntry = '<div class="collection-book-attr">Your Listing</div>';
                }
            }

            let optionEntry = '<div class="collection-book-attr"></div>';
            let bookCollectionStatus = '';
            if (isSearchResult) {  
                if (sessionStorage.getItem("email") == book.owner) { optionEntry = '' }
                else { optionEntry = `<div class="collection-book-attr request-option"><a class="request_book_btn">Request Book</a></div>` }
            }else{
                console.log(book.status);
                const listingStatus = book.status==0?'WAITING':(book.status==1?'ACTIVE':'DONE');
                bookCollectionStatus=`<div class="collection-book-attr ${listingStatus}">${listingStatus}</div>`;
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
                                optionEntry + bookCollectionStatus +
                                '</div>'+
                            '</button>'+
                        '</td>'+
                   '</tr>'
            );
        }
    }

    return { requestOption: $(".request-option") };
};

const displayRequestExchangeInfo = (initiatedBookExchange, userBookCollection, exchangeBookInfo) => {    
    let requestExchangeHTML = '';
    const forExchange = exchangeBookInfo.forExchange;

    if (initiatedBookExchange != null) { 
        // Logged in account has already initiated an exchange, so cannot make another exchange
        // requestExchangeHTML += '<section>';
        // requestExchangeHTML += `<p>You have initiated an exchange with your book with id ${initiatedBookExchange.firstPartyBookId}<br>with ${initiatedBookExchange.otherPartyId}'s book with id ${initiatedBookExchange.otherPartyBookId}.<br>Until that exchange has been completed, you cannot make another exchange.</p>`;
        // requestExchangeHTML += '</section>';

        requestExchangeHTML += '<section>';
        requestExchangeHTML += `<div class="requested_exchanges_div">You have initiated an exchange with ${initiatedBookExchange.otherPartyId}</div>`;
        requestExchangeHTML += `<div class="requested_exchanges_div">Your book: ${initiatedBookExchange.firstPartyBookDetails.name}</div>`;
        requestExchangeHTML += `<div class="requested_exchanges_div">${initiatedBookExchange.otherPartyId}'s book: ${initiatedBookExchange.otherPartyBookDetails.name}</div>`;
        requestExchangeHTML += '</section>';

    } else {
        // Logged in account has requested book, but not initiated the exchange.
        requestExchangeHTML += '<section>';

        if (forExchange) {
            requestExchangeHTML += '<select name="user_books" id="user_books_list">';
            requestExchangeHTML += '</select>';
        }
        
        requestExchangeHTML += '<p>Book name: <span class="other_party_book_name"></span></p>';
        requestExchangeHTML += '<p>Book ISBN: <span class="other_party_book_isbn"></span></p>';
        requestExchangeHTML += '<p>Book owner: <span class="other_party_user"></span></p>';
        requestExchangeHTML += '</section>';
        requestExchangeHTML += '<section class="exchange-page-buttons">';
        requestExchangeHTML += '<button type="button" class="submit-button" id="request-exchange">Request Exchange</button>';
        requestExchangeHTML += '<button type="button" class="submit-button" id="cancel-exchange">Cancel</button>';
        requestExchangeHTML += '</section>';
        
    }

    $(".request-exchange").html(requestExchangeHTML);

    if (forExchange) {
        for(let bookNum in userBookCollection) {
            if(userBookCollection[bookNum].status==2)continue;
            let option = `<option value='${userBookCollection[bookNum].id}' id="logged-in-user-book-name-option">${userBookCollection[bookNum].name}</option>`;
            $('#user_books_list').append(option);
        }
    }

    $('span.other_party_book_name').html(exchangeBookInfo.name); 
    $('span.other_party_book_isbn').html(exchangeBookInfo.isbn);
    $('.other_party_user').html(exchangeBookInfo.owner);  
}

const displayIncomingExchangesInfo = bookExchanges => {
    const loggedInUserId = sessionStorage.getItem('email');
    let incomingExchangesHTML = '';

    let noIncomingExchanges = true;

    for (let bookExchangeNum in bookExchanges) {
        let bookExchange = bookExchanges[bookExchangeNum];
        if (bookExchange.initiatorId !== null && loggedInUserId === bookExchange.firstPartyId 
            && loggedInUserId !== bookExchange.initiatorId) {
            if (noIncomingExchanges) {
                noIncomingExchanges = false;
            }

            incomingExchangesHTML += '<div>';
            incomingExchangesHTML += '<section>';
            incomingExchangesHTML += `<p id="other-party-book-id" value=${bookExchange.otherPartyBookId}>Book name of book from ${bookExchange.initiatorId}: (name of book with id ${bookExchange.otherPartyBookId})</p>`;
            incomingExchangesHTML += `<p>Book ISBN of book from ${bookExchange.initiatorId}: (ISBN of book with id ${bookExchange.otherPartyBookId})</p>`;
            incomingExchangesHTML += `<p id="first-party-book-id" value=${bookExchange.firstPartyBookId}>Book name of book requested from your listings: (name of book with id ${bookExchange.firstPartyBookId})</p>`;
            incomingExchangesHTML += `<p>Book ISBN of book requested from your listings: (ISBN of book with id ${bookExchange.firstPartyBookId})</p>`;
            incomingExchangesHTML += '</section>';
            incomingExchangesHTML += `<section class="exchange-page-buttons">`;
            incomingExchangesHTML += `<button type="button" class="submit-button" id="accept-exchange" value=${bookExchange.id}>Accept</button>`;
            incomingExchangesHTML += `<button type="button" class="submit-button" id="reject-exchange" value=${bookExchange.id}>Reject</button>`;
            incomingExchangesHTML += `</section>`;
            incomingExchangesHTML += '</div>'; 
        }         
    }

    if (noIncomingExchanges) {
        incomingExchangesHTML += "<section>";
        incomingExchangesHTML += "<p>You have no incoming exchanges.</p>";
        incomingExchangesHTML += "</section>";
    }

    $(".incoming-exchanges").html(incomingExchangesHTML);
};

export { localSpringBootServerUrl, minimumBookDescriptionLength, maximumBookDescriptionLength, 
    indexPageFilename, loginPageFilename, listBookPageFilename, bookListingsPageFilename, exchangesPageFilename,
    otherLeftNavbarItems,
    checkStringNotEmpty, checkEmail, checkPassword, checkISBN, 
    checkBookDescriptionNotTooShort, checkBookDescriptionNotTooLong, 
    highlightInputField, highlightText, resetStyle,
    displayBookListings, 
    displayRequestExchangeInfo, displayIncomingExchangesInfo };