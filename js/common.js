var display_lang={};

display_lang["en"]={"CSSFONT":"Calibri Light","LANGUAGE OPTIONS":"LANGUAGE OPTIONS","Default":"Default",
	"APPEARANCE":"APPEARANCE","LANGUAGE":"LANGUAGE","HELP/ABOUT":"HELP/ABOUT",
	"BACK":"BACK","SETTING":"SETTING","Syntax Colors":"Syntax Coloring","Font":"Font",
	"Reset":"Reset","Show":"Show","Hide":"Hide","Line Number":"Line Number",
	"Your jump history will be listed here.":"Your jump history will be listed here.",
	"Ok":"OK","PEN":"PEN","ERASER":"ERASER","ERASE ALL INK":"ERASE ALL INK",
	"WEIGHT":"WEIGHT","Pen":"Pen","Jump History":"Jump History","Last Location":"Return to last Location",
	"Increase Font Size":"Increase Font Size","Decrease Font Size":"Decrease Font Size",
	"Fold All":"Fold All","Expand All":"Expand All","Edit":"Edit",
	"Settings":"Settings","Select the one you need.":"Select the one you need.",
	"Click on its name to jump.":"Click on its name to jump.",
	"Please wait...":"Please wait...","Pin the Dock":"Pin the Dock",
	"Collapse the Dock":"Collapse the Dock"};
	
display_lang["ch"]={"CSSFONT":"微软雅黑","LANGUAGE OPTIONS":"语言选项","Default":"默认",
	"APPEARANCE":"外观","LANGUAGE":"语言","HELP/ABOUT":"帮助/关于",
	"BACK":"返回","SETTING":"设置项","Syntax Colors":"语法颜色","Font":"字体",
	"Reset":"重设","Show":"显示","Hide":"隐藏","Line Number":"行号",
	"Your jump history will be listed here.":"这儿将显示你跳转的历史记录。",
	"Ok":"确定","PEN":"画笔","ERASER":"橡皮擦","ERASE ALL INK":"擦除所有墨迹",
	"WEIGHT":"画笔粗细","Pen":"画笔","Jump History":"跳转历史","Last Location":"返回上一位置",
	"Increase Font Size":"增大字号","Decrease Font Size":"减小字号",
	"Fold All":"折叠所有语句块","Expand All":"展开所有语句块","Edit":"编辑",
	"Settings":"设置","Select the one you need.":"请选择一个",
	"Click on its name to jump.":"单击跳转","Please wait...":"请稍候...",
	"Pin the Dock":"固定工具栏","Collapse the Dock":"收起工具栏"};
	
display_lang["jp"]={"CSSFONT":"メイリオ","LANGUAGE OPTIONS":"言語オプション","Default":"デフォルト",
	"APPEARANCE":"デザイン","LANGUAGE":"言語","HELP/ABOUT":"ヘルプ／バージョン情報",
	"BACK":"前に戻る","SETTING":"設定","Syntax Colors":"シンタックスカラーリング","Font":"フォント",
	"Reset":"リセット","Show":"表示","Hide":"隠す","Line Number":"行番号",
	"Your jump history will be listed here.":"ここにはジャンプリスト（変更した位置の履歴）を記録した",
	"Ok":"確定","PEN":"ペン","ERASER":"消しゴム","ERASE ALL INK":"すべての筆跡を消す",
	"WEIGHT":" 線の太さ","Pen":"ペン","Jump History":"ジャンプリスト","Last Location":"前の位置に戻る",
	"Increase Font Size":"フォントサイズの拡大","Decrease Font Size":"フォントサイズの縮小",
	"Fold All":"すべてのコードを折り畳む","Expand All":"すべてのコードを展開","Edit":"コード編集",
	"Settings":"設定","Select the one you need.":"リストから一つ選びなさい",
	"Click on its name to jump.":"ジャンプするにはネームをクリックする",
	"Please wait...":"少々お待ちください...","Pin the Dock":"ツールバーを固定する",
	"Collapse the Dock":"ツールバーを隠す"};


//所有的配置数据都存放在这个变量里面
var g_config={"display_lang":"en","display_font":"Consolas","syntax_color":null,
		"old_syntax_color":null,"show_line_number":true,
		"code_lang":"detect_lang",//代码使用的语言
		"code":"",//代码
		"ctags":null
	};
	
g_cur_cursor_type="cursor"; //当前指针的类型，鼠标指针，画笔，橡皮擦。
g_pen_weight="1"; //当前画笔的宽度。1,2,4三种类型。
g_pen_color="#d63b3f";
		
		
var g_stxMap=null;
var g_lines=null;
//代码的总行数
var g_lineCount=0;

//指示当前正在修改的颜色
var g_cur_change_color="";

//通过行号索引的折叠位置。
var g_fold_pos={};

var g_last_pos=0;

//初始化函数列表
var g_init_list=[];

