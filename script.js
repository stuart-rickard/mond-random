function cl(log) {
  console.log(log);
}

let tableEl = document.getElementById("table");

let settings = {
  rows: 40,
  columns: 40,

  proportionRed: 10 / 1000,
  proportionYellow: 20 / 1000,
  proportionBlue: 10 / 1000,
  proportionBlack: 80 / 1000,

  proportionPanelFill: 300 / 1000,
  proportionPanelCombine: 300 / 1000,

  allowElls: false,

  colors: {
    red: "#e4071e",
    yellow: "#Fbe90e",
    blue: "#0051f4",
    black: "#0a0a0a",
  },
};

grid = {
  gridArray: [],
  getCellContents: function getCellContents(coordinates) {
    return this.gridArray[coordinates[0]][coordinates[1]];
  },
  setCellContents: function setCellContents(coordinates, contents) {
    this.gridArray[coordinates[0]][coordinates[1]] = contents;
  },
};

panelsArray = {};

class Cell {
  color;
  coordinates;
  // coordinates are [left/right, top/bottom]; a higher top/bottom coordinate is lower on the screen
  constructor(color, coordinates) {
    this.color = color;
    this.coordinates = coordinates;
  }
  // neighborCell(direction) {
  //   let directionVector = {
  //     up: [0, -1],
  //     down: [0, 1],
  //     left: [-1, 0],
  //     right: [1, 0],
  //   };
  //   let xCoord = this.coordinates[0] + directionVector[direction][0];
  //   let yCoord = this.coordinates[1] + directionVector[direction][1];

  //   // check whether there is a cell
  //   if (
  //     xCoord >= settings.columns ||
  //     xCoord < 0 ||
  //     yCoord >= settings.rows ||
  //     yCoord < 0
  //   ) {
  //     // if not, return null
  //     return null;
  //   } else {
  //     // else return cell
  //     return gridArray[xCoord][yCoord];
  //   }
  // }
}
class Background extends Cell {
  color = "w";
  constructor(color, coordinates) {
    super(color, coordinates);
  }
}
class Divider extends Cell {
  color = "black";
  constructor(color, coordinates) {
    super(color, coordinates);
  }
}
class Corner extends Cell {
  color = "black";
  constructor(color, coordinates) {
    super(color, coordinates);
  }
}
class PanelCell extends Cell {
  panelName;
  constructor(color, coordinates, panelName) {
    super(color, coordinates);
    this.panelName = panelName;
  }
  myPanel() {
    return panelsArray[this.panelName];
  }
}
class Beat extends Cell {
  constructor(color, coordinates) {
    super(color, coordinates);
  }
}

class Panel {
  panelName;
  // panelNames are a string: "panel_[left/right number]_[top/bottom number]"; a higher top/bottom number is lower on the screen
  colRange;
  rowRange;
  color;
  combineRight;
  combineDown;
  delete;
  constructor(panelName, cols, rows, color) {
    this.panelName = panelName;
    this.colRange = cols;
    this.rowRange = rows;
    this.color = color;
    this.combineRight = false;
    this.combineDown = false;
    this.delete = null;
  }
  panelToRight() {
    // look at grid to right for another panel
    let search = this.colRange[1] + 1;
    // if search is in range of grid
    if (search < settings.columns) {
      // check whether searched grid is panel, if not (for instance, could be Divider), increment and try again
      while (
        !(grid.getCellContents([search, this.rowRange[0]]) instanceof PanelCell)
      ) {
        search++;
      }
      // return found panel, or null if outside of the grid
      return panelsArray[
        grid.getCellContents([search, this.rowRange[0]]).panelName
      ];
    } else {
      return false;
    }
  }
  panelBelow() {
    // look at grid below the right corner for another panel
    let search = this.rowRange[1] + 1;
    // if search is in range of grid
    if (search < settings.rows) {
      // check whether searched grid is panel, if not (for instance, could be Divider), increment and try again
      while (
        !(
          grid.getCellContents([this.colRange[1] - 1, search]) instanceof
          PanelCell
        )
      ) {
        search++;
      }
      // return found panel, or null if outside of the grid
      cl("------------");
      cl([this.colRange[1] - 1, search]);
      cl("------------");
      cl(grid.getCellContents([this.colRange[1] - 1, search]));
      cl("------------");
      cl(
        panelsArray[
          grid.getCellContents([this.colRange[1] - 1, search]).panelName
        ]
      );
      return panelsArray[
        grid.getCellContents([this.colRange[1] - 1, search]).panelName
      ];
    } else {
      return false;
    }
  }
}

