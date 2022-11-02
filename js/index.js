import { checkUserLoggedIn } from "./requests.js";
import { loginPageFilename } from "./vars_and_helpers.js";

const listBookButton = $("button#list-book");

$(document).ready(() => {
    listBookButton.click(e => {
        // Checks if user is logged in. If not, the user is redirected to the login page filename.
        if (!checkUserLoggedIn()) {
            e.preventDefault();
            window.location = loginPageFilename;
        }
    });
});