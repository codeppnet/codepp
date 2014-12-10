g_init_list.push(function (){
	$(window).resize(function (e){
		$("#wait_page").css({"width":$(this).width()+"px",
			"height":$(this).height()+"px"});
	});
	$(window).trigger("resize");
});
