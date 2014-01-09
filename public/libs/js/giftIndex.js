var tdCont = {
  cell: function(item) {
    return $("<td></td>").html(item);
  },

  row: function() {
    return $("<tr></tr>");
  },
  editStockOut: function(soId) {
    return function() {
      editStockOutFunc(soId);
    }
  },
  delStockOut: function(soId) {
    return function() {
      delStockOutFunc(soId);
    }
  },
  editStockIn: function(siId) {
    return function() {
      editStockInFunc(siId);
    }
  },
  delStockIn: function(siId) {
    return function() {
      delStockInFunc(siId);
    }
  }
};

/**
 * load department for auto fill in
 * @return {null} 
 */
function loadAutoFillDepart() {
  $.ajax({
    url: '/manualinputdepts',
    type: 'GET',
    success: function(data) {
      if (data.statusCode === 0) {
        var departInfo = $.map(data.data, function(value) {
          return {
            value: value
          };
        });
        $('#giftSendDepart').autocomplete({
          lookup: departInfo,
          minChars: 0,
          onSelect: function(suggestion) {
            //$('#selection').html('You selected: ' + suggestion.value + ', ' + suggestion.data);
          }
        });
      }
    }
  });
}
/**
 * load department for auto fill in
 * @return {null} 
 */
function loadAutoFillSupplier() {
  $.ajax({
    url: '/suppliers',
    type: 'GET',
    success: function(data) {
      if (data.statusCode === 0) {
        var supplierInfo = $.map(data.data, function(value) {
          return {
            value: value
          };
        });
        $('#supplierName').autocomplete({
          lookup: supplierInfo,
          minChars: 0,
          onSelect: function(suggestion) {
            //$('#selection').html('You selected: ' + suggestion.value + ', ' + suggestion.data);
          }
        });
      }
    }
  });
}
/**
 * eidt stock out
 * @param  {string} soId stockId
 * @return {null}      
 */
 function editStockOutFunc(soId) {
  $.ajax({
    url: '/stockouts',
    type: 'POST',
    data: {
      'soId': soId
    },
    success: function(data) {
      if (data.statusCode === 0) {
        $('#outOpearteOne').show();
        $('#outOpearte').hide();
        var cellData = data.data[0];
        $("#soId").val(cellData.soId);
        $('#giftType').selectpicker('val', cellData.giftId);
        $("#giftSize").val(cellData.num);
        $("#giftAcount").val(cellData.amount);
        $("#applyUserId").val(cellData.applyUserId);
        $('#giftSendDepart').val(cellData.underDept);
        //$('#giftApplyDepart').selectpicker('val', cellData.applyDeptId);
        $('#payStatus').selectpicker('val', cellData.ptId);
        $('#remark').val(cellData.remark);
        $('#other').val(cellData.other);
      }
    }
  })
}

/**
 * delete stock out record
 * @param  {string} soId stock out Id
 * @return {null}      
 */
 function delStockOutFunc(soId) {
  bootbox.confirm("确定删除吗?", function(result) {
    if (result) {
      $.ajax({
        url: '/stockout/deletion',
        type: 'POST',
        data: {
          'soId': soId
        },
        success: function(data) {
          if (data.statusCode === 0) {
            bootbox.alert("删除成功!");
            getStockOutRecord();
          }
        }
      })
    }
  });
}

/**
 * delete stockIn record
 * @param  {null} siId stockIn Id
 * @return {null}      
 */
 function delStockInFunc(siId) {
  bootbox.confirm("确定删除吗?", function(result) {
    if (result) {
      $.ajax({
        url: '/stockin/deletion',
        type: 'POST',
        data: {
          'siId': siId
        },
        success: function(data) {
          if (data.statusCode === 0) {
            bootbox.alert("删除成功!");
            getStockInRecord();
          }
        }
      })
    }
  });
}

/**
 * edit stock in 
 * @param  {string} siId stock in Id
 * @return {null}      
 */
 function editStockInFunc(siId) {
  $.ajax({
    url: '/stockins',
    type: 'POST',
    data: {
      'siId': siId
    },
    success: function(data) {
      if (data.statusCode === 0) {
        $('#inOpearteOne').show();
        $('#inOpearte').hide();
        var cellData = data.data[0];
        $("#siId").val(cellData.siId);
        $('#giftTypeIn').selectpicker('val', cellData.giftId);
        $("#giftSize2").val(cellData.num);
        $("#giftAcount2").val(cellData.amount);
        $("#supplierName").val(cellData.supplier);
        $('#siTypeIdSelect').selectpicker('val', cellData.siTypeId);
        $('#payStatusIn').selectpicker('val', cellData.ptId);
      }
    }
  })
}

