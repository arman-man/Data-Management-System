// Get the objects we need to modify
let updateCompanyForm = document.getElementById('update-company-form-ajax');

// Modify the objects we need
updateCompanyForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputCompanyToUpdate = document.getElementById("mySelectCompany");
    let inputNameUpdate = document.getElementById("input-name-update");

    // Get the values from the form fields
    let companyToUpdate = inputCompanyToUpdate.value;
    let nameUpdateValue = inputNameUpdate.value;

    // Put our data we want to send in a javascript object
    let data = {
        companyID: companyToUpdate,
        name: nameUpdateValue
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-company-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, companyToUpdate);

            // Clear the input fields for another transaction
            inputCompanyToUpdate.value = '';
            inputNameUpdate.value = '';

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, companyID) {
    let parsedData = JSON.parse(data);

    let table = document.getElementById("Companies-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == companyID) {

            // Get the location of the row where we found the matching company ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of company value
            let td = updateRowIndex.getElementsByTagName("td")[1];

            // Reassign company to our value we updated to
            td.innerHTML = parsedData[i - 1].name;
        }
    }
}