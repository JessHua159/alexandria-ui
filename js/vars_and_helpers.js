const localSpringBootServerUrl = "http://localhost:8080";
const highlightInputFieldColor = "rgb(29, 39, 48)";

const checkStringNotEmpty = x => x != null && x.length > 0;

const highlightInputField = inputField => {
    inputField.css("outline", "none");
    inputField.css("border-color", highlightInputFieldColor);
    inputField.css("box-shadow", `0 0 3px ${highlightInputFieldColor}`);
};

const resetStyle = element => element.attr("style", "");

export { localSpringBootServerUrl, checkStringNotEmpty, highlightInputField, resetStyle };