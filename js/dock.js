g_init_list.push(function() {
	
	function resize(e)
	{
		var left=parseInt($("#bar").css("left"));
		var top=parseInt($("#bar").css("top"));
		var row=(top-7)/44;
		var col=(left-24)/50+1;
		if($(window).width()<535)
		{
			if($("#dock").hasClass("dock_one_row"))
			{
				var left=parseInt($("#bar").css("left"));
				$("#bar").css("top",(Math.floor(col/5)+1)*44+7+"px");
				$("#bar").css("left",(col%5-1)*50+24+"px");
				$("#dock").attr("class","dock_two_row");
				$("#pin").css("margin-left","15px");
			}
		}else
		{
			if($("#dock").hasClass("dock_two_row"))
			{
				var top=parseInt($("#bar").css("top"));
				$("#bar").css("left",(row-1)*50*5+(col-1)*50+24+"px");
				$("#bar").css("top",44+7+"px");
				$("#dock").attr("class","dock_one_row");
				$("#pin").css("margin-left","10px");
			}
		}
	}
	
	$(window).resize(resize);
	
	$("#dock #setting").click(function(e) {
		switch_to_page("setting_page");
    });
	$("html").mousemove(function (e){
					 
	 if($(window).height()-e.clientY<$("#dock").height()+16)
	 {
		 $("#dock").fadeIn();
	 }else
	 {
		 if($("#pin").hasClass("unpinned"))
		 {
			 if($("#config_pen").css("display")=="none"&&
			 	$("#jump_stack_list").css("display")=="none")
			 {
			 	$("#dock").fadeOut();
			 }
		 }
	 }
	}).mouseleave(function (e){
		if($("#pin").hasClass("unpinned"))
		{
			$("#dock").fadeOut();
		}
	 });
	$(".dock_button").bind("mouseover",function (e){
		$("#bar").stop();
		$("#bar").animate({"left":this.offsetLeft+"px"},"fast");
		$("#bar").css({"top":this.offsetTop+
			$(".dock_button").height()+"px"});
	});
	$("#pin").click(function(e) {
		if($(this).hasClass("pinned"))
		{
			$(this).removeClass("pinned");
			$(this).addClass("unpinned");
			$(this).attr("extra","Pin the Dock");
		}else
		{
			$(this).removeClass("unpinned");
			$(this).addClass("pinned");
			$(this).attr("extra","Collapse the Dock");
		}
		$(this).attr("title",display_lang[g_config["display_lang"]][$(this).attr("extra")]);
	});
	resize(null);
	function show_dock_dialog(id)
	{
		$("#"+id).stop();
		$("#"+id).show();
		$("#"+id).animate({opacity:1,"bottom":"110%"});
	}
	function hide_dock_dialog(id)
	{
		$("#"+id).stop();
		$("#"+id).animate({opacity:0},function (){
				$("#"+id).hide();
				$("#"+id).css("bottom","50%");
				$("html").trigger("mousemove");
			});
	}
	hide_dock_dialog("config_pen");
	hide_dock_dialog("jump_stack_list");
	$(document).click(function(e) {
        hide_dock_dialog("config_pen");
		hide_dock_dialog("jump_stack_list");
    });
	$("#pen").click(function(e) {
        if($("#config_pen").css("opacity")==0)
		{
			show_dock_dialog("config_pen");
		}else
		{
			hide_dock_dialog("config_pen");
		}
		hide_dock_dialog("jump_stack_list");
		e.stopPropagation();
    });
	$("#jump_stack_list").click(function(e) {
        e.stopPropagation();
    });
	$("#jump_stack").click(function(e) {
        if($("#jump_stack_list").css("opacity")==0)
		{
			show_dock_dialog("jump_stack_list");
		}else
		{
			hide_dock_dialog("jump_stack_list");
		}
		hide_dock_dialog("config_pen");
		e.stopPropagation();
    });
	$("#pen_weigth>span").click(function(e) {
        g_pen_weight=this.id.split("_")[2];
		$("#pen_weigth>span").removeClass("selected");
		$(this).addClass("selected");
    });
	$("#default_pen,#eraser").click(function(e) {
        if($(this).hasClass("selected"))
		{
			g_cur_cursor_type="cursor";
			$("#default_pen,#eraser").removeClass("selected");
			$("#drawing_board").hide();
		}else
		{
			$("#default_pen,#eraser").removeClass("selected");
			$(this).addClass("selected");
			
			$("#drawing_board").show();
			
			if(g_cur_cursor_type=="cursor")
			{
				var w=$(window).width()>$("body").width()?$(window).width():$("body").width();
				var h=$(window).height()>$("body").height()?$(window).height():$("body").height();
				
				$("#drawing_board").attr("width",w)
				$("#drawing_board").attr("height",h);
			}
			g_cur_cursor_type=this.id;
		}
    });
	$("#config_pen>#pen_color>span").click(function(e) {
        $("#config_pen>#pen_color>span").removeClass("selected");
		$(this).addClass("selected");
		g_pen_color=$(this).find("span").css("background-color");
		echo(g_config);
    });
	
	$("#erase_all_ink").click(function(e) {
        $("#drawing_board").attr("width",$("#drawing_board").attr("width"));
        $("#drawing_board").attr("height",$("#drawing_board").attr("height"));
    });
	
	$("#edit").click(function(e) {
		$("#default_pen,#eraser").removeClass("selected");
		g_cur_cursor_type="cursor";
        switch_to_page("edit_page");
    });
	
	$("#zoomin").click(function(e) {
        $("#display_code").css("font-size","+=2px");
    });
	$("#zoomout").click(function(e) {
        if(parseInt($("#display_code").css("font-size"))>=12)
		{
			$("#display_code").css("font-size","+=-2px");
		}
    });
	
	$("#fold_all").click(function(e) {
		$(".expand span").trigger("click");
        $(".fold_start span").trigger("click");
    });
	
	$("#expand_all").click(function(e) {
		 $(".expand span").trigger("click");
    });
	
	$("#goback").click(function(e) {
        $("html,body").animate({scrollTop:g_last_pos},"fast");
    });
});
