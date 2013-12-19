function manageLoad() {
  $("li[class='active']").removeAttr("class");
  $("#manage").addClass("active");
  $("#assetDetails").hide();
  $("#assetEvent").hide();
  $("#underName").hide();
  //$("#noUserAsset").hide();
  $('#baseType').selectpicker();
  $.ajax({
    type: 'GET',
    url: '/departments',
    success: function(data) {
      if (data.statusCode === 0) {
        for (var i = 0; i < data.data.length; i++) {
          var temp = "<option value='" + data.data[i].departmentId + "'>" + data.data[i].departmentName + "</option>";
          $("#assetDepAlloc").append(temp);
          $("#assetDepartSel").append(temp);
          $("#assetDepUnderSearch").append(temp);
        }
        $('#assetDepAlloc').selectpicker();
        $("#assetDepartSel").selectpicker();
        $('#assetDepUnderSearch').selectpicker();

      }
    }
  });
  $.ajax({
    type: 'GET',
    url: '/fatypes',
    success: function(data) {
      if (data.statusCode === 0) {
        for (var i = 0; i < data.data.length; i++) {
          var temp = "<option value='" + data.data[i].typeId + "'>" + data.data[i].typeName + "</option>";
          $("#assetTypeSel").append(temp);

        }
        $('#assetTypeSel').selectpicker();
      }
    }
  });
  $.ajax({
    type: "GET",
    url: "/fixedasset/conditionInfo",
    success: function(data) {
      if (data.statusCode === 0) {
        var i , temp;
        for (i = 0; i < data.data.status.length; i++) {
          temp = "<option value='" + data.data.status[i].currentStatus + "'>" + data.data.status[i].currentStatus + "</option>";
          $("#currentStaSel").append(temp);
        }
        for (i = 0; i < data.data.belong.length; i++) {
          temp = "<option value='" + data.data.belong[i].assetBelong + "'>" + data.data.belong[i].assetBelong + "</option>";
          $("#assetBelongSel").append(temp);
        }
        $('#currentStaSel').selectpicker();
        $('#assetBelongSel').selectpicker();
      }
    }
  });

}

/**
 * search order by userId or assetId
 * @return {null}
 */
function btnPrintClick() {
  $("#assetDetails").hide();
  $("#assetEvent").hide();
  $("#underName").hide();
  if ($("#baseType").val() === "0") {
    var qrCode = $("#baseInput").val();
    if (qrCode) {
      loadAssetDetails(qrCode);
      $("#assetDetails").after($("#underName").clone());
      $("#underName").remove();
    } else {
      bootbox.alert("请输入编号后查询!");

    }
  } else {
    $("#assetDetails").hide();
    $("#assetEvent").hide();
    $("#underName").hide();
    if ($("#baseInput").val()) {
      loadUnderName($("#baseInput").val());
    } else {
      bootbox.alert("请输入人员编号后查询!");

    }
    $("#underName").after($("#assetDetails").clone());
    $("#assetDetails").remove();
  }
}
/**
 * load assetDetails
 * @param  {string} qrCode
 * @return {null}
 */
