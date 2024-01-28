let tableEl = document.getElementById("table");

const rows = 40;
const columns = 40;

const proportionRed = 10 / 1000;
const proportionYellow = 20 / 1000;
const proportionBlue = 10 / 1000;
const proportionBlack = 80 / 1000;

const proportionPanelFill = 300 / 1000;
const proportionPanelCombine = 300 / 1000;

const colors = {
  r: "#e4071e",
  y: "#Fbe90e",
  b: "#0051f4",
  k: "#0a0a0a",
};

const gridArray = [];
const panelAttributesCollection = {};

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
  constructor(color, coordinates, panelName) {
    super(color, coordinates);
    this.panelName = panelName;
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

function checkCorrespondences() {
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
  Object.keys(panelAttributesCollection).forEach((key) => {
    if (key != panelAttributesCollection[key].panelName) {
      badCorrespondences.push({
        key: key,
        panelName: panelAttributesCollection[key].panelName,
      });
    }
  });
  if (badCorrespondences.length != 0) {
    console.error("Bad Correspondence");
    console.log(badCorrespondences);
  }
  // todo delete else
  else {
    console.log("Correspondence OK");
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
  for (y = 1; y < rows - 1; y++) {
    if (Math.random() < proportionBlack) {
      for (x = 0; x < columns; x++) {
        let divider = new Divider(null, [x, y]);
        gridArray[x][y] = divider;
      }
    } else {
      notGridRows.push(y);
    }
  }
  notGridRows.push(rows - 1);
  // ...then the divider columns, and identify the corners too
  notGridColumns.push(0);
  for (x = 1; x < columns - 1; x++) {
    if (Math.random() < proportionBlack) {
      for (y = 0; y < rows; y++) {
        if (gridArray[x][y] instanceof Divider) {
          let corner = new Corner(null, [x, y]);
          gridArray[x][y] = corner;
        } else {
          let divider = new Divider(null, [x, y]);
          gridArray[x][y] = divider;
        }
      }
    } else {
      notGridColumns.push(x);
    }
  }
  notGridColumns.push(columns - 1);
  // determine panels location and area
  const panelRowRanges = [];
  for (y = 0; y < rows; y++) {
    if (notGridRows.includes(y)) {
      let panelRow = [y];
      while (notGridRows.includes(y)) {
        y++;
      }
      panelRow.push(y);
      panelRowRanges.push(panelRow);
    }
  }
  // todo clean up technical debt here
  let panelColumnNumber = 0;
  for (x = 0; x < columns; x++) {
    if (notGridColumns.includes(x)) {
      let colRange = [x];
      while (notGridColumns.includes(x)) {
        x++;
      }
      colRange.push(x);
      panelRowRanges.forEach((rowRange) => {
        // let panelName = "panel_" + panelCounter.toString();
        let panelRowNumber = panelRowRanges.indexOf(rowRange);
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

        let panelAttributes = new PanelAttributes(
          panelName,
          colRange,
          rowRange,
          null,
          neighborPanelLeft,
          neighborPanelAbove
        );
        panelAttributesCollection[panelName] = panelAttributes;
      });
      panelColumnNumber++;
    }
  }
  console.log(panelAttributesCollection);
}

function fillPanels() {
  Object.values(panelAttributesCollection).forEach((panel) => {
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
    // let assignedPanel = new Panel(null, [x, y], panel.panelName);
    for (x = panel.colRange[0]; x < panel.colRange[1]; x++) {
      for (y = panel.rowRange[0]; y < panel.rowRange[1]; y++) {
        gridArray[x][y] = new Panel(null, [x, y], panel.panelName);
      }
    }
  });
  console.log(panelAttributesCollection);
  console.log(gridArray);
}

function combinePanels() {
  let newColor;
  let leftRightPairs = [];
  // look at each panel
  Object.values(panelAttributesCollection).forEach((panel) => {
    // if (Math.random() < proportionPanelCombine) {
    //   // panel is candidate for pairing
    //   // decide whether pair is up/down or side/side
    // }
    // // de-conflict the panels; no panel

    // Randomize combinations to right and/or below
    if (panel.neighborPanelLeft) {
      if (Math.random() < proportionPanelCombine) {
        newColor = panelAttributesCollection[panel.neighborPanelLeft].color;
        panel.color = newColor;
        // look for dividers and change their  color
        let x = panel.colRange[0] - 1;
        while (gridArray[x][panel.rowRange[0]] instanceof Divider) {
          for (let y = panel.rowRange[0]; y < panel.rowRange[1]; y++) {
            gridArray[x][y].color = newColor;
          }
          x--;
        }
        leftRightPairs.push([
          panel.panelName,
          panelAttributesCollection[panel.neighborPanelLeft].panelName,
        ]);
      }
    }
    // keep track of pairs
    if (panel.neighborPanelAbove) {
      if (Math.random() < proportionPanelCombine) {
        // check whether panel is already part of left/right pair; if so expand area
        newColor = panelAttributesCollection[panel.neighborPanelAbove].color;
        panel.color = newColor;

        // look for dividers and change their color
        let y = panel.rowRange[0] - 1;
        while (gridArray[panel.colRange[0]][y] instanceof Divider) {
          for (let x = panel.colRange[0]; x < panel.colRange[1]; x++) {
            gridArray[x][y].color = newColor;
          }
          y--;
        }
      }
    }
  });
  console.log(leftRightPairs);
}

function renderGrid() {
  // for (x = 0; x < columns; x++) {
  for (y = 0; y < rows; y++) {
    let rowElement = document.createElement("tr");
    tableEl.appendChild(rowElement);

    for (x = 0; x < columns; x++) {
      let colElement = document.createElement("td");
      let cellColor = gridArray[x][y].color
        ? gridArray[x][y].color
        : panelAttributesCollection[gridArray[x][y].panelName].color;
      // if (cellColor != "w") {
      colElement.style.backgroundColor = colors[cellColor];
      // colElement.innerText = x.toString() + "," + y.toString();
      // }
      rowElement.appendChild(colElement);
    }
  }
}

fillGridWithWhite();
setUpPanels();
fillPanels();
combinePanels();
renderGrid();
checkCorrespondences();
