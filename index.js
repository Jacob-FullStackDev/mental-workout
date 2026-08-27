"use strict";

// PREBOARDING DOM ELEMENT SELECTORS

const preboardingSectionEl = document.getElementById("preboarding-section");
const preboardingFormEl = document.getElementById("preboarding-form");
const goalInputEl = document.getElementById("preboarding-goal-input");
const durationInputEl = document.getElementById("preboarding-duration-input");
const firstOperandInputEl = document.getElementById(
  "preboarding-first-operand-digits-input",
);
const secondOperandInputEl = document.getElementById(
  "preboarding-second-operand-digits-input",
);
const firstOperandValueEl = document.getElementById(
  "preboarding-first-operand",
);
const secondOperandValueEl = document.getElementById(
  "preboarding-second-operand",
);
const preboardingProblemFeedbackEl = document.getElementById(
  "preboarding-problem--feedback",
);
const preboardingProblemEl = document.getElementById("preboarding-problem");

// SESSION DOM ELEMENT SELECTORS

const sessionSectionEl = document.getElementById("session-container");
const firstOperandEl = document.getElementById("session-first-operand");
const secondOperandEl = document.getElementById("session-second-operand");
const answerInputFormEl = document.getElementById("session-answer-form");
const answerInputEl = document.getElementById("session-answer-input");
const answerFeedbackEl = document.getElementById("session-answer-feedback"); // Whether or not the answer was correct
const sessionCountdownEl = document.getElementById("session-countdown");
const pauseBtnEl = document.getElementById("session-pause-btn");
const correctAnswersValueEl = document.getElementById(
  "session-correct-answers",
);
const totalAnswersValueEl = document.getElementById("session-total-answers");

// PAUSE MENU DOM ELEMENT SELECTORS

const pauseMenuEl = document.getElementById("pause-menu-container");
const resumeBtnEl = document.getElementById("pause-menu-resume-btn");
const timeRemainingEl = document.getElementById("pause-menu-countdown");

// RESULTS SECTION ELEMENTS

const resultsContainerElement = document.createElement("div");
resultsContainerElement.id = "results-container";

const returnToHomeBtn = document.createElement("button");
returnToHomeBtn.classList.add("btn");

const resultsElement = document.createElement("p"); // Session results displayed as fraction (e.g. 1/3)

// VOLUME ELEMENTS

const volumeSliderPreboardingEl = document.getElementById(
  "preboarding-volume-input",
);
const volumeValuePreboardingEl = document.getElementById(
  "preboarding-volume-value",
);
volumeValuePreboardingEl.textContent = `${volumeSliderPreboardingEl.value}%`;

const volumeSliderPauseMenuEl = document.getElementById(
  "pause-menu-volume-input",
);
const volumeValuePauseMenuEl = document.getElementById(
  "pause-menu-volume-value",
);
volumeValuePauseMenuEl.textContent = `${volumeSliderPreboardingEl.value}%`;

// VOLUME PROPERTIES

const correctAnswerSfx = new Audio("assets/CorrectAnswerSFX.mp3");
const incorrectAnswerSfx = new Audio("assets/IncorrectAnswerSFX.mp3");
let volumeValue = Number(volumeSliderPreboardingEl.value) / 100; // audio.volume property value ranging from 0-1
let volumePercent = Number(volumeSliderPreboardingEl.value); // volume % ranging from 0-100%

// HANDLE SFX

function handleSFXVolume(sliderEl) {
  volumeValue = Number(sliderEl.value) / 100;
  correctAnswerSfx.volume = volumeValue;
  incorrectAnswerSfx.volume = volumeValue;
  // Plays sound effect for the user to gauge the volume
  correctAnswerSfx.play();
}

volumeSliderPreboardingEl.addEventListener("change", () => {
  // updates SFX volume
  handleSFXVolume(volumeSliderPreboardingEl);
});
volumeSliderPreboardingEl.addEventListener("input", (e) => {
  // displays SFX volume
  volumePercent = Number(e.target.value);
  // sync other volume sliders range attribute/volume values
  volumeValuePreboardingEl.textContent =
    volumeValuePauseMenuEl.textContent = `${volumePercent}%`;
  volumeSliderPauseMenuEl.value = volumePercent;
});

