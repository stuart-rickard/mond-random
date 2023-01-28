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
const panelAtts = {};
const panelsArray = [];
// todo get rid of next two arrays
const panelNameList = [];
const panelAttributesList = [];
// todo get rid of types object
const types = {
  background: { color: "w" },
  divider: { color: "k" },
  corner: { color: "y" },
};

class Type {
  color;
  coordinates;
  // coordinates are [left/right, top/bottom]; a higher top/bottom coordinate is lower on the screen
  constructor(color, coordinates) {
    this.color = color;
    this.coordinates = coordinates;
  }
  provideColor() {
    return this.color;
  }
}
// todo replace Background with white panels in setUpPanels
class Background extends Type {
  color = "w";
  constructor(color, coordinates) {
    super(color, coordinates);
  }
}
class Divider extends Type {
  color = "k";
  constructor(color, coordinates) {
    super(color, coordinates);
  }
}
class Corner extends Type {
  color = "k";
  constructor(color, coordinates) {
    super(color, coordinates);
  }
}
class Panel extends Type {
  panelName;
  panelAttributes;
  constructor(color, coordinates, panelAttributes, panelName) {
    super(color, coordinates);
    this.panelName = panelName;
    // todo get rid of panelAttributes in Panel closs
    this.panelAttributes = panelAttributes;
    this.color = panelAttributes.color;
  }
  get panelAtts() {
    return panelAtts[this.panelName];
  }
  substitutePanel() {
    console.log("sub");
  }
  providePanelRange(direction) {
    console.log(direction);
  }
}
class Beat extends Type {
  constructor(color, coordinates) {
    super(color, coordinates);
  }
}

class PanelAttributes {
  panelName;
  // panelNames are a string: "panel_[left/right number]_[top/bottom number]"; a higher top/bottom number is lower on the screen
  colRange;
  rowRange;
  color;
  neighborPanelLeft;
  neighborPanelAbove;
  constructor(
    panelName,
    cols,
    rows,
    color,
    neighborPanelLeft,
    neighborPanelAbove
  ) {
    this.panelName = panelName;
    this.colRange = cols;
    this.rowRange = rows;
    this.color = color;
    this.neighborPanelLeft = neighborPanelLeft;
    this.neighborPanelAbove = neighborPanelAbove;
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
// todo confirm column and row are used correctly throughout; start with render because that can't be changed
function fillGridWithWhite() {
  for (x = 0; x < columns; x++) {
    let currentRow = [];
    for (y = 0; y < rows; y++) {
      let background = new Background(null, [x, y]);
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
        let divider = new Divider(null, [i, r]);
        gridArray[i][r] = divider;
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
        if (gridArray[c][i] instanceof Divider) {
          let corner = new Corner(null, [c, i]);
          gridArray[c][i] = corner;
        } else {
          let divider = new Divider(null, [c, i]);
          gridArray[c][i] = divider;
        }
      }
    } else {
      notGridColumns.push(c);
    }
  }
  notGridColumns.push(columns - 1);
  console.log(gridArray);

  // determine panels location and area
  let panelCounter = 0;
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
  // todo clean up technical debt here
  let panelRowNumber = 0;
  for (c = 0; c < columns; c++) {
    if (notGridColumns.includes(c)) {
      let panelColumn = [c];
      while (notGridColumns.includes(c)) {
        c++;
      }
      panelColumn.push(c);
      panelRows.forEach((row) => {
        // let panelName = "panel_" + panelCounter.toString();
        let panelColumnNumber = panelRows.indexOf(row);
        let panelName =
          "panel_" +
          panelColumnNumber.toString() +
          "_" +
          panelRowNumber.toString();
        let neighborPanelLeft =
          panelColumnNumber > 0
            ? "panel_" +
              (panelColumnNumber - 1).toString() +
              "_" +
              panelRowNumber.toString()
            : null;
        let neighborPanelAbove =
          panelRowNumber > 0
            ? "panel_" +
              panelColumnNumber.toString() +
              "_" +
              (panelRowNumber - 1).toString()
            : null;
        panelsArray.push({
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
          null,
          neighborPanelLeft,
          neighborPanelAbove
        );
        panelAttributesList.push(panelAttributes);
        panelCounter++;
        panelAtts[panelName] = panelAttributes;
      });
      panelRowNumber++;
    }
  }
  // panels.sort((a, b) => b.area - a.area);
  console.log(panelAtts);
}

function fillPanels() {
  panelAttributesList.forEach((panel) => {
    if (Math.random() < proportionPanelFill) {
      let colorRand = Math.random();
      // todo get rid of nested ifs
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
        gridArray[x][y] = new Panel(null, [x, y], panel, panel.panelName);
      }
    }
  });
  console.log(gridArray);
}

function combinePanels() {
  // look at each panel
  Object.values(panelAtts).forEach((panel) => {
    // Randomize combinations to right and/or below
    // A combination to the right is to convert the color of adjacent Divider and Panel objects
  });
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
console.log(gridArray[0][0].panelAtts.color);
