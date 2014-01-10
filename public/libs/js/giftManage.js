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

/**
 * delete gift
 * @param  {string} giftId gift id
 * @return {null}        
 */
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
          //row.append(cellBrand);
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
 * isDigit 
 * @param  {string}  value value
 * @return {Boolean}       
 */
function isDigit(value) {
    var patrn = /^[0-9]*$/;
    if (patrn.exec(value) == null || value == "") {
        return false;
    } else {
        return true;
    }
}
/**
 * gift insert click
 * @return {null}
 */
function giftInOpearteClick() {
  if(!$("#giftName").val()){
    bootbox.alert("请输入礼品名称!");
    return;
  }
  if(!$("#giftUnit").val()){
    bootbox.alert("请输入计量单位!");
    return;
  }
  if($('#giftPrice').val() <= 0 || !$("#giftPrice").val()|| !isDigit($('#giftPrice').val()) ){
    bootbox.alert("请输入正确的礼品单价!");
    return;
  }
  if($("#giftCategory").val() == '0' ){
    bootbox.alert("请选择礼品类别!");
    return;
  }
  $.ajax({
    url: '/gift/insertion',
    type: 'POST',
    data: $('form.giftInOpear').serialize(),
    success: function(data) {
      if (data.statusCode === 0) {
        bootbox.alert("录入成功!");
        loadGifts();
      } else {
        bootbox.alert("系统出错 , 请重试 !");
      }
    },
    error: function(err) {
      bootbox.alert(err);
    }
  })
}

/**
 * edit gidt
 * @return {null} 
 */
function giftEditOpearteClick() {
  if(!$("#editGiftName").val()){
    bootbox.alert("请输入礼品名称!");
    return;
  }
  if(!$("#editGiftUnit").val()){
    bootbox.alert("请输入计量单位!");
    return;
  }
  if($('#editGiftPrice').val() <= 0 || !$("#editGiftPrice").val() | !isDigit($('#editGiftPrice').val())){
    bootbox.alert("请输入正确的礼品单价!");
    return;
  }
  if($("#giftCategoryEdit").val() == '0' ){
    bootbox.alert("请选择礼品类别!");
    return;
  }
  $.ajax({
    url: '/gift/modification',
    type: 'POST',
    data: $('form.editGiftInOpear').serialize(),
    success: function(data) {
      if (data.statusCode === 0) {
        $('#gitEditModle').modal('hide');
        bootbox.alert("修改成功!", function() {
          loadGifts();
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

/**
 * load gift category
 * @return {null} 
 */
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
          //row.append(linkDel);
          $("#giftCategoryAttr").append(row);
        };
      }
    }
  })
}
/**
 * load giftCategoty
 * @return {null} 
 */
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

/**
 * add gift category
 */
function addGiftCategory() {
  if(!$("#giftCategoryName").val()){
    bootbox.alert("名称不能为空!");
    return;
  }
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
/**
 * editCategory
 * @param  {string} categoryId categoryId
 * @param  {string} name       the name category
 * @return {null}            
 */
function editCategoryFunc(categoryId, name) {
  $("#giftCategoryBtnEdit").unbind();
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
          $('#giftCategoryBtn').show();
          $('#giftCategoryBtnEdit').hide();
          loadGiftCategorys();
        }
      }

    })
  });
}