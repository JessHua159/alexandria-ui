import { localSpringBootServerUrl, indexPageFilename, exchangesPageFilename, 
    highlightInputField, highlightText, resetStyle, 
    displayBookListings,
    displayRequestExchangeInfo, displayIncomingExchangesInfo, bookListingsPageFilename } from "./vars_and_helpers.js"

const sendTokenRequest = ({ email }) => {
    const emailObj = {
        "email": email
    };
    const emailJSON = JSON.stringify(emailObj);
    console.log(emailJSON);

    const ajaxPasswordResetTokenRequest = $.ajax({
        method: "POST",
        url: `${localSpringBootServerUrl}/api/passwordReset`,
        headers: {
            "Content-Type": "application/json"
        },
        data: emailJSON,
        crossDomain: true
    });

    ajaxPasswordResetTokenRequest.done(data => {
        console.log("Reset token has been generated and sent to user email");
        console.log("Data returned: ");
        console.log(data);
    }).fail(err => {
        console.log("Reset token has NOT been sent to email.");
        console.log("Error: ")
        console.log(err);
    });
};

// Sends ajax request to create account
const sendAccountInfo = ({ universityName, firstName, lastName, email, password }) => {
    const accountInfo = {
        "university": { "name": universityName },
        "firstName": firstName,
        "lastName": lastName,
        "username": email,
        // "primaryEmail": email,
        "password": password
    };

    const accountInfoJSON = JSON.stringify(accountInfo);

    const ajaxRequestToSendAccountInfo = $.ajax({
        method: "POST",
        url: `${localSpringBootServerUrl}/api/signup`,
        headers: {
            "Content-Type": "application/json",
        },
        data: accountInfoJSON,
        // dataType: "json",
        crossDomain: true,
        success: function(response){
            alert("User account created successfully");
            $("#submit-button").hide();
            let emailConfirmationCodeField = `<label for="emailConfirmation">Account confirmation code:</label><input type="text" id="emailConfirmation" name="emailConfirmation"><br>`;
            let emailConfirmationButton = '<button type="button" id="acc_verification_btn">Verify code</button>';
            let output = emailConfirmationCodeField + emailConfirmationButton;
            $("#acc_creation_form").append(output);

            $("#acc_verification_btn").click(function (e) { 
                e.preventDefault();
                const validationCode = $("#emailConfirmation").val();
                const validationData = JSON.stringify({
                    "email": email,
                    "validationCode": validationCode
                });
                $.ajax({
                    method: "POST",
                    url: `${localSpringBootServerUrl}/api/verifyUser`,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    data: validationData,
                    // dataType: "json",
                    crossDomain: true,
                    statusCode:{
                        200: function(response){
                            alert("Account successfully validated!");
                            window.location="index.html";
                        },
                        400: function(response){
                            alert("Account validation failed!");
                        }
                    },
                    
                });
            });
        }
    });

    // .done() for success:
    // .fail() for error:
    // .always() for complete:

    ajaxRequestToSendAccountInfo.done(data => {
        console.log("Account has been created.");
        console.log("Data returned: ");
        console.log(data);

        $("p#submit-message").text("Account has been created.");
        loginUser({ email, password }, true);
    }).fail(err => {
        console.log("Account has not been created.");
        console.log("Error: ")
        console.log(err);

        let submitMessageText = `There is an error with account creation. Return code: ${err.status}. Error: ${err.statusText}.`;
        if (err.status == 400) {
            let errResponseJSONMessage = err.responseJSON.message;
            if (errResponseJSONMessage.indexOf("University name") != -1) {
                const universityDesc = $("label#university-desc");

                universityDesc.css("display", "inline");
                universityDesc.text(errResponseJSONMessage);
                highlightText(universityDesc, "red");
                highlightInputField($("input#university"));
            } else if (errResponseJSONMessage.indexOf("username") != -1) {
                const emailDesc = $("label#email-desc");

                emailDesc.css("display", "inline");
                emailDesc.text(errResponseJSONMessage);
                highlightText(emailDesc, "red");
                highlightInputField($("input#email"));
            }

            submitMessageText = `There is an error with account creation.`;
        }

        $("p#submit-message").text(submitMessageText);
    });
};