function loadAssetDetails(qrCode) {
  $.ajax({
    type: 'POST',
    url: '/fixedasset/inspection',
    data: {
      'qrCode': qrCode
    },
    success: function(data) {
      $("#assetDetails").hide();
      $("#assetEvent").hide();
      $("#underName").hide();
      if (data.statusCode === 0) {
        $("#assetDetails").show();
        $("#assetDetails ul").html("");
        var det = data.data.faDetail;
        var $assetDetailsul = $("#assetDetails ul");
        var temp = '<li class="list-group-item">';
        if (det.newId) {
          $assetDetailsul.append(temp + '设备编号:' + det.newId + '</li>');
          $("#the_new_id").val(det.newId);
        } else {
          bootbox.alert("设备不存在!");
        }
        if (det.typeId) {
          if (data.data.typeInfo.typeName == det.assetName) {
            $assetDetailsul.append(temp + '设备名称:' + data.data.typeInfo.typeName + '</li>');
          } else {
            $assetDetailsul.append(temp + '设备名称:' + data.data.typeInfo.typeName + '-> ' + det.assetName + '</li>');
          }
        }
        if (det.oldId) {
          $assetDetailsul.append(temp + '旧编号:' + det.oldId + '</li>');
        }
        if (det.userId) {
          $assetDetailsul.append(temp + '领用人:' + data.data.userInfo.userName + '</li>');
          loadUnderName(det.userId);
        }
        if (det.departmentId) {
          $assetDetailsul.append(temp + '部门:' + data.data.deptInfo.departmentName + '</li>');
        }
        if (det.assetBelong) {
          $assetDetailsul.append(temp + '资产归属:' + det.assetBelong + '</li>');
        }
        if (det.currentStatus) {
          $assetDetailsul.append(temp + '当前状态:' + det.currentStatus + '</li>');
        }
        if (det.brand) {
          $assetDetailsul.append(temp + '品牌:' + det.brand + '</li>');
        }
        if (det.model) {
          $assetDetailsul.append(temp + '型号:' + det.model + '</li>');
        }
        if (det.specifications) {
          $assetDetailsul.append(temp + '规格:' + det.specifications + '</li>');
        }
        if (det.price > 0) {
          $assetDetailsul.append(temp + '价格:' + det.price + '</li>');
        }
        if (det.purchaseDate && det.purchaseDate != '0000-00-00') {
          $assetDetailsul.append(temp + '采购日期:' + det.purchaseDate.substring(0, 10) + '</li>');
        }
        if (det.possessDate && det.possessDate != '0000-00-00') {
          $assetDetailsul.append(temp + '领用日期:' + det.possessDate + '</li>');
        }
        if (det.serviceCode) {
          $assetDetailsul.append(temp + '快速服务代码:' + det.serviceCode + '</li>');
        }
        if (det.mac) {
          $assetDetailsul.append(temp + 'MAC地址:' + det.mac + '</li>');
        }
        if (det.reject > 0) {
          $assetDetailsul.append(temp + '已报废 <button type="button" onclick="onMakeSureClick()" class="btn btn-warning">取消报废</button>' + '</li>');
          if (det.rejectDate && det.rejectDate != '0000-00-00') {
            $assetDetailsul.append(temp + '报废时间:' + det.rejectDate + '</li>');
          }
        } else {
          $assetDetailsul.append(temp + '未报废</li>');
        }
        //add history 
        loadAssetEvevt(det.newId);

      }
      if (data.statusCode == 1) {
        $('#twoSearch').popover('show');
        setInterval(function() {
          $('#twoSearch').popover('destroy');
        }, 1000);
      }

    }
  });

}

/**
 * load asset bref info under user name
 * @param  {string} userId
 * @return {null}
 */
function loadUnderName(userId) {
  $.ajax({
    type: 'GET',
    url: '/user/' + userId + '/fixedassets',
    success: function(data) {
      if (data.statusCode === 0) {

        if (data.data.length) {
          $("#underName").show();
          $("#addtr").html("");
          for (var i = 0; i < data.data.length; ++i) {
            var cellData = data.data[i];
            var row = searchNoUserContainer.createRowContainer();
            var cellNum = searchNoUserContainer.createCellContainer(i);
            var cellId = searchNoUserContainer.createCellContainer(cellData.newId);
            var cellName = searchNoUserContainer.createCellContainer(cellData.assetName);
            var link = $("<a href='javascript:void(0);'>详情</a>");
            var linkDrop = $("<a href='javascript:void(0);'>回收</a>");
            var linkOther = $("<a data-toggle='modal' href='javascript:void(0);'>改派</a>");
            link.click(searchNoUserContainer.itemClick2(cellData.newId));
            linkDrop.click(searchNoUserContainer.itemClickDrop(cellData.newId, cellData.userId));
            linkOther.click(searchNoUserContainer.itemClickOther(cellData.newId));
            var cellDetail = searchNoUserContainer.createCellContainer(link);
            var cellDrop = searchNoUserContainer.createCellContainer(linkDrop);
            var cellOther = searchNoUserContainer.createCellContainer(linkOther);
            row.append(cellNum);
            row.append(cellId);
            row.append(cellName);
            row.append(cellDetail);
            row.append(cellDrop);
            row.append(cellOther);
            $("#addtr").append(row);
          }
        } else {
          $('#twoSearch').popover('show');
          setInterval(function() {
            $('#twoSearch').popover('destroy');
          }, 1000);

        }

      }
    }
  });
}
/**
 * load asset change event
 * @param  {string} aetid
 * @return {null}
 */
