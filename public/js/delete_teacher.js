function deleteTeacher(teacherID) {
    let link = '/delete-teacher-ajax/';
    let data = {
      teacher_id: teacherID
    };
  
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        deleteRow(teacherID);
      }
    });
  }
  
  function deleteRow(teacherID){
      let table = document.getElementById("teachers-table");
      for (let i = 0, row; row = table.rows[i]; i++) {
         if (table.rows[i].getAttribute("data-value") == teacherID) {
              table.deleteRow(i);
              break;
         }
      }
  }