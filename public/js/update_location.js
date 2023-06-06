// Get the objects we need to modify
let updateLocationForm = document.getElementById('update-location-form-ajax');

// Modify the objects we need
updateLocationForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputLocationToUpdate = document.getElementById("mySelectLocation");
    let inputStateUpdate = document.getElementById("input-state-update");
    let inputCityUpdate = document.getElementById("input-city-update");

    // Get the values from the form fields
    let locationToUpdate = inputLocationToUpdate.value;
    let stateUpdateValue = inputStateUpdate.value;
    let cityUpdateValue = inputCityUpdate.value;

    // Put our data we want to send in a javascript object
    let data = {
        locationID: locationToUpdate,
        state: stateUpdateValue,
        city: cityUpdateValue
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-location-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, locationToUpdate);

            // Clear the input fields for another transaction
            inputLocationToUpdate.value = '';
            inputStateUpdate.value = '';
            inputCityUpdate.value = '';

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, locationID) {
    let parsedData = JSON.parse(data);

    let table = document.getElementById("Locations-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == locationID) {

            // Get the location of the row where we found the matching company ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of location value
            let td = updateRowIndex.getElementsByTagName("td")[1];

            // Reassign state to our value we updated to
            td.innerHTML = parsedData[i - 1].state;

            // Get td of location value
            td = updateRowIndex.getElementsByTagName("td")[2];

            // Reassign city to our value we updated to
            td.innerHTML = parsedData[i - 1].city;
        }
    }
}