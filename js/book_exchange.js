import { bookListingsPageFilename } from "./vars_and_helpers.js";
import { createBookExchange, getExchangesInfoAndUpdateDOMElements } from "./requests.js";

$(document).ready(function () {
    getExchangesInfoAndUpdateDOMElements();
});