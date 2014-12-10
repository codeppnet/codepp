function Word(start,len,type)
{
	this.start=start;
	this.len=len;
	this.type=type;
}
function regToken(code)
{
	var words=[];
	code=code+"\n";
	var lastDelimiterPos=-1,lastNotSpaceDlmter=-1;
	var curState="";
	var QC="";
	for(var i=0;i<code.length;i++)
	{
		if(curState=="")
		{
			QC=getQC(code,i);
			if(QC!="")
			{
				curState=QC;
				lastDelimiterPos=i;
			}else
			{
				if(isDelimiter(code[i]))
				{
					//处理单词的识别
					var word=code.substr(lastDelimiterPos+1,i-lastDelimiterPos-1);
					if(word!="")
					{
						var cls=getWordCls(word,code[lastNotSpaceDlmter],code[i]);
						if(!isUndef(cls))
						{
							append(words,new Word(lastDelimiterPos+1,i-lastDelimiterPos-1,cls));
						}
						//echo(word+":"+getWordCls(word,code[lastNotSpaceDlmter],code[i]));
					}
					if(!isSpace(code[i]))
					{
						lastNotSpaceDlmter=i;
					}
					lastDelimiterPos=i;
				}
			}
			
		}else if(curState=="QUOTATION1"||
			curState=="QUOTATION2")
		{
			if(code[i]==stxMap["ESCAPE"].get(0))
			{
				i++;
				continue;
			}
			var QC2=getQC(code,i);
			if(QC2==QC)
			{
				//转换状态为普通模式
				curState="";
				i+=stxMap[QC].get(0).length-1;
				append(words,new Word(lastDelimiterPos,i-lastDelimiterPos+1,QC=="QUOTATION1"?"Quotation":"Quotation 2"));
				//echo(code.substr(lastDelimiterPos,i-lastDelimiterPos+1)+":"+QC);
				lastDelimiterPos=i;
			}
		}else if(curState=="COMMENTON")
		{
			QC=getQC(code,i);
			if("COMMENTOFF"==QC)
			{
				//转换状态为普通模式
				curState="";
				i+=stxMap[QC].get(0).length-1;
				append(words,new Word(lastDelimiterPos,i-lastDelimiterPos+1,"Block comment"));
				//echo(code.substr(lastDelimiterPos,i-lastDelimiterPos+1)+":"+"COMMENT");
				lastDelimiterPos=i;
			}
		}else if(curState=="LINECOMMENT")
		{
			if(code[i]=="\n"||
				code[i]=="\r")
			{
				curState="";
				append(words,new Word(lastDelimiterPos,i-lastDelimiterPos+1,"Line comment"))
				//echo(code.substr(lastDelimiterPos,i-lastDelimiterPos+1)+":"+"LINECOMMENT");
				lastDelimiterPos=i;
			}
		}
		else
		{
			curState="";
		}
	}
	return words;
}
function wrap(code,words,colors)
{
	a=new String();
	var offset=0,oldlen=0,color="";
	var aftCode="";//高亮后代码
	var curPos=0;
	for(var i=0;i<words.length;i++)
	{
		var word=words[i];
		var color=colors[word.type];
		color=(color?color:"black");
		aftCode+=code.substr(curPos,word.start-curPos).replace(/\</g,"&lt;").replace(/\>/g,"&gt;");
		curPos=word.start;
		aftCode+="<font face='Consolas' color='" +color+ "'>"+
			code.substr(curPos,word.len).replace(/\</g,"&lt;").replace(/\>/g,"&gt;")+"</font>";
		curPos+=word.len;
	}
	aftCode+=code.substr(curPos).replace(/\</g,"&lt;").replace(/\>/g,"&gt;");
	return "<pre>"+aftCode+"</pre>";
}
