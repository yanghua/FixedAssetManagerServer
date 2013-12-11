function btnPrintClick(){  
	window.print();  
}    
function btnResearch () {
	var $dp1 = $("#dpd1"),
	$dp2 = $("#dpd2"),
	d1 = new Date($dp1.val()).getTime(),
	d2 = new Date($dp2.val()).getTime();
	if(d1>=d2){
		bootbox.alert("时间选择错误！后者需大于前者！");
	}else{
		window.location.href="/fixedasset/printservice/1/"+d1+"/"+d2;
	}
}      