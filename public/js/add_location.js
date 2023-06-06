// Get the objects we need to modify
let addLocationForm = document.getElementById('add-location-form-ajax');

// Modify the objects we need
addLocationForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputState = document.getElementById("input-state");
    let inputCity = document.getElementById("input-city");

    // Get the values from the form fields
    let stateValue = inputState.value;
    let cityValue = inputCity.value;

    // Put our data we want to send in a javascript object
    let data = {
        state: stateValue,
        city: cityValue
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-location-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputState.value = '';
            inputCity.value = '';

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
    let currentTable = document.getElementById("Locations-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and cells
    let row = document.createElement("TR");
    let locationIDCell = document.createElement("TD");
    let stateCell = document.createElement("TD");
    let cityCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    locationIDCell.innerText = newRow.locationID;
    stateCell.innerText = newRow.state;
    cityCell.innerText = newRow.city;

    deleteCell = document.createElement("button");
    deleteCell.className = "btn btn-danger";
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function () {
        deleteLocation(newRow.locationID);
    };

    // Add the cells to the row 
    row.appendChild(locationIDCell);
    row.appendChild(stateCell);
    row.appendChild(cityCell);
    row.appendChild(deleteCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.locationID);

    // Add the row to the table
    currentTable.appendChild(row);

    // Find drop down menu, create a new option, fill data in the option (full name, id),
    // then append option to drop down menu so newly created rows via ajax will be found in it without needing a refresh
    let selectMenu = document.getElementById("mySelectLocation");
    let option = document.createElement("option");
    option.text = newRow.locationID;
    option.value = newRow.locationID;
    selectMenu.add(option);
}
