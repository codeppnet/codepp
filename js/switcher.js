var Switcher={"init":function (id,state_change){
		var s=document.createElement("SPAN");
		$(s).addClass("btn");
		$("#"+id).get(0).appendChild(s);
		$(s).css("left","0");
		$("#"+id).click(function(e) {
        	if($(s).css("left")!="0px")
			{
				$(s).css("left",0);
				$(s).css("right","auto");
				state_change(0);
			}else
			{
				$(s).css("left","auto");
				$(s).css("right","0");
				state_change(1);
			}
        });
	}};
