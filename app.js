// Enregistrer le Service Worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").then(() => {
    console.log("Service Worker enregistré");
  });
}

const version = "CalC Pente 1.0.1 - 18/10/2024";

// Affiche la version de la PWA
const notificationsBtn = document.getElementById("version");
const initialText = notificationsBtn.textContent;
let cacheName;
let timeoutId;

notificationsBtn.addEventListener("click", () => {
  if (notificationsBtn.textContent === initialText) {
    notificationsBtn.textContent = version;

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      notificationsBtn.textContent = initialText;
    }, 3000);
  } else {
    notificationsBtn.textContent = initialText;

    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
});

// Gestion du calcul de pente

const inputsValidity = {
  altitude1: false,
  altitude2: false,
  distance: false,
};

// Validation du formulaire

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
    showResults();
    drawSlope();
  }
}

// Affichage du résultat

const results = document.querySelector(".results");
const titleResults = document.querySelectorAll(".title-results");
const slopePercent = document.querySelector(".slope-percent");
const slopeDegree = document.querySelector(".slope-degree");
const glideRatio = document.querySelector(".glide-ratio");
const canvasContainer = document.querySelector(".chart-container");

function showResults() {
  titleResults[0].style.display = "inline";
  slopePercent.textContent = `${calculateSlopePercent()}%`;
  titleResults[1].style.display = "inline";
  slopeDegree.textContent = `${calculateSlopeDegree()}°`;
  titleResults[2].style.display = "inline";
  titleResults[3].style.display = "inline";
  glideRatio.textContent = `${calculateGlideRatio()}`;
  canvasContainer.style.display = "block";
  results.classList.add("visible");
}

// Validation des champs

const regEx = /^[0-9]\d*$/;
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

// Calcul de la pente

function calculateDeltaAltitude() {
  let altitude1 = parseInt(altitude1Input.value);
  let altitude2 = parseInt(altitude2Input.value);
  let highAltitude = 0;
  let lowAltitude = 0;
  if (altitude1 > altitude2) {
    highAltitude = altitude1;
    lowAltitude = altitude2;
  } else {
    highAltitude = altitude2;
    lowAltitude = altitude1;
  }

  let deltaAltitude = highAltitude - lowAltitude;
  return deltaAltitude;
}

function calculateSlopePercent() {
  let deltaAltitude = calculateDeltaAltitude();

  let slopePercentResult = (deltaAltitude / distanceInput.value) * 100;

  return slopePercentResult.toFixed(1);
}

function calculateSlopeDegree() {
  let deltaAltitude = calculateDeltaAltitude();

  let slopeRadiansResult = Math.atan(deltaAltitude / distanceInput.value);
  let slopeDegreeResult = slopeRadiansResult * (180 / Math.PI);

  return slopeDegreeResult.toFixed(1);
}

function calculateGlideRatio() {
  let deltaAltitude = calculateDeltaAltitude();
  let glideRatio = distanceInput.value / deltaAltitude;

  return glideRatio.toFixed(1);
}

// Graphique avec Chart

let chartIntance = null;

function drawSlope() {
  // Suppression du graphique avant d'en créer un nouveau
  if (chartIntance !== null) {
    chartIntance.destroy();
  }

  let slopeLength = parseInt(distanceInput.value); // X
  let slopeHeight = parseInt(calculateDeltaAltitude()); // Y

  const canvas = document.querySelector("#slope-chart");
  const maxWidth = 200;
  const maxHeight = 300;

  const ratio = slopeHeight / slopeLength;

  // Calculer la hauteur du canvas en fonction du ratio et de la limite de hauteur maximale
  let canvasHeight = maxWidth * ratio;
  let canvasWidth = maxWidth;

  // Si la hauteur calculée dépasse maxHeight, réduire les dimensions à l'échelle
  if (canvasHeight > maxHeight) {
    canvasHeight = maxHeight;
    canvasWidth = maxHeight / ratio; // Ajuster la largeur pour maintenir l'échelle
  }

  // Définir les dimensions du canvas
  canvas.width = canvasWidth; // Ajustement dynamique de la largeur
  canvas.height = canvasHeight; // Ajustement dynamique de la hauteur

  const data = {
    labels: ["A", "B"],
    datasets: [
      {
        //label: "Pente",
        data: [0, slopeHeight],
        borderColor: "#4db050",
        fill: false,
        borderWidth: 2,
      },
    ],
  };

  const config = {
    type: "line",
    data: data,
    options: {
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          min: 0,
          max: slopeLength,
          title: {
            display: false,
            //text: "Distance",
          },
          ticks: {
            // callback: function(value, index, values) {
            //   return index === 0 ? "0 m" : slopeLength + " m"
            // }
            display: false,
          },
        },
        y: {
          min: 0,
          max: slopeHeight,
          beginAtZero: true,
          title: {
            display: false,
            //text: "Hauteur (m)"
          },
          ticks: {
            display: false,
          },
        },
      },
      maintainAspectRatio: false,
      responsive: false,
    },
  };

  const ctx = canvas.getContext("2d");
  chartIntance = new Chart(ctx, config);
}
