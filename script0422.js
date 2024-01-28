// const bellThree = require("./utils/utils");

let tableEl = document.getElementById("table");

const rows = 40;
const columns = 40;

const proportionRed = 15 / 1000;
const proportionYellow = 50 / 1000;
const proportionBlue = 15 / 1000;

const colors = {
  r: "#e4071e",
  y: "#Fbe90e",
  b: "#0051f4",
};

let gridArray = [];

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

for (x = 0; x < rows; x++) {
  let currentRow = [];
  for (y = 0; y < columns; y++) {
    currentRow.push("w");
    if (redRows.includes(x) || redColumns.includes(y)) {
      currentRow[y] = "r";
    }
    if (yellowRows.includes(x) || yellowColumns.includes(y)) {
      currentRow[y] = "y";
    }
    if (blueRows.includes(x) || blueColumns.includes(y)) {
      currentRow[y] = "b";
    }
  }
  gridArray.push(currentRow);
}

for (x = 0; x < rows; x++) {
  let rowElement = document.createElement("tr");
  tableEl.appendChild(rowElement);

  for (y = 0; y < columns; y++) {
    let colElement = document.createElement("td");
    colElement.setAttribute("data-x", x);
    colElement.setAttribute("data-y", y);
    let cellColor = gridArray[x][y];
    if (cellColor != "w") {
      colElement.style.backgroundColor = colors[cellColor];
    }
    rowElement.appendChild(colElement);
  }
}