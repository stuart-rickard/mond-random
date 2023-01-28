let tableEl = document.getElementById("table");

const rows = 40;
const columns = 40;

const proportionRed = 10 / 1000;
const proportionYellow = 20 / 1000;
const proportionBlue = 10 / 1000;
const proportionBlack = 80 / 1000;

const proportionPanelFill = 300 / 1000;
const proportionPanelCombine = 500 / 1000;

const colors = {
  r: "#e4071e",
  y: "#Fbe90e",
  b: "#0051f4",
  k: "#0a0a0a",
};

const gridArray = [];
const panels = [];
const panelNameList = [];
const panelAttributesList = [];
const types = {
  background: { color: "w" },
  divider: { color: "k" },
  corner: { color: "y" },
};

class Type {
  color;
  typeName;
  coordinates;
  constructor(typeName, color, coordinates) {
    this.typeName = typeName;
    this.color = color;
    this.coordinates = coordinates;
  }
  provideTypeName() {
    return this.typeName;
  }
  provideColor() {
    return this.color;
  }
}

class Background extends Type {
  typeName = "background";
  color = "w";
  constructor(typeName, color, coordinates) {
    super(typeName, color, coordinates);
  }
}
class Divider extends Type {
  typeName = "divider";
  color = "k";
  constructor(typeName, color, coordinates) {
    super(typeName, color, coordinates);
  }
}
class Corner extends Type {
  typeName = "corner";
  color = "y";
  constructor(typeName, color, coordinates) {
    super(typeName, color, coordinates);
  }
}
class Panel extends Type {
  panelAttributes;
  constructor(panelName, color, coordinates, panelAttributes) {
    super(panelName, color, coordinates);
    this.panelAttributes = panelAttributes;
    this.typeName = panelAttributes.panelName;
    this.color = panelAttributes.color;
  }
  substitutePanel() {
    console.log("sub");
  }
  providePanelRange(direction) {
    console.log(direction);
  }
}
class Beat extends Type {
  typeName = "beat";
  constructor(typeName, color, coordinates) {
    super(typeName, color, coordinates);
  }
}

class PanelAttributes {
  panelName;
  colRange;
  rowRange;
  color;
  constructor(panelName, cols, rows, color) {
    this.panelName = panelName;
    this.colRange = cols;
    this.rowRange = rows;
    this.color = color;
  }
}

function checkCoordinateCorrespondence() {
  let badCorrespondences = [];
  for (x = 0; x < columns; x++) {
    for (y = 0; y < rows; y++) {
      if (
        gridArray[x][y].coordinates[0] != x ||
        gridArray[x][y].coordinates[1] != y
      ) {
        badCorrespondences.push({
          gridCoords: [x, y],
          objectCoords: gridArray[x][y].coordinates,
        });
      }
    }
  }
  if (badCorrespondences.length != 0) {
    console.error("Bad Coordinate Correspondence");
    console.log(badCorrespondences);
  }
  // todo delete else
  else {
    console.log("Coordinate correspondence OK");
  }
}

function fillGridWithWhite() {
  for (x = 0; x < rows; x++) {
    let currentRow = [];
    for (y = 0; y < columns; y++) {
      let background = new Background(null, null, [x, y]);
      currentRow.push(background);
    }
    gridArray.push(currentRow);
  }
}

