import { checkUserLoggedIn } from "./requests.js";
import { indexPageFilename, loginPageFilename, listBookPageFilename, bookListingsPageFilename } from "./vars_and_helpers.js";

const listBookButton = $("button#list-book");
const bookListingsButton = $("button#book-listings");

$(document).ready(() => {

    var userEmail = sessionStorage.getItem('email');

    if(userEmail){
        $('.create_account_menu').hide();
        $('.search_bar').show();
    }
    else{
        $('.create_account_menu').show();
        $('.logo_big').css({"color":"#ff1744"});
        $('.search_bar').hide();
        
    }

    sessionStorage.setItem("pageAfterLogin", indexPageFilename);

    listBookButton.click(e => {
        // Checks if user is logged in. If not, the user is redirected to the login page filename.
        if (!checkUserLoggedIn()) {
            e.preventDefault();
            window.location = loginPageFilename;
            sessionStorage.setItem("pageAfterLogin", listBookPageFilename);
        }
    });
    
    bookListingsButton.click(e => {
        // Checks if user is logged in. If not, the user is redirected to the login page filename.
        if (!checkUserLoggedIn()) {
            e.preventDefault();
            window.location = loginPageFilename;
            sessionStorage.setItem("pageAfterLogin", bookListingsPageFilename);
        }
    });
});