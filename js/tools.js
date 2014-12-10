function isUndef(v)
{
	return v===undefined;
}
//判断str中有没有ch.
function hasChar(str,ch)
{
	return isContain(str,ch);
}
function isContain(container,element)
{
	for(var i in container)
	{
		if(typeof(container[i])!="function")
		{
			if(toProperCase(container[i])===element)
			{
				return true;
			}
		}
	}
	return false;
}
function isSpace(ch)
{
	return ch==' '||ch=='\t'||
			ch=='\n'||ch=='\r';
}
function toHtml(str)
{
	return str.replace(/\</g,"&lt;").
		replace(/\>/g,"&gt;").
		replace(/ /g,"&nbsp;").
		replace(/\t/g,"&nbsp;&nbsp;&nbsp;&nbsp;");
}
//判断str2是否是str1的前缀。
function isPrefix(str1,str2)
{
	return str1.substr(0,str2.length)==str2;
}

function remove_space_and_uppercase(str)
{
	var r="";
	for(var i=0;i<str.length;i++)
	{
		if(str.charCodeAt(i)>=65&&str.charCodeAt(i)<=90)
		{
			r+="_"+str[i].toLowerCase();
		}else if(str[i]==" ")
		{
			r+="_s";
		}else if(str[i]=="_")
		{
			r+="__";
		}else
		{
			r+=str[i];
		}
	}
	return r;
}

function remove_first_char_html(html_str)
{
	if(html_str.length>0)
	{
		if(html_str[0]=="&")
		{
			return html_str.replace(/&.+?\;/,"");
		}
		if(html_str[0]=="<")
		{
			return html_str.replace(/\>([^\<&]|(&.+?\;))/,">");
		}
		return html_str.substr(1);
	}
}

function remove_first_n_char_html(html_str,n)
{
	while(n>0)
	{
		html_str=remove_first_char_html(html_str);
		n--;
	}
	return html_str;
}

function remove_last_char_html(html_str)
{
	if(html_str.length>0)
	{
		if(html_str.substr(-1)==">")
		{
			/*
			while()
			{
				
			}*/
		}
		if(html_str.substr(-1)==">")
		{
			return html_str.replace(/\>([^\<&]|(&.+?\;))/,">");
		}
		return html_str.substr(1);
	}
}

function trim(str)
{
	return str.replace(/^(\t| )+/,"").replace(/(\t| )+$/,"");
}
