Slider={"init":function (id,color,value_change){
		$("#"+id).css("background-color",color);
		var s=document.createElement("SPAN");
		$(s).addClass("slider_block");
		$("#"+id).get(0).appendChild(s);
		var oldx=0,is_capture=0;
		$(s).mouseup(function(e) {
            is_capture=0;
			if(s.releaseCapture)
			{
				s.releaseCapture();
			}
        });;
		$(s).mousedown(function(e) {
            oldx=e.offsetX;
			is_capture=1;
			if(s.setCapture)
			{
				s.setCapture();
			}
        });
		$(s).mousemove(function(e) {
			if(is_capture==1)
			{
				if(e.offsetX-oldx>0)
				{
					if(($("#"+id).width()-
						(e.offsetX-oldx+parseInt($(s).
						css("left"))))>$(s).width())
					{
						$(s).css({"left":"+="+(e.offsetX-oldx)+"px"});
					}else
					{
						$(s).css({"left":$("#"+id).width()-$(s).width()+"px"});
					}
				}else if(e.offsetX-oldx<0)
				{
					if(parseInt($(s).css("left"))>0)
					{
						$(s).css({"left":"+="+(e.offsetX-oldx)+"px"});
					}else
					{
						$(s).css({"left":0});
					}
				}
				var value=(parseInt($(s).css("left")))/($("#"+id).width()-$(s).width());
	            value_change(value);
			}
        });
		var slider={"setVal":function (val,triggerChange){
				$(s).css({"left":($("#"+id).width()-$(s).width())*val+"px"});
				if(triggerChange) value_change(val);
			}};
		return slider;
	}};
