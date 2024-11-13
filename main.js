document.addEventListener("DOMContentLoaded", function () {
  const display = document.getElementById("display");
  const buttons = document.querySelector(".buttons");
  const historyList = document.getElementById("history-list");

  let currentInput = "";
  let previousInput = "";
  let operator = "";
  const history = loadHistoryFromCookies() || [];

  renderHistory(history);

  // Manejo del evento de clic en botones
  buttons.addEventListener("click", (event) => {
      const target = event.target;
      if (target.matches("button")) {
          processInput(target.textContent);
      }
  });

  function processInput(value) {
      if (isNumber(value) || value === ".") {
          handleNumberInput(value);
      } else if (isOperator(value)) {
          handleOperatorInput(value);
      } else if (value === "=") {
          handleEqualInput();
      } else if (value === "C") {
          resetCalculator();
      }
  }

  function handleNumberInput(value) {
      if (value === "." && currentInput.includes(".")) return; // Evitar múltiples puntos decimales
      currentInput += value;
      updateDisplay(currentInput);
  }

  function handleOperatorInput(value) {
      if (currentInput) {
          if (previousInput && operator) {
              performCalculation();
          }
          operator = value;
          previousInput = currentInput;
          currentInput = "";
      }
  }

  function handleEqualInput() {
      if (previousInput && currentInput && operator) {
        const expression = `${previousInput} ${operator} ${currentInput}`;
        performCalculation();
        saveHistoryEntry(`${expression} = ${currentInput}`);
        resetOperator();
    }
  }

  function performCalculation() {
      const num1 = parseFloat(previousInput);
      const num2 = parseFloat(currentInput);
      switch (operator) {
          case "+":
              currentInput = (num1 + num2).toString();
              break;
          case "-":
              currentInput = (num1 - num2).toString();
              break;
          case "*":
              currentInput = (num1 * num2).toString();
              break;
          case "/":
              currentInput = num2 !== 0 ? (num1 / num2).toString() : "Error";
              break;
      }
      updateDisplay(currentInput);
  }

  function resetCalculator() {
      currentInput = "";
      previousInput = "";
      operator = "";
      updateDisplay(currentInput);
  }

  function resetOperator() {
      previousInput = "";
      operator = "";
  }

  function updateDisplay(value) {
      display.value = value;
  }

  function isNumber(value) {
      return !isNaN(value);
  }

  function isOperator(value) {
      return ["+", "-", "*", "/"].includes(value);
  }

  // Funciones de historial
  function saveHistoryEntry(entry) {
      history.push(entry);
      renderHistory(history);
      saveHistoryToCookies(history);
  }

  function renderHistory(historyArray) {
      historyList.innerHTML = "";
      historyArray.forEach((entry) => {
          const listItem = document.createElement("li");
          listItem.textContent = entry;
          listItem.classList.add("history-entry");
          historyList.appendChild(listItem);
      });
  }

  // Funciones de cookies
  function saveHistoryToCookies(historyArray) {
      document.cookie = `calculator_history=${encodeURIComponent(JSON.stringify(historyArray))}`;
  }

  function loadHistoryFromCookies() {
      const cookies = document.cookie.split("; ");
      const historyCookie = cookies.find((cookie) => cookie.startsWith("calculator_history="));
      if (historyCookie) {
          const historyJSON = historyCookie.split("=")[1];
          return JSON.parse(decodeURIComponent(historyJSON));
      }
      return [];
  }
});
