// Get the objects we need to modify
let updateStatusForm = document.getElementById('update-status-form-ajax');

// Modify the objects we need
updateStatusForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputStatusToUpdate = document.getElementById("mySelectStatus");
    let inputStatusUpdate = document.getElementById("input-status-update");

    // Get the values from the form fields
    let statusToUpdate = inputStatusToUpdate.value;
    let statusUpdateValue = inputStatusUpdate.value;

    // Put our data we want to send in a javascript object
    let data = {
        statusID: statusToUpdate,
        status: statusUpdateValue
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-status-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, statusToUpdate);

            // Clear the input fields for another transaction
            inputStatusToUpdate.value = '';
            inputStatusUpdate.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, statusID) {
    let parsedData = JSON.parse(data);

    let table = document.getElementById("Statuses-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == statusID) {

            // Get the location of the row where we found the matching company ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of company value
            let td = updateRowIndex.getElementsByTagName("td")[1];

            // Reassign company to our value we updated to
            td.innerHTML = parsedData[i - 1].status;
        }
    }
}