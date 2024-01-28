let tableEl = document.getElementById("table");

let settings = {
  rows: 55,
  columns: 55,

  weightRed: 10,
  weightYellow: 20,
  weightBlue: 10,

  proportionDivider: 65 / 1000,
  proportionPanelFill: 300 / 1000,
  proportionPanelCombine: 150 / 1000,

  colors: {
    red: "#e4071e",
    yellow: "#Fbe90e",
    blue: "#0051f4",
    black: "#0a0a0a",
    white: "#f6f6eb",
  },
};

let columns = [];
let rows = [];
let colorsGrid = [];

function reset() {
  columns = [];
  rows = [];
  colorsGrid = [];
  // clear tableEl
  while (tableEl.firstChild) {
    tableEl.removeChild(tableEl.firstChild);
  }
}

function assignPanelColor() {
  let weightAndFillFactor =
    settings.proportionPanelFill /
    (settings.weightRed + settings.weightYellow + settings.weightBlue);
  let ceilRed = settings.weightRed * weightAndFillFactor;
  let ceilYellow = settings.weightYellow * weightAndFillFactor + ceilRed;
  let ceilBlue = settings.weightBlue * weightAndFillFactor + ceilYellow;
  let rand = Math.random();
  switch (true) {
    case rand < ceilRed:
      return "red";
    case rand < ceilYellow:
      return "yellow";
    case rand < ceilBlue:
      return "blue";
    default:
      return "white";
  }
}

function setUpColumnsAndRows() {
  // randomly generate dividers, which are never on the outside of the grid
  const dividerRows = [];
  const dividerColumns = [];

  function identifyDividerIndices(array, dimension) {
    for (let index = 1; index < dimension - 1; index++) {
      if (Math.random() < settings.proportionDivider) {
        if (array.includes(index - 1) || array.includes(index - 2)) {
          if (Math.random() < 0.15) {
            array.push(index);
          }
        } else {
          array.push(index);
        }
      }
    }
  }

  function populateAxis(dividerArray, size) {
    let axisArray = [];
    let index = 0;
    let start = -1;
    for (value of dividerArray) {
      let panelWidth = value - start - 1;
      if (panelWidth > 0) {
        axisArray.push({
          index: index,
          start: start + 1,
          width: value - start - 1,
          type: "panel",
        });
        index++;
        axisArray.push({
          index: index,
          start: value,
          width: 1,
          type: "divider",
        });
        start = value;
        index++;
      } else {
        // to avoid 0-width panels
        axisArray[axisArray.length - 1].width += 1;
        start = value;
      }
    }
    axisArray.push({
      index: index,
      start: start,
      width: size - start - 1,
      type: "panel",
    });
    return axisArray;
  }

  identifyDividerIndices(dividerRows, settings.rows);
  identifyDividerIndices(dividerColumns, settings.columns);

  columns = populateAxis(dividerColumns, settings.columns);
  rows = populateAxis(dividerRows, settings.rows);
}

function populateColorsGrid() {
  for (rowElement of rows) {
    let rowArray = [];
    for (columnElement of columns) {
      if (columnElement.type == "panel" && rowElement.type == "panel") {
        rowArray.push({
          color: assignPanelColor(),
          row: rowElement.index,
          column: columnElement.index,
        });
      } else {
        rowArray.push({
          color: "black",
          row: rowElement.index,
          column: columnElement.index,
        });
      }
    }
    colorsGrid.push(rowArray);
  }
}

function combinePanels() {
  function checkAndApplyRange(xMin, xMax, yMin, yMax, color) {
    for (let row = yMin; row <= yMax; row++) {
      let breakInnerLoop = false;
      for (let col = xMin; col <= xMax && !breakInnerLoop; col++) {
        let cell = colorsGrid[row][col];
        console.log(col, cell);
        cell.color = color;
        let cellGroup = colorsGrid[row][col].group;
        // if the cell would expand the group, restart with the new range
        if (
          cellGroup.xMin < xMin ||
          cellGroup.xMax > xMax ||
          cellGroup.yMin < yMin ||
          cellGroup.yMax > yMax
        ) {
          // extend range
          yMin = Math.min(cellGroup.yMin, yMin);
          yMax = Math.max(cellGroup.yMax, yMax);
          xMin = Math.min(cellGroup.xMin, xMin);
          xMax = Math.max(cellGroup.xMax, xMax);
          // restart
          breakInnerLoop = true;
          row = yMin - 1;
        }
        // update the group
        cellGroup.xMin = xMin;
        cellGroup.xMax = xMax;
        cellGroup.yMin = yMin;
        cellGroup.yMax = yMax;
        // add color for clarity
        cellGroup.color = color;
        // add marker
        cellGroup.marker = [xMin, xMax, yMin, yMax, color];
        // already extended to remove extend flag
        cellGroup.extend = false;
      }
    }
  }

  // prepare panels to have groups
  for (panel of colorsGrid.flat()) {
    panel.group = {
      xMin: panel.column,
      xMax: panel.column,
      yMin: panel.row,
      yMax: panel.row,
      color: panel.color,
      extend: false,
    };
    // randomly select panels to extend to the right or down
    if (panel.row % 2 == 0 && panel.column % 2 == 0)
      if (panel.column < columns.length - 2) {
        if (Math.random() < settings.proportionPanelCombine) {
          panel.group.xMax = panel.column + 2;
          panel.group.extend = true;
        }
        if (panel.row < rows.length - 2) {
          if (Math.random() < settings.proportionPanelCombine) {
            panel.group.yMax = panel.row + 2;
            panel.group.extend = true;
          }
        }
      }
  }

  // go through grid, group panels based on extends
  for (rowElement of colorsGrid) {
    for (panel of rowElement) {
      if (panel.group.extend) {
        checkAndApplyRange(
          panel.group.xMin,
          panel.group.xMax,
          panel.group.yMin,
          panel.group.yMax,
          panel.group.color
        );
      }
    }
  }
}

function render() {
  for (let rowIndex = 0; rowIndex < colorsGrid.length; rowIndex++) {
    let rowElement = document.createElement("tr");
    for (columnObj of colorsGrid[rowIndex]) {
      let colElement = document.createElement("td");
      colElement.style.backgroundColor = settings.colors[columnObj.color];
      for (
        let widthCounter = 0;
        widthCounter < columns[columnObj.column].width;
        widthCounter++
      ) {
        let cloneColElement = colElement.cloneNode();
        rowElement.appendChild(cloneColElement);
      }
    }
    for (
      let heightCounter = 0;
      heightCounter < rows[columnObj.row].width;
      heightCounter++
    ) {
      let cloneRowElement = rowElement.cloneNode(true);
      tableEl.appendChild(cloneRowElement);
    }
  }
}

function main() {
  reset();
  setUpColumnsAndRows();
  populateColorsGrid();
  combinePanels();
  render();
  console.log(colorsGrid);
  console.log("--------------------");
}

document.addEventListener("click", main);
document.addEventListener("tap", main);
document.addEventListener("keydown", main);

main();

// avoid groups that split the canvas
// avoid one row or one column
// avoid too much regularity / lack of assymetry
// avoid no color
// delete group property?
