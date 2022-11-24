const phoneElements = document.querySelectorAll("input[name=phone]");

phoneElements.forEach((elem) =>
  validatePhoneNumber(elem, elem.dataset.code, elem.dataset.mask)
);

function validatePhoneNumber(input, inputCode, inputMask) {
  const codeLength = +inputCode.length + 2;
  let currentValue = "",
    cursorPosition = 0;
  const maskArray = phoneMaskArray(inputMask);

  input.addEventListener("click", () => {
    if (input.value !== "") return;

    setInputState(`${inputCode} ${inputMask}`, codeLength);
    currentValue = input.value;
  });
  input.addEventListener("input", (event) => {
    const hasNumbers = /\d+/g.test(event.data);
    const isText = event.inputType === "insertText";
    const isDeleting =
      event.inputType === "deleteContentBackward" || "deleteContentForward";
    const isRightPlace = maskArray.includes(cursorPosition - codeLength);
    console.log(event, input.selectionStart, input.selectionEnd);
    cursorPosition = input.selectionStart;

    if (isText && hasNumbers && isRightPlace) {
      setInputState(generateValue(cursorPosition, event), cursorPosition);
      currentValue = input.value;
      return;
    }
    if (isDeleting) {
      return;
    }
    setInputState(currentValue, cursorPosition - 1);
  });

  function generateValue(cursorPosition, event) {
    const valueLength = event.data.length;
    if (!valueLength) return event.value;
    return (
      input.value.slice(0, cursorPosition) +
      input.value.slice(cursorPosition + valueLength)
    );
  }
  function setInputState(value, cursorPosition) {
    input.value = value;
    input.selectionStart = cursorPosition;
    input.selectionEnd = cursorPosition;
  }
  function phoneMaskArray(value) {
    let maskArray = [];
    value.split("").forEach((letter, index) => {
      if (/\s|-|\(|\)/g.test(letter)) return;
      maskArray.push(index);
    });
    return maskArray;
  }
}