function setUpPanels() {
  const notGridRows = [];
  const notGridColumns = [];
  // set up divider lines, which are never on the outside of the image
  // first the divider rows...
  notGridRows.push(0);
  for (r = 1; r < rows - 1; r++) {
    if (Math.random() < proportionBlack) {
      for (i = 0; i < columns; i++) {
        let divider = new Divider(null, null, [r, i]);
        gridArray[r][i] = divider;
      }
    } else {
      notGridRows.push(r);
    }
  }
  notGridRows.push(rows - 1);
  // ...then the divider columns, and identify the corners too
  notGridColumns.push(0);
  for (c = 1; c < columns - 1; c++) {
    if (Math.random() < proportionBlack) {
      for (i = 0; i < rows; i++) {
        if (gridArray[i][c] instanceof Divider) {
          let corner = new Corner(null, null, [i, c]);
          gridArray[i][c] = corner;
        } else {
          let divider = new Divider(null, null, [i, c]);
          gridArray[i][c] = divider;
        }
      }
    } else {
      notGridColumns.push(c);
    }
  }
  notGridColumns.push(columns - 1);
  console.log(gridArray);
  console.log(notGridRows);
  console.log(notGridColumns);

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
  // console.log(panelRows);

  let panelCounter = 0;
  for (c = 0; c < columns; c++) {
    if (notGridColumns.includes(c)) {
      let panelColumn = [c];
      while (notGridColumns.includes(c)) {
        c++;
      }
      panelColumn.push(c);
      panelRows.forEach((row) => {
        let panelName = "panel_" + panelCounter.toString();
        panels.push({
          panelName: panelName,
          rows: row,
          cols: panelColumn,
          area: (row[1] - row[0]) * (panelColumn[1] - panelColumn[0]),
        });
        panelNameList.push(panelName);
        types[panelName] = {
          color: null,
          rows: row,
          cols: panelColumn,
          area: (row[1] - row[0]) * (panelColumn[1] - panelColumn[0]),
        };
        let panelAttributes = new PanelAttributes(
          panelName,
          row,
          panelColumn,
          null
        );
        panelAttributesList.push(panelAttributes);
        panelCounter++;
      });
    }
  }
  // panels.sort((a, b) => b.area - a.area);
  console.log("panelAttributesList");
  console.log(panelAttributesList);
}

function fillPanels() {
  panelAttributesList.forEach((panel) => {
    // let color = "";
    // let type = panel.panelName;
    let fillPanel = Math.random() < proportionPanelFill ? true : false;
    if (fillPanel) {
      let colorRand = Math.random();
      if (
        colorRand <
        proportionRed / (proportionRed + proportionYellow + proportionBlue)
      ) {
        panel.color = "r";
      } else {
        if (
          colorRand <
          (proportionRed + proportionYellow) /
            (proportionRed + proportionYellow + proportionBlue)
        ) {
          panel.color = "y";
        } else {
          // if (colorRand < proportionRed + proportionYellow + proportionBlue) {
          panel.color = "b";
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
    } else {
      panel.color = "w";
    }
    for (x = panel.rowRange[0]; x < panel.rowRange[1]; x++) {
      for (y = panel.colRange[0]; y < panel.colRange[1]; y++) {
        gridArray[x][y] = new Panel(null, null, [x, y], panel);
      }
    }
  });
  console.log(gridArray);
}

function combinePanels() {
  // look at each panel
  // find bottom rights and move backward
  let currentCoordinates = [0, 0];
  let notDone = true;
  let currentPanel =
    types[gridArray[currentCoordinates[0]][currentCoordinates[1]]];
  console.log(currentPanel);
  while (notDone) {
    // randomize right and below
    let combineRight = Math.random() < proportionPanelCombine ? true : false;
    let combineBelow = Math.random() < proportionPanelCombine ? true : false;
    // if combine right, look to the right for dividers and panels
    if (combineRight && currentPanel.cols[1] != columns) {
      // change the divider first
      // choose color and assign to type
      // assign current type to all in new range
    }

    // repeat for below

    // move to next panel
  }
  if (currentPanel.cols[1] == columns) {
    console.log("right edge panel");
  } else {
  }
  if (currentPanel.rows[1] == rows) {
    console.log("bottom edge panel");
  } else {
  }
  // pick edge or edges to combine
  // determine the pair panel and dividers involved
  // change the type of them
  if (
    types[currentPanel].cols[1] == columns &&
    types[currentPanel].rows[1] == rows
  ) {
    notDone = false;
  }
}

function renderGrid() {
  for (x = 0; x < columns; x++) {
    let rowElement = document.createElement("tr");
    tableEl.appendChild(rowElement);

    for (y = 0; y < rows; y++) {
      let colElement = document.createElement("td");
      let cellColor = gridArray[x][y].provideColor();
      if (cellColor != "w") {
        colElement.style.backgroundColor = colors[cellColor];
      }
      rowElement.appendChild(colElement);
    }
  }
}

fillGridWithWhite();
setUpPanels();
fillPanels();
// combinePanels();
renderGrid();
checkCoordinateCorrespondence();
