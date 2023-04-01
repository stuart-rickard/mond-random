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
  findPanelsInRange: function findPanelsInRange(panelColumnAndPanelRowRange) {
    // console.log(panelColumnAndPanelRowRange);
    let collectionArray = [];
    let minX = panelColumnAndPanelRowRange[0][0];
    let maxX = panelColumnAndPanelRowRange[0][1];
    let minY = panelColumnAndPanelRowRange[1][0];
    let maxY = panelColumnAndPanelRowRange[1][1];
    Object.values(panelsCollection).forEach((panel) => {
      let nameSplit = panel.panelName.split("_");
      // console.log("nameSplit");
      // console.log(nameSplit);
      if (
        !(
          parseInt(nameSplit[0]) > maxX ||
          parseInt(nameSplit[1]) < minX ||
          parseInt(nameSplit[2]) > maxY ||
          parseInt(nameSplit[3]) < minY
        )
      ) {
        collectionArray.push(panel);
      }
      // console.log(panel.panelName);
      // console.log(parseInt(nameSplit[0]));
      // console.log("maxX", maxX);
      // console.log(parseInt(nameSplit[1]));
      // console.log("minX", minX);
      // console.log(parseInt(nameSplit[2]));
      // console.log("maxY", maxY);
      // console.log(parseInt(nameSplit[3]));
      // console.log("minY", minY);
    });
    // for (let xCoord = minX; xCoord < maxX; xCoord++) {
    //   for (let yCoord = minY; yCoord < maxY; yCoord++) {
    //     current = this.getCellContents(xCoord, yCoord);
    //     if (collectionArray.includes(current)) {
    //     } else {
    //       collectionArray.push(current);
    //     }
    //   }
    // }
    return collectionArray;
  },
};

panelsCollection = {};

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
    return panelsCollection[this.panelName];
  }
}
class Beat extends Cell {
  constructor(color, coordinates) {
    super(color, coordinates);
  }
}

