import { localSpringBootServerUrl, indexPageFilename, highlightInputField, highlightText, resetStyle } from "./vars_and_helpers.js"
import { displayPersonalBooks } from "./personal_listings.js"

const sendTokenRequest = ({ email }) => {
    const emailObj = {
        "email": email
    };
    const emailJSON = JSON.stringify(emailObj);
    console.log(emailJSON);

    const ajaxPasswordResetTokenRequest = $.ajax({
        method: "POST",
        url: `${localSpringBootServerUrl}/api/resetToken`,
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
            "Authorization": "Bearer " + sessionStorage.getItem("token")
        },
        data: accountInfoJSON,
        // dataType: "json",
        crossDomain: true
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
    console.log(emailJSON);

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
        sessionStorage.setItem("firstName", data.firstName);

        window.location = indexPageFilename;

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
        console.log(bookData);
        sessionStorage.setItem( "bookList", JSON.stringify(bookData) );
        displayPersonalBooks();
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

    console.log(sessionStorage.getItem("token"));
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
    })
}

export { sendAccountInfo, loginUser, checkUserLoggedIn, sendTokenRequest, sendTokenAndChangePassword, sendBookInfo, getPersonalCollection };