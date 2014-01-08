var tdCont = {
  cell: function(item) {
    return $("<td></td>").html(item);
  },

  row: function() {
    return $("<tr></tr>");
  },
  nothing: function(soId) {
    return function() {
      //editStockOutFunc(soId);
    }
  }
};


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


