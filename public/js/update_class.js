/*
    Citation for the following page:
    Date: 12/5/22
    Adapted from:
    Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/
// Get the objects we need to modify
let updateClassForm = document.getElementById('update-class-form-ajax');

// Modify the objects we need
updateClassForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputClassName = document.getElementById("mySelect");
    let inputTeacherID = document.getElementById("input-teacher_id-update");

    // Get the values from the form fields
    let classNameValue = inputClassName.value;
    let teacherIDValue = inputTeacherID.value;

    // Put our data we want to send in a javascript object
    let data = {
        classname: classNameValue,
        teacher_id: teacherIDValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-class-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, classNameValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, classID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("classes-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == classID) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of teacher_id value
            let td = updateRowIndex.getElementsByTagName("td")[1];

            // Reassign teacher_id to our value we updated to
            td.innerHTML = parsedData[0].last_name; 
       }
    }
}
