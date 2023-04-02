function cl(log) {
  console.log(log);
}

let tableEl = document.getElementById("table");

let settings = {
  rows: 40,
  columns: 40,

  weightRed: 10,
  weightYellow: 20,
  weightBlue: 10,

  proportionDivider: 80 / 1000,
  proportionPanelFill: 300 / 1000,
  proportionPanelCombine: 300 / 1000,

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
        array.push(index);
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

function combinePanels() {}

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
        rowElement.appendChild(colElement);
      }
    }
    for (
      let heightCounter = 0;
      heightCounter < rows[columnObj.row].width;
      heightCounter++
    )
      tableEl.appendChild(rowElement);
  }
}

setUpColumnsAndRows();
populateColorsGrid();
// combinePanels();
render();
cl(rows);
cl(columns);
cl(colorsGrid);