function randomIsLessThan(fraction) {
  if (Math.random() < fraction) {
    return true;
  } else {
    return false;
  }
}

function randomizer(array) {
  // array format is: [[.3,"30% chance"],[.4, "40% chance"]]
  let rand = Math.random();
  let runningTotal = 0;
  let result = null;
  // while the number is greater than the sum of first item in the array add the next item; until return result or end of array
  for (const item of array) {
    runningTotal += item[0];
    if (rand < runningTotal) {
      result = item[1];
      break;
    }
  }
  return result;
}

function fillGridWithBackgroundCells() {
  for (let xCoord = 0; xCoord < settings.columns; xCoord++) {
    let currentRow = [];
    for (let yCoord = 0; yCoord < settings.rows; yCoord++) {
      let background = new Background(null, [xCoord, yCoord]);
      currentRow.push(background);
    }
    grid.gridArray.push(currentRow);
  }
}

function setUpPanelStartingBoundaries() {
  // set up divider lines, which are never on the outside of the grid

  // use arrays to collect the  rows and column numbers that are not dividers so that we can use them later to create the panel vertical and horizontal ranges
  const notDividerRows = [];
  const notDividerColumns = [];

  // first set the divider rows...
  notDividerRows.push(0);
  for (let yCoord = 1; yCoord < settings.rows - 1; yCoord++) {
    if (randomIsLessThan(settings.proportionBlack)) {
      for (let xCoord = 0; xCoord < settings.columns; xCoord++) {
        let divider = new Divider(null, [xCoord, yCoord]);
        grid.gridArray[xCoord][yCoord] = divider;
      }
    } else {
      notDividerRows.push(yCoord);
    }
  }
  notDividerRows.push(settings.rows - 1);
  // ...then the divider columns, and identify the corners too
  notDividerColumns.push(0);
  for (let xCoord = 1; xCoord < settings.columns - 1; xCoord++) {
    if (randomIsLessThan(settings.proportionBlack)) {
      for (let yCoord = 0; yCoord < settings.rows; yCoord++) {
        if (grid.gridArray[xCoord][yCoord] instanceof Divider) {
          let corner = new Corner(null, [xCoord, yCoord]);
          grid.gridArray[xCoord][yCoord] = corner;
        } else {
          let divider = new Divider(null, [xCoord, yCoord]);
          grid.gridArray[xCoord][yCoord] = divider;
        }
      }
    } else {
      notDividerColumns.push(xCoord);
    }
  }
  notDividerColumns.push(settings.columns - 1);

  // use the "notDivider" arrays to determine panel horizontal and vertical ranges
  const panelRowRanges = [];
  for (let yCoord = 0; yCoord < settings.rows; yCoord++) {
    if (notDividerRows.includes(yCoord)) {
      let panelRow = [yCoord];
      while (notDividerRows.includes(yCoord)) {
        yCoord++;
      }
      panelRow.push(yCoord);
      panelRowRanges.push(panelRow);
    }
  }
  // todo clean up technical debt here
  let panelColumnNumber = 0;
  for (let xCoord = 0; xCoord < settings.columns; xCoord++) {
    if (notDividerColumns.includes(xCoord)) {
      let colRange = [xCoord];
      while (notDividerColumns.includes(xCoord)) {
        xCoord++;
      }
      colRange.push(xCoord);
      panelRowRanges.forEach((rowRange) => {
        let panelRowNumber = panelRowRanges.indexOf(rowRange);
        let panelName =
          "panel_" +
          panelColumnNumber.toString() +
          "_" +
          panelRowNumber.toString();

        let panelAttributes = new Panel(panelName, colRange, rowRange, null);
        panelsArray[panelName] = panelAttributes;
      });
      panelColumnNumber++;
    }
  }
}

