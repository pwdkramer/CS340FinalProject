/*
    Citation for the following page:
    Date: 12/5/22
    Adapted from:
    Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/
// Get the objects we need to modify
let addStudentClassForm = document.getElementById('add-student_class-form-ajax');

// Modify the objects we need
addStudentClassForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputClassID = document.getElementById("input-class_id");
    let inputStudentID = document.getElementById("input-student_id");

    // Get the values from the form fields
    let classIDValue = inputClassID.value;
    let studentIDValue = inputStudentID.value;

    // Put our data we want to send in a javascript object
    let data = {
        class_id: classIDValue,
        student_id: studentIDValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-student_class-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputClassID.value = '';
            inputStudentID.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
// Students_Classes
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("students_classes-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let classIDCell = document.createElement("TD");
    let studentIDCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    classIDCell.innerText = newRow.class_id;
    studentIDCell.innerText = newRow.student_id;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteStudentClass(newRow.class_id, newRow.student_id);
    };

    // Add the cells to the row 
    row.appendChild(classIDCell);
    row.appendChild(studentIDCell);
    row.appendChild(deleteCell);

    row.setAttribute('data-value', (newRow.class_id, newRow.student_id));
    
    // Add the row to the table
    currentTable.appendChild(row);
}