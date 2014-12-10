g_init_list.push(function() {
    
	var s=Select.init("code_lang_select",function(str,value){
			g_config["syntax_color"]=null;
			g_config["code_lang"]=value;
		});
	
	s.selectItemByValue(g_config["code_lang"]);
	
	//根据parse_fold_pos的返回值，增加控制折叠的元素到网页上。
	function add_fold_element(fold_pos_arr)
	{
		var over=(function(e) {
                var linenum=$(this).parentsUntil(".line").parent().get(0).id.split("n")[1];
				for(var i=g_fold_pos[linenum-1]["start_linenum"]+1;
					i<=g_fold_pos[linenum-1]["end_linenum"]+1;i++)
				{
					$("#ln"+i).css("background-color","#f6f7fb");
				}
           });
		var out=(function(e) {
                var linenum=$(this).parentsUntil(".line").parent().get(0).id.split("n")[1];
				for(var i=g_fold_pos[linenum-1]["start_linenum"]+1;
					i<=g_fold_pos[linenum-1]["end_linenum"]+1;i++)
				{
					$("#ln"+i).css("background-color","#fff");
				}
           });
		   
		 var clk=(function (e){
			 	var fold=$(this).parentsUntil(".line");
				var linenum=fold.parent().get(0).id.split("n")[1];
				if(!fold.hasClass("expand"))
				{
					for(var i=g_fold_pos[linenum-1]["start_linenum"]+2;
						i<=g_fold_pos[linenum-1]["end_linenum"]+1;i++)
					{
						$("#ln"+i).data("hide",$("#ln"+i).data("hide")+1);
						$("#ln"+i).hide();
					}
					fold.addClass("expand");
					var ellipsis=document.createElement("span");
					var line_code=$("#ln"+(g_fold_pos[linenum-1]["end_linenum"]+1)).
						find(".line_code");
					$(ellipsis).html("<span class='suspension_points'>...</span>"+remove_first_n_char_html(line_code.html(),
						g_fold_pos[linenum-1]["end_inline_pos"]));
					$(ellipsis).find(".suspension_points").click(function(e) {
                        fold.find("span").trigger("click");
                    });
					//$(ellipsis).html("..."+g_fold_pos[linenum-1]["end"]);
					$(ellipsis).addClass("ellipsis");
					fold.parent().find(".line_code").get(0).appendChild(ellipsis);
				}else
				{
					$(fold.parent()).find(".ellipsis").remove();
					for(var i=g_fold_pos[linenum-1]["start_linenum"]+2;
						i<=g_fold_pos[linenum-1]["end_linenum"]+1;i++)
					{
						$("#ln"+i).data("hide",$("#ln"+i).data("hide")-1);
						if($("#ln"+i).data("hide")==0)
						{
							$("#ln"+i).show();
						}
					}
					fold.removeClass("expand");
				}
			 });
		for(var i=0;i<fold_pos_arr.length;i++)
		{
			g_fold_pos[fold_pos_arr[i]["start_linenum"]]=fold_pos_arr[i];
			var start=$("#ln"+(fold_pos_arr[i]["start_linenum"]+1)).find(".fold");
			start.attr("class","");
			start.addClass("fold_start");
			start.addClass("fold");
			start.find("span").mouseover(over);
			start.find("span").mouseout(out);
			start.find("span").click(clk);
			for(var j=fold_pos_arr[i]["start_linenum"]+2;j<=fold_pos_arr[i]["end_linenum"];j++)
			{
				$("#ln"+j).data("hide",0);
				var s=$("#ln"+j).find(".fold");
				if(!(s.hasClass("fold_start")||s.hasClass("fold_end")))
					$("#ln"+j).find(".fold").addClass("fold_space");
			}
			$("#ln"+(fold_pos_arr[i]["end_linenum"]+1)).data("hide",0);
			$("#ln"+(fold_pos_arr[i]["end_linenum"]+1)).find(".fold").addClass("fold_end");
		}
		
	}

	
	$(window).resize(function(e) {
        $("#edit_page").height($(window).height()*0.9);
    });
	if(g_config["code"]!="") $("#code_txt").val(g_config["code"]);
	$("#ok_btn").click(function(e) {
		g_config["code"]=$("#code_txt").val().replace(/\t/g,"    ");

		if(g_config["code_lang"]=="detect_lang")
		{
			g_config["code_lang"]=detect_lang(g_config["code"]);
			s.selectItemByValue(g_config["code_lang"]);
		}
		g_config["ctags"]=null;
		g_jump_stack_list["clear"]();
		app.saveConfig();
		switch_to_page("wait_page");
        load_rules_from_server(function (){
				$("#display_code").html(getFormatedCode(g_config["code"]));
				$("#display_code").css("font-family",g_config["display_font"]);
				apply_color();
				apply_linenum();
				apply_font();
				add_fold_element(parse_fold_pos());
				switch_to_page("display");
				funcorvarname_bind_event();
				app.saveConfig();
			});
    });
	
	$(window).trigger("resize");
	$(document).delegate('textarea','keydown',function(e) {
		var keyCode=e.keyCode||e.which;
		if(keyCode==9) 
		{
			e.preventDefault();
			var start = $(this).get(0).selectionStart;
			var end = $(this).get(0).selectionEnd;
			$(this).val($(this).val().substring(0,start)
				+"    "
				+$(this).val().substring(end));
			$(this).get(0).selectionStart=$(this).get(0).
				selectionEnd=start+4;
		}
	});
});
