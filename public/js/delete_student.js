/*
    Citation for the following page:
    Date: 12/5/22
    Adapted from:
    Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/
function deleteStudent(studentID) {
    let link = '/delete-student-ajax/';
    let data = {
      student_id: studentID
    };
  
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        deleteRow(studentID);
      }
    });
  }
  
  function deleteRow(studentID){
      let table = document.getElementById("students-table");
      for (let i = 0, row; row = table.rows[i]; i++) {
         if (table.rows[i].getAttribute("data-value") == studentID) {
              table.deleteRow(i);
              deleteDropDownMenu(studentID);
              break;
         }
      }
  }

  function deleteDropDownMenu(studentID){
    let selectMenu = document.getElementById("mySelect");
    for (let i = 0; i < selectMenu.length; i++){
      if (Number(selectMenu.options[i].value) === Number(studentID)){
        selectMenu[i].remove();
        break;
      } 
  
    }
  }