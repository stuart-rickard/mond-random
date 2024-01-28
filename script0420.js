// const bellThree = require("./utils/utils");

let tableEl = document.getElementById("table");

const rows = 40;
const columns = 40;

const proportionRed = 15 / 1000;
const proportionYellow = 50 / 1000;
const proportionBlue = 15 / 1000;

let redColumns = [];
let yellowColumns = [];
let blueColumns = [];

let redRows = [];
let yellowRows = [];
let blueRows = [];

for (x = 1; x <= rows; x++) {
  let rowRand = Math.random();
  if (rowRand < proportionRed) {
    redRows.push(x);
  } else {
    if (rowRand < proportionRed + proportionYellow) {
      yellowRows.push(x);
    } else {
      if (rowRand < proportionRed + proportionYellow + proportionBlue) {
        blueRows.push(x);
      }
    }
  }
}

for (y = 1; y <= rows; y++) {
  let colRand = Math.random();
  if (colRand < proportionRed) {
    redColumns.push(y);
  } else {
    if (colRand < proportionRed + proportionYellow) {
      yellowColumns.push(y);
    } else {
      if (colRand < proportionRed + proportionYellow + proportionBlue) {
        blueColumns.push(y);
      }
    }
  }
}

for (x = 1; x <= rows; x++) {
  let rowElement = document.createElement("tr");
  tableEl.appendChild(rowElement);

  for (y = 1; y <= columns; y++) {
    let colElement = document.createElement("td");
    colElement.setAttribute("data-x", x);
    colElement.setAttribute("data-y", y);
    if (redRows.includes(x)) {
      colElement.style.backgroundColor = "#e4071e";
    }
    if (yellowRows.includes(x)) {
      colElement.style.backgroundColor = "#Fbe90e";
    }
    if (blueRows.includes(x)) {
      colElement.style.backgroundColor = "#0051f4";
    }
    if (redColumns.includes(y)) {
      colElement.style.backgroundColor = "#e4071e";
    }
    if (yellowColumns.includes(y)) {
      colElement.style.backgroundColor = "#Fbe90e";
    }
    if (blueColumns.includes(y)) {
      colElement.style.backgroundColor = "#0051F4";
    }
    rowElement.appendChild(colElement);
  }
}

// console.log(bellThree());
