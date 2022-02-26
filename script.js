let tableEl = document.getElementById("table");

for (x = 1; x <= 20; x++) {
  let rowElement = document.createElement("tr");
  tableEl.appendChild(rowElement);

  for (y = 1; y <= 20; y++) {
    let colElement = document.createElement("td");
    // colElement.innerText = "-";
    colElement.setAttribute("data-x", x);
    colElement.setAttribute("data-y", y);
    // colElement.style.padding = "0px 0px 0px 0px";
    // colElement.setAttribute("padding", "0px");
    let color = Math.floor(Math.random() * 16777215).toString(16);
    colElement.style.backgroundColor = "#" + color;
    rowElement.appendChild(colElement);

    // console.log(x + " " + y);
  }
}
