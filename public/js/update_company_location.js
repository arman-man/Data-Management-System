// Get the objects we need to modify
let updateCompany_LocationForm = document.getElementById('update-company_location-form-ajax');

// Modify the objects we need
updateCompany_LocationForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputCompany_LocationToUpdate = document.getElementById("mySelectCompany_Location");
    let inputCompanyIDUpdate = document.getElementById("input-companyID-update");
    let inputLocationIDUpdate = document.getElementById("input-locationID-update");

    // Get the values from the form fields
    let company_locationToUpdate = inputCompany_LocationToUpdate.value;
    let companyIDUpdateValue = inputCompanyIDUpdate.value;
    let locationIDUpdateValue = inputLocationIDUpdate.value;

    // Put our data we want to send in a javascript object
    let data = {
        company_location_ID: company_locationToUpdate,
        companyID: companyIDUpdateValue,
        locationID: locationIDUpdateValue
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-company_location-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, company_locationToUpdate);

            // Clear the input fields for another transaction
            inputCompany_LocationToUpdate.value = '';
            inputCompanyIDUpdate.value = '';
            inputLocationIDUpdate.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
})

function updateRow(data, company_location_ID) {
    let parsedData = JSON.parse(data);

    let table = document.getElementById("Companies_Locations-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == company_location_ID) {

            // Get the location of the row where we found the matching company ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of location value
            let td = updateRowIndex.getElementsByTagName("td")[1];

            // Reassign state to our value we updated to
            td.innerHTML = parsedData[i - 1].name;

            // Get td of location value
            td = updateRowIndex.getElementsByTagName("td")[2];

            // Reassign city to our value we updated to
            td.innerHTML = parsedData[i - 1].location;
        }
    }
}