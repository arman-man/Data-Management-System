function deleteStatus(statusID) {
    // Put our data we want to send in a javascript object
    let data = {
        statusID: statusID
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-status-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // Add the new data to the table
            deleteRow(statusID);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}

function deleteRow(statusID) {

    let table = document.getElementById("Statuses-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == statusID) {
            table.deleteRow(i);
            deleteDropDownMenu(statusID);
            break;
        }
    }
}

function deleteDropDownMenu(statusID) {
    let selectMenu = document.getElementById("mySelectStatus");
    for (let i = 0; i < selectMenu.length; i++) {
        if (Number(selectMenu.options[i].value) === Number(statusID)) {
            selectMenu[i].remove();
            break;
        }

    }
}