function loadAssetEvevt(aetid) {
  $.ajax({
    type: 'GET',
    url: '/fixedasset/' + aetid + '/history',
    success: function(data) {
      if (data.statusCode === 0) {
        if (data.data.length > 0) {
          $("#assetEvent").show();
          $("#historyul").html("");

          for (var i = 0; i < data.data.length; ++i) {
            $("#historyul").append();
            var eve = data.data[i];
            var temp = "<li class='list-group-item'>";
            var eTime = eve.aeTime.substring(0, 10);
            switch (eve.aetpId) {
              case 3:
                $("#historyul").append(temp + " 设备 : " + eve.atId + " 于 " + eTime + eve.aetName + " 至 " + eve.userName + "(" + eve.userId + ")" + "</li>");
                break;
              case 4:
                $("#historyul").append(temp + " 设备 : " + eve.atId + " 于 " + eTime + " 从 " + eve.userName + "(" + eve.userId + ")名下 " + eve.aetName + "</li>");
                break;
              default:
                $("#historyul").append(temp + " 设备 : " + eve.atId + " 于 " + eTime + eve.aetName + "</li>");
                break;
            }
          }
          $("#historyul li:odd").addClass("evenClass");
        } else {
          $("#assetEvent").hide();
          $("#historyul").html("");
        }
      }

    }
  });
}
/**
 * the make sure reject an asset
 * @return {null}
 */
function onMakeSureClick() {
  bootbox.confirm("确定报废该设备?", function(result) {
    if (result) {
      $.ajax({
        type: 'POST',
        url: '/fixedasset/rejection',
        data: {
          'faId': $("#the_new_id").val(),
          'reject': 1
        },
        success: function(data) {
          if (data.statusCode === 0) {
            loadAssetDetails($("#the_new_id").val());
          }
        }
      });
    }
  });
}

var searchNoUserContainer = {
  createCellContainer: function(item) {
    return $("<td></td>").html(item);
  },

  createRowContainer: function() {
    return $("<tr></tr>");
  },
  itemClick: function(value) {
    return function() {
      loadAllocToUser(value);
    };
  },
  userIdClick: function(userId,fromPage) {
    return function() {
      addUserIdToInput(userId,fromPage);
    };
  },
  itemClick2: function(value) {
    return function() {
      loadAssetDetails(value);
    };
  },
  itemClickDrop: function(value, value2) {
    return function() {
      loadReturnAsset(value, value2);
    };
  },
  itemClickOther: function(value) {
    return function() {
      loadSendOther(value);
    };
  },
  operateClick: function(assetId, userId) {
    return function() {
      $("#operateModal").modal('show');
      $("#recycleButton").click(function() {
        loadReturnAsset(assetId, null);
      });
      $("#rejectButton").click(function() {
        loadRejectAsset(assetId);
      });
      $("#editAssetButton").click(function() {
        loadEditAsset(assetId);
      });
      $("#assetAlloctionToSomeOne").click(function() {
        assetAllocateToSomeOne(assetId);
      });
      $("#checkUserIdByName").click(function() {
        assetCheckUserIdByUserName($("#userNameInput").val(),null);
      });
     
    };
  }
};



