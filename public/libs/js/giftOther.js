/**
 * load ajax upload 
 * @return {null} 
 */
function loadAjaxUpload() {
	var oBtn = document.getElementById("giftUpload");
	var oShow = document.getElementById("uploadedName");
	var oRemind = document.getElementById("errorRemind");

	new AjaxUpload($("#giftUpload"),{
		action:"/stockin/import",
		name:"file_source",
		responseType:"JSON",
		onSubmit:function(file,ext){
			if(ext && /^(xls|xlsx)$/.test(ext)){
				oBtn.value = "正在上传…";
				//oBtn.disabled = "disabled";

			}else{	
				oRemind.style.color = "#ff3300";
				oRemind.innerHTML = "不支持其他格式，请上传Excel文件！";
				return false;
			}
		},
		onComplete:function(file,response){
			if (!response.statusCode) {
				oBtn.value = "上传成功,继续上传?";
				oRemind.innerHTML = "";
			}
		}
	});
}

/**
 * to export excel about stockIn
 * @return {null} 
 */
function exportStockInExcel () {
	window.location.href= "/stockin/export";
}

/**
 * to export excel about stockOut
 * @return {null} 
 */
function exportStockOutExcel () {
	window.location.href= "/stockout/export";
}

/**
 * to export excel about stockIn
 * @return {null} 
 */
function exportInventoryExcel () {
	window.location.href= "/inventory/export";
}