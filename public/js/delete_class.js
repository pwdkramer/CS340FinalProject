/*
    Citation for the following page:
    Date: 12/5/22
    Adapted from:
    Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/
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
              deleteDropDownMenu(classID);
              break;
         }
      }
  }

  function deleteDropDownMenu(classID){
    let selectMenu = document.getElementById("mySelect");
    for (let i = 0; i < selectMenu.length; i++){
      if (Number(selectMenu.options[i].value) === Number(classID)){
        selectMenu[i].remove();
        break;
      } 
  
    }
  }