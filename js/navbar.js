import { checkUserLoggedIn } from "./requests.js";

$(document).ready(() => {
    // Checks if the user is logged in and updates navbar as appropriate
    const isLoggedIn = checkUserLoggedIn();
    if (isLoggedIn) {
        // $("#profile-username").html(`<a href="#">Hi ${sessionStorage.getItem("username")}</a>`);
        $("#login-or-logout").html('<a href="index.html">Logout</a>');
    } else {
        $("#login-or-logout").html('<a href="login.html">Login</a>');
    }

    $("#login-or-logout a").click(() => {
        if (isLoggedIn) {
            // Logs user out by removing jwt token from session storage and updates navbar
            sessionStorage.removeItem("token");
            // sessionStorage.removeItem("username");
            window.location = "index.html";
        }
    });
});