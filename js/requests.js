import { highlightInputField, localSpringBootServerUrl } from "./vars_and_helpers.js"

// Sends ajax request to create account
const sendAccountInfo = ({ universityName, username, firstName, lastName, email, password }) => {
    const accountInfo = {
        "university": { "name": universityName },
        "username": username,
        "firstName": firstName,
        "lastName": lastName,
        "primaryEmail": email,
        "password": password
    };
    
    const accountInfoJSON = JSON.stringify(accountInfo);
    console.log(accountInfoJSON);
    
    const ajaxRequestToSendAccountInfo = $.ajax({
        method: "POST",
        url: `${localSpringBootServerUrl}/api/signup`,
        headers: {
            "Content-Type": "application/json"
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
        
        $(".submit-message").text("Account has been created.");
        loginUser({ username, password}, true);
    }).fail(err => {
        console.log("Account has not been created.");
        console.log("Error: ")
        console.log(err);

        $(".submit-message").text(`There is an error with account creation. Return code: ${err.status}. Error: ${err.statusText}.`);
    });
};

// Sends ajax request to log in user
const loginUser = ({ username, password }, fromAccountCreation) => {
    const accountInfo = {
        "username": username,
        "password": password
    };
    
    const accountInfoJSON = JSON.stringify(accountInfo);

    const ajaxRequestToSendLoginInfo = $.ajax({
        beforeSend: xhr => xhr.setRequestHeader ("Authorization", "Basic " + btoa(username + ":" + password)),
        type: "GET",
        url: `${localSpringBootServerUrl}/api/login`,
        headers: {
            "Content-Type": "application/json",
        },
        data: accountInfoJSON,
        crossDomain: true
    });

    ajaxRequestToSendLoginInfo.done(data => {
        console.log("Login successful.");
        console.log("Data returned: ");
        console.log(data);

        if (fromAccountCreation) {
            let submitButtonVal = $("input#submit-button").val();
            $("input").val("");
            $("input#submit-button").val(submitButtonVal);
        }

        sessionStorage.setItem("token", data.jwt)   // stores jwt token to session storage

        $(".submit-message").text(fromAccountCreation ? `Account with username ${username} has been created. You have been logged in.` : "You have been logged in.");
    }).fail(err => {
        console.log("Login failed.");
        console.log("Error: ");
        console.log(err);

        let statusNo = err.status;
        if (statusNo == 401)    // Invalid login credentials
            if (!fromAccountCreation) { 
                highlightInputField($("input#username"));
                highlightInputField($("password#password"));
            } else {
                $(".submit-message").text(`Unable to login after account creation`);
            }
        else {  // Some other error
            $(".submit-message").text(`There is an error with login. Return code: ${err.status}. Error: ${err.statusText}.`);
        }
    });
};

export { sendAccountInfo, loginUser };