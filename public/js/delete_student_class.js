function deleteStudentClass(classID, studentID) {
    let link = '/delete-student_class-ajax/';
    let data = {
      class_id: classID,
      student_id: studentID
    };
  
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        deleteRow(classID, studentID);
      }
    });
  }
  
  function deleteRow(classID, studentID){
      let table = document.getElementById("students_classes-table");
      for (let i = 0, row; row = table.rows[i]; i++) {
         if (table.rows[i].getAttribute("data-value") == (classID, studentID)) {
              table.deleteRow(i);
              break;
         }
      }
  }