"use strict";
// DOM ELEMENT SELECTORS
const preboardingHeadingEl = document.getElementById("preboarding-heading");
const durationInputEl = document.getElementById("session-duration");
const goalInputEl = document.getElementById("session-goal");
const firstOperandInputEl = document.getElementById("first-operand-length");
const secondOperandInputEl = document.getElementById("second-operand-length");
const firstOperandSampleEl = document.getElementById("sample-operand--1");
const secondOperandSampleEl = document.getElementById("sample-operand--2");
const startSessionEl = document.getElementById("start-session");
const mathProblemEl = document.getElementById("math-problem");
const sessionCountdownEl = document.getElementById("session-countdown");
const accuracyEl = document.getElementById("accuracy");

let mode = "multiplication";
preboardingHeading.textContent += ` ${mode}`;
