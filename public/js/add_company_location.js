// Get the objects we need to modify
let addCompanyLocationForm = document.getElementById('add-company_location-form-ajax');

// Modify the objects we need
addCompanyLocationForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputCompanyID = document.getElementById("input-companyID");
    let inputLocationID = document.getElementById("input-locationID");


    // Get the values from the form fields
    let companyIDValue = inputCompanyID.value;
    let locationIDValue = inputLocationID.value;

    // Put our data we want to send in a javascript object
    let data = {
        companyID: companyIDValue,
        locationID: locationIDValue,
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-company_location-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputCompanyID.value = '';
            inputLocationID.value = '';

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
    let currentTable = document.getElementById("Companies_Locations-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and cells
    let row = document.createElement("TR");
    let company_location_IDCell = document.createElement("TD");
    let companyIDCell = document.createElement("TD");
    let locationIDCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    company_location_IDCell.innerText = newRow.company_location_ID;
    companyIDCell.innerText = newRow.name;
    locationIDCell.innerText = newRow.location;

    deleteCell = document.createElement("button");
    deleteCell.className = "btn btn-danger";
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function () {
        delete_company_location(newRow.company_location_ID);
    };

    // Add the cells to the row 
    row.appendChild(company_location_IDCell);
    row.appendChild(companyIDCell);
    row.appendChild(locationIDCell);
    row.appendChild(deleteCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.company_location_ID);

    // Add the row to the table
    currentTable.appendChild(row);

    // Find drop down menu, create a new option, fill data in the option (full name, id),
    // then append option to drop down menu so newly created rows via ajax will be found in it without needing a refresh
    let selectMenu = document.getElementById("mySelectCompany_Location");
    let option = document.createElement("option");
    option.text = newRow.company_location_ID;
    option.value = newRow.company_location_ID;
    selectMenu.add(option);
}