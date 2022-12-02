function deleteSchool(schoolID) {
    let link = '/delete-school-ajax/';
    let data = {
      school_id: schoolID
    };
  
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        deleteRow(schoolID);
      }
    });
  }
  
  function deleteRow(schoolID){
      let table = document.getElementById("schools-table");
      for (let i = 0, row; row = table.rows[i]; i++) {
         if (table.rows[i].getAttribute("data-value") == schoolID) {
              table.deleteRow(i);
              break;
         }
      }
  }