var tdCont = {
  cell: function(item) {
    return $("<td></td>").html(item);
  },

  row: function() {
    return $("<tr></tr>");
  },
  editGift: function(giftId) {
    return function() {
      editGiftFunc(giftId);
    }
  },
  delGift: function(giftId) {
    return function() {
      delGiftFunc(giftId);
    }
  }
};

function editGiftFunc(giftId) {
  bootbox.alert(giftId);

}

function delGiftFunc(giftId) {
  bootbox.confirm("确定删除此礼品吗?", function(result) {
    if (result) {
      // $.ajax({
      // 	url:'',
      // 	type:''
      // })
      bootbox.alert("yes");
    }
  });
}


/**
 * load gifts
 * @return {null}
 */
function loadGifts() {
  $.ajax({
    url: '/gifts',
    type: 'GET',
    success: function(data) {
      if (data.statusCode === 0) {
        for (var i = 0; i < data.data.length; i++) {
          var cellData = data.data[i];
          var row = tdCont.row();
          //var cellId = tdCont.cell(cellData.giftId);
          var cellBrand = tdCont.cell(cellData.brand);
          var cellName = tdCont.cell(cellData.name);
          var cellUnit = tdCont.cell(cellData.unit);
          var cellPrice = tdCont.cell(cellData.price);
          var tempDate = "";
          if (cellData.expireDate.indexOf('0000') == -1) {
            tempDate = cellData.expireDate.substring(0, 10)
          } else {
            tempDate = "无";
          }
          var cellExpireDate = tdCont.cell(tempDate);
          var cellCategoryId = tdCont.cell(cellData.gcname);
          var linkEdit = tdCont.cell($("<a href='javascript:void(0);'>修改</a>"));
          linkEdit.click(tdCont.editGift(cellData.giftId));
          var linkDel = tdCont.cell($("<a href='javascript:void(0);'>删除</a>"));
          linkDel.click(tdCont.delGift(cellData.giftId));
          //row.append(cellId);
          row.append(cellName);
          row.append(cellBrand);
          row.append(cellUnit);
          row.append(cellPrice);
          row.append(cellCategoryId);
          row.append(cellExpireDate);
          row.append(linkEdit);
          row.append(linkDel);
          $("#addtr").append(row);

        };
      }
    }
  })
}
/**
 * gift insert click
 * @return {null}
 */
function giftInOpearteClick() {
  //without check
  $.ajax({
    url: '/gift/insertion',
    type: 'POST',
    data: $('form.giftInOpear').serialize(),
    success: function(data) {
      if (data.statusCode === 0) {
        bootbox.alert("出库成功!", function() {
          // todo
        });
      } else {
        bootbox.alert("系统出错 , 请重试 !");
      }
    },
    error: function(err) {
      bootbox.alert(err);
    }
  })
}