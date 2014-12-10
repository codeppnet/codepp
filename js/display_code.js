function funcorvarname_bind_event()
{
	var selector=".funcorvarname";
	if(g_config["code_lang"]=="php")
	{
		selector+=",._p_r_e_f_i_x3";
	}
	$(selector).unbind("click");
	$(selector).bind("click",function (e){
			g_jump_list.hide();
			var linenum=$(this).parentsUntil(".line").parent().get(0).id.split("n")[1];
			var token=$(this).text().replace(/[^a-zA-Z_0-9]/g,"");
			if(!isUndef(g_config["ctags"][token]))
			{
				var tag=g_config["ctags"][token];
				if(tag.length==1)
				{
					scroll_to_line(tag[0]["linenum"],tag[0]["signature"]);
				}else//多个跳转
				{
					g_jump_list.clear();
					g_jump_list.show();
					for(var i=0;i<tag.length;i++)
					{
						g_jump_list.add(tag[i]["signature"],tag[i]["linenum"]);
					}
				}
			}
			e.stopPropagation();
		});
	$(selector).hover(function (e){
			var token=$(this).text().replace(/[^a-zA-Z_0-9]/g,"");
			if(!isUndef(g_config["ctags"][token]))
			{
				$(this).css("text-decoration","underline");	
			}
		},function (e){
			$(this).css("text-decoration","none");
		});
}
g_init_list.push(function() {
	$("#jump_list").click(function(e) {
        e.stopPropagation();
    });
    $(document).click(function(e) {
		g_jump_list.hide();
    });
	
});
