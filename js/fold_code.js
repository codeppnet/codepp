function remove_quotings(code)
{
	code=code.replace(/'(.*?)[^\\](\\\\)*'|''/g,function (){
		var str=arguments[0];
		return "'"+str.substr(1,str.length-2).replace(/./g," ")+"'";
	});

	code=code.replace(/"(.*?)[^\\](\\\\)*"|""/g,function (){
		var str=arguments[0];
		return '"'+str.substr(1,str.length-2).replace(/./g," ")+'"';
	});
	return code;
}
function remove_comment_c_style(code)
{
	code=remove_quotings(code);
	code=code.replace(/\/\*([\s\S]*?)\*\//g,function (str,str1){
		return "/*"+str1.replace(/./g," ")+"*/";
	});
	code=code.replace(/\/\/(.*)/g,function (str,str1){
		return "//"+str1.replace(/./g," ");
	});
	return code;
}
function remove_comment_basic_style(code)
{
	code=remove_quotings(code);
	code=code.replace(/'(.*)/g,function (str,str1){
		return "'"+str1.replace(/./g," ");
	});
	code=code.replace(/rem\b(.*)/ig,function (str,str1){
		return "rem"+str1.replace(/./g," ");
	});
	return code;
}
function remove_comment_py_style(code)
{

	code=code.replace(/'''([\s\S]*?)'''/g,function (str,str1){
		return "'''"+str1.replace(/./g," ")+"'''";
	});
	
	code=code.replace(/"""([\s\S]*?)"""/g,function (str,str1){
		return '"""'+str1.replace(/./g," ")+'"""';
	});
	
	code=code.replace(/#(.*)/g,function (str,str1){
		return "#"+str1.replace(/./g," ");
	});
	return code;
}