volumeSliderPauseMenuEl.addEventListener("change", () => {
  handleSFXVolume(volumeSliderPauseMenuEl);
});
volumeSliderPauseMenuEl.addEventListener("input", (e) => {
  volumePercent = Number(e.target.value);
  volumeValuePauseMenuEl.textContent =
    volumeValuePreboardingEl.textContent = `${volumePercent}%`;
  volumeSliderPreboardingEl.value = volumePercent;
});

// INITAL STATE FUNCTION

let correctAnswers,
  totalAnswers,
  sessionPaused, // Indicates being on the pause screen
  sessionFinished, // Indicates being on the session results screen
  firstOperandDigits,
  secondOperandDigits,
  firstOperand,
  secondOperand;

function init() {
  correctAnswers = 0;
  totalAnswers = 0;
  sessionPaused = false;
  sessionFinished = false;
  goalInputEl.value = "";
  durationInputEl.value = "";
  answerInputEl.value = "";
  firstOperandDigits = secondOperandDigits = null;
  firstOperandInputEl.value = secondOperandInputEl.value = "";
  firstOperandValueEl.textContent = secondOperandValueEl.textContent = "";
  correctAnswersValueEl.textContent = correctAnswers;
  totalAnswersValueEl.textContent = totalAnswers;
  preboardingProblemEl.classList.add("hidden");
}
init();

// GENERATE UNIQUE PROBLEM

function operandGen(digits) {
  if (digits >= 1) {
    let max = 10 ** digits - 1;
    let min = 10 ** (digits - 1) - 1;
    let operand = Math.floor(Math.random() * (max - min)) + min + 1;
    return operand;
  }
}

let previousFirstOperand, previousSecondOperand;
function problemGen(firstOperandDigits, secondOperandDigits) {
  let newFirstOperand;
  let newSecondOperand;
  while (!newFirstOperand || newFirstOperand === previousFirstOperand) {
    newFirstOperand = operandGen(firstOperandDigits);
  }
  previousFirstOperand = newFirstOperand;
  while (!newSecondOperand || newSecondOperand === previousSecondOperand) {
    newSecondOperand = operandGen(secondOperandDigits);
  }
  previousSecondOperand = newSecondOperand;
  firstOperandEl.textContent = newFirstOperand;
  secondOperandEl.textContent = newSecondOperand;
}

function displayPreboardingOperand(operandPosition, digits) {
  let newValue = operandGen(digits);
  let oldValue;
  if (operandPosition === 1) {
    // first operand value element
    oldValue = Number(firstOperandValueEl.textContent);
    while (oldValue === newValue) {
      // ensures new operand is different than the old operand
      newValue = operandGen(digits);
    }
    firstOperandValueEl.textContent = newValue;
  }
  if (operandPosition === 2) {
    // second operand value element
    oldValue = Number(secondOperandValueEl.textContent);
    while (oldValue === newValue) {
      newValue = operandGen(digits);
    }
    secondOperandValueEl.textContent = newValue;
  }
}

// TOGGLES SESSION COMPONENT

function handleSession() {
  preboardingSectionEl.classList.toggle("hidden");
  sessionSectionEl.classList.toggle("hidden");
}

// UPON ENDING SESSION

function setSessionGoalResultMessage(goal) {
  if (correctAnswers > goal) return "exceeded";
  else if (correctAnswers < goal) return "failed to meet";
  else return "met";
}

