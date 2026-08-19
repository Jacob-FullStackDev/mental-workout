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

// VOLUME %

let activeVolumeSliderEl = document.getElementById("volume-slider--1"); // volume slider locations: onboarding, pause menu
let activeVolumeValueEl = document.getElementById("volume-value--1");

// SESSION DOM ELEMENT SELECTORS

const mathProblemEl = document.getElementById("math-problem");
const sessionCountdownEl = document.getElementById("session-countdown");
const accuracyEl = document.getElementById("accuracy");
const answerInputEl = document.getElementById("problem-answer-input");
const sessionSectionEl = document.getElementById("session-section-container");
const answerInputFormEl = document.getElementById("problem-answer-form");

// PAUSE MENU DOM ELEMENT SELECTORS

const pauseMenuEl = document.getElementById("pause-menu");
const timeRemainingEl = document.getElementById("time-remaining");

// INITIAL STATE

let firstOperand;
let secondOperand;
let firstOperandDigits;
let secondOperandDigits;
let volume;

// SFX VOLUME

const correctAnswerSfx = new Audio("/assets/rightanswer-95219.mp3");
const incorrectAnswerSfx = new Audio("assets/wrong-47985.mp3");
function handleSFXVolume(id) {
  activeVolumeSliderEl = document.getElementById(`volume-slider--${id}`);
  activeVolumeValueEl = document.getElementById(`volume-value--${id}`);
  volume = Number(activeVolumeSliderEl.value);
  activeVolumeValueEl.textContent = volume;
  activeVolumeSliderEl.addEventListener("input", () => {
    volume = Number(activeVolumeSliderEl.value);
    activeVolumeValueEl.textContent = volume;
    // tests volume
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
  durationInMS,
  durationInS,
  sessionPaused;
function init() {
  correctAnswers = 0;
  problemsAnswered = 0;
  sessionProblemSolveGoal = 0;
  sessionPaused = false;
  accuracyEl.value = "";
  goalInputEl.value = "";
  durationInputEl.value = "";
  firstOperandInputEl.value = secondOperandInputEl.value = "";
  sessionSectionEl.classList.add("hidden");
}
init();

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

function setSessionGoalResultMessage() {
  if (correctAnswers > sessionProblemSolveGoal) return "exceeded";
  else if (correctAnswers < sessionProblemSolveGoal) return "failed to meet";
  else return "met";
}

function endSession() {
  console.log(
    `You correctly solved ${correctAnswers} / ${problemsAnswered} problems. You correctly solved ${correctAnswers} problems. You ${setSessionGoalResultMessage()} your goal of ${sessionProblemSolveGoal}`,
  );
  init();
  sessionSectionEl.classList.add("hidden");
}

// PAUSE MENU

const pauseBtnEl = document.getElementById("pause-btn");
pauseBtnEl.addEventListener("click", (e) => {
  e.preventDefault();
  sessionPaused = !sessionPaused;
  pauseMenuEl.classList.toggle("hidden");
  handleSFXVolume(2);
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
  const sessionEnd = setInterval(() => {
    // ends session
    if (!sessionPaused) {
      if (durationInS === 0) {
        endSession();
      }
    }
  }, 1000);
  const sessionTimer = setInterval(() => {
    // counts down time while not paused
    if (!sessionPaused) {
      durationInS--;
      sessionCountdownEl.textContent = durationInS;
    }
  }, 1000);
  problemGen(firstOperandDigits, secondOperandDigits);
  answerInputFormEl.addEventListener("submit", (e) => {
    e.preventDefault();
    let answer = Number(answerInputEl.value);
    answerInputEl.value = "";
    problemsAnswered++;
    if (answer === firstOperand * secondOperand) {
      correctAnswerSfx.play();
      correctAnswers++;
    } else {
      incorrectAnswerSfx.play();
      console.log(answer, firstOperand * secondOperand);
    }
    accuracyEl.textContent = `${correctAnswers} / ${problemsAnswered}`;
    problemGen(firstOperandDigits, secondOperandDigits);
  });
});
