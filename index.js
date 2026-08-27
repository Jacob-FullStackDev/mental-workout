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

// HANDLE SFX

const correctAnswerSfx = new Audio("assets/CorrectAnswerSFX.mp3");
const incorrectAnswerSfx = new Audio("assets/IncorrectAnswerSFX.mp3");

function handleSFXVolume(sliderEl) {
  let volume = Number(sliderEl.value) / 100;
  correctAnswerSfx.volume = volume;
  incorrectAnswerSfx.volume = volume;
  // Plays sound effect for the user to gauge the volume
  correctAnswerSfx.play();
}

volumeSliderPreboardingEl.addEventListener("change", (e) => {
  // updates SFX volume
  handleSFXVolume(volumeSliderPreboardingEl);
});
volumeSliderPreboardingEl.addEventListener("input", (e) => {
  // displays SFX volume
  volumeValuePreboardingEl.textContent = `${e.target.value}%`;
});

volumeSliderPauseMenuEl.addEventListener("change", (e) => {
  handleSFXVolume(volumeSliderPauseMenuEl);
});
volumeSliderPauseMenuEl.addEventListener("input", (e) => {
  volumeValuePauseMenuEl.textContent = `${e.target.value}%`;
});

// INITAL STATE FUNCTION

let correctAnswers,
  totalAnswers,
  sessionPaused, // Indicates being on the pause screen
  sessionFinished, // Indicates being on the session results screen
  firstOperandDigits,
  secondOperandDigits;

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

// GENERATE PROBLEM

function operandGen(digits) {
  if (digits >= 1) {
    let max = 10 ** digits - 1;
    let min = 10 ** (digits - 1) - 1;
    let operand = Math.floor(Math.random() * (max - min)) + min + 1;
    return operand;
  }
}
function problemGen(
  firstOperandDigits,
  secondOperandDigits,
  previousFirstOperand = undefined,
  previousSecondOperand = undefined,
) {
  if (
    (firstOperandEl.textContent && secondOperandEl.textContent) ||
    (previousFirstOperand && previousSecondOperand)
  ) {
    let newFirstOperand;
    let newSecondOperand;
    while (!newFirstOperand || newFirstOperand === previousFirstOperand) {
      newFirstOperand = operandGen(firstOperandDigits);
    }
    while (!newSecondOperand || newSecondOperand === previousSecondOperand) {
      newSecondOperand = operandGen(secondOperandDigits);
    }
    firstOperandEl.textContent = newFirstOperand;
    secondOperandEl.textContent = newSecondOperand;
  } else {
    firstOperandEl.textContent = operandGen(firstOperandDigits);
    secondOperandEl.textContent = operandGen(secondOperandDigits);
  }
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

// STARTS/ENDS SESSION

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

// ERROR HANDLER
function errorHandler(feedbackEl, msg, action, hiddenEl = undefined) {
  feedbackEl.textContent = msg;
  feedbackEl.classList.remove("hidden");
  hiddenEl.classList.add("hidden");
  if (action === "error") {
    console.error(msg);
  }
  if (action === "warn") {
    console.warn(msg);
  }
}

// PREBOARDING EVENT LISTENERS (To start a session)

firstOperandInputEl.addEventListener("input", (e) => {
  if (
    (!isNaN(Number(e.target.value)) && e.target.value !== "e") ||
    e.target.value === ""
  ) {
    firstOperandDigits = Number(e.target.value);
    if (
      (firstOperandDigits >= 1 && firstOperandDigits <= 7) ||
      !firstOperandInputEl.value
    ) {
      displayPreboardingOperand(1, firstOperandDigits);
      preboardingProblemFeedbackEl.classList.add("hidden");
    } else {
      return errorHandler(
        preboardingProblemFeedbackEl,
        preboardingProblemEl,
        "Operands must be between 1 and 7 digits long",
        "warn",
      );
    }
    if (!secondOperandInputEl.value) {
      displayPreboardingOperand(2, firstOperandDigits);
    }
    if (!firstOperandInputEl.value) {
      // Value removed or wasn't added
      if (secondOperandInputEl.value) {
        // Use length of other operand
        displayPreboardingOperand(1, secondOperandDigits);
      } else if (!firstOperandInputEl.value && !secondOperandInputEl.value) {
        secondOperandValueEl.textContent = firstOperandValueEl.textContent = "";
        preboardingProblemEl.classList.add("hidden");
        return;
      }
    }
    preboardingProblemEl.classList.remove("hidden");
  } else {
    // if input wasn't a number, handles that edge case
    errorHandler(
      preboardingProblemFeedbackEl,
      "Input is not a valid number",
      "error",
      preboardingProblemEl,
    );
  }
});

secondOperandInputEl.addEventListener("input", (e) => {
  if (
    (!isNaN(Number(e.target.value)) && e.target.value !== "e") ||
    e.target.value === ""
  ) {
    secondOperandDigits = Number(e.target.value);
    if (
      (secondOperandDigits >= 1 && secondOperandDigits <= 7) ||
      !secondOperandInputEl.value
    ) {
      displayPreboardingOperand(2, secondOperandDigits);
      preboardingProblemFeedbackEl.classList.add("hidden");
    } else {
      return errorHandler(
        preboardingProblemFeedbackEl,
        preboardingProblemEl,
        "Operands must be between 1 and 7 digits long",
        "warn",
      );
    }
    if (!firstOperandInputEl.value) {
      displayPreboardingOperand(1, secondOperandDigits);
    }
    if (!secondOperandInputEl.value) {
      // Value removed or wasn't added
      if (firstOperandInputEl.value) {
        // Use length of other operand
        displayPreboardingOperand(2, firstOperandDigits);
      } else if (!secondOperandInputEl.value && !firstOperandInputEl.value) {
        firstOperandValueEl.textContent = secondOperandValueEl.textContent = "";
        preboardingProblemEl.classList.add("hidden");
        return;
      }
    }
    preboardingProblemEl.classList.remove("hidden");
  } else {
    // if input wasn't a number, handles that edge case
    errorHandler(
      preboardingProblemFeedbackEl,
      "Input is not a valid number",
      "error",
      preboardingProblemEl,
    );
  }
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

answerInputFormEl.addEventListener("submit", (e) => {
  if (
    (!isNaN(Number(e.target.value)) && e.target.value !== "e") ||
    e.target.value === ""
  ) {
    e.preventDefault();
    let answer = Number(answerInputEl.value);
    let firstOperand = Number(firstOperandEl.textContent);
    let secondOperand = Number(secondOperandEl.textContent);
    const correctAnswerCondition = answer === firstOperand * secondOperand;
    answerInputEl.value = "";
    totalAnswers++;
    totalAnswersValueEl.textContent = totalAnswers;

    problemGen(
      firstOperandDigits,
      secondOperandDigits,
      firstOperand,
      secondOperand,
    );
    if (correctAnswerCondition) {
      correctAnswerSfx.play();
      correctAnswers++;
      correctAnswersValueEl.textContent = correctAnswers;
    } else {
      // testing statement
      console.log(
        `you answered ${answer}, the solution is ${firstOperand * secondOperand}, ${firstOperand}, ${secondOperand}`,
      );
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
  } else {
    // if input wasn't a number, handles that edge case
    answerInputEl.value = "";
    errorHandler(answerFeedbackEl, "Input is not a valid number", "error");
  }
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