function colorPanelsAndFillGrid() {
  Object.values(panelsArray).forEach((panel) => {
    if (randomIsLessThan(settings.proportionPanelFill)) {
      panel.color = randomizer([
        [
          settings.proportionRed /
            (settings.proportionRed +
              settings.proportionYellow +
              settings.proportionBlue),
          "red",
        ],
        [
          settings.proportionYellow /
            (settings.proportionRed +
              settings.proportionYellow +
              settings.proportionBlue),
          "yellow",
        ],
        [
          settings.proportionBlue /
            (settings.proportionRed +
              settings.proportionYellow +
              settings.proportionBlue),
          "blue",
        ],
      ]);
    } else {
      panel.color = "white";
    }
    for (let xCoord = panel.colRange[0]; xCoord < panel.colRange[1]; xCoord++) {
      for (
        let yCoord = panel.rowRange[0];
        yCoord < panel.rowRange[1];
        yCoord++
      ) {
        grid.gridArray[xCoord][yCoord] = new PanelCell(
          null,
          [xCoord, yCoord],
          panel.panelName
        );
      }
    }
  });
}

function combinePanels() {
  // let newColor;
  // let leftRightPairs = [];
  let newPanels = [];
  let panelsToDelete = [];
  let newPanelNumber = 0;

  // look at each panel
  Object.values(panelsArray).forEach((panel) => {
    // randomize pair right and down
    if (randomIsLessThan(settings.proportionPanelCombine))
      panel.combineRight = true;
  });
  // handle right combines
  Object.values(panelsArray).forEach((panel) => {
    if (panel.combineRight && !panel.delete) {
      // find panel to right
      let rightPanel = panel.panelToRight();
      if (rightPanel) {
        while (rightPanel.panelToRight() && rightPanel.combineRight) {
          panelsToDelete.push(rightPanel);
          rightPanel.delete = true;
          rightPanel = rightPanel.panelToRight();
        }
        // create new panel with new column range, delete old panels
        let panelAttributes = new Panel(
          "newPanel_" + newPanelNumber.toString(),
          [panel.colRange[0], rightPanel.colRange[1]],
          panel.rowRange,
          panel.color
        );
        newPanelNumber++;
        newPanels.push(panelAttributes);
        panelsArray[panelAttributes.panelName] = panelAttributes;
        if (!panelsToDelete.includes(panel)) {
          panelsToDelete.push(panel);
        }
        if (!panelsToDelete.includes(rightPanel)) {
          panelsToDelete.push(rightPanel);
        }
      }
    }
  });

  // paint new panels
  Object.values(newPanels).forEach((panel) => {
    for (let xCoord = panel.colRange[0]; xCoord < panel.colRange[1]; xCoord++) {
      for (
        let yCoord = panel.rowRange[0];
        yCoord < panel.rowRange[1];
        yCoord++
      ) {
        grid.gridArray[xCoord][yCoord] = new PanelCell(
          null,
          [xCoord, yCoord],
          panel.panelName
        );
      }
    }
  });
  // delete old panels
  panelsToDelete.forEach((panel) => {
    delete panelsArray[panel.panelName];
  });

  Object.values(panelsArray).forEach((panel) => {
    if (randomIsLessThan(settings.proportionPanelCombine))
      panel.combineDown = true;
  });
  cl(panelsArray);
  newPanels = [];
  panelsToDelete = [];
  let minX, minY, maxX, maxY;
  Object.values(panelsArray).forEach((panel) => {
    cl(panel.combineDown == true && !panel.delete);
    if (panel.combineDown == true && !panel.delete) {
      minX = panel.colRange[0];
      maxX = panel.colRange[1];
      minY = panel.rowRange[0];
      maxY = panel.rowRange[1];
      // [[minX, maxX], [minY, maxY]] = [panel.colRange, panel.rowRange];

      let belowPanel = panel.panelBelow();
      cl(belowPanel);
      if (belowPanel) {
        minX = Math.min(minX, belowPanel.colRange[0]);
        maxX = Math.max(maxX, belowPanel.colRange[1]);
        minY = Math.min(minY, belowPanel.rowRange[0]);
        maxY = Math.max(maxY, belowPanel.rowRange[1]);
        // todo improve trace through panels
        while (belowPanel.panelBelow() && belowPanel.combineDown) {
          minX = Math.min(minX, belowPanel.colRange[0]);
          maxX = Math.max(maxX, belowPanel.colRange[1]);
          minY = Math.min(minY, belowPanel.rowRange[0]);
          maxY = Math.max(maxY, belowPanel.rowRange[1]);
          panelsToDelete.push(belowPanel);
          belowPanel.delete = true;
          belowPanel = belowPanel.panelBelow();
        }
        // create new panel with new column range, delete old panels
        let panelAttributes = new Panel(
          "vertical_" + newPanelNumber.toString(),
          [minX, maxX],
          [minY, maxY],
          panel.color
        );
        newPanelNumber++;
        cl(panelAttributes);
        newPanels.push(panelAttributes);
        panelsArray[panelAttributes.panelName] = panelAttributes;
        if (!panelsToDelete.includes(panel)) {
          panelsToDelete.push(panel);
        }
        if (!panelsToDelete.includes(belowPanel)) {
          panelsToDelete.push(belowPanel);
        }
      }
    }
  });

  // paint new panels
  Object.values(newPanels).forEach((panel) => {
    for (let xCoord = panel.colRange[0]; xCoord < panel.colRange[1]; xCoord++) {
      for (
        let yCoord = panel.rowRange[0];
        yCoord < panel.rowRange[1];
        yCoord++
      ) {
        grid.gridArray[xCoord][yCoord] = new PanelCell(
          null,
          [xCoord, yCoord],
          panel.panelName
        );
      }
    }
  });
}

