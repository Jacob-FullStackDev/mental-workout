"use strict";

// PREBOARDING DOM ELEMENT SELECTORS

const preboardingSectionEl = document.getElementById("preboarding-section");
const durationInputEl = document.getElementById("session-duration");
const goalInputEl = document.getElementById("session-goal");
const firstOperandInputEl = document.getElementById("first-operand-length");
const secondOperandInputEl = document.getElementById("second-operand-length");
const sampleProblemEl = document.getElementById("sample-problem");
const startSessionFormEl = document.getElementById("start-session");
const firstOperandOfSampleProblemEl =
  document.getElementById("sample-operand-1");
const secondOperandOfSampleProblemEl =
  document.getElementById("sample-operand-2");
const sampleProblemFeedbackEl = document.getElementById(
  "sample-problem-feedback",
);

// VOLUME % DOM ELEMENT SELECTORS

let activeVolumeSliderEl; // volume slider/volume value element locations: onboarding, pause menu
let activeVolumeValueEl;

// SESSION DOM ELEMENT SELECTORS

const mathProblemEl = document.getElementById("math-problem");
const sessionCountdownEl = document.getElementById("session-countdown");
const accuracyEl = document.getElementById("accuracy");
const answerInputEl = document.getElementById("problem-answer-input");
const sessionSectionEl = document.getElementById("session-section-container");
const answerInputFormEl = document.getElementById("problem-answer-form");
const answerFeedbackEl = document.getElementById("answer-feedback"); // whether or not the answer was correct

// PAUSE MENU DOM ELEMENT SELECTORS

const pauseMenuEl = document.getElementById("pause-menu");
const timeRemainingEl = document.getElementById("time-remaining");
const pauseBtnEl = document.getElementById("pause-btn");
const resumeBtnEl = document.getElementById("resume-btn");

// RESULTS SECTION ELEMENTS

const returnToHomeBtn = document.createElement("button");
const resultsElement = document.createElement("p"); // session results displayed as fraction (1/3)

// INITIAL STATE (that isn't handled in the init function)

let firstOperand,
  secondOperand,
  firstOperandDigits,
  secondOperandDigits,
  volume,
  durationInMS,
  durationInS;

// HANDLE SFX

const correctAnswerSfx = new Audio("assets/CorrectAnswerSFX.mp3");
const incorrectAnswerSfx = new Audio("assets/IncorrectAnswerSFX.mp3");

function handleSFXVolume(id) {
  activeVolumeSliderEl = document.getElementById(`volume-slider--${id}`);
  activeVolumeValueEl = document.getElementById(`volume-value--${id}`);
  volume = Number(activeVolumeSliderEl.value);
  activeVolumeValueEl.textContent = volume;
  activeVolumeSliderEl.addEventListener("input", () => {
    volume = Number(activeVolumeSliderEl.value);
    activeVolumeValueEl.textContent = volume;
    // plays sound effect for the user to gauge the volume
    activeVolumeSliderEl.addEventListener("change", () => {
      correctAnswerSfx.volume = volume / 100;
      correctAnswerSfx.play();
    });
  });
}
handleSFXVolume(1);

// INITAL STATE FUNCTION

let correctAnswers,
  problemsAnswered,
  sessionProblemSolveGoal,
  sessionPaused, // indicates being on the pause screen
  sessionFinished, // indicates being on the session results screen
  sessionEndTimer,
  sessionTimer;
function init() {
  correctAnswers = 0;
  problemsAnswered = 0;
  sessionProblemSolveGoal = 0;
  sessionPaused = false;
  sessionFinished = false;
  accuracyEl.value = "";
  goalInputEl.value = "";
  durationInputEl.value = "";
  firstOperandInputEl.value = secondOperandInputEl.value = "";
  activeVolumeSliderEl = document.getElementById("volume-slider--1");
  activeVolumeValueEl = document.getElementById("volume-value--1");
}
init();

// GENERATE PROBLEM

function operandGen(digits) {
  if (digits >= 1) {
    let max = 10 ** digits - 1;
    let min = 10 ** (digits - 1) - 1;
    let operand = Math.floor(Math.random() * (max - min)) + min + 1;
    return operand;
  }
}

