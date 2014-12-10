List={"addItem":function (listId,str,font_color){
		var li=document.createElement("li");
		$(li).css("color",font_color);
		$(li).html("<span></span>"+str);
		$("#"+listId).get(0).appendChild(li);
		var index=List.getCount(listId)-1;
		if(index==0)
		{
			$(li).find("span").show();
			List["selectedItems"][listId]=li;
			if(listId in List["clickListeners"])
				List["clickListeners"][listId](0,str);
		}
		$(li).click(function(e) {
			$("#"+listId+" li").find("span").hide();
			List["selectedItems"][listId]=this;
			$(this).find("span").show();
        	if(listId in List["clickListeners"])
				List["clickListeners"][listId](index,str);
		});
	},"clickListeners":{},"selectedItems":{},"getCount":function (listId){
			return $("#"+listId+">li").get().length;
		},"addClickListener":function (listId,clickListener){
				this["clickListeners"][listId]=clickListener;
			},"setSelectedItemColor":function (listId,color){
				$(List["selectedItems"][listId]).css("color",color);
			},"clear":function(listId){
					$("#"+listId).empty();
				}};
