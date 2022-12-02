// Get the objects we need to modify
let addStudentForm = document.getElementById('add-student-form-ajax');

// Modify the objects we need
addStudentForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputSchoolID = document.getElementById("input-school_id");
    let inputFirstName = document.getElementById("input-first_name");
    let inputLastName = document.getElementById("input-last_name");
    let inputDateOfBirth = document.getElementById("input-date_of_birth");
    let inputEmail = document.getElementById("input-email");

    // Get the values from the form fields
    let schoolIDValue = inputSchoolID.value;
    let firstNameValue = inputFirstName.value;
    let lastNameValue = inputLastName.value;
    let dateOfBirthValue = inputDateOfBirth.value;
    let emailValue = inputEmail.value;

    // Put our data we want to send in a javascript object
    let data = {
        school_id: schoolIDValue,
        first_name: firstNameValue,
        last_name: lastNameValue,
        date_of_birth: dateOfBirthValue,
        email: emailValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-student-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputSchoolID.value = '';
            inputFirstName.value = '';
            inputLastName.value = '';
            inputDateOfBirth.value = '';
            inputEmail.value = '';


        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
// Students
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("students-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let studentIdCell = document.createElement("TD");
    let schoolIdCell = document.createElement("TD");
    let firstNameCell = document.createElement("TD");
    let lastNameCell = document.createElement("TD");
    let dateOfBirthCell = document.createElement("TD");
    let emailCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    studentIdCell.innerText = newRow.student_id;
    schoolIdCell.innerText = newRow.school_id;
    firstNameCell.innerText = newRow.first_name;
    lastNameCell.innerText = newRow.last_name;
    dateOfBirthCell.innerText = newRow.date_of_birth;
    emailCell.innerText = newRow.email;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteStudent(newRow.student_id);
    }

    // Add the cells to the row 
    row.appendChild(studentIdCell);
    row.appendChild(schoolIdCell);
    row.appendChild(firstNameCell);
    row.appendChild(lastNameCell);
    row.appendChild(dateOfBirthCell);
    row.appendChild(emailCell);
    row.appendChild(deleteCell);

    row.setAttribute('data-value', newRow.student_id);
    
    // Add the row to the table
    currentTable.appendChild(row);

    let selectMenu = document.getElementById("mySelect");
    let option = document.createElement("option");
    option.text = newRow.first_name + ' ' + newRow.last_name;
    option.value = newRow.student_id;
    selectMenu.add(option);
}