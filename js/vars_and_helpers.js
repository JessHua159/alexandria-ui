const localSpringBootServerUrl = "http://localhost:8080";
const highlightInputFieldColor = "rgb(255, 0, 0)";

const checkStringNotEmpty = x => x != null && x.length > 0;

const highlightInputField = inputField => {
    inputField.css("outline", "none");
    inputField.css("border-color", highlightInputFieldColor);
    inputField.css("box-shadow", `0 0 3px ${highlightInputFieldColor}`);
};

const highlightText = (labelName, newColor) => {
    var label = "label#" + labelName;
    $(label).css("color", newColor);
};

const resetStyle = element => element.attr("style", "");

export { localSpringBootServerUrl, checkStringNotEmpty, highlightInputField, highlightText, resetStyle };