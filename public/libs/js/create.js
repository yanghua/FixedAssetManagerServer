function loadEditDate (assetId) {
	if(assetId){
		$.ajax({
			typeId:"GET",
			url:"/fixedasset/"+assetId+"/info",
			success:function (data) {
				if (data.statusCode===0) {
					
				}
			}
		});
	}
}
/**
 * load faInfo from Data and show them
 * @param  {string} faId faId
 * @return {null}      
 */
function loadFaInfoFromRenderData (faId) {
	$.ajax({
		type:"GET",
		url:"/fixedasset/"+faId+"/info",
		success:function (data) {
			if(data.statusCode===0){
				var faDetail = data.data.faDetail;
				$("#newId").val(faDetail.newId);
				$('#fatypeSelect').selectpicker('val', faDetail.typeId);
				$('#conpanySelect').selectpicker('val', faDetail.companyId);
				$("#assetName").val(faDetail.assetName);
				$("#assetBelong").val(faDetail.assetBelong);
				$("#brand").val(faDetail.brand);
				$("#model").val(faDetail.model);
				$("#specifications").val(faDetail.specifications);
				$("#price").val(faDetail.price);
				$("#serviceCode").val(faDetail.serviceCode);
				$("#mac").val(faDetail.mac);
				$("#remark1").val(faDetail.remark1);
				$("#remark2").val(faDetail.remark2);
				$("#oldId").val(faDetail.oldId);
				$("#userId").val(faDetail.userId);
				$("#departmentId").val(faDetail.departmentId);
				$("#purchaseDate").val(faDetail.purchaseDate);
				$("#possessDate").val(faDetail.possessDate);
				$("#reject").val(faDetail.reject);
				$("#rejectDate").val(faDetail.rejectDate);
				$("#qrcode").val(faDetail.qrcode);
			}
		}
	});
}

/**
 * submit click
 * @return {null} 
 */
function loadSubmitClickEvent(faId) {
	$("button#submit").click(function(){
		//existence 
		$.ajax({
			type:"GET",
			url:"/fixedasset/"+$("#newId").val()+"/existence",
			success:function(data) {
				if(data.data===0){
					$.ajax({
						type: "POST",
						url: "/fixedasset/insertion",
						data: $('form.contact').serialize(),
						success: function(msg){
							if (msg.statusCode===0) {
								bootbox.alert("入库成功!");
							}
						},
						error: function(){
							bootbox.alert("入库失败!");
						}
					});
				}else{
					if (faId) {
						$.ajax({
							type: "POST",
							url: "/fixedasset/"+faId+"/modification",
							data: $('form.contact').serialize(),
							success: function(msg){
								if (msg.statusCode===0) {
									bootbox.alert("更新成功!");
								}
							},
							error: function(){
								bootbox.alert("更新失败");
							}
						});
					}else{
						bootbox.alert("此编号已存在，请更换");
					}
					
				}
			}
		});
		
	});
}

/**
 * load companies and types using ajax and fill their to selecters
 * @return {null} 
 */
function updateCompaniesAndTypes () {
	$.ajax({
		type:"GET",
		url:"/fatypes",
		success:function(data) {
			if (data.statusCode===0) {
				for (var i =0 ; i<data.data.length;i++) {
					var temp = "<option value='" + data.data[i].typeId+"'>" + 
					data.data[i].typeName + "</option>";
					$("#fatypeSelect").append(temp);
				}
				$('#fatypeSelect').selectpicker();
				
			}

		},
		error:function() {
				// body...
			}
		});
	$.ajax({
		type:"GET",
		url:"/companies",
		success:function (data) {
			if (data.statusCode===0) {
				for (var i = 0; i < data.data.length; i++) {
					var temp = "<option value='"+data.data[i].companyId+"'>" + 
					data.data[i].companyName + "</option>";
					$("#conpanySelect").append(temp);
				}
				$('#conpanySelect').selectpicker();
			}
		}
	});
}