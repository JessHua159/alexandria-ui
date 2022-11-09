import { checkUserLoggedIn } from "./requests.js";
import { loginPageFilename, listBookPageFilename, personalListingsPageFilename } from "./vars_and_helpers.js";

const listBookButton = $("button#list-book");
const personalListingsButton = $("button#personal-listings");


$(document).ready(() => {
    listBookButton.click(e => {
        // Checks if user is logged in. If not, the user is redirected to the login page filename.
        if (!checkUserLoggedIn()) {
            e.preventDefault();
            window.location = loginPageFilename;
            sessionStorage.setItem("pageAfterLogin", listBookPageFilename);
        }
    });
    personalListingsButton.click(e => {
        // Checks if user is logged in. If not, the user is redirected to the login page filename.
        if (!checkUserLoggedIn()) {
            e.preventDefault();
            window.location = loginPageFilename;
            sessionStorage.setItem("pageAfterLogin", personalListingsPageFilename);
        }
    });
});