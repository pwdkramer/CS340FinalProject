/*
    Citation for the following page:
    Date: 12/5/22
    Adapted from:
    Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/
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