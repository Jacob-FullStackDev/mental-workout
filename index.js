// TODO: add sounds for right/wrong answers, respect CSS flags, be able to toggle volume/mute, use new Audio('/path').play(); (to play)
const durationInputElement = document.getElementById("session-duration");
const startBtnElement = document.getElementById("start-session-btn");
const sessionGoalElement = document.getElementById("session-goal");
const sessionContainerElement = document.getElementById("session-container");
const problemElement = document.getElementById("math-problem");
const startFormElement = document.getElementById("session-form");
let firstOperand;
let secondOperand;
const problemsCorrectElement = document.getElementById(
  "problems-answered-correctly"
);
let problemsCorrect = 0; // TODO: render it on an element, move to function, set to uninitialized
const submitSolutionBtn = document.createElement("button");
submitSolutionBtn.type = "button";
const countdownElement = document.getElementById("session-countdown");
const answerFormElement = document.createElement("form");
const answerInputElement = document.createElement("input");
const answerLabelElement = document.createElement("label");
let sessionStarted;
function cleanup() {
  startFormElement.style.display = "block";
  if (sessionStarted === true) {
    startBtnElement.style.display = "block";
    answerFormElement.remove();
    answerInputElement.remove();
    answerLabelElement.remove();
    problemsCorrectElement.textContent = problemElement.textContent = "";
    firstOperand = secondOperand = problemsCorrect = 0;
    console.log("cleanup ran!"); // keeps running
  }
}
function problemGenerator() {
  submitSolutionBtn.textContent = "Submit answer";
  firstOperand = Math.ceil(Math.random() * 99);
  secondOperand = Math.ceil(Math.random() * 99);
  problemElement.textContent = `${firstOperand} × ${secondOperand}`;
}
submitSolutionBtn.addEventListener("click", (event) => {
  event.preventDefault();
  let answerValue = Number(answerInputElement.value);
  let answer = firstOperand * secondOperand;
  console.log(typeof answer, typeof answerValue, answer, answerValue);
  if (answerValue === answer) {
    submitSolutionBtn.disabled = true;
    console.log("Correct!");
    problemGenerator();
    submitSolutionBtn.disabled = false;
  }
});

startBtnElement.addEventListener("click", (event) => {
  event.preventDefault();
  startFormElement.style.display = "none";
  answerInputElement.type = "number";
  answerInputElement.id = "answer-field";
  answerLabelElement.textContent = "Answer:";
  startBtnElement.style.display = "none";
  answerLabelElement.setAttribute("for", "answer-field");
  sessionContainerElement.appendChild(answerFormElement);
  answerFormElement.appendChild(answerLabelElement);
  answerFormElement.appendChild(answerInputElement);
  answerFormElement.appendChild(submitSolutionBtn);
  const durationMS = parseInt(durationInputElement.value * 1000); // Miliseconds
  sessionStarted = true;
  problemGenerator();
  setInterval(() => {
    let count = durationMS;
    // TODO: fix timer
    console.log(count); // keeps logging even after cleanup
  }, 1000);
  setInterval(cleanup, durationMS);
});