/**
 * search the retrieve assets
 * @param  {string} pageIndex page
 * @return {null}
 *
 *   */
function retrieveSearch(pageIndex) {
  $.ajax({
    type: "POST",
    url: "/fixedasset/retrieve",
    data: {
      departmentId: $('#assetDepartSel').val(),
      typeId: $('#assetTypeSel').val(),
      assetBelong: $('#assetBelongSel').val(),
      currentStatus: $('#currentStaSel').val(),
      page: pageIndex
    },
    success: function(data) {
      if (data.statusCode === 0) {
        if (data.data.fixedAssets.length) {
          //$("#underName").show();
          $("#dataSearchDetail").html("");
          $("#viewTitle").html("");
          $("#viewTitle").append("查询结果__总数:" + data.data.total.totalCount);
          for (var i = 0; i < data.data.fixedAssets.length; ++i) {
            var cellData = data.data.fixedAssets[i];
            var row = searchNoUserContainer.createRowContainer();
            var cellNum = searchNoUserContainer.createCellContainer(cellData.newId);
            var cellId = searchNoUserContainer.createCellContainer(cellData.assetName);
            var cellName = searchNoUserContainer.createCellContainer(cellData.specifications);
            var cellDetail;
            if (cellData.userId) {
              cellDetail = searchNoUserContainer.createCellContainer(cellData.userId + "(" + cellData.userName + ")");
            } else {
              cellDetail = searchNoUserContainer.createCellContainer(null);
            }
            var link = $("<a href='javascript:void(0);'>操作</a>");
            link.click(searchNoUserContainer.operateClick(cellData.newId, cellData.userId));
            var cellOperation = searchNoUserContainer.createCellContainer(link);

            row.append(cellNum);
            row.append(cellId);
            row.append(cellName);
            row.append(cellDetail);
            row.append(cellOperation);
            $("#dataSearchDetail").append(row);
            if (data.data.total.totalCount > 50) {
              $('#viewPaginator').show();
              $('#viewPaginator').pagination({
                items: data.data.total.totalCount,
                itemsOnPage: 50,
                currentPage: pageIndex,
                cssStyle: 'light-theme',
                onPageClick: function(pageNum) {
                  retrieveSearch(pageNum);
                }
              });
            } else {
              $('#viewPaginator').hide();
            }
          }
        } else {
          $('#viewPaginator').hide();
          $("#dataSearchDetail").html("未查询到相关数据!");
          $("#viewTitle").html("");
          $("#viewTitle").append("查询结果");
        }
      }
    },
    error: function() {
      alert("出错");
    }


  });
}
/**
 * load return asset
 * @param  {string} assetId assetId
 * @return {null}
 */
function loadReturnAsset(assetId, userId) {
  bootbox.confirm("确认回收吗?", function(result) {
    if (result) {
      $.ajax({
        type: "POST",
        url: "/fixedasset/" + assetId + "/recycle",
        success: function(data) {
          if (data.statusCode === 0) {
            bootbox.alert("资产回收成功!");
            if (userId) {
              loadUnderName(userId);
            }
          }
        }
      });
    }
  });
}

/**
 * the make sure reject an asset
 * @return {null}
 */
function loadRejectAsset(assetId) {
  bootbox.confirm("确定报废该设备?", function(result) {
    if (result) {
      $.ajax({
        type: 'POST',
        url: '/fixedasset/rejection',
        data: {
          'faId': assetId,
          'reject': 1
        },
        success: function(data) {
          if (data.statusCode === 0) {
            bootbox.alert("确定报废该设备?");
          }
        }
      });
    }
  });
}
/**
 * show send to other
 * @param  {string} assetId
 * @return {null}
 */
