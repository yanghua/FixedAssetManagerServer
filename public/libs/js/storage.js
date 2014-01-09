var tdCont = {
  cell: function(item) {
    return $("<td></td>").html(item);
  },

  row: function() {
    return $("<tr></tr>");
  },
  editLimitation: function(giftId) {
    return function() {
      editLimitationFunc(giftId);
    }
  }
};

/**
 * get storage info
 * @param  {string} giftId the id of gift
 * @return {null}        
 */
function getStorage(giftId) {
  $.ajax({
    url: '/inventories',
    type: 'POST',
    data:{'giftId':giftId},
    success: function(data) {
      if (data.statusCode === 0) {
        $("#storageResult").html("");
        for (var i = 0; i < data.data.length; i++) {
          var cellData = data.data[i];
          var row = tdCont.row();
          var cellName = tdCont.cell(cellData.name);
          var cellNum = tdCont.cell(cellData.num);
          var cellUnit = tdCont.cell(cellData.unit);
          var cellPrice = tdCont.cell(cellData.price);

          var cellGcName = tdCont.cell(cellData.gcName);
          var tempDate = "";
          if (cellData.soDate) {
            if (cellData.soDate.indexOf('0000') == -1) {
              tempDate = cellData.soDate.substring(0, 10)
            } else {
              tempDate = "/";
            }
          } else {
            tempDate = "/";
          }

          var cellExpireDate = tdCont.cell(tempDate);

          row.append(cellName);
          row.append(cellUnit);
          row.append(cellPrice);
          row.append(cellNum);
          row.append(cellGcName);

          row.append(cellExpireDate);
          $("#storageResult").append(row);
        };

      }
    }
  })
}

/**
 * load gift selector
 * @return {null} 
 */
function loadGifts() {
  $.ajax({
    type: 'POST',
    url: '/gifts',
    success: function(data) {
      if (data.statusCode === 0) {
        for (var i = 0; i < data.data.length; i++) {
          var temp = "<option value='" + data.data[i].giftId + "'>" + data.data[i].name +"("+data.data[i].price+")"+ "</option>";
          $("#giftTypes").append(temp);
        };
        $('#giftTypes').selectpicker();
       
      }
    }
  });
}

function loadLimitation () {
  $.ajax({
    type: "GET",
    url: "/limitations",
    success: function(data){
      if (data.statusCode === 0) {
        $("#limitationAttr").html("");
        for (var i = 0; i < data.data.length; i++) {
          var cellData = data.data[i];
          var row = tdCont.row();
          var cellName = tdCont.cell(cellData.name);
          var cellLimitNum = tdCont.cell(cellData.limitNum);
          var linkEdit = tdCont.cell($("<a href='javascript:void(0);'>修改</a>"));
          linkEdit.click(tdCont.editLimitation(cellData.giftId));
          row.append(cellName);
          row.append(cellLimitNum);
          row.append(linkEdit);
          $("#limitationAttr").append(row);
        }
      }
    }
  });
}

function editLimitationFunc (giftId) {
  bootbox.prompt("请输入新的限制数量", function(result) {                
    if (result === null) {                                             
                                  
    } else {
       if (isDigit(result) && result>0) {
          $.ajax({
            type:"POST",
            url:"/limitation/modification",
            data:{"giftId":giftId,"limitNum":result},
            success:function (data) {
              if (data.statusCode === 0) {
                loadLimitation ();
              }            
            }
          })
       }else{
        bootbox.alert("请输入大于0的数字!"); 
       }                          
    }
  });
}
/**
 * isDigit
 * @param  {string}  value 
 * @return {bool}       
 */
function isDigit(value) {
    var patrn = /^[0-9]*$/;
    if (patrn.exec(value) == null || value == "") {
        return false
    } else {
        return true
    }
}




