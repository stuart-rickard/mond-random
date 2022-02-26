let tableEl = document.getElementById("table");

const rows = 40;
const columns = 40;

const percentRed = 0.015;
const percentYellow = 0.05;
const percentBlue = 0.01;

let redColumns = [];
let yellowColumns = [];
let blueColumns = [];

let redRows = [];
let yellowRows = [];
let blueRows = [];

for (x = 1; x <= rows; x++) {
  let rowRand = Math.random();
  if (rowRand < percentRed) {
    redRows.push(x);
  } else {
    if (rowRand < percentRed + percentYellow) {
      yellowRows.push(x);
    } else {
      if (rowRand < percentRed + percentYellow + percentBlue) {
        blueRows.push(x);
      }
    }
  }
}

for (y = 1; y <= rows; y++) {
  let colRand = Math.random();
  if (colRand < percentRed) {
    redColumns.push(y);
  } else {
    if (colRand < percentRed + percentYellow) {
      yellowColumns.push(y);
    } else {
      if (colRand < percentRed + percentYellow + percentBlue) {
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
