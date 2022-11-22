import { checkUserLoggedIn } from "./requests.js";
import { indexPageFilename, loginPageFilename, listBookPageFilename, bookListingsPageFilename } from "./vars_and_helpers.js";

const listBookButton = $("button#list-book");
const bookListingsButton = $("button#book-listings");

$(document).ready(() => {
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