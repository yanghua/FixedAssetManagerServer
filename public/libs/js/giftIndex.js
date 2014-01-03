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
        $('#giftSendDepart').selectpicker('val', cellData.underDept);
        $('#giftApplyDepart').selectpicker('val', cellData.applyDeptId);
        $('#payStatus').selectpicker('val', cellData.ptId);
      }
    }
  })
}

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

function outOpearteClick(edit) {
  //without check
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


function inOpearteClick(edit) {
  //without check 
  
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

function getStockOutRecord() {
  $.ajax({
    url: '/stockouts',
    type: 'POST',
    success: function(data) {
      if (data.statusCode === 0) {
        //bootbox.alert(data.data[0].soId);
        $("#stockOutRecodes").html("");
        for (var i = 0; i < data.data.length; i++) {
          var cellData = data.data[i];
          var row = tdCont.row();
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
          var cellDepartmentName = tdCont.cell(cellData.departmentName);
          //var cellApplyDept = tdCont.cell(cellData.)
          var cellPtName = tdCont.cell(cellData.ptName);
          var linkEdit = tdCont.cell($("<a href='javascript:void(0);'>修改</a>"));
          linkEdit.click(tdCont.editStockOut(cellData.soId));
          var linkDel = tdCont.cell($("<a href='javascript:void(0);'>删除</a>"));
          linkDel.click(tdCont.delStockOut(cellData.soId));
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

function getStockInRecord() {
  $.ajax({
    url: '/stockins',
    type: 'POST',
    success: function(data) {
      if (data.statusCode === 0) {
        //bootbox.alert(data.data[0].soId);
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
          //var cellApplyDept = tdCont.cell(cellData.)
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



function loadPaumenttypes() {
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

function loadDepartments() {
  $.ajax({
    type: 'GET',
    url: '/departments',
    success: function(data) {
      if (data.statusCode === 0) {
        for (var i = 0; i < data.data.length; i++) {
          var temp = "<option value='" + data.data[i].departmentId + "'>" + data.data[i].departmentName + "</option>";
          $("#giftSendDepart").append(temp);
          $("#giftApplyDepart").append(temp);
        }
        $('#giftApplyDepart').selectpicker();
        $('#giftSendDepart').selectpicker();

      }
    }
  });
}


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