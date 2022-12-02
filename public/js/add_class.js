// Get the objects we need to modify
let addClassForm = document.getElementById('add-class-form-ajax');

// Modify the objects we need
addClassForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputTeacherID = document.getElementById("input-teacher_id-ajax");
    let inputClassName = document.getElementById("input-class_name");
    let inputClassSection = document.getElementById("input-class_section");
    let inputMaxStudents = document.getElementById("input-max_students");

    // Get the values from the form fields
    let teacherIDValue = inputTeacherID.value;
    let classNameValue = inputClassName.value;
    let classSectionValue = inputClassSection.value;
    let maxStudentsValue = inputMaxStudents.value;

    // Put our data we want to send in a javascript object
    let data = {
        teacher_id: teacherIDValue,
        class_name: classNameValue,
        class_section: classSectionValue,
        max_students: maxStudentsValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-class-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputTeacherID.value = '';
            inputClassName.value = '';
            inputClassSection.value = '';
            inputMaxStudents.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
// bsg_people
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("classes-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let classIDCell = document.createElement("TD");
    let teacherIDCell = document.createElement("TD");
    let classNameCell = document.createElement("TD");
    let classSectionCell = document.createElement("TD");
    let maxStudentsCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    classIDCell.innerText = newRow.class_id;
    teacherIDCell.innerText = newRow.teacher_id;
    classNameCell.innerText = newRow.class_name;
    classSectionCell.innerText = newRow.class_section;
    maxStudentsCell.innerText = newRow.max_students;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteClass(newRow.class_id);
    };

    // Add the cells to the row 
    row.appendChild(classIDCell);
    row.appendChild(teacherIDCell);
    row.appendChild(classNameCell);
    row.appendChild(classSectionCell);
    row.appendChild(maxStudentsCell);
    row.appendChild(deleteCell);

    row.setAttribute('data-value', newRow.class_id);
    
    // Add the row to the table
    currentTable.appendChild(row);
}