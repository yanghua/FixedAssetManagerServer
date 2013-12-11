function loadAjaxUpload(companyId) {
	var oBtn = document.getElementById("wiseduExcel");
	var oShow = document.getElementById("uploadedName");
	var oRemind = document.getElementById("errorRemind");

	new AjaxUpload($("#wiseduExcel"),{

		action:"/fixedasset/import/company/"+companyId,
		name:"file_source",
		responseType:"JSON",
		onSubmit:function(file,ext){

			if(ext && /^(xls|xlsx)$/.test(ext)){
				oBtn.value = "正在上传…";
				oBtn.disabled = "disabled";

			}else{	
				oRemind.style.color = "#ff3300";
				oRemind.innerHTML = "不支持其他格式，请上传Excel文件！";
				return false;
			}
		},
		onComplete:function(file,response){
			if (!response.statusCode) {
				//$("#ssss").disabled = "";
				oBtn.value = "上传成功";
				oRemind.innerHTML = "";
			};
		}
	});
}

function bacthExport (companyId) {
	if(companyId-1){
		window.location.href= "/fixedasset/excelExport/2";
	}else{
		window.location.href= "/fixedasset/excelExport/1";
	}
	
}