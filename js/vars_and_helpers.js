const localSpringBootServerUrl = "http://localhost:8080";
const highlightInputFieldColor = "rgb(255, 0, 0)";

const checkStringNotEmpty = x => x != null && x.length > 0;

const highlightInputField = inputField => {
    inputField.css("outline", "none");
    inputField.css("border-color", highlightInputFieldColor);
    inputField.css("box-shadow", `0 0 3px ${highlightInputFieldColor}`);
};

const highlightText = (ele, newColor) => ele.css("color", newColor);

const resetStyle = element => element.attr("style", "");

export { localSpringBootServerUrl, checkStringNotEmpty, highlightInputField, highlightText, resetStyle };