class Panel {
  panelName;
  // TODO UPDATE: panelNames are a string: "panel_[left/right number]_[top/bottom number]"; a higher top/bottom number is lower on the screen
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
  paintToGrid() {
    for (let xCoord = this.colRange[0]; xCoord < this.colRange[1]; xCoord++) {
      for (let yCoord = this.rowRange[0]; yCoord < this.rowRange[1]; yCoord++) {
        grid.gridArray[xCoord][yCoord] = new PanelCell(
          null,
          [xCoord, yCoord],
          this.panelName
        );
      }
    }
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
      return panelsCollection[
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
        panelsCollection[
          grid.getCellContents([this.colRange[1] - 1, search]).panelName
        ]
      );
      return panelsCollection[
        grid.getCellContents([this.colRange[1] - 1, search]).panelName
      ];
    } else {
      return [];
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

function getColAndRowFromPanelName(panel) {
  let name = panel.panelName;
  let splitName = name.split("_");
  return splitName;
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
  let panelRowNumber = 0;
  for (let xCoord = 0; xCoord < settings.columns; xCoord++) {
    if (notDividerColumns.includes(xCoord)) {
      let colRange = [xCoord];
      while (notDividerColumns.includes(xCoord)) {
        xCoord++;
      }
      colRange.push(xCoord);
      panelRowRanges.forEach((rowRange) => {
        panelRowNumber = panelRowRanges.indexOf(rowRange);
        let panelName =
          panelColumnNumber.toString() +
          "_" +
          panelColumnNumber.toString() +
          "_" +
          panelRowNumber.toString() +
          "_" +
          panelRowNumber.toString() +
          "_origPanel";

        let panelAttributes = new Panel(panelName, colRange, rowRange, null);
        panelsCollection[panelName] = panelAttributes;
      });
      panelColumnNumber++;
    }
  }
  grid["highestPanelRowNumber"] = panelRowNumber;
  grid["highestPanelColumnNumber"] = panelColumnNumber - 1;
}

function colorPanelsAndFillGrid() {
  Object.values(panelsCollection).forEach((panel) => {
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

function combinePanelsRight() {
  let newPanels = [];
  let panelsToDelete = [];
  let newPanelNumber = 0;

  // look at each panel
  Object.values(panelsCollection).forEach((panel) => {
    // randomize pair right
    if (randomIsLessThan(settings.proportionPanelCombine))
      panel.combineRight = true;
  });
  // handle right combines
  Object.values(panelsCollection).forEach((panel) => {
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
        let splitPanel = getColAndRowFromPanelName(panel);
        let splitRightPanel = getColAndRowFromPanelName(rightPanel);
        let panelName =
          splitPanel[0] +
          "_" +
          splitRightPanel[1] +
          "_" +
          splitPanel[2] +
          "_" +
          splitPanel[3] +
          "_" +
          "newRightPanel_" +
          newPanelNumber.toString();
        let panelAttributes = new Panel(
          panelName,
          [panel.colRange[0], rightPanel.colRange[1]],
          panel.rowRange,
          panel.color
        );
        newPanelNumber++;
        newPanels.push(panelAttributes);
        panelsCollection[panelAttributes.panelName] = panelAttributes;
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
    panel.paintToGrid();
  });
  // delete old panels
  panelsToDelete.forEach((panel) => {
    delete panelsCollection[panel.panelName];
  });
}

function combinePanelsDownWithConnectionTracing() {
  newPanels = [];
  panelsToDelete = [];
  let downList = [];
  let newPanelNumber = 100;

  // Create the downList (panels that expand down)
  Object.values(panelsCollection).forEach((panel) => {
    if (randomIsLessThan(settings.proportionPanelCombine)) {
      if (panel.rowRange[1] != grid.columns) {
        panel.combineDown = true;
        downList.push(panel);
      }
    }
  });
  console.log("panelsCollection:");
  console.log(panelsCollection);
  console.log("downList:");
  console.log(downList);
  // let minX, minY, maxX, maxY;

  // Process the downlist
  Object.values(downList).forEach((panel) => {
    // skip any already processed panels by checking if they are already in the panelsToDelete array
    if (panelsToDelete.includes(panel)) {
      return;
    }
    let doneLookingDown = false;
    let nameSplit = panel.panelName.split("_");
    let xRange = [parseInt(nameSplit[0]), parseInt(nameSplit[1])];
    console.log("xRange before:");
    console.log(xRange);
    let lookDownRow = parseInt(nameSplit[3]) + 1;
    let lowerRange = [xRange, [lookDownRow, lookDownRow]];
    // reset current range
    // look down
    let count = 0;
    while (!doneLookingDown && count < 1) {
      count++;
      doneLookingDown = true;
      // ?update the row in case we are checking another row
      console.log("lowerRange");
      console.log(lowerRange);
      console.log("count", count);
      let lowerPanels = grid.findPanelsInRange(lowerRange);

      // Handle the panels that are below the downList panel
      lowerPanels.forEach((panelNextLayer) => {
        // add to delete list
        panelsToDelete.push(panelNextLayer);
        // TODO fix above so that we aren't pushing dups
        // update the width
        xRange[0] = Math.min(panelNextLayer.panelName.split("_")[0], xRange[0]);
        xRange[1] = Math.max(panelNextLayer.panelName.split("_")[1], xRange[1]);
        // check whether panel is on downList; if so update flag so that we look at another layer
        if (downList.includes(panelNextLayer)) {
          doneLookingDown = false;
          console.log("this one would add a layer");
          console.log(panelNextLayer);
          lowerRange = [xRange, [lowerRange[1][0] + 1, lowerRange[1][1] + 1]];
        }
      });

      // NEED TO GO ONE LAYER AT A TIME. REVISE WIDTH WITH EACH LAYER

      // set boundary to max size of panel and downconnections
      // look down again if any downconnections are down

      // look at edges
      // set boundary to max size within edges
      // look down agin if any of bottom are down
      // look at edges if boundary changed

      // set up box
      // minX = panel.colRange[0];
      // maxX = panel.colRange[1];
      // minY = panel.rowRange[0];
      // maxY = panel.rowRange[1];

      // look down
      // update box
      // look at bottom edge

      // use panels in range or WHATEVER

      // minX = Math.min(panel.colRange[0], minX);
      // maxX = Math.max(panel.colRange[1], maxX);
      // minY = Math.min(panel.rowRange[0], minY);
      // maxY = Math.max(panel.rowRange[1], maxY);
    }
    console.log("xRange after:");
    console.log(xRange);
    // create new panel with new column range, delete old panels
    let panelName =
      xRange[0].toString() +
      "_" +
      xRange[1].toString() +
      "_" +
      nameSplit[2].toString() +
      "_" +
      lowerRange[1][1].toString() +
      "_" +
      "newDownPanel_" +
      newPanelNumber.toString();
    let panelAttributes = new Panel(
      panelName,
      xRange,
      [parseInt(nameSplit[2]), lowerRange[1][1]],
      "blue"
      // panel.color
    );
    newPanelNumber++;
    cl(panelAttributes);
    newPanels.push(panelAttributes);
    panelsCollection[panelAttributes.panelName] = panelAttributes;
  });
  // paint new panels
  Object.values(newPanels).forEach((panel) => {
    panel.paintToGrid();
  });
  // delete old panels
  // panelsToDelete.forEach((panel) => {
  // delete panelsCollection[panel.panelName];
  // });
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
        : panelsCollection[grid.gridArray[xCoord][yCoord].panelName].color;
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
  Object.keys(panelsCollection).forEach((key) => {
    if (key != panelsCollection[key].panelName) {
      badCorrespondences.push({
        key: key,
        panelName: panelsCollection[key].panelName,
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
combinePanelsRight();
combinePanelsDownWithConnectionTracing();
if (settings.allowElls) addBeats();
console.log(panelsCollection);
render();
checkCorrespondences();
console.log("this approach got too complicated");
