function fill_color_to_list()
{
	List.clear("color_list");
	for(var i in g_config["syntax_color"])
	{
		if(g_cur_change_color=="")
		{
			g_cur_change_color=i;
		}
		List.addItem("color_list",i,g_config["syntax_color"][i]);
	}
}
//改变当前显示语言
function change_display_lang()
{
	$(".show_text").each(function(index, element) {
		if("CSSFONT" in display_lang[g_config["display_lang"]])
		{
			$(element).css("font-family",display_lang[g_config["display_lang"]]["CSSFONT"]);
		}else
		{
			$(element).css("font-family","inherit");
		}
		$(element).html(display_lang[g_config["display_lang"]][$(element).attr("extra")]);
	});
	
	$(".title_show_text").each(function(index, element) {
        $(element).attr("title",display_lang[g_config["display_lang"]][$(element).attr("extra")]);
    });
	app.saveConfig();
}
//根据cur_display_lang选中列表框中的项目
function select_list_item()
{
	$("#setting_language ul li a").each(function(index, element){
		$(element).html($(element).text().replace(/\<.+\>/,""));
	});
	$("#setting_language ul li").each(function(index, element){
		if($(element).attr("value")==g_config["display_lang"])
		{
			$(element).find("a").text($(this).find("a").text()+
				"<"+display_lang[g_config["display_lang"]]["Default"]+">");
		}
	});
}
g_init_list.push(function(){

	function resize(e)
	{
		if($(window).height()-80<parseInt($("#leftbar").css("min-height")))
		{
			$("#leftbar").height(parseInt($("#leftbar").css("min-height")));
		}else
		{
			$("#leftbar").height($(window).height()-80);
		}
	}
	resize();
	change_display_lang();
	select_list_item();
	
	function color_change()
	{
		g_config["syntax_color"][g_cur_change_color]="#";
			$("#change_color>div input").each(function(index, element) {
				var val=parseInt($(element).val());
				if(isNaN(val)) val=0;
                g_config["syntax_color"][g_cur_change_color]+=(("00"+parseInt(val).toString(16)).substr(-2,2));
            });
		//echo(g_config["syntax_color"][cur_change_color]);
		var c=g_config["syntax_color"][g_cur_change_color];
		//echo(c);
		s_color_r.setVal(parseInt(c.substr(1,2),16)/255);
		s_color_g.setVal(parseInt(c.substr(3,2),16)/255);
		s_color_b.setVal(parseInt(c.substr(5,2),16)/255);
		List.setSelectedItemColor("color_list",c);
/*		echo(g_config["syntax_color"][cur_change_color]);*/
		$("#color_preview>div").css("background-color",g_config["syntax_color"][g_cur_change_color]);
		$("."+remove_space_and_uppercase(g_cur_change_color)).
			css("color",g_config["syntax_color"][g_cur_change_color]);
			
		app.saveConfig();
	}
	
	//初始化滑块
	var s_color_r=Slider.init("color_r","#cc3333",function (value){
			$("#color_r").parent().find("input").val(parseInt(255*value));
			color_change();
		});
	var s_color_g=Slider.init("color_g","#4cb569",function (value){
			$("#color_g").parent().find("input").val(parseInt(255*value));
			color_change();
		});
	var s_color_b=Slider.init("color_b","#4db5b1",function (value){
			$("#color_b").parent().find("input").val(parseInt(255*value));
			color_change();
		});
	
	$("#change_color>div input").bind("input",function (){
			color_change();
		});
	$("#reset").click(function(e) {
        var c=g_config["old_syntax_color"][g_cur_change_color];
		s_color_r.setVal(parseInt(c.substr(1,2),16)/255,true);
		s_color_g.setVal(parseInt(c.substr(3,2),16)/255,true);
		s_color_b.setVal(parseInt(c.substr(5,2),16)/255,true);
    });
	//增加颜色内容到颜色list
	g_cur_change_color="";
	List.addClickListener("color_list",function (index,str){
			g_cur_change_color=str;
			var c=g_config["syntax_color"][g_cur_change_color];
			s_color_r.setVal(parseInt(c.substr(1,2),16)/255,true);
			s_color_g.setVal(parseInt(c.substr(3,2),16)/255,true);
			s_color_b.setVal(parseInt(c.substr(5,2),16)/255,true);
		})
	
	//初始化行号切换控件
	Switcher.init("line_number_switcher",function (state){
			g_config["show_line_number"]=!state;
			app.saveConfig();
			apply_linenum();
		});
	if(!g_config["show_line_number"])
	{
		$("#line_number_switcher").trigger("click");
	}
	//初始化下拉框
	var s=Select.init("font_select",function (str){
			g_config["display_font"]=str;
			apply_font();
			app.saveConfig();
		},"down");
	s.selectItem(g_config["display_font"]);
	
	$("#setting_page #goback_display").click(function(e) {
        switch_to_page("display");
    });
	$("#setting_language ul li").mouseover(function(e) {
		$(this).find(".list_small_left_bar").show();
	}).mouseout(function(e) {
		$(this).find(".list_small_left_bar").hide();
	});
	$("#setting_language ul li").click(function(e) {
		select_list_item();
		g_config["display_lang"]=$(this).attr("value");
		select_list_item();
		change_display_lang();
	});
	
	$("#setting_content>*").hide();
	$("#setting_appearance").show();
	
	$(".setting_item").click(function(e) {
		$(".setting_item").each(function(index, element) {
			$(element).removeClass("setting_item_active");
			$(element).removeClass($(element).get(0).id+"_active");
		});
		
		$(this).addClass("setting_item_active");
		$(this).addClass($(this).get(0).id+"_active");
		//隐藏所有选项卡
		$("#setting_content>*").hide();
		//显示当前选项卡
		$("#setting_"+$(this).get(0).id).show();
	});
	$(".setting_item").mouseover(function(e) {
		$(".setting_item_small_left_bar").animate({"top":this.offsetTop+"px"},"fast");
		
	});
	
	$(".setting_item").each(function(index, element) {
			if($(element).hasClass("setting_item_active"))
			{
				$(".setting_item_small_left_bar").css({"top":element.offsetTop+"px"});
			}
	});
	$(window).resize(resize);
});
