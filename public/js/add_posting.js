// Get the objects we need to modify
let addPostingForm = document.getElementById('add-posting-form-ajax');

// Modify the objects we need
addPostingForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputPosition = document.getElementById("input-position");
    let inputSalary = document.getElementById("input-salary");
    let inputCompany_Location_ID = document.getElementById("input-company_location_ID");
    let inputSource = document.getElementById("input-source");

    // Get the values from the form fields
    let positionValue = inputPosition.value;
    let salaryValue = inputSalary.value;
    let company_location_IDValue = inputCompany_Location_ID.value;
    let sourceValue = inputSource.value;

    // Put our data we want to send in a javascript object
    let data = {
        position: positionValue,
        salary: salaryValue,
        company_location_ID: company_location_IDValue,
        source: sourceValue
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-posting-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputPosition.value = '';
            inputSalary.value = '';
            inputCompany_Location_ID.value = '';
            inputSource.value = '';

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
    let currentTable = document.getElementById("Postings-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and cells
    let row = document.createElement("TR");
    let postingIDCell = document.createElement("TD");
    let positionCell = document.createElement("TD");
    let salaryCell = document.createElement("TD");
    let company_location_IDCell = document.createElement("TD");
    let sourceCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    postingIDCell.innerText = newRow.postingID;
    positionCell.innerText = newRow.position;
    salaryCell.innerText = newRow.salary;
    company_location_IDCell.innerText = newRow.company_location;
    sourceCell.innerText = newRow.source;

    deleteCell = document.createElement("button");
    deleteCell.className = "btn btn-danger";
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function () {
        deletePosting(newRow.postingID);
    };

    // Add the cells to the row 
    row.appendChild(postingIDCell);
    row.appendChild(positionCell);
    row.appendChild(salaryCell);
    row.appendChild(company_location_IDCell);
    row.appendChild(sourceCell);
    row.appendChild(deleteCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.postingID);

    // Add the row to the table
    currentTable.appendChild(row);

    // Find drop down menu, create a new option, fill data in the option (full name, id),
    // then append option to drop down menu so newly created rows via ajax will be found in it without needing a refresh
    let selectMenu = document.getElementById("mySelectPosting");
    let option = document.createElement("option");
    option.text = newRow.postingID;
    option.value = newRow.postingID;
    selectMenu.add(option);
}