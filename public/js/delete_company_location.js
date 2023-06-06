function delete_company_location(company_location_ID) {
    // Put our data we want to send in a javascript object
    let data = {
        company_location_ID: company_location_ID
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-company_location-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // Add the new data to the table
            deleteRow(company_location_ID);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}


function deleteRow(company_location_ID) {

    let table = document.getElementById("Companies_Locations-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == company_location_ID) {
            table.deleteRow(i);
            deleteDropDownMenu(company_location_ID);
            break;
        }
    }
}

function deleteDropDownMenu(company_location_ID) {
    let selectMenu = document.getElementById("mySelectCompany_Location");
    for (let i = 0; i < selectMenu.length; i++) {
        if (Number(selectMenu.options[i].value) === Number(company_location_ID)) {
            selectMenu[i].remove();
            break;
        }

    }
}