const sendTokenAndChangePassword = ({ email, resetToken, newPassword }) => {
    const changePasswordObj = {
        "email": email,
        "resetToken": resetToken,
        "newPassword": newPassword
    };

    const changePasswordJSON = JSON.stringify(changePasswordObj);
    console.log(changePasswordJSON);

    const ajaxPasswordResetTokenRequest = $.ajax({
        method: "POST",
        url: `${localSpringBootServerUrl}/api/changePassword`,
        headers: {
            "Content-Type": "application/json"
        },
        data: changePasswordJSON,
        crossDomain: true
    });

    ajaxPasswordResetTokenRequest.done(data => {
        console.log("User password has been updated");
        console.log("Data returned: ");
        console.log(data);
    }).fail(err => {
        console.log("User password has NOT been updated");
        console.log("Error: ")
        console.log(err);
    });
};


// Sends ajax request to log in user
const loginUser = ({ email, password }, fromAccountCreation) => {
    // const accountInfo = {
    //     "username": email,
    //     "password": password
    // };
    
    // const accountInfoJSON = JSON.stringify(accountInfo);

    const ajaxRequestToSendLoginInfo = $.ajax({
        beforeSend: xhr => xhr.setRequestHeader("Authorization", "Basic " + btoa(email + ":" + password)),
        type: "GET",
        url: `${localSpringBootServerUrl}/api/login`,
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + sessionStorage.getItem("token")
        },
        // data: accountInfoJSON,
        // dataType: "json",
        crossDomain: true
    });

    ajaxRequestToSendLoginInfo.done(data => {
        console.log("Login successful.");

        if (fromAccountCreation) {
            let submitButtonVal = $("input#submit-button").val();
            $("input").val("");
            $("input#submit-button").val(submitButtonVal);
        }

        // stores jwt token to session storage
        sessionStorage.setItem("token", data.jwt);   
        // sessionStorage.setItem("firstName", data.firstName);
        console.log(data);
        sessionStorage.setItem("email", data.email);

        // user gets taken to relevant page after login
        let pageAfterLogin = sessionStorage.getItem("pageAfterLogin");
        window.location = pageAfterLogin != null ? pageAfterLogin : indexPageFilename;

        // $(".submit-message").text(fromAccountCreation ? `Account with email ${email} has been created. You have been logged in.` : "You have been logged in.");
    }).fail(err => {
        console.log("Login failed.");

        let statusNo = err.status;
        if (statusNo == 401)    // Invalid login credentials
            if (!fromAccountCreation) { 
                const emailDesc = $("label#email-desc"), 
                    emailField = $("input#email");
                
                const passwordDesc = $("label#password-desc"), 
                    passwordField = $("input#password");

                resetStyle(emailDesc);
                emailDesc.text("Incorrect email or password");
                highlightText(emailDesc, "red");
                highlightInputField(emailField);
                
                resetStyle(passwordDesc);
                passwordDesc.text("Incorrect email or password");
                highlightText(passwordDesc, "red");
                highlightInputField(passwordField);
                
                passwordField.val("");

                // $("p#submit-message").text(`Incorrect email or password`);
            } else {
                $("p#submit-message").text(`Unable to login after account creation`);
            }
        else {  // Some other error
            $("p#submit-message").text(`There is an error with login. Return code: ${err.status}. Error: ${err.statusText}.`);
        }
    });
};

//get personal book collection
const getPersonalCollection = () => {
    const ajaxRequestPersonalCollection = $.ajax({
        type: "GET",
        url: `${localSpringBootServerUrl}/api/book/collection`,
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + sessionStorage.getItem("token")
        },
        crossDomain: true
    });

    ajaxRequestPersonalCollection.done(data => {
        console.log("Successfully retrieved collection:");
        var bookData = data.data;
        console.log(data);
        console.log(bookData);
        sessionStorage.setItem( "personalBookList", JSON.stringify(bookData) );
        displayBookListings(false);
    }).fail(err => {
        console.log("Failed to retrieve personal collection.");
        let statusNo = err.status;
    });
};