//获取代码的折叠位置数组。
function parse_fold_pos()
{
	var c_style=["js","cpp","php","java","cs","jsp"];
	var basic_style=["vb","asp"];
	var py_style=["py"];
	if(isContain(c_style,g_config["code_lang"]))
	{
		return parse_fold_pos_c_style(g_config["code"]);
	}else if(isContain(basic_style,g_config["code_lang"]))
	{
		return parse_fold_pos_basic_style(g_config["code"]);
	}else if(isContain(py_style,g_config["code_lang"]))
	{
		//return [];
		return parse_fold_pos_py_style(g_config["code"]);
	}else
	{
		return [];
	}
}
function parse_fold_pos_basic_style(code)
{
	var mark_pairs=[/\bif.+?then\b( |\t)*(\n)/i,/\bend if\b/i,/\bfor\b/i,/\bnext\b/i,
		/\bwhile\b/i,/\bwend\b/i,/\bfunction\b/i,/\bend( |\t)+function\b/i,
		/\bsub\b/i,/\bend( |\t)+sub\b/i];
	code=remove_comment_basic_style(code);
	return parse_fold_pos_by_marks(code,mark_pairs);
}
function parse_fold_pos_c_style(code)
{
	var mark_pairs=[/{/,/}/,/\/\*/,/\*\//];
	code=remove_comment_c_style(code);
	return parse_fold_pos_by_marks(code,mark_pairs);
}
function parse_fold_pos_py_style(code)
{
	code=remove_comment_py_style(code);
	var mark_pairs=[/'''/,/'''/,/"""/,/"""/];
	var fold_pos=parse_fold_pos_by_marks(code,mark_pairs);
	code=code.replace(/'''([\s\S]*?)'''/g,function (str,str1){
		return "'''"+str1.replace(/./g,"")+"";
	});
	var lines=code.split(/\n/);
	function get_tab_count(line)
	{
		return line.match(/^(\t| )*/)[0].length;
	}
	function get_most_near_not_empty(i)
	{
		while(lines[i].length==0)
		{
			i--;
			if(i==0) return 0;
		}
		return i;
	}
	var cur_tab_count=get_tab_count(lines[0]);
 	var tab_stack=[];
	for(var i=0;i<lines.length;i++)
	{
		if(lines[i]!=""&&trim(lines[i]).substr(0,1)!="#")
		{
			var tmp=get_tab_count(lines[i]);
			if(tmp>cur_tab_count)
			{
				tab_stack.push({"tab_count":tmp,"linenum":i});
			}
			if(tmp<cur_tab_count)
			{
				var tmp2=null;
				while(1)
				{
					if(tab_stack.length==0) break;
					tmp2=tab_stack.pop();
					if(tmp2.tab_count>tmp)
					{
						fold_pos.push({"start_linenum":tmp2["linenum"]-1,
							"end_linenum":get_most_near_not_empty(i-1),
							"end_inline_pos":lines[get_most_near_not_empty(i-1)].length});
					}else
					{
						tab_stack.push(tmp2);
						break;
					}
				}
			}
			cur_tab_count=tmp;
		}
	}
	
	while(tab_stack.length!=0)
	{
		tmp2=tab_stack.pop();
		fold_pos.push({"start_linenum":tmp2["linenum"]-1,
						"end_linenum":get_most_near_not_empty(i-1),
						"end_inline_pos":lines[get_most_near_not_empty(i-1)].length});
	}
	
	return fold_pos;
}
function search_mark(code,start,marks)
{
	var r={"pos":Infinity,"which_mark":-1,"length":0};
	
	for(var i=0;i<marks.length;i++)
	{
		var match_result=code.substr(start).match(marks[i]);
		if(match_result!=null)
		{
			if(start+match_result.index<r["pos"])
			{
				r["which_mark"]=i;
				r["pos"]=match_result.index+start;
				r["length"]=match_result[0].length;
				r["str"]=match_result[0];
			}
		}
	}
	
	return r;
}
//根据两个mark的位置判断他们是否是一对mark,从0开始。
function is_mark_pair(pos1,pos2,mark_pairs)
{
	if(pos1%2==0&&pos1==pos2&&
		mark_pairs[pos1].toString()==
		mark_pairs[pos1+1].toString())
	{
		return true;
	}
	if(pos1%2==0&&pos1==pos2-1)
	{
		return true;
	}
	return false;
}
function parse_fold_pos_by_marks(code,mark_pairs)
{
	function get_linenum_by_pos(pos)//pos和linenumber都从1开始计数,位置从0计数。
	{
		var linenum=0;
		while(pos>0)
		{
			if(isUndef(g_lines[linenum])) break;
			pos-=g_lines[linenum].length+1;
			linenum++;
		}
		return [linenum,g_lines[linenum-1].length+pos];
	}
	var mark_stack=[];
	var mark_pos=[];
	var start=0;
	var r=null;
	var line_pos=null;
	while(1)
	{
		r=search_mark(code,start,mark_pairs);
		if(r["which_mark"]!=-1)
		{
			start=r.pos+r.length;
			line_pos=get_linenum_by_pos(r["pos"]+1);
			if(mark_stack.length>0)
			{
				if(is_mark_pair(mark_stack[mark_stack.length-1]["which_mark"],
					r["which_mark"],mark_pairs))
				{
					var tmp=mark_stack.pop();
					if(line_pos[0]-1-tmp["linenum"]>1)
					{
						mark_pos.push({"which_mark":r["which_mark"]-1,"start_linenum":
							tmp["linenum"],"end_linenum":
							line_pos[0]-1,"start":
							tmp["str"],"end":r["str"],"start_pos":tmp["pos"],
							"end_pos":r["pos"],"end_inline_pos":line_pos[1]});
					}
					continue;
				}
			}
			if(r["which_mark"]%2==0)
			{
				mark_stack.push({"which_mark":r["which_mark"],
					"linenum":line_pos[0]-1,
					"str":r["str"],"pos":r["pos"]});
			}
		}else
		{
			break;
		}
	}
	return mark_pos;
}
