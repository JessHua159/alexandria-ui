import { checkUserLoggedIn } from "./requests.js";
import { otherLeftNavbarItems } from "./vars_and_helpers.js";

$(document).ready(() => {
    // Checks if the user is logged in and updates navbar as appropriate
    const isLoggedIn = checkUserLoggedIn();
    if (isLoggedIn) {
        $("#other-left-navbar-items-toggle").html(otherLeftNavbarItems);
        $("#login-or-logout-toggle").html('<a href="index.html">Logout</a>');
        $("#profile-username-toggle").html(`<a href="#">Hi ${sessionStorage.getItem("email")}</a>`);
    } else {
        $("#login-or-logout-toggle").html('<a href="login.html">Login</a>');
    }

    $("#login-or-logout-toggle a").click(() => {
        if (isLoggedIn) {
            // Logs user out by removing jwt token and account-specific variables from session storage
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("email");
            sessionStorage.removeItem("exchange_book_id");
            window.location = "index.html";
        }
    });
});