function loadSendOther(assetId) {
  $('#myModal').modal('show');
  $('#assetUserId').val(assetId);
}

/**
 * sent asset to other user
 * @param  {string} assetId assetId
 * @param  {string} userId  userId
 * @param  {string} depId   departmentId
 * @return {null}
 */
function updateAssetToUser(assetId, userId, depId) {

  $.ajax({
    type: "POST",
    data: {
      'userId': userId,
      'deptId': depId,
      'faId': assetId
    },
    url: "/fixedasset/" + assetId + "/allocation",
    success: function(data) {
      if (data.statusCode === 0) {
        bootbox.alert("操作成功！");
        loadUnderName($("#baseInput").val());
      } else {
        bootbox.alert("操作失败，请联系管理员！");
      }
    }
  });
}

function updateAssetToUser2(argument) {
  if ($("#assetDepAlloc").val() === "0" || !$("#assetUserIdAlloc").val()) {
    bootbox.alert("请选择部门或者输入人员工号后操作!");
  } else {
    $('#myModal').modal('hide');
    updateAssetToUser(
      $('#assetUserId').val(),
      $('#assetUserIdAlloc').val(),
      $('#assetDepAlloc').val()
    );
  }
}
/**
 * change page to edit page with assetID
 * @param  {string } assetId assetId
 * @return {null}
 */
function loadEditAsset(assetId) {
  window.location.href = "/fixedasset/create/" + assetId;
}

/**
 * asset allocation or reallocation
 * @param  {string} assetId assetId
 * @param  {string} userId  userId
 * @param  {string} deptId  departmentId
 * @return {null}
 */
function assetAllocateToSomeOne(assetId) {
  if ($("#assetDepUnderSearch").val() === "0" || !$("#assetUserIdAllocation").val()) {
    bootbox.alert("请选择部门或输入人员工号后操作!");
  } else {
    $.ajax({
      type: "POST",
      data: {
        'userId': $("#assetUserIdAllocation").val(),
        'deptId': $("#assetDepUnderSearch").val(),
        'faId': assetId
      },
      url: "/fixedasset/" + assetId + "/allocation",
      success: function(data) {
        if (data.statusCode === 0) {
          bootbox.alert("操作成功！");
          loadUnderName($("#baseInput").val());
        } else {
          bootbox.alert("操作失败，请联系管理员！");
        }
      }
    });
  }
}

/**
 * check userid by username
 * @return {null}
 */
function assetCheckUserIdByUserName(inputText,fromPage) {
  $.ajax({
    type: "GET",
    url: "/fixedasset/getUserId/" + inputText,
    success: function(data) {
      if (data.statusCode === 0 && data.data.length > 0) {
        $('#userInfoModle').modal('show');
        $("#userInfoDetails").html("");
        var htmlsnip = "";
        for (var i = 0; i < data.data.length; i++) {
          var userInfo = data.data[i];
          var userid = userInfo.userId;
          var link = $("<a href='javascript:void(0);'>" + userInfo.userName + "(" + userInfo.userId + ")--" + userInfo.department.replace(/@/g," ") + "</a>");
          link.click(searchNoUserContainer.userIdClick(userid,fromPage));
          var row = searchNoUserContainer.createRowContainer();
          var cka = searchNoUserContainer.createCellContainer(link);
          row.append(cka);
          $("#userInfoDetails").append(row);
        }
      }
    }
  });
}

/**
 * add selected userid to input box
 * @param {string} userId userId
 */
function addUserIdToInput(userId, fromPage) {
  $('#userInfoModle').modal('hide');
  if(fromPage){
    $("#baseInput").val(userId);
  }else{
    $("#assetUserIdAllocation").val(userId);
  }
 
}

/**
 * check userid by username
 * @return {null}
 */
function assetCheckUserIdByUserName2 () {
  assetCheckUserIdByUserName($("#userNameInput2").val(),2);
}