// Checks that user is logged in via the token session storage
const checkUserLoggedIn = () => {
    let tokenVal = sessionStorage.getItem("token");
    if (tokenVal == null) {
        return false;
    }

    return true;
};


// Sends ajax request to add book info
const sendBookInfo = ({ isbn, name, condition, description, listingOption }) => {
    const bookInfo = {
        "isbn": isbn,
        "name": name,
        "condition": condition,
        "description": description,
        "forExchange": false,
        "forGiveAway": false
    };

    if (listingOption == "Exchange") {
        bookInfo.forExchange = true;
    } else if (listingOption == "Give away") {
        bookInfo.forGiveaway = true;
    }

    const bookInfoJSON = JSON.stringify(bookInfo);

    const ajaxRequestToSendBookInfo = $.ajax({
        method: "POST",
        url: `${localSpringBootServerUrl}/api/book`,
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + sessionStorage.getItem("token")
        },
        data: bookInfoJSON,
        crossDomain: true
    });

    ajaxRequestToSendBookInfo.done(data => {
        console.log("Data received: " + data);
        $("p#submit-message").text("Book info successfully added");
        window.location = indexPageFilename;
    }).fail(err => {
        $("p#submit-message").text(`There is an error with add book info. Return code: ${err.status}. Error: ${err.statusText}`);
    });
}

// Sends ajax request to get book listings from search term
const sendBookSearchInfo = ({ searchTerm, isISBN }) => {
    const searchQuery = `${isISBN ? "isbn" : "name"}=${searchTerm}`;

    const ajaxRequestToSendBookSearchInfo = $.ajax({
        method: "GET",
        url: `${localSpringBootServerUrl}/api/book?${searchQuery}`,
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + sessionStorage.getItem("token")
        },
        crossDomain: true
    });

    ajaxRequestToSendBookSearchInfo.done(data => {
        var bookData = data.data;
        $("p#submit-message").text(bookData.length > 0 ? `Search result for ${searchTerm}` : `No search results for ${searchTerm}`);
        sessionStorage.setItem( "searchedBookList", JSON.stringify(bookData) );
        const otherSelector = displayBookListings(true);
        
        otherSelector.requestOption.click(function(e) {
            e.preventDefault();
            
            const firstPartyId = $(this).parent().children(".owner-info").text().substring(7), 
                firstPartyBookId = $(this).parent().children(".book-id").text(),
                firstPartyBookName = $(this).parent().children(".book-name").text(),
                firstPartyBookISBN = $(this).parent().children(".book-isbn").text().substring(6);

            sessionStorage.setItem('exchange_book_id', firstPartyBookId);
            window.location = exchangesPageFilename;
        });
    }).fail(err => {
        $("p#submit-message").text(`There is an error with send book search info. Return code: ${err.status}. Error: ${err.statusText}`);
    });
}

// Gets book exchange information and updates the respective DOM elements that are dependent on that information
const getExchangesInfoAndUpdateDOMElements = () => {
    const ajaxRequestToGetBookExchangeInfo = $.ajax({
        method: "GET",
        url: `${localSpringBootServerUrl}/api/book/exchange`,
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + sessionStorage.getItem("token")
        },
        crossDomain: true
    });

    ajaxRequestToGetBookExchangeInfo.done(data => {
        console.log(data.data);
        getRequestExchangeInfoAndDisplay(data.data);
        displayIncomingExchangesInfo(data.data);

        $("#accept-exchange").click(function () {
            console.log("accept exchange");
            acceptExchange($(this), $(this).val());
        });
    
        $("#reject-exchange").click(function () {
            console.log("reject exchange");
            rejectExchange($(this).val());
        });
    }).fail(err => {
        let errHTMLInfo = '<section>';
        errHTMLInfo += `<p>There is an error with get exchange info. Return code: ${err.status}. Error: ${err.statusText}</p>`;
        errHTMLInfo += '</section>';

        $(".request-exchange").html(errHTMLInfo);
        $(".incoming-exchanges").html(errHTMLInfo);
    });
}

