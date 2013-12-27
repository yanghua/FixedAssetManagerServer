var tdCont = {
  cell: function(item) {
    return $("<td></td>").html(item);
  },

  row: function() {
    return $("<tr></tr>");
  },
  operateClick: function(giftId) {
    return function() {
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
  },
  editGift: function (giftId) {
  	return function () {
  		editGiftFunc(giftId);
  	}
  }
};

function editGiftFunc (giftId) {
	bootbox.alert(giftId);
}



function loadGifts() {
        $.ajax({
            url:'/gifts',
            type:'GET',
            success: function (data) {
                if (data.statusCode === 0) {
                    for (var i = 0; i < data.data.length; i++) {
                        var cellData = data.data[i];
                        var row = tdCont.row();
                        //var cellId = tdCont.cell(cellData.giftId);
                        var cellBrand = tdCont.cell(cellData.brand);
                        var cellName = tdCont.cell(cellData.name);
                        var cellUnit = tdCont.cell(cellData.unit);
                        var cellPrice = tdCont.cell(cellData.price);
                        var cellExpireDate = tdCont.cell(cellData.expireDate.substring(0,10));
                        var cellCategoryId = tdCont.cell(cellData.gcname);
                        var linkEdit = tdCont.cell($("<a href='javascript:void(0);'>修改</a>"));
                        linkEdit.click(tdCont.editGift(cellData.giftId));
                        var linkDel = tdCont.cell($("<a href='javascript:void(0);'>删除</a>"));
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