/**
 * add stock out opearte 
 * @param  {string} edit edit or add
 * @return {null}      
 */
 function outOpearteClick(edit) {
  if($('#giftType').val() == '0'){
    bootbox.alert("请选择礼品!");
    return ;
  }
  if($('#giftSize').val() <= 0 || !$('#giftSize').val() || !isDigit($('#giftSize').val()) ){
    bootbox.alert("请输入正确的个数!");
    return ;
  }
  if(!$('#applyUserId').val() ){
    bootbox.alert("请输入申请人信息!");
    return ;
  }
  // if($('#giftApplyDepart').val() == '0'){
  //   bootbox.alert("请选择申请部门!");
  //   return ;
  // }
  if(!$('#giftSendDepart').val() ){
    bootbox.alert("请输入费用承担部门!");
    return ;
  }
  if($('#payStatus').val() == '0'){
    bootbox.alert("请选择付款状态!");
    return ;
  }

  var alertString, outUrl;
  if (edit) {
    alertString = "修改成功!";
    outUrl = "/stockout/modification";
  } else {
    alertString = "出库成功!";
    outUrl = "/stockout/insertion";
  }
  $.ajax({
    url: outUrl,
    type: 'POST',
    data: $('form.outStorage').serialize(),
    success: function(data) {
      if (data.statusCode === 0) {
        bootbox.alert(alertString);
        $('#outOpearteOne').hide();
        $('#outOpearte').show();
        getStockOutRecord();
        $("form.outStorage")[0].reset();

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
 * the stock in opearte
 * @param  {string} edit editId
 * @return {null}      
 */
function inOpearteClick(edit) {
  if($('#giftTypeIn').val() == '0'){
    bootbox.alert("请选择礼品!");
    return ;
  }
  if($('#giftSize2').val() <= 0 || !$('#giftSize2').val() || !isDigit($('#giftSize2').val()) ){
    bootbox.alert("请输入正确的个数!");
    return ;
  }
  if(!$('#supplierName').val() ){
    bootbox.alert("请输入供应商信息!");
    return ;
  }
  if($('#siTypeIdSelect').val() == '0'){
    bootbox.alert("请选择入库类型!");
    return ;
  }
  if($('#payStatusIn').val() == '0'){
    bootbox.alert("请选择付款状态!");
    return ;
  }

  var alertString, inUrl;
  if (edit) {
    alertString = "修改成功!";
    inUrl = "/stockin/modification";
  } else {
    alertString = "出库成功!";
    inUrl = "/stockin/insertion";
  }
  $.ajax({
    url: inUrl,
    type: 'POST',
    data: $('form.inStorage').serialize(),
    success: function(data) {
      if (data.statusCode === 0) {
        bootbox.alert(alertString);
        getStockInRecord();
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
 * get stockout record
 * @return {null} 
 */
function getStockOutRecord() {
  $.ajax({
    url: '/stockouts',
    type: 'POST',
    success: function(data) {
      if (data.statusCode === 0) {
        $("#stockOutRecodes").html("");
        for (var i = 0; i < data.data.length; i++) {
          var cellData = data.data[i];
          var row = tdCont.row();
          var cellGcName = tdCont.cell(cellData.gcname)
          var cellName = tdCont.cell(cellData.name);
          var cellNum = tdCont.cell(cellData.num);
          var cellAmount = tdCont.cell(cellData.amount);
          var cellUserName = tdCont.cell(cellData.userName);
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
          var cellDepartmentName = tdCont.cell(cellData.underDept);
          var cellPtName = tdCont.cell(cellData.ptName);
          var linkEdit = tdCont.cell($("<a href='javascript:void(0);'>修改</a>"));
          linkEdit.click(tdCont.editStockOut(cellData.soId));
          var linkDel = tdCont.cell($("<a href='javascript:void(0);'>删除</a>"));
          linkDel.click(tdCont.delStockOut(cellData.soId));
          row.append(cellGcName);
          row.append(cellName);
          row.append(cellNum);
          row.append(cellAmount);
          row.append(cellUserName);
          row.append(cellDepartmentName);
          row.append(cellPtName);
          row.append(cellExpireDate);
          row.append(linkEdit);
          row.append(linkDel);
          $("#stockOutRecodes").append(row);
        };

      }
    }
  })
}

/**
 * get stock in record
 * @return {null} 
 */
function getStockInRecord() {
  $.ajax({
    url: '/stockins',
    type: 'POST',
    success: function(data) {
      if (data.statusCode === 0) {
        $("#stockInRecodes").html("");
        for (var i = 0; i < data.data.length; i++) {
          var cellData = data.data[i];
          var row = tdCont.row();
          var cellName = tdCont.cell(cellData.name);
          var cellNum = tdCont.cell(cellData.num);
          var cellAmount = tdCont.cell(cellData.amount);
          var cellSupplier = tdCont.cell(cellData.supplier);
          var tempDate = "";
          if (cellData.siDate) {
            if (cellData.siDate.indexOf('0000') == -1) {
              tempDate = cellData.siDate.substring(0, 10)
            } else {
              tempDate = "/";
            }
          } else {
            tempDate = "/";
          }

          var cellExpireDate = tdCont.cell(tempDate);
          var cellPtName = tdCont.cell(cellData.ptName);
          var linkEdit = tdCont.cell($("<a href='javascript:void(0);'>修改</a>"));
          linkEdit.click(tdCont.editStockIn(cellData.siId));
          var linkDel = tdCont.cell($("<a href='javascript:void(0);'>删除</a>"));
          linkDel.click(tdCont.delStockIn(cellData.siId));
          row.append(cellName);
          row.append(cellNum);
          row.append(cellAmount);
          row.append(cellSupplier);
          row.append(cellPtName);
          row.append(cellExpireDate);
          row.append(linkEdit);
          row.append(linkDel);
          $("#stockInRecodes").append(row);
        };

      }
    }
  })
}


/**
 * load payment type
 * @return {null} 
 */
function loadPaymenttypes() {
  $.ajax({
    type: 'GET',
    url: '/paymenttypes',
    success: function(data) {
      if (data.statusCode === 0) {
        for (var i = 0; i < data.data.length; i++) {
          var temp = "<option value='" + data.data[i].ptId + "'>" + data.data[i].ptName + "</option>";
          $("#payStatus").append(temp);
          $("#payStatusIn").append(temp);
        };
        $('#payStatus').selectpicker();
        $('#payStatusIn').selectpicker();
      }
    }
  });
}

/**
 * load departments
 * @return {null} 
 */
function loadDepartments() {
  $.ajax({
    type: 'GET',
    url: '/departments',
    success: function(data) {
      if (data.statusCode === 0) {
        for (var i = 0; i < data.data.length; i++) {
          var temp = "<option value='" + data.data[i].departmentId + "'>" + data.data[i].departmentName + "</option>";
          //$("#giftSendDepart").append(temp);
          //$("#giftApplyDepart").append(temp);
        }
        //$('#giftApplyDepart').selectpicker();
        //$('#giftSendDepart').selectpicker();

      }
    }
  });
}

/**
 * load gifts
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
          $("#giftType").append(temp);
          $("#giftTypeIn").append(temp);
        };
        $('#giftType').selectpicker();
        $('#giftTypeIn').selectpicker();
        $("#giftType").change(function() {
          $("#giftAcount").val(data.data[$("#giftType").prop("selectedIndex") - 1].price * $("#giftSize").val());
        });
        $("#giftSize").keyup(function() {
          $("#giftAcount").val(data.data[$("#giftType").prop("selectedIndex") - 1].price * $("#giftSize").val());
        });
        $("#giftTypeIn").change(function() {
          $("#giftAcount2").val(data.data[$("#giftTypeIn").prop("selectedIndex") - 1].price * $("#giftSize2").val());
        });
        $("#giftSize2").keyup(function() {
          $("#giftAcount2").val(data.data[$("#giftTypeIn").prop("selectedIndex") - 1].price * $("#giftSize2").val());
        });
      }
    }
  });
}

/**
 * load stock in types
 * @return {null} 
 */
function loadStockintypes() {
  $.ajax({
    type: 'GET',
    url: '/stockintypes',
    success: function(data) {
      if (data.statusCode === 0) {
        for (var i = 0; i < data.data.length; i++) {
          var temp = "<option value='" + data.data[i].sitId + "'>" + data.data[i].typeName + "</option>";
          $("#siTypeIdSelect").append(temp);
        };
        $('#siTypeIdSelect').selectpicker();
      }
    }
  });
}