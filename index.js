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
const sampleProblemOperand1El = document.getElementById("sample-operand-1");
const sampleProblemOperand2El = document.getElementById("sample-operand-2");
const sampleProblemOperatorEl = document.getElementById("sample-operator");
// INITIAL STATE
let sessionInProgress = false;
let sampleProblemDisplayed = false;
let sampleProblem = ` × `;
function startSession(firstLength, secondLength = firstLength) {
  sessionInProgress = true;
  let firstOperand = Math.round((Math.random() * 10 + 1) ** firstLength);
  let secondOperand = Math.round((Math.random() * 10 + 1) ** secondLength);
}

function operandGen(digits) {
  let max = 10 ** digits - 1;
  let min = 10 ** (digits - 1) - 1;
  console.log(min, max);
  let operand = Math.round(Math.random() * (max - min)) + min;
  console.log(operand);
  return operand;
}
console.log(Math.round(900));
operandGen(3);
firstOperandInputEl.addEventListener("input", (e) => {
  e.preventDefault();
  console.log(e.target.value);
  sampleProblemOperand1El.textContent = operandGen(Number(e.target.value));
});
secondOperandInputEl.addEventListener("input", (e) => {
  e.preventDefault();
});
