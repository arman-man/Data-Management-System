// Get the objects we need to modify
let addStatusForm = document.getElementById('add-status-form-ajax');

// Modify the objects we need
addStatusForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputStatus = document.getElementById("input-status");

    // Get the values from the form fields
    let statusValue = inputStatus.value;

    // Put our data we want to send in a javascript object
    let data = {
        status: statusValue,
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-status-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputStatus.value = '';

            // Reload page to match styles
            location.reload();

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("Statuses-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and cells
    let row = document.createElement("TR");
    let statusIDCell = document.createElement("TD");
    let statusCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    statusIDCell.innerText = newRow.statusID;
    statusCell.innerText = newRow.status;

    deleteCell = document.createElement("button");
    deleteCell.className = "btn btn-danger";
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function () {
        deleteStatus(newRow.statusID);
    };

    // Add the cells to the row 
    row.appendChild(statusIDCell);
    row.appendChild(statusCell);
    row.appendChild(deleteCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.statusID);

    // Add the row to the table
    currentTable.appendChild(row);

    // Find drop down menu, create a new option, fill data in the option (full name, id),
    // then append option to drop down menu so newly created rows via ajax will be found in it without needing a refresh
    let selectMenu = document.getElementById("mySelectStatus");
    let option = document.createElement("option");
    option.text = newRow.status;
    option.value = newRow.statusID;
    selectMenu.add(option);
}