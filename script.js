const phoneElements = document.querySelectorAll("input[name=phone]");

phoneElements.forEach((elem) => validatePhoneNumber(elem));

function validatePhoneNumber(input) {
  const inputMaskValue = input.dataset.mask,
    maskArray = phoneMaskArray(inputMaskValue);

  let currentValue = input.value,
    cursorPosition = maskArray[0];

  input.addEventListener("click", () => {
    if (input.value === "") {
      setInputValue(inputMaskValue);
      setCursorState();
      currentValue = input.value;
    } else {
      cursorPosition = input.selectionStart;
    }
  });

  input.addEventListener("input", (event) => {
    const hasNumbers = /\d+/g.test(event.data),
      isEnd = cursorPosition - 1 === maskArray[maskArray.length - 1];

    console.info(isEnd, event, hasNumbers);
    if (!hasNumbers) {
      setInputValue(currentValue);
      setCursorState(cursorPosition);
      return;
    }
    if (hasNumbers) {
      console.log("-- " + cursorPosition);
      setInputValue(generateValue(cursorPosition, event));
      setCursorState(cursorPosition);
      console.log("++ " + cursorPosition);
      return;
    }
  });

  function generateValue(position, event) {
    const data = event.data;
    if (!data) return event.target.value;
    const dataLength = data.length,
      isText = event.inputType === "insertText",
      isDeleting =
        event.inputType === "deleteContentBackward" || "deleteContentForward";
    let inputValueArray = currentValue.split("");

    cursorPosition = nextRightValuePlace(position - 1);
    if (isDeleting) {
      // nothing
    }

    for (let i = 0; i < dataLength; i++) {
      console.log(i, inputValueArray[cursorPosition], cursorPosition);
      inputValueArray[cursorPosition] = data;
      cursorPosition = nextRightValuePlace(position);
      console.log(i, inputValueArray[cursorPosition], cursorPosition);
    }

    currentValue = inputValueArray.join("");
    return currentValue;
  }
  function setCursorState(cursor = maskArray[0]) {
    input.selectionStart = cursor;
    input.selectionEnd = cursor;
    cursorPosition = cursor;
  }
  function setInputValue(value) {
    input.value = value;
  }
  function phoneMaskArray(value) {
    let maskArray = [];
    value.split("").forEach((letter, index) => {
      if (!/_/g.test(letter)) return;
      maskArray.push(index);
    });
    return maskArray;
  }
  function nextRightValuePlace(position) {
    const lastPosition = maskArray[maskArray.length - 1];
    if (position === lastPosition) return lastPosition + 1;
    return maskArray.find((elem) => elem > position);
  }
}