function endSession(goal) {
  // stops timer, marks session as finished, enters results page
  sessionFinished = true;
  resultsElement.textContent = `You correctly solved ${correctAnswers} / ${totalAnswers} problems. You correctly solved ${correctAnswers} problems. You ${setSessionGoalResultMessage(goal)} your goal of ${goal} correct answers.`;
  returnToHomeBtn.textContent = "Return to Home";
  resultsContainerElement.append(resultsElement, returnToHomeBtn);
  document.body.append(resultsContainerElement);
  init();
  sessionSectionEl.classList.add("hidden");
  firstOperandEl.textContent = secondOperandEl.textContent = "";
}

returnToHomeBtn.addEventListener("click", (e) => {
  e.preventDefault();
  returnToHome();
});

// PAUSE MENU

function togglePauseMenu() {
  sessionPaused = !sessionPaused;
  pauseMenuEl.classList.toggle("hidden");
}

// RESULTS SCREEN

function returnToHome() {
  resultsContainerElement.remove();
  preboardingSectionEl.classList.remove("hidden");
}

// RETURN TO AREA

document.body.addEventListener("keyup", (e) => {
  e.preventDefault();
  if (e.key === "Escape") {
    if (sessionPaused === true) togglePauseMenu();
    if (sessionFinished === true) returnToHome();
  }
});

// ERROR HANDLING

function errorHandler(feedbackEl, msg, action, hiddenEl = undefined) {
  feedbackEl.textContent = msg;
  feedbackEl.classList.remove("hidden");
  if (hiddenEl) {
    hiddenEl.classList.add("hidden");
  }
  if (action === "error") {
    console.error(msg);
  }
  if (action === "warn") {
    console.warn(msg);
  }
}
function invalidNumberHandler(e, msg, feedbackEl) {
  if (
    isNaN(Number(e.target.value)) ||
    e.target.value === "e" ||
    e.target.value.includes(" ")
  ) {
    errorHandler(feedbackEl, msg, "error");
    return true; // function ran
  }
}

// PREBOARDING EVENT LISTENERS (To start a session)
goalInputEl.addEventListener("input", (e) => {
  if (
    invalidNumberHandler(
      e,
      "Goal isn't a valid number",
      preboardingProblemFeedbackEl,
    ) === true
  ) {
    return (goalInputEl.value = "");
  }
});

durationInputEl.addEventListener("input", (e) => {
  if (
    invalidNumberHandler(
      e,
      "Goal isn't a valid number",
      preboardingProblemFeedbackEl,
    ) === true
  ) {
    return (durationInputEl.value = "");
  }
});
function preboardingOperandInputElHandler(
  e,
  activeOperandInputEl,
  otherOperandInputEl,
) {
  // activeOperandInputEl refers to the element with the attached event listener
  if (
    invalidNumberHandler(
      e,
      `The ${activeOperandInputEl === firstOperandInputEl ? "first" : "second"} operand isn't a valid number`,
      preboardingProblemFeedbackEl,
    ) === true
  ) {
    return (activeOperandInputEl.value = "");
  }
  // Operand digits length for the input
  let activeListenerDigits;
  let otherActiveListenerDigits;
  // Operand position for the first/second sample operands
  let activeListenerOperandPos;
  let otherListenerOperandPos;
  if (activeOperandInputEl === firstOperandInputEl) {
    activeListenerDigits = firstOperandDigits = Number(e.target.value);
    otherActiveListenerDigits = secondOperandDigits;
    activeListenerOperandPos = 1;
    otherListenerOperandPos = 2;
  } else if (activeOperandInputEl === secondOperandInputEl) {
    activeListenerDigits = secondOperandDigits = Number(e.target.value);
    otherActiveListenerDigits = firstOperandDigits;
    activeListenerOperandPos = 2;
    otherListenerOperandPos = 1;
  }
  if (
    (activeListenerDigits >= 1 && activeListenerDigits <= 7) ||
    !activeOperandInputEl.value
  ) {
    displayPreboardingOperand(activeListenerOperandPos, activeListenerDigits);
    preboardingProblemFeedbackEl.classList.add("hidden");
  } else {
    activeOperandInputEl.value = "";
    return errorHandler(
      preboardingProblemFeedbackEl,
      "Operands must be between 1 and 7 digits long",
      "warn",
      preboardingProblemEl,
    );
  }
  if (!otherOperandInputEl.value) {
    displayPreboardingOperand(otherListenerOperandPos, activeListenerDigits);
  }
  if (!activeOperandInputEl.value) {
    // Value removed or wasn't added
    if (otherOperandInputEl.value) {
      // Use length of other operand
      displayPreboardingOperand(
        activeListenerOperandPos,
        otherActiveListenerDigits,
      );
    } else if (!activeOperandInputEl.value && !otherOperandInputEl.value) {
      secondOperandValueEl.textContent = firstOperandValueEl.textContent = "";
      preboardingProblemEl.classList.add("hidden");
      return;
    }
  }
  preboardingProblemEl.classList.remove("hidden");
}
firstOperandInputEl.addEventListener("input", (e) => {
  preboardingOperandInputElHandler(
    e,
    firstOperandInputEl,
    secondOperandInputEl,
  );
});

