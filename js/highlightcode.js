function isFuncOrVarName(str)
{
	return /^[a-z_][a-z0-9_]*$/i.test(str);
}

//获取词语类别,lastDelimiter:上一个非空白分隔符。nextDelimiter:下一个分隔符(不一定非空白)。
function getWordCls(word,lastDelimiter,nextDelimiter)
{
	//寻找是否有符合的前缀。
	var prefix=getPrefixCls(word);
	if(prefix!="") return prefix;
	
	//关键字识别
	var kwType=g_stxMap["KEYWORD"];
	for(var i in kwType.items)
	{
		if(isContain(kwType.items[i].extra,word))
		{
			if(!(i=="Compiler directives"&&lastDelimiter!="#"))
				return i;
		}
	}
	
	//数字识别，待增加。
}
//判断这个单词是不是一个前缀类，如果是，返回类型名，不是返回"";
function getPrefixCls(word)
{
	for(var i in g_stxMap)
	{
		if(/^PREFIX[0-9]/.test(i))
		{
			if(isPrefix(word,g_stxMap[i].get(0)))
				return i;
		}
	}
	return "";
}

function isDelimiter(ch)
{
	return hasChar(g_stxMap["DELIMITER"].get(0),ch)||isSpace(ch);
}
//从str的startPos位置像后查看尽量多。
//看是否是QUOTATION1,#QUOTATION2,COMMENTON,#LINECOMMENT,COMMENTOFF.
//如果是任何一种，返回类型字符串，如都不是，返回"".
function getQC(str,startPos)
{
	function isEqu(key)
	{
		if(isUndef(g_stxMap[key])) return false;
		return str.substr(startPos,g_stxMap[key].get(0).length)==g_stxMap[key].get(0);
	}
	var QC=["COMMENTON","COMMENTOFF","COMMENTON2","COMMENTOFF2",
		"QUOTATION1","QUOTATION2","LINECOMMENT","LINECOMMENT2"];
	for(var i=0;i<QC.length;i++)
	{
		if(isEqu(QC[i]))
		{
			return QC[i];
		}
	}
	return "";
}

