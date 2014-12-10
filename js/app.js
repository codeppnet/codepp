var app=(function (){
		var app={};
		app.init=(function (){
				var r=this.restoreConfig();
				for(var i=0;i<g_init_list.length;i++)
				{
					g_init_list[i]();
				}
				if(r)
				{
					$("#ok_btn").trigger("click");
				}else
				{
					switch_to_page("edit_page");
				}
				fill_color_to_list();
			});
			
		app.restoreConfig=(function (){
			if(is_in_office())
			{
				var t=Office.context.document.settings.get("config");
				if(t)
				{
					g_config=t;
					if(g_config["code"]!="") return true;
				}
			}
			return false;
		});
	
		app.saveConfig=(function (){
			if(is_in_office())
			{
				Office.context.document.settings.set("config",g_config);
				Office.context.document.settings.saveAsync();
			}
		});
		
		return app;
	}
)();
