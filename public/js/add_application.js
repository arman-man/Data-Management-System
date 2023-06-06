// Get the objects we need to modify
let addApplicationForm = document.getElementById('add-application-form-ajax');

// Modify the objects we need
addApplicationForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputPostingID = document.getElementById("input-postingID");
    let inputStatusID = document.getElementById("input-statusID");
    let inputDate = document.getElementById("input-date");


    // Get the values from the form fields
    let postingIDValue = inputPostingID.value;
    let statusIDValue = inputStatusID.value;
    let dateValue = inputDate.value;

    // Put our data we want to send in a javascript object
    let data = {
        postingID: postingIDValue,
        statusID: statusIDValue,
        date: dateValue
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-application-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputPostingID.value = '';
            inputStatusID.value = '';
            inputDate.value = '';

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
    let currentTable = document.getElementById("Applications-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and cells
    let row = document.createElement("TR");
    let applicationIDCell = document.createElement("TD");
    let postingIDCell = document.createElement("TD");
    let statusIDCell = document.createElement("TD");
    let dateCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    applicationIDCell.innerText = newRow.applicationID;
    postingIDCell.innerText = newRow.postingID;
    statusIDCell.innerText = newRow.status;
    dateCell.innerText = newRow.date;

    deleteCell = document.createElement("button");
    deleteCell.className = "btn btn-danger";
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function () {
        deleteApplication(newRow.applicationID);
    };

    // Add the cells to the row 
    row.appendChild(applicationIDCell);
    row.appendChild(postingIDCell);
    row.appendChild(statusIDCell);
    row.appendChild(dateCell);
    row.appendChild(deleteCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.applicationID);

    // Add the row to the table
    currentTable.appendChild(row);
}