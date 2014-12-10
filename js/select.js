Select={"init":function (id,selectItem,pos){//pos指示下拉框位置向上还是向下。
			var arrow=document.createElement("SPAN");
			if(pos=="down")
			{
				$(arrow).addClass("up_arrow");
			}else
			{
				$(arrow).addClass("down_arrow");
				$(arrow).css({"top":"auto","bottom":"-14px","border-top-color":"#515151"});
			}
			var button=document.createElement("SPAN");
			$("#"+id+">ul").get(0).appendChild(arrow);
			$(button).addClass("button");
			$(button).html("No Select");
			$(button).unbind("click");
			var arrow2=document.createElement("SPAN");
			if(pos=="down")
			{
				$(arrow2).addClass("down_arrow");
			}else
			{
				$(arrow2).addClass("up_arrow");
				$(arrow2).css({"border-bottom-color":"#fff","top":"3px","z-index":1});
			}
			$("#"+id).get(0).appendChild(arrow2);
			$("#"+id).get(0).appendChild(button);
			$("#"+id+">ul").css("top","auto");
			var s={"id":id,"selectItem":function(str){
					$("#"+this["id"]+">.button").html(str);
				},"selectItemByValue":function (val){
						$("#"+this.id).find("li").each(function(index,element) {
                            if($(element).attr("val")==val)
							{
								s.selectItem($(element).text());
							}
                        });
					},"toggle":function (){
						
						if($("#"+id+">ul").css("opacity")==0)
						{
							this.show();
						}else
						{
							this.hide();
						}
					},"hide":function (){
						$("#"+id+">ul").stop();
						if(pos=="down")
						{
							$("#"+id+">ul").animate({opacity:0,top:"15px"},"fast",function (){
								$("#"+id+">ul").css("display","none");
							});	
						}else
						{
							
							$("#"+id+">ul").animate({opacity:0,bottom:"15px"},"fast",function (){
								$("#"+id+">ul").css("display","none");
							});
						}
					},"show":function (){
							$("#"+id+">ul").stop();
							$("#"+id+">ul").css("display","block");
							if(pos=="down")
							{
								$("#"+id+">ul").animate({opacity:1,top:"40px"},"fast");
							}else
							{
								$("#"+id+">ul").animate({opacity:1,bottom:"40px"},"fast");
							}
						}
				};
			$(button).click(function(e) {
				e.stopPropagation();
				s.toggle();
            });
			$("#"+id+">ul>li").click(function(e) {
                s.selectItem($(this).html());
				s.toggle();
				selectItem($(this).html(),$(this).attr("val"));
            });
			
			$(document).bind("click",function (e){
				s.hide();
			});
			return s;
		}};
