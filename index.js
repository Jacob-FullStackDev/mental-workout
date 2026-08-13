"use strict";
// DOM ELEMENT SELECTORS
const preboardingHeadingEl = document.getElementById("preboarding-heading");
const durationInputEl = document.getElementById("session-duration");
const goalInputEl = document.getElementById("session-goal");
const firstOperandInputEl = document.getElementById("first-operand-length");
const secondOperandInputEl = document.getElementById("second-operand-length");
const sampleProblemEl = document.getElementById("sample-problem");
const startSessionEl = document.getElementById("start-session");
const sessionCountdownEl = document.getElementById("session-countdown");
const accuracyEl = document.getElementById("accuracy");
const firstOperandOfSampleProblemEl =
  document.getElementById("sample-operand-1");
const secondOperandOfSampleProblemEl =
  document.getElementById("sample-operand-2");
const sampleProblemFeedbackEl = document.getElementById(
  "sample-problem-feedback",
);
// INITIAL STATE
let sessionInProgress = false;
let sampleProblemDisplayed = false;
let sampleProblem = ` × `;
function startSession(firstLength, secondLength = firstLength) {
  sessionInProgress = true;
}

function operandGen(digits) {
  if (digits >= 1) {
    let max = 10 ** digits - 1;
    let min = 10 ** (digits - 1) - 1;
    let operand = Math.floor(Math.random() * (max - min)) + min + 1;
    return operand;
  }
}

firstOperandInputEl.addEventListener("input", (e) => {
  e.preventDefault();
  const digitsLength = Number(e.target.value);
  if (digitsLength >= 1 && digitsLength <= 15) {
    firstOperandOfSampleProblemEl.textContent = operandGen(digitsLength);
  }
  if (!secondOperandInputEl.value) {
    secondOperandOfSampleProblemEl.textContent = operandGen(
      firstOperandOfSampleProblemEl.textContent.length,
    );
  }
  if (!firstOperandInputEl.value) {
    // value removed
    if (secondOperandInputEl.value) {
      // use length of other operand
      firstOperandOfSampleProblemEl.textContent = operandGen(
        secondOperandOfSampleProblemEl.textContent.length,
      );
    } else if (!secondOperandInputEl.value) {
      secondOperandOfSampleProblemEl.textContent =
        firstOperandOfSampleProblemEl.textContent = "";
      sampleProblemEl.classList.add("hidden");
      return;
    }
  }
  sampleProblemEl.classList.remove("hidden");
});

secondOperandInputEl.addEventListener("input", (e) => {
  e.preventDefault();
  const digitsLength = Number(e.target.value);
  if (digitsLength >= 1 && digitsLength <= 15) {
    secondOperandOfSampleProblemEl.textContent = operandGen(digitsLength);
  }
  if (!firstOperandInputEl.value) {
    firstOperandOfSampleProblemEl.textContent = operandGen(
      secondOperandOfSampleProblemEl.textContent.length,
    );
  }
  if (!secondOperandInputEl.value) {
    // value removed
    if (firstOperandInputEl.value) {
      // use length of other operand
      secondOperandOfSampleProblemEl.textContent = operandGen(
        firstOperandOfSampleProblemEl.textContent.length,
      );
    } else if (!firstOperandInputEl.value) {
      firstOperandOfSampleProblemEl.textContent =
        secondOperandOfSampleProblemEl.textContent = "";
      sampleProblemEl.classList.add("hidden");
      return;
    }
  }
  sampleProblemEl.classList.remove("hidden");
});
