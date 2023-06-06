// Get the objects we need to modify
let upatePostingForm = document.getElementById('update-posting-form-ajax');

// Modify the objects we need
upatePostingForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputPostingToUpdate = document.getElementById("mySelectPosting");
    let inputPositionUpdate = document.getElementById("input-position-update");
    let inputSalaryUpdate = document.getElementById("input-salary-update");
    let inputCompany_location_IDUpdate = document.getElementById("input-company_location_ID-update");
    let inputSourceUpdate = document.getElementById("input-source-update");

    // Get the values from the form fields
    let postingToUpdate = inputPostingToUpdate.value;
    let positionUpdateValue = inputPositionUpdate.value;
    let salaryUpdateValue = inputSalaryUpdate.value;
    let company_location_IDValue = inputCompany_location_IDUpdate.value;
    let sourceUpdateValue = inputSourceUpdate.value;


    // Put our data we want to send in a javascript object
    let data = {
        postingID: postingToUpdate,
        position: positionUpdateValue,
        salary: salaryUpdateValue,
        company_location_ID: company_location_IDValue,
        source: sourceUpdateValue
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-posting-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, postingToUpdate);

            // Clear the input fields for another transaction
            inputPostingToUpdate.value = '';
            inputPositionUpdate.value = '';
            inputSalaryUpdate.value = '';
            inputCompany_location_IDUpdate.value = '';
            inputSourceUpdate.value = ';'

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, postingID) {
    let parsedData = JSON.parse(data);

    let table = document.getElementById("Postings-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == postingID) {

            // Get the location of the row where we found the matching company ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of location value
            let td = updateRowIndex.getElementsByTagName("td")[1];

            // Reassign state to our value we updated to
            td.innerHTML = parsedData[i - 1].position;

            // Get td of location value
            td = updateRowIndex.getElementsByTagName("td")[2];

            // Reassign city to our value we updated to
            td.innerHTML = parsedData[i - 1].salary;

            // Get td of location value
            td = updateRowIndex.getElementsByTagName("td")[3];

            // Reassign city to our value we updated to
            td.innerHTML = parsedData[i - 1].company_location;

            // Get td of location value
            td = updateRowIndex.getElementsByTagName("td")[4];

            // Reassign city to our value we updated to
            td.innerHTML = parsedData[i - 1].source;
        }
    }
}