// Gets information about request that user has created and displays it
const getRequestExchangeInfoAndDisplay = bookExchanges => {
    let id = sessionStorage.getItem('exchange_book_id');
    const jwt = sessionStorage.getItem('token');

    let initiatedBookExchange = null;
    const loggedInUserId = sessionStorage.getItem("email");

    for (let exchangeNum in bookExchanges) {
        let bookExchange = bookExchanges[exchangeNum];
        if (bookExchange.initiatorId == loggedInUserId) {
            initiatedBookExchange = bookExchange;
            break;
        }
    }

    if (id == null && initiatedBookExchange == null) {
        // Logged in account has not made an exchange.
        let requestExchangeHTML = '<section>';
        requestExchangeHTML += `<p>You have not initiated an exchange.<br>To initiate an exchange, select the book listings option, search for a book listing that is not yours, and click on request book option on that listing.</p>`;
        requestExchangeHTML += '</section>';
        
        $(".request-exchange").html(requestExchangeHTML);
       
        return;
    } 

    if (id == null && initiatedBookExchange != null) {
        id = initiatedBookExchange.firstPartyBookId;
    }

    const get_book_url = "http://localhost:8080/api/book/"+id;

    $.ajax({
        method: "GET",
        url: get_book_url,
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + jwt
        },
        crossDomain: true,
        success: function (response) {
            const exchangeBookInfo = response.data;

            const bookCollectionURL = "http://localhost:8080/api/book/collection";

            $.ajax({
                method: "GET",
                url: bookCollectionURL,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + jwt
                },
                crossDomain: true,
                success: function (response) {
                    const userBookCollection = response.data;
                    
                    displayRequestExchangeInfo(initiatedBookExchange, userBookCollection, exchangeBookInfo); 
                
                    $('#request-exchange').click(function (e) { 
                        e.preventDefault();
                
                        const userBookListField = $('#user_books_list');
                
                        let selectedBook = null;
                        if (userBookListField) {
                            selectedBook = userBookListField.val();
                        }
                
                        let exchangeData = {};
                        const exchangeBookInfo = sessionStorage.getItem("exchangeBookInfo");
                
                        exchangeData.firstPartyId = sessionStorage.getItem('email');
                        exchangeData.otherPartyId = exchangeBookInfo.owner;
                        exchangeData.firstPartyBookId = sessionStorage.getItem('exchange_book_id');
                        exchangeData.otherPartyBookId = selectedBook;
                        exchangeData.initiatorId = sessionStorage.getItem('email');
                
                        createBookExchange(exchangeData);
                    });
                
                    $("#cancel-exchange").click(function(){
                        window.location = bookListingsPageFilename;
                    });
                },
                fail: function (err) {
                    let requestExchangeHTML = `<p>There was an error with getting logged in user's book info. Return code: ${err.status}. Error: ${err.statusText}</p>`;
                    $(".request-exchange").html(requestExchangeHTML);
                }
            });
        },
        fail: function (err) {
            let requestExchangeHTML = `<p>There was an error with getting exchange request info. Return code: ${err.status}. Error: ${err.statusText}</p>`;
            $(".request-exchange").html(requestExchangeHTML);
        }
    });
}

