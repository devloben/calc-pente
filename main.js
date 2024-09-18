const inputsValidity = {
  altitude1: false,
  altitude2: false,
  distance: false,
};

const container = document.querySelector(".container");
const form = document.querySelector("form");
form.addEventListener("submit", handleForm);

let isAnimating = false;
function handleForm(e) {
  e.preventDefault();

  const keys = Object.keys(inputsValidity);
  const failedInputs = keys.filter((key) => !inputsValidity[key]);

  if (failedInputs.length && !isAnimating) {
    isAnimating = true;
    container.classList.add("shake");

    setTimeout(() => {
      container.classList.remove("shake");
      isAnimating = false;
    }, 400);

    failedInputs.forEach((input) => {
      const index = keys.indexOf(input);
      showValidation({ index: index, validation: false });
    });
  } else {
    calculateSlopePercent();
    calculateSlopeDegree();
  }
}

const regEx = /^[1-9]\d*$/;
const validationTexts = document.querySelectorAll(".error-msg");

function showValidation({ index, validation }) {
  if (validation) {
    if (validationTexts[index]) validationTexts[index].style.display = "none";
  } else {
    if (validationTexts[index]) validationTexts[index].style.display = "block";
  }
}

const altitude1Input = document.querySelector(
  ".input-group:nth-child(1) input"
);

altitude1Input.addEventListener("blur", altitude1Validation);
altitude1Input.addEventListener("input", altitude1Validation);

function altitude1Validation() {
  if (regEx.test(altitude1Input.value)) {
    showValidation({ index: 0, validation: true });
    inputsValidity.altitude1 = true;
  } else {
    showValidation({ index: 0, validation: false });
    inputsValidity.altitude1 = false;
  }
}

const altitude2Input = document.querySelector(
  ".input-group:nth-child(2) input"
);

altitude2Input.addEventListener("blur", altitude2Validation);
altitude2Input.addEventListener("input", altitude2Validation);

function altitude2Validation() {
  if (regEx.test(altitude2Input.value)) {
    showValidation({ index: 1, validation: true });
    inputsValidity.altitude2 = true;
  } else {
    showValidation({ index: 1, validation: false });
    inputsValidity.altitude2 = false;
  }
}

const distanceInput = document.querySelector(".input-group:nth-child(3) input");

distanceInput.addEventListener("blur", distanceValidation);
distanceInput.addEventListener("input", distanceValidation);

function distanceValidation() {
  if (regEx.test(distanceInput.value)) {
    showValidation({ index: 2, validation: true });
    inputsValidity.distance = true;
  } else {
    showValidation({ index: 2, validation: false });
    inputsValidity.distance = false;
  }
}

// Affichage de la pente en %
const slopePercent = document.querySelector("#slope-percent");

function calculateSlopePercent() {
  let highAltitude = 0;
  let lowAltitude = 0;
  if (altitude1Input.value > altitude2Input.value) {
    highAltitude = parseInt(altitude1Input.value);
    lowAltitude = parseInt(altitude2Input.value);
  } else {
    highAltitude = parseInt(altitude2Input.value);
    lowAltitude = parseInt(altitude1Input.value);
  }

  let deltaAltitude = highAltitude - lowAltitude;

  let slopePercentResult = (deltaAltitude / distanceInput.value) * 100;

  slopePercent.textContent = `${slopePercentResult.toFixed(1)} %`;
}

// Affichage de la pente en °
const slopeDegree = document.querySelector("#slope-degree");

function calculateSlopeDegree() {
  let highAltitude = 0;
  let lowAltitude = 0;
  if (altitude1Input.value > altitude2Input.value) {
    highAltitude = parseInt(altitude1Input.value);
    lowAltitude = parseInt(altitude2Input.value);
  } else {
    highAltitude = parseInt(altitude2Input.value);
    lowAltitude = parseInt(altitude1Input.value);
  }

  let deltaAltitude = highAltitude - lowAltitude;

  let slopeRadiansResult = Math.atan(deltaAltitude / distanceInput.value);
  let slopeDegreeResult = slopeRadiansResult * (180 / Math.PI);

  slopeDegree.textContent = `${slopeDegreeResult.toFixed(1)} °`;
}
