function deleteClass(classID) {
    let link = '/delete-class-ajax/';
    let data = {
      class_id: classID
    };
  
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        deleteRow(classID);
      }
    });
  }
  
  function deleteRow(classID){
      let table = document.getElementById("classes-table");
      for (let i = 0, row; row = table.rows[i]; i++) {
         if (table.rows[i].getAttribute("data-value") == classID) {
              table.deleteRow(i);
              break;
         }
      }
  }