secondOperandInputEl.addEventListener("input", (e) => {
  preboardingOperandInputElHandler(
    e,
    secondOperandInputEl,
    firstOperandInputEl,
  );
});

preboardingFormEl.addEventListener("submit", (e) => {
  e.preventDefault();
  handleSession();
  firstOperandDigits = Number(firstOperandInputEl.value);
  secondOperandDigits = secondOperandInputEl.value
    ? Number(secondOperandInputEl.value)
    : firstOperandDigits;
  let sessionProblemSolveGoal = Number(goalInputEl.value);
  let durationInMS = Number(durationInputEl.value) * 1000;
  let durationInS = durationInMS / 1000;
  sessionCountdownEl.textContent = durationInS;
  problemGen(firstOperandDigits, secondOperandDigits);
  let sessionTimer = setInterval(() => {
    // Counts down time while not paused
    if (!sessionPaused) {
      if (durationInS === 0) {
        endSession(sessionProblemSolveGoal);
        return clearInterval(sessionTimer);
      }
      durationInS--;
      sessionCountdownEl.textContent = durationInS;
    }
  }, 1000);
});

// IN SESSION EVENT LISTENERS

answerInputEl.addEventListener("input", (e) => {
  if (
    invalidNumberHandler(
      e,
      "Answer is not a valid number",
      answerFeedbackEl,
    ) === true
  )
    return (answerInputEl.value = "");
});

answerInputFormEl.addEventListener("submit", (e) => {
  e.preventDefault();
  let answer = Number(answerInputEl.value);
  firstOperand = Number(firstOperandEl.textContent);
  secondOperand = Number(secondOperandEl.textContent);
  const correctAnswerCondition = answer === firstOperand * secondOperand;
  answerInputEl.value = "";
  totalAnswers++;
  totalAnswersValueEl.textContent = totalAnswers;

  problemGen(firstOperandDigits, secondOperandDigits);
  if (correctAnswerCondition) {
    correctAnswerSfx.play();
    correctAnswers++;
    correctAnswersValueEl.textContent = correctAnswers;
  } else incorrectAnswerSfx.play();

  answerFeedbackEl.textContent = correctAnswerCondition
    ? `Correct!: ${answer}`
    : `Incorrect! you answered ${answer} but it was ${firstOperand * secondOperand}`;
  answerFeedbackEl.classList.add(
    correctAnswerCondition ? "correct-answer" : "incorrect-answer",
  );
  const showAnswerFeedbacktimer = setInterval(() => {
    answerFeedbackEl.textContent = "";
    answerFeedbackEl.classList.remove("correct-answer", "incorrect-answer");
    clearInterval(showAnswerFeedbacktimer);
  }, 800);
});

pauseBtnEl.addEventListener("click", (e) => {
  e.preventDefault();
  togglePauseMenu();
});

// PAUSE MENU EVENT LISTENER

resumeBtnEl.addEventListener("click", (e) => {
  e.preventDefault();
  togglePauseMenu();
  problemGen(firstOperandDigits, secondOperandDigits);
});