function switch_to_page(page_id)
{
	if(page_id=="display")
	{
		$("body").css("background-color","#fff");
	}else
	{
		$("body").css("background-color","#eff0f0");
	}
	$("body>*").hide();
	if(page_id=="wait_page")
	{
		$("body>#"+page_id).show();
	}else
	{
		$("body>#"+page_id).fadeIn(300);
	}
}

function echo(str)
{
	console.log(str);
}

//ajax默认全局设置
$.ajaxSetup({error:function(){
		switch_to_page("edit_page");
		alert('error!');
		//echo("error!");
	},"type":"GET",
	"asyn":true});

//从服务器上下载规则。
function load_rules_from_server(complete)
{
	$.ajax("rules/"+g_config["code_lang"]+"/"+g_config["code_lang"]+".stx",
		{success:function(data,textStatus,jqXHR){
				//加载stx成功，开始剖析。
				g_stxMap=parseStx(data);
				function load_ctags()
				{
					if(g_config["ctags"]==null)
					{
						$.ajax("ctags/index.php",
						{"success":function(data,textStatus,jqXHR){
								g_config["ctags"]=parse_ctags(data)
								complete();
							},"type":'POST',"data":{"code":g_config["code"],
								"lang":g_config['code_lang']}
						});
					}else
					{
						complete();
					}
				}
				//如果本地没有配色文件，就去服务器上下载配色文件
				if(g_config["syntax_color"]==null)
				{
					$.ajax("rules/"+g_config["code_lang"]+"/"+g_config["code_lang"]+".color",
						{"success":function(data,textStatus,jqXHR){
								g_config["syntax_color"]=parseColor(data);
								g_config["old_syntax_color"]=parseColor(data);
								fill_color_to_list();
								load_ctags();
							}
						});
				}else
				{
					load_ctags();
				}
			}
		});
}
//为代码应用颜色
function apply_color()
{
	for(var i in g_config["syntax_color"])
	{
		$("."+remove_space_and_uppercase(i)).css("color",g_config["syntax_color"][i]);
	}
}

function apply_linenum()
{
	if(!g_config["show_line_number"])
	{
		$(".linenumber").hide();
	}else
	{
		$(".linenumber").show();
	}
}

function apply_font()
{
	$("#display_code").css("font-family",g_config["display_font"]);
}
function scroll_to_line(linenum,signature,is_push)
{
	if(isUndef(is_push))	
		g_jump_stack_list["push"](signature,linenum);
	//高亮这一行
	$("#ln"+linenum).css("background-color","yellow");
	setTimeout(function (){
		$("#ln"+linenum).css("background-color","white");
	},1000)
	
	g_last_pos=$("html,body").scrollTop();
	
	$("html,body").animate({scrollTop:$("#ln"+linenum).
			offset().top},"fast");
}

var g_jump_stack_list={"push":function (str,linenum){
		var li=document.createElement("li");
		$(li).text(trim(str));
		$(li).attr("linenum",linenum);
		var _this=this;
		$(li).click(function(e) {
        	_this["select"](li);
			_this.select_change($(this).attr("linenum"));
			scroll_to_line($(this).attr("linenum"),"",false);
    	});
		$("#jump_stack_list>.nothing").remove();
		var all_li=$("#jump_stack_list>li").get();
		for(var i=0;i<all_li.length;i++)
		{
			if($(all_li[i]).hasClass("selected"))
			{
				break;
			}
			$(all_li[i]).remove();
		}
		var container=$("#jump_stack_list").get(0);
		var top_li=$("#jump_stack_list>li").get(0);
		if(typeof top_li!="undefined")
		{
			container.insertBefore(li,top_li);
		}else
		{
			container.insertBefore(li, null);
		}
			
		_this["select"](li);
		all_li=$("#jump_stack_list>li").get();
		for(var i=all_li.length-1;i>=0;i--)
		{
			if(i>9)
			{
				$(all_li[i]).remove();
			}
		}
	},"clear":function (){
			$("#jump_stack_list>li").remove();
			var li=document.createElement("li");
			$(li).addClass("show_text");
			$(li).addClass("nothing");
			$(li).css("background-color","rgba(0,0,0,0)");
			$(li).attr("extra","Your jump history will be listed here.");
			$(li).text(display_lang[g_config["display_lang"]]["Your jump history will be listed here."]);
			$("#jump_stack_list").get(0).appendChild(li);
		},"select_change":function (linenum){
			
		},"select":function (li){
				$("#jump_stack_list>li").removeClass("selected");
				$(li).addClass("selected");
			}
	};

//显示重载函数的列表
var g_jump_list={"add":function (str,linenum){
		var li=document.createElement("li");
		$(li).text(str);
		$(li).attr("linenum",linenum);
		$(li).click(function(e) {
            scroll_to_line($(this).attr("linenum"),str);
			g_jump_list.hide();
        });
		$("#jump_list ul").get(0).appendChild(li);
	},"clear":function (){
			$("#jump_list ul li").remove();
		}
	,"show":function (){
			$("#jump_list").show();
		},"hide":function (){
				$("#jump_list").hide();
			}
}
