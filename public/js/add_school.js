/*
    Citation for the following page:
    Date: 12/5/22
    Adapted from:
    Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/
// Get the objects we need to modify
let addSchoolForm = document.getElementById('add-school-form-ajax');

// Modify the objects we need
addSchoolForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputSchoolName = document.getElementById("input-school_name");

    // Get the values from the form fields
    let schoolNameValue = inputSchoolName.value;

    // Put our data we want to send in a javascript object
    let data = {
        school_name: schoolNameValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-school-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputSchoolName.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
// Schools
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("schools-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 2 cells
    let row = document.createElement("TR");
    let schoolIdCell = document.createElement("TD");
    let schoolNameCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    schoolIdCell.innerText = newRow.school_id;
    schoolNameCell.innerText = newRow.school_name;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteSchool(newRow.school_id);
    };

    // Add the cells to the row 
    row.appendChild(schoolIdCell);
    row.appendChild(schoolNameCell);
    row.appendChild(deleteCell);

    row.setAttribute('data-value', newRow.school_id);
    
    // Add the row to the table
    currentTable.appendChild(row);
}