function render() {
  // for (xCoord = 0; xCoord < columns; xCoord++) {
  for (let yCoord = 0; yCoord < settings.rows; yCoord++) {
    let rowElement = document.createElement("tr");
    tableEl.appendChild(rowElement);

    for (let xCoord = 0; xCoord < settings.columns; xCoord++) {
      let colElement = document.createElement("td");
      let cellColor = grid.gridArray[xCoord][yCoord].color
        ? grid.gridArray[xCoord][yCoord].color
        : panelsArray[grid.gridArray[xCoord][yCoord].panelName].color;
      // if (cellColor != "white") {
      colElement.style.backgroundColor = settings.colors[cellColor];
      // colElement.innerText = xCoord.toString() + "," + yCoord.toString();
      // }
      rowElement.appendChild(colElement);
    }
  }
}

function checkCorrespondences() {
  let badCorrespondences = [];
  for (let xCoord = 0; xCoord < settings.columns; xCoord++) {
    for (let yCoord = 0; yCoord < settings.rows; yCoord++) {
      if (
        grid.gridArray[xCoord][yCoord].coordinates[0] != xCoord ||
        grid.gridArray[xCoord][yCoord].coordinates[1] != yCoord
      ) {
        badCorrespondences.push({
          gridCoords: [xCoord, yCoord],
          objectCoords: grid.gridArray[xCoord][yCoord].coordinates,
        });
      }
    }
  }
  Object.keys(panelsArray).forEach((key) => {
    if (key != panelsArray[key].panelName) {
      badCorrespondences.push({
        key: key,
        panelName: panelsArray[key].panelName,
      });
    }
  });
  if (badCorrespondences.length != 0) {
    console.error("Bad Correspondence");
    console.log(badCorrespondences);
  }
  // todo delete else
  else {
    cl("Correspondence OK");
  }
}

fillGridWithBackgroundCells();
setUpPanelStartingBoundaries();
colorPanelsAndFillGrid();
combinePanels();
if (settings.allowElls) addBeats();
render();
checkCorrespondences();