//根据g_stxMap中的case配置，转换字符串到合适的大小写。
function toProperCase(str)
{
	if(!isUndef(g_stxMap["CASE"])&&("n" in g_stxMap["CASE"].items))
	{
		return str.toLowerCase();
	}else
	{
		return str;
	}
}
function Word(start,len,type)
{
	this.start=start;
	this.len=len;
	this.type=type;
}
/*
	对代码进行词法分析，返回分析之后的Word数组。
	需求全局变量，g_stxMap.
*/
function lexer(code)
{
	var words=[];
	code=code+"\n";
	code=toProperCase(code);
	var lastDelimiterPos=-1,lastNotSpaceDlmter=-1;
	var curState="";
	g_lineCount=1;
	var QC="",QC2="";//是哪种引用或者注释。
	for(var i=0;i<code.length;i++)
	{
		if(curState=="")
		{
			QC=getQC(code,i);
			if(QC!="")
			{
				curState=QC;
				lastDelimiterPos=i;
				i+=g_stxMap[QC].get(0).length-1;
			}else
			{
				if(isDelimiter(code[i]))
				{
					//处理单词的识别
					var word=code.substr(lastDelimiterPos+1,i-lastDelimiterPos-1);//当前标识符
					if(word!="")
					{
						var cls=getWordCls(word,code[lastNotSpaceDlmter],code[i]);
						var start=lastDelimiterPos+1;//标识符开始
						var len=i-lastDelimiterPos-1;//标识符开始
						if(!isUndef(cls))
						{
							words.push(new Word(start,len,cls));
						}else
						{
							if(isFuncOrVarName(word))
							{
								words.push(new Word(start,len,"funcorvarname"));
							}
						}
					}
					if(!isSpace(code[i]))
					{
						lastNotSpaceDlmter=i;
					}
					lastDelimiterPos=i;
					if(code[i]=='\n')
					{
						words.push(new Word(i,1,"br"));
						g_lineCount++;
					}
				}
			}
			
		}else if(curState=="QUOTATION1"||
			curState=="QUOTATION2")
		{
			if(!isUndef(g_stxMap["ESCAPE"])&&code[i]==g_stxMap["ESCAPE"].get(0))
			{
				i++;
				continue;
			}
			QC2=getQC(code,i);
			if(QC2==QC)
			{
				//转换状态为普通模式
				curState="";
				i+=g_stxMap[QC].get(0).length-1;
				words.push(new Word(lastDelimiterPos,i-lastDelimiterPos+1,
					QC=="QUOTATION1"?"Quotation":"Quotation 2"));
				lastDelimiterPos=i;
			}
		}else if(curState=="COMMENTON"||
			curState=="COMMENTON2")
		{
			QC2=getQC(code,i);
			if(code[i]=='\n')
			{
				words.push(new Word(lastDelimiterPos,i-lastDelimiterPos,
					QC=="COMMENTON"?"Block comment":"Block comment 2"));
				words.push(new Word(i,1,'br'));
				g_lineCount++;
				lastDelimiterPos=i+1;
				continue;
			}
			if(QC2=="") continue;
			if(g_stxMap[QC2].get(0)==
				g_stxMap[QC2].get(0)&&
				QC2==QC)
			{
				QC2="COMMENTOFF"+QC.substr("COMMENTON".length,1);
			}
			if(QC2=="COMMENTOFF"+QC.substr("COMMENTON".length,1))
			{
				curState="";
				i+=g_stxMap[QC].get(0).length-1;
				words.push(new Word(lastDelimiterPos,i-lastDelimiterPos+1,
					QC=="COMMENTON"?"Block comment":"Block comment 2"));
				lastDelimiterPos=i;
			}
		}else if(curState=="LINECOMMENT1"||
			"LINECOMMENT2")
		{
			if(code[i]=="\n")
			{
				curState="";
				words.push(new Word(lastDelimiterPos,i-lastDelimiterPos,"Line comment"));
				words.push(new Word(i,1,"br"));
				g_lineCount++;
				lastDelimiterPos=i;
			}
		}else
		{
			curState="";
		}
	}
	return words;
}
function add_space_suffix(str,size)
{
	while(str.length<size)
	{
		str+=" ";
	}
	return str;
}
function hightlight(code,words)
{
	var offset=0,oldlen=0;
	var aftCode="";//高亮后代码
	var curPos=0;
	var foldableId=0;
	var lineCount=1;
	var lineNumSize=g_lineCount.toString().length;
	for(var i=0;i<words.length;i++)
	{
		var word=words[i];
		var str1=code.substr(curPos,word.start-curPos);
		aftCode+=toHtml(str1);
		curPos=word.start;
		if(word.type=="token")
		{
			aftCode+="<a class='token'>"+str2+"</a>";
		}else if(word.type=='br')
		{
			lineCount++;
			aftCode+="</span></div><div id='ln"+lineCount+"' class='line'>"+
				"<span class='linenumber'>"+toHtml(add_space_suffix(
				lineCount.toString(),lineNumSize))+
				"</span><span class='fold'>&nbsp;<span></span></span><span class='line_code'>";
		}else
		{
			aftCode+="<a class='"+remove_space_and_uppercase(word.type)+ "'>"+
				toHtml(code.substr(curPos,word.len))+"</a>";
		}
		curPos+=word.len;
	}
	return "<div id='ln1' class='line'>"+
		"<span class='linenumber'>"+toHtml(add_space_suffix("1",lineNumSize))
		+"</span><span class='fold'>&nbsp;<span></span></span><span class='line_code'>"+
		aftCode+"</span></div>";
}
//获取处理完的代码。
function getFormatedCode(code)
{
	var words=lexer(code);
	var highLightCode=hightlight(code,words);
	return highLightCode;
}
