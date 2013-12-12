/**
 * search order by userId or assetId
 * @return {null}
 */
function btnPrintClick(){  
	$("#assetDetails").hide();
	$("#assetEvent").hide();
	$("#underName").hide();
	if ($("#baseType").val()==0) {
		var qrCode=$("#baseInput").val();
		if (qrCode) {
			loadAssetDetails(qrCode);
			$("#assetDetails").after($("#underName").clone());
			$("#underName").remove();
		}else{
			bootbox.alert("请输入编号后查询!");

		}
	}else{
		$("#assetDetails").hide();
		$("#assetEvent").hide();
		$("#underName").hide();
		if ($("#baseInput").val()) {
			loadUnderName($("#baseInput").val());
		}else{
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
function loadAssetDetails(qrCode){
	$.ajax({ 
		type: 'POST', 
		url: '/fixedasset/inspection', 
			data:{'qrCode':qrCode},
			success: function (data) { 
				$("#assetDetails").hide();
				$("#assetEvent").hide();
				$("#underName").hide();
				if(data.statusCode==0){
					$("#assetDetails").show();
					$("#assetDetails ul").html("");
					var det=data.data.faDetail;
					var $assetDetailsul =  $("#assetDetails ul");
					var temp ='<li class="list-group-item">';
					if (det.newId) {
						 $assetDetailsul.append(temp+'设备编号:'+det.newId+'</li>');
						$("#the_new_id").val(det.newId);
					}else{
						bootbox.alert("设备不存在!");
					}
					if (det.typeId) {
						if (data.data.typeInfo.typeName==det.assetName) {
							 $assetDetailsul.append(temp+'设备名称:'+data.data.typeInfo.typeName+'</li>');
						}else{
							 $assetDetailsul.append(temp+'设备名称:'+data.data.typeInfo.typeName + '-> '+ det.assetName +'</li>');
						}
					}
					if(det.oldId){
						 $assetDetailsul.append(temp+'旧编号:'+det.oldId+'</li>');
					}
					if(det.userId){
						 $assetDetailsul.append(temp+'领用人:'+data.data.userInfo.userName+'</li>');
						loadUnderName(det.userId);
					}
					if(det.departmentId){
						 $assetDetailsul.append(temp+'部门:'+data.data.deptInfo.departmentName+'</li>');
					}
					if(det.assetBelong){
						 $assetDetailsul.append(temp+'资产归属:'+det.assetBelong+'</li>');
					}
					if(det.currentStatus){
						 $assetDetailsul.append(temp+'当前状态:'+det.currentStatus+'</li>');
					}
					if(det.brand){
						 $assetDetailsul.append(temp+'品牌:'+det.brand+'</li>');
					}
					if(det.model){
						 $assetDetailsul.append(temp+'型号:'+det.model+'</li>');
					}
					if(det.specifications){
						 $assetDetailsul.append(temp+'规格:'+det.specifications+'</li>');
					}
					if(det.price>0){
						 $assetDetailsul.append(temp+'价格:'+det.price+'</li>');
					}
					if(det.purchaseDate&&det.purchaseDate!='0000-00-00'){
						 $assetDetailsul.append(temp+'采购日期:'+det.purchaseDate.substring(0,10)+'</li>');
					}
					if(det.possessDate&&det.possessDate!='0000-00-00'){
						 $assetDetailsul.append(temp+'领用日期:'+det.possessDate+'</li>');
					}
					if(det.serviceCode){
						 $assetDetailsul.append(temp+'快速服务代码:'+det.serviceCode+'</li>');
					}
					if(det.mac){
						 $assetDetailsul.append(temp+'MAC地址:'+det.mac+'</li>');
					}
					if(det.reject>0){
						 $assetDetailsul.append(temp+'已报废 <button type="button" onclick="onMakeSureClick()" class="btn btn-warning">取消报废</button>'+'</li>');
						if (det.rejectDate&&det.rejectDate!='0000-00-00') {
							 $assetDetailsul.append(temp+'报废时间:'+det.rejectDate+'</li>');
						};
					}else{
						 $assetDetailsul.append(temp+'未报废</li>');
					}
					//add history 
					loadAssetEvevt(det.newId);

				}
				if(data.statusCode==1){
					$('#twoSearch').popover('show');
					setInterval(function(){
						$('#twoSearch').popover('destroy');
					},1000);	
				}

			}
		});

}

/**
 * load asset bref info under user name
 * @param  {string} userId
 * @return {null}
 */	
function loadUnderName(userId){
	$.ajax({ 
		type: 'GET', 
		url: '/user/'+userId+'/fixedassets', 
		success: function (data) { 
			if(data.statusCode==0){
				function createCellContainer(item){
					return $("<td></td>").html(item);
				}

				function createRowContainer(){
					return $("<tr></tr>");
				}

				function itemClick(value){
					return function(){
						loadAssetDetails(value);
					}
				}
				function itemClickDrop(value,value2){
					return function(){
						loadReturnAsset(value,value2);
					}
				}
				function itemClickOther(value){
					return function(){
						loadSendOther(value);
					}
				}

				if(data.data.length){
					$("#underName").show();
					$("#addtr").html("");
					for (var i = 0; i < data.data.length; ++i) {
						var cellData = data.data[i];
						var row = createRowContainer();
						var cellNum = createCellContainer(i);
						var cellId = createCellContainer(cellData.newId);
						var cellName = createCellContainer(cellData.assetName);
						var link = $("<a href='javascript:void(0);'>详情</a>");
						var linkDrop = $("<a href='javascript:void(0);'>回收</a>");
						var linkOther = $("<a data-toggle='modal' href='javascript:void(0);'>改派</a>");
						link.click(itemClick(cellData.newId));
						linkDrop.click(itemClickDrop(cellData.newId,cellData.userId));
						linkOther.click(itemClickOther(cellData.newId));
						var cellDetail = createCellContainer(link);
						var cellDrop = createCellContainer(linkDrop);
						var cellOther = createCellContainer(linkOther);
						row.append(cellNum);
						row.append(cellId);
						row.append(cellName);
						row.append(cellDetail);
						row.append(cellDrop);
						row.append(cellOther);
						$("#addtr").append(row);
					}
				}else{
					$('#twoSearch').popover('show');
					setInterval(function(){
						$('#twoSearch').popover('destroy');
					},1000);

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
function loadAssetEvevt (aetid) {
	$.ajax({ 
		type: 'GET', 
		url: '/fixedasset/'+aetid+'/history', 
		success: function (data) { 
			if(data.statusCode==0){
				if (data.data.length>0) {
					$("#assetEvent").show();
					$("#historyul").html("");
					
					for (var i = 0; i < data.data.length; ++i) {
						$("#historyul").append();
						var eve=data.data[i];
						var temp = "<li class='list-group-item'>";
						var eTime=eve.aeTime.substring(0,10);
						switch(eve.aetpId)
						{
							case 3:
							$("#historyul").append(temp+" 设备 : "+eve.atId+" 于 "+eTime+eve.aetName+" 至 "+eve.userName+"("+eve.userId+")"+"</li>");
							break;
							case 4:
							$("#historyul").append(temp+" 设备 : "+eve.atId+" 于 "+eTime+" 从 "+eve.userName+"("+eve.userId+")名下 "+eve.aetName+"</li>");
							break;
							default:
							$("#historyul").append(temp+" 设备 : "+eve.atId+" 于 "+eTime+eve.aetName+"</li>");
							break;
						}
					}
					$("#historyul li:odd").addClass("evenClass");
				}else{
					$("#assetEvent").hide();
					$("#historyul").html("");
				}
			}
			
		}
	});
}
/**
 * the make sure reject an asset 
 * @return {[type]}
 */
function onMakeSureClick () {
	bootbox.confirm("确定报废该设备?", function(result) {
		if (result) {
			$.ajax({ 
			type: 'POST', 
			url: '/fixedasset/rejection', 
			data:{'faId':$("#the_new_id").val(),'reject':1},
			success: function (data) { 
				if (data.statusCode==0) {
					loadAssetDetails($("#the_new_id").val());
				};
			}
			})
		};
		
	})
	
};
/**
 * search asset without user about 
 * @param  {string} depId     部门id
 * @param  {string} typeId    资产类型id
 * @param  {string} pageIndex 分页
 * @return {null} 
 */
function searchNoUser (pageIndex) {
	$.ajax({ 
		type: 'GET', 
		url: '/department/'+$("#assetDep").val()+'/idelfixedasset/type/'+$("#assetTypes").val()+'/page/'+pageIndex,
		success: function (data) { 
			if (data.statusCode==0) {
				function createCellContainer(item){
					return $("<td></td>").html(item);
				}

				function createRowContainer(){
					return $("<tr></tr>");
				}

				function itemClick(value){
					return function(){
						loadAllocToUser(value);
					}
				}
				$("#noUserAsset").show();
				$("#addtrAs").html("");
				if(data.data.total){
					
					for (var i = 0; i < data.data.idelFAList.length; ++i) {
						var cellData = data.data.idelFAList[i];
						var row = createRowContainer();
						var cellNum = createCellContainer(i);
						var cellId = createCellContainer(cellData.newId);
						var cellName = createCellContainer(cellData.assetName);
						var link = $("<a href='javascript:void(0);'>派发</a>");
						link.click(itemClick(cellData.newId));
						var cellDetail = createCellContainer(link);
						row.append(cellNum);
						row.append(cellId);
						row.append(cellName);
						row.append(cellDetail);
						$("#addtrAs").append(row);
					}
				}else{
					$("#addtrAs").html("");
				}
			};
		}
	})
}
/**
 * alloc asset to user
 * @param  {string} assetId 
 * @return {null}         
 */
function loadAllocToUser (assetId) {
	if($("#assetDep2").val()!=0){
		bootbox.prompt("请输入人员编号：", function(userId) {                
			if (userId === null) {                                             

			} else {
				if (userId){
					$.ajax({
						type:"POST",
						data:{'userId':userId,
						'deptId':$("#assetDep2").val(),
						'faId':assetId},
						url:"/fixedasset/"+assetId+"/allocation",
						success:function (data) {
							if (data.statusCode==0) {
								bootbox.alert("操作成功！");
							}else{
								bootbox.alert("操作失败，请联系管理员！");
							}
						}
					});
				}                          
			}
		});
	}else{
		bootbox.alert("请输入设备将被分配至的部门!");
	}

}
/**
 * search the retrieve assets
 * @param  {string} pageIndex page
 * @return {null}           
 * 
 *   */
function retrieveSearch (pageIndex) {
	$.ajax({
		type: "POST",
		url: "/fixedasset/retrieve",
		data: {departmentId:$('#assetDepartSel').val(),typeId:$('#assetTypeSel').val(),
		assetBelong:$('#assetBelongSel').val(),currentStatus:$('#currentStaSel').val(),
		page:pageIndex},
		success: function(data){
			if (data.statusCode==0) {

				function createCellContainer(item){
					return $("<td></td>").html(item);
				}

				function createRowContainer(){
					return $("<tr></tr>");
				}

					// function itemClick(value){
					// 	return function(){
					// 		//loadAssetDetails(value);
					// 	}
					// }
					if(data.data.fixedAssets.length){
						//$("#underName").show();
						$("#dataSearchDetail").html("");
						$("#viewTitle").html("");
						$("#viewTitle").append("查询结果__总数:"+data.data.total.totalCount);
						for (var i = 0; i < data.data.fixedAssets.length; ++i) {
							var cellData = data.data.fixedAssets[i];
							var row = createRowContainer();
							var cellNum = createCellContainer(cellData.newId);
							var cellId = createCellContainer(cellData.assetName);
							var cellName = createCellContainer(cellData.specifications);
							var cellDetail = createCellContainer(cellData.userId);
							row.append(cellNum);
							row.append(cellId);
							row.append(cellName);
							row.append(cellDetail);
							$("#dataSearchDetail").append(row);
							if(data.data.total.totalCount>50){
								$('#viewPaginator').show();
								$('#viewPaginator').pagination({
									items: data.data.total.totalCount,
									itemsOnPage: 50,
									currentPage: pageIndex,
									cssStyle: 'light-theme',
									onPageClick: function(pageNum){
										retrieveSearch(pageNum);
									}
								});
							}else{
								$('#viewPaginator').hide();
							}
						}
					}else{
						$("#dataSearchDetail").html("未查询到相关数据!");
					}
				};
			},
			error: function(){
				alert("出错");
			}


		})
}
/**
 * load return asset 
 * @param  {string} assetId assetId
 * @return {null}        
 */
function loadReturnAsset (assetId,userId) {
	bootbox.confirm("确认回收吗?", function(result) {
		$.ajax({
			type:"POST",
			url:"/fixedasset/"+assetId+"/recycle",
			success:function (data) {
				if(data.statusCode==0){
					bootbox.alert("资产回收成功!");
					loadUnderName(userId);
				}
			}
		})
		
	}); 

}
/**
 * show send to other 
 * @param  {string} assetId 
 * @return {null}         
 */
function loadSendOther (assetId) {
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
function updateAssetToUser (assetId,userId,depId) {

	$.ajax({
		type:"POST",
		data:{'userId':userId,
		'deptId':depId,
		'faId':assetId},
		url:"/fixedasset/"+assetId+"/allocation",
		success:function (data) {
			if (data.statusCode==0) {
				bootbox.alert("操作成功！");
				loadUnderName($("#baseInput").val());
			}else{
				bootbox.alert("操作失败，请联系管理员！");
			}
		}
	});
}
function updateAssetToUser2 (argument) {

	if ($("#assetDepAlloc").val()==0||!$("#assetUserIdAlloc").val()) {
		bootbox.alert("请选择部门或者输入人员工号后操作!")
	}else{
		$('#myModal').modal('hide');
		updateAssetToUser(
			$('#assetUserId').val(),
			$('#assetUserIdAlloc').val(),
			$('#assetDepAlloc').val()
		);
	}

}

