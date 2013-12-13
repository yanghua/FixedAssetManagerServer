$(function() {
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
									$('#submit').popover('show');
									setInterval(function(){
										$('#submit').popover('destroy');
									},700);
								}
							},
							error: function(){
								alert("failure");
							}
						});
					}else{
						alert("此编号已存在，请更换");
					}
				}
			});
			
		});
});