function problemGen(firstOperandDigits, secondOperandDigits) {
  firstOperand = operandGen(firstOperandDigits);
  secondOperand = operandGen(secondOperandDigits);
  mathProblemEl.textContent = `${firstOperand} × ${secondOperand}`;
}

// START SESSION

function handleSession() {
  preboardingSectionEl.classList.toggle("hidden");
  sessionSectionEl.classList.toggle("hidden");
  sessionProblemSolveGoal = Number(goalInputEl.value);
  firstOperandDigits = Number(firstOperandInputEl.value);
  secondOperandDigits = Number(secondOperandInputEl.value)
    ? Number(secondOperandInputEl.value)
    : firstOperandDigits;
  durationInMS = Number(durationInputEl.value) * 1000;
  durationInS = durationInMS / 1000;
  sessionCountdownEl.textContent = durationInS;
  accuracyEl.textContent = `${correctAnswers} / ${problemsAnswered}`;
}

// END SESSION

function setSessionGoalResultMessage() {
  if (correctAnswers > sessionProblemSolveGoal) return "exceeded";
  else if (correctAnswers < sessionProblemSolveGoal) return "failed to meet";
  else return "met";
}

function endSession() {
  clearInterval(sessionEndTimer);
  clearInterval(sessionTimer);
  sessionFinished = true;
  resultsElement.textContent = `You correctly solved ${correctAnswers} / ${problemsAnswered} problems. You correctly solved ${correctAnswers} problems. You ${setSessionGoalResultMessage()} your goal of ${sessionProblemSolveGoal}`;
  returnToHomeBtn.textContent = "Return to Home";
  document.body.append(resultsElement, returnToHomeBtn);
  returnToHomeBtn.addEventListener("click", (e) => {
    e.preventDefault();
    returnToHome();
  });
  init();
  sessionSectionEl.classList.add("hidden");
}

// PAUSE MENU

function togglePauseMenu(volumeElementId) {
  sessionPaused = !sessionPaused;
  pauseMenuEl.classList.toggle("hidden");
  handleSFXVolume(volumeElementId);
}

// RESULTS SCREEN

function returnToHome() {
  returnToHomeBtn.remove();
  resultsElement.remove();
  preboardingSectionEl.classList.remove("hidden");
}

// RETURN TO AREA

document.body.addEventListener("keyup", (e) => {
  e.preventDefault();
  if (e.key === "Escape") {
    if (sessionPaused === true) togglePauseMenu(1);
    if (sessionFinished === true) returnToHome();
  }
});

// START SESSION EVENT LISTENERS

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

startSessionFormEl.addEventListener("submit", (e) => {
  e.preventDefault();
  handleSession();
  // handle SFX volume
  correctAnswerSfx.volume = incorrectAnswerSfx.volume = volume / 100;
  sessionEndTimer = setInterval(() => {
    // ends session once timer has 0 seconds
  }, 1000);
  sessionTimer = setInterval(() => {
    // counts down time while not paused
    if (!sessionPaused) {
      if (durationInS === 0) {
        endSession();
      }
      durationInS--;
      sessionCountdownEl.textContent = durationInS;
    }
  }, 1000);
  problemGen(firstOperandDigits, secondOperandDigits);

  // IN SESSION EVENT LISTENERS

  answerInputFormEl.addEventListener("submit", (e) => {
    e.preventDefault();
    let answer = Number(answerInputEl.value);
    const correctAnswerCondition = answer === firstOperand * secondOperand;
    answerInputEl.value = "";
    problemsAnswered++;
    if (correctAnswerCondition) {
      correctAnswerSfx.play();
      correctAnswers++;
    } else {
      incorrectAnswerSfx.play();
    }
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
    accuracyEl.textContent = `${correctAnswers} / ${problemsAnswered}`;
    problemGen(firstOperandDigits, secondOperandDigits);
  });
});

pauseBtnEl.addEventListener("click", (e) => {
  e.preventDefault();
  togglePauseMenu(2);
  resumeBtnEl.addEventListener("click", (e) => {
    e.preventDefault();
    togglePauseMenu(1);
  });
});