const createBookExchange = ({ firstPartyId, otherPartyId, firstPartyBookId, otherPartyBookId, initiatorId }) => {
    const exchangeInfo = {
        "firstPartyId": firstPartyId,
        "otherPartyId": otherPartyId,
        "firstPartyBookId": firstPartyBookId,
        "otherPartyBookId": otherPartyBookId,
        "initiatorId": initiatorId
    };

    const exchangeInfoJSON = JSON.stringify(exchangeInfo);

    const ajaxRequestToCreateBookExchange = $.ajax({
        method: "POST",
        url: `${localSpringBootServerUrl}/api/book/exchange`,
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + sessionStorage.getItem("token")
        },
        data: exchangeInfoJSON,
        crossDomain: true
    });

    ajaxRequestToCreateBookExchange.done(data => {
        window.location = indexPageFilename;

        const exchangeBookInfo = sessionStorage.getItem("exchangeBookInfo");
        const createBookExchangeMsgHTML = otherPartyBookId != null ? `<p>You have created exchange with book with name ${this.parent().children("#logged-in-user-book-name-option").text()} for book with name ${exchangeBookInfo.name} from ${exchangeBookInfo.owner}.</p>` : 
        `<p>You have requested donated book with name ${exchangeBookInfo.name} from ${exchangeBookInfo.owner}.</p>`;
        $(".exchange-page-buttons").html(createBookExchangeMsgHTML);
    }).fail(err => {
        console.log(err);
    });
};

const acceptExchange = (buttonSelector, exchangeId) => {
    const ajaxRequestToMarkExchangeComplete = $.ajax({
        method: "POST",
        url: `${localSpringBootServerUrl}/api/book/exchange/complete/${exchangeId}`,
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + sessionStorage.getItem("token")
        },
        crossDomain: true
    });

    ajaxRequestToMarkExchangeComplete.done(data => {
        console.log(`Exchange with id ${exchangeId} marked completed.`);
        
        const firstPartyBookId = buttonSelector.parent().children("#first-party-book-id").val(),
            otherPartyBookId = buttonSelector.parent().children("#other-party-book-id").val();
        
        deleteBooksFromExchange(firstPartyBookId, otherPartyBookId);
    }).fail(err => {
        console.log(err);
    });
};

const rejectExchange = exchangeId => {
    const ajaxRequestToMarkExchangeComplete = $.ajax({
        method: "POST",
        url: `${localSpringBootServerUrl}/api/book/exchange/complete/${exchangeId}`,
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + sessionStorage.getItem("token")
        },
        crossDomain: true
    });

    ajaxRequestToMarkExchangeComplete.done(data => {
        console.log(`Exchange with id ${exchangeId} marked completed.`);
        window.location = bookListingsPageFilename;
    }).fail(err => {
        console.log(err);
    });
};

const deleteBooksFromExchange = (firstPartyBookId, otherPartyBookId) => {
    const ajaxRequestToDeleteFirstPartyBookListing = $.ajax({
        method: "DELETE",
        url: `${localSpringBootServerUrl}/api/book/${firstPartyBookId}`,
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + sessionStorage.getItem("token")
        },
        crossDomain: true
    });
    
    ajaxRequestToDeleteFirstPartyBookListing.done(data => {
        console.log(`Deleted book listing with id ${firstPartyBookId}`);
    
        if (otherPartyBookId == null) {
            console.log("No other party book id, so requested book for donation, no delete other party book listing");
            window.location = bookListingsPageFilename;
            return;
        }

        const ajaxRequestToDeleteOtherPartyBookListing = $.ajax({
            method: "DELETE",
            url: `${localSpringBootServerUrl}/api/book/${firstPartyBookId}`,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + sessionStorage.getItem("token")
            },
            crossDomain: true
        });

        ajaxRequestToDeleteOtherPartyBookListing.done(data => {
            console.log(`Deleted book listing with id ${otherPartyBookId}`);
            window.location = bookListingsPageFilename;
        }).fail(err => {
            console.log(err);
        });
    }).fail(err => {
        console.log(err);
    });
};

export { sendAccountInfo, loginUser, checkUserLoggedIn, 
    sendTokenRequest, sendTokenAndChangePassword, 
    sendBookInfo, getPersonalCollection, sendBookSearchInfo, 
    getExchangesInfoAndUpdateDOMElements, createBookExchange };