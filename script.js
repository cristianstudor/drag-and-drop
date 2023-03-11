const addBtns = document.querySelectorAll(".add-btn:not(.solid)");
const saveItemBtns = document.querySelectorAll(".solid");
const addItemContainers = document.querySelectorAll(".add-container");
const addItems = document.querySelectorAll(".add-item");
// Item Lists
const listColumns = document.querySelectorAll(".drag-item-list");
const backlogListEl = document.getElementById("backlog-list");
const progressListEl = document.getElementById("progress-list");
const completeListEl = document.getElementById("complete-list");
const onHoldListEl = document.getElementById("on-hold-list");

// Items
let updatedOnLoad = false;

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];

// Drag Functionality
let draggedItem;
let currentColumn;

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem("listArrays")) {
    listArrays = JSON.parse(localStorage.getItem("listArrays"));
    backlogListArray = listArrays[0];
    progressListArray = listArrays[1];
    completeListArray = listArrays[2];
    onHoldListArray = listArrays[3];
  } else {
    backlogListArray = ["Release the course", "Sit back and relax"];
    progressListArray = ["Work on projects", "Listen to music"];
    completeListArray = ["Being cool", "Getting stuff done"];
    onHoldListArray = ["Being uncool"];
  }
}

// Set localStorage Arrays
function updateSavedColumns() {
  listArrays = [
    backlogListArray,
    progressListArray,
    completeListArray,
    onHoldListArray
  ];
  localStorage.setItem("listArrays", JSON.stringify(listArrays));
}

// Filter Arrays to remove emty items
function filterArray(array) {
  const filteredArray = array.filter((item) => item !== null);
  return filteredArray;
}

// Disable draggable on parent elem so that the cursor can be moved with ease
function disableDraggableOnParent(event) {
  const parent = event.target.parentElement;
  parent.draggable = false;
}

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  // List Item Content
  const listElContent = document.createElement("span");
  listElContent.textContent = item;
  listElContent.contentEditable = true;
  listElContent.setAttribute("onfocusin", `disableDraggableOnParent(event)`);
  listElContent.setAttribute("onfocusout", `updateItem(${index},${column})`);
  // List Item
  const listEl = document.createElement("li");
  listEl.classList.add("drag-item");
  listEl.id = index;
  listEl.draggable = true;
  listEl.setAttribute("ondragstart", "drag(event)");
  // Append
  listEl.appendChild(listElContent);
  columnEl.appendChild(listEl);
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  if (!updatedOnLoad) getSavedColumns();
  // Backlog Column
  backlogListEl.textContent = "";
  backlogListArray.forEach((backlogItem, index) => {
    createItemEl(backlogListEl, 0, backlogItem, index);
  });
  backlogListArray = filterArray(backlogListArray);
  // Progress Column
  progressListEl.textContent = "";
  progressListArray.forEach((progressItem, index) => {
    createItemEl(progressListEl, 1, progressItem, index);
  });
  progressListArray = filterArray(progressListArray);
  // Complete Column
  completeListEl.textContent = "";
  completeListArray.forEach((completeItem, index) => {
    createItemEl(completeListEl, 2, completeItem, index);
  });
  completeListArray = filterArray(completeListArray);
  // On Hold Column
  onHoldListEl.textContent = "";
  onHoldListArray.forEach((onHoldItem, index) => {
    createItemEl(onHoldListEl, 3, onHoldItem, index);
  });
  onHoldListArray = filterArray(onHoldListArray);
  // Run getSavedColumns only once, Update Local Storage
  updatedOnLoad = true;
  updateSavedColumns();
}

// Add to Column List, Reset Textbox
function addToColumn(column) {
  const itemText = addItems[column].textContent;
  const selectedArray = listArrays[column];
  selectedArray.push(itemText);
  addItems[column].textContent = "";
  updateDOM(column);
}

// Show Add Item Input Box
function showInputBox(column) {
  addBtns[column].style.visibility = "hidden";
  saveItemBtns[column].style.display = "flex";
  addItemContainers[column].style.display = "flex";
}

// Hide Item Input Box
function hideInputBox(column) {
  addBtns[column].style.visibility = "visible";
  saveItemBtns[column].style.display = "none";
  addItemContainers[column].style.display = "none";
  addToColumn(column);
}

// Allows arrays to reflect Drag and Drop items
function rebuildArrays() {
  backlogListArray = Array.from(backlogListEl.children).map(
    (item) => item.textContent
  );
  progressListArray = Array.from(progressListEl.children).map(
    (item) => item.textContent
  );
  completeListArray = Array.from(completeListEl.children).map(
    (item) => item.textContent
  );
  onHoldListArray = Array.from(onHoldListEl.children).map(
    (item) => item.textContent
  );
  updateDOM();
}

// Update Item - Delete if necessary, or update Array value
function updateItem(id, column) {
  const selectedArray = listArrays[column];
  const selectedColumn = listColumns[column];
  const selectedList = selectedColumn.children[id];
  const selectedText = selectedList.children[0];

  if (!selectedText.textContent) {
    delete selectedArray[id];
  } else {
    selectedArray[id] = selectedText.textContent;
  }
  updateDOM();
}

// When Item Enters Column Area
function dragEnter(column) {
  listColumns[column].classList.add("over");
  currentColumn = column;
}

// When Item Starts Dragging
function drag(e) {
  draggedItem = e.target;
}

// Column Allows for Item to Drop
function allowDrop(e) {
  e.preventDefault();
}

// Dropping Item in Column
function drop(e) {
  e.preventDefault();
  // Remove Background Color/Padding
  listColumns.forEach((column) => {
    column.classList.remove("over");
  });
  // Add item to Column
  const parent = listColumns[currentColumn];
  parent.appendChild(draggedItem);
  // Dragging complete
  rebuildArrays();
}

// On Load
updateDOM();
