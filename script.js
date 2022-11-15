let tableEl = document.getElementById("table");

const rows = 40;
const columns = 40;

const proportionRed = 10 / 1000;
const proportionYellow = 20 / 1000;
const proportionBlue = 10 / 1000;
const proportionBlack = 80 / 1000;

const proportionPanelFill = 300 / 1000;

const colors = {
  r: "#e4071e",
  y: "#Fbe90e",
  b: "#0051f4",
  k: "#0a0a0a",
};

const gridArray = [];
const panels = [];

function fillGridWithWhite() {
  for (x = 0; x < rows; x++) {
    let currentRow = [];
    for (y = 0; y < columns; y++) {
      currentRow.push("w");
    }
    gridArray.push(currentRow);
  }
}

function renderGrid() {
  for (x = 0; x < rows; x++) {
    let rowElement = document.createElement("tr");
    tableEl.appendChild(rowElement);

    for (y = 0; y < columns; y++) {
      let colElement = document.createElement("td");
      let cellColor = gridArray[x][y];
      if (cellColor != "w") {
        colElement.style.backgroundColor = colors[cellColor];
      }
      rowElement.appendChild(colElement);
    }
  }
}

function setUpPanels() {
  const notGridRows = [];
  const notGridColumns = [];
  // set up grid lines
  notGridRows.push(0);
  for (r = 1; r < rows - 1; r++) {
    if (Math.random() < proportionBlack) {
      for (i = 0; i < columns; i++) {
        gridArray[r][i] = "k";
      }
    } else {
      notGridRows.push(r);
    }
  }
  notGridRows.push(rows - 1);
  notGridColumns.push(0);
  for (c = 1; c < columns - 1; c++) {
    if (Math.random() < proportionBlack) {
      for (i = 0; i < rows; i++) {
        gridArray[i][c] = "k";
      }
    } else {
      notGridColumns.push(c);
    }
  }
  notGridColumns.push(columns - 1);

  // determine panels location and area
  const panelRows = [];
  for (r = 0; r < rows; r++) {
    if (notGridRows.includes(r)) {
      let panelRow = [r];
      while (notGridRows.includes(r)) {
        r++;
      }
      panelRow.push(r);
      panelRows.push(panelRow);
    }
  }
  console.log(panelRows);

  for (c = 0; c < columns; c++) {
    if (notGridColumns.includes(c)) {
      let panelColumn = [c];
      while (notGridColumns.includes(c)) {
        c++;
      }
      panelColumn.push(c);
      panelRows.forEach((row) => {
        panels.push({
          rows: row,
          cols: panelColumn,
          area: (row[1] - row[0]) * (panelColumn[1] - panelColumn[0]),
        });
      });
    }
  }
  panels.sort((a, b) => b.area - a.area);
  console.log(panels);
}

function fillPanels() {
  panels.forEach((panel) => {
    // XXXXX chance of being filled is a bit more if the panel is smaller
    let color = "";
    let fillPanel = Math.random() < proportionPanelFill ? true : false;
    if (fillPanel) {
      let colorRand = Math.random();
      if (
        colorRand <
        proportionRed / (proportionRed + proportionYellow + proportionBlue)
      ) {
        color = "r";
      } else {
        if (
          colorRand <
          (proportionRed + proportionYellow) /
            (proportionRed + proportionYellow + proportionBlue)
        ) {
          color = "y";
        } else {
          // if (colorRand < proportionRed + proportionYellow + proportionBlue) {
          color = "b";
          // } else {
          //   if (
          //     colorRand <
          //     proportionRed +
          //       proportionYellow +
          //       proportionBlue +
          //       proportionBlack
          //   ) {
          //     color = "k";
          //   }
          // }
        }
      }
    }
    for (x = panel.rows[0]; x < panel.rows[1]; x++) {
      for (y = panel.cols[0]; y < panel.cols[1]; y++) {
        gridArray[x][y] = color;
      }
    }
  });
}

fillGridWithWhite();
setUpPanels();
fillPanels();
renderGrid();
