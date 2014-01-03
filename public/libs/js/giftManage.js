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
  },
  editCategory: function(categoryId, name) {
    return function() {
      editCategoryFunc(categoryId, name);
    }
  },
  delCategory: function(categoryId) {
    return function() {
      delCategoryFunc(categoryId);
    }
  }
};

/**
 * edit gift and load the data
 * @param  {string} giftId the id of gift
 * @return {null}
 */
function editGiftFunc(giftId) {
  $('#gitEditModle').modal('show');
  $.ajax({
    url: '/gifts',
    type: 'POST',
    data: {
      'giftId': giftId
    },
    success: function(data) {
      if (data.statusCode === 0) {
        var tempGift = data.data[0];
        $("#editGiftId").val(tempGift.giftId);
        $("#editBrand").val(tempGift.brand);
        $("#editGiftName").val(tempGift.name);
        $("#editGiftUnit").val(tempGift.unit);
        $("#editGiftPrice").val(tempGift.price);
        var tempDate = "";
        if (tempGift.expireDate) {
          if (tempGift.expireDate.indexOf('0000') == -1) {
            tempDate = tempGift.expireDate.substring(0, 10)
          } else {
            tempDate = "";
          }
        } else {
          tempDate = "";
        }

        $('#giftCategoryEdit').selectpicker('val', tempGift.categoryId);
        $("#editGiftExpireDate").val(tempDate);
      }
    }
  })
}

function delGiftFunc(giftId) {
  bootbox.confirm("确定删除此礼品吗?", function(result) {
    if (result) {
      $.ajax({
        url: '/gift/deletion',
        type: 'POST',
        data: {
          'giftId': giftId
        },
        success: function(data) {
          if (data.statusCode === 0) {
            bootbox.alert("删除成功!");
            loadGifts();
          }
        }
      })

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
    type: 'POST',
    success: function(data) {
      if (data.statusCode === 0) {
        $("#addtr").html("");
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
        bootbox.alert("录入成功!", function() {
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

function giftEditOpearteClick() {
  //without check 
  $.ajax({
    url: '/gift/modification',
    type: 'POST',
    data: $('form.editGiftInOpear').serialize(),
    success: function(data) {
      if (data.statusCode === 0) {
        $('#gitEditModle').modal('hide');
        bootbox.alert("修改成功!", function() {
          loadGifts();
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

function loadGiftCategorys() {
  $.ajax({
    type: 'GET',
    url: '/giftcategories',
    success: function(data) {
      if (data.statusCode === 0) {
        $("#giftCategoryAttr").html("");
        for (var i = 0; i < data.data.length; i++) {
          var cellData = data.data[i];
          var row = tdCont.row();
          var cellName = tdCont.cell(cellData.name);
          var linkEdit = tdCont.cell($("<a href='javascript:void(0);'>修改</a>"));
          linkEdit.click(tdCont.editCategory(cellData.categoryId, cellData.name));
          var linkDel = tdCont.cell($("<a href='javascript:void(0);'>删除</a>"));
          linkDel.click(tdCont.delCategory(cellData.categoryId));
          row.append(cellName);
          row.append(linkEdit);
          row.append(linkDel);
          $("#giftCategoryAttr").append(row);
        };
      }
    }
  })
}

function loadGiftCategorysIndex() {
  $.ajax({
    url: "/giftcategories",
    type: "GET",
    success: function(data) {
      if (data.statusCode === 0) {
        for (var i = 0; i < data.data.length; i++) {
          var temp = "<option value='" + data.data[i].categoryId + "'>" + data.data[i].name + "</option>";
          $("#giftCategory").append(temp);
          $("#giftCategoryEdit").append(temp);
        };
        $('#giftCategoryEdit').selectpicker();
        $('#giftCategory').selectpicker();
      }
    }
  })
}

function addGiftCategory() {
  //with check
  $.ajax({
    type: 'POST',
    url: '/giftCategory/insertion',
    data: {
      'name': $('#giftCategoryName').val()
    },
    success: function(data) {
      if (data.statusCode === 0) {
        bootbox.alert("添加成功!");
        $('#giftCategoryName').val("");
        loadGiftCategorys();
      }
    }
  })
}

function editCategoryFunc(categoryId, name) {
  $('#giftCategoryName').val(name);
  $('#giftCategoryBtn').hide();
  $('#giftCategoryBtnEdit').show();
  $('#giftCategoryBtnEdit').click(function() {
    $.ajax({
      url: '/giftcategory/modification',
      type: 'POST',
      data: {
        'categoryId': categoryId,
        'name': $('#giftCategoryName').val()
      },
      success: function(data) {
        if (data.statusCode === 0) {
          bootbox.alert("修改成功");

          $("#giftCategoryBtnEdit").unbind();
          loadGiftCategorys();
        }
      }

    })
  });
}