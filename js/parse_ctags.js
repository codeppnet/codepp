function parse_signature(tagname,str)
{
	str=trim(str);
	var s=str.match(/(signature:)(.*)/);
	if(s)
	{
		s=s[2];
	}else
	{
		s="";
	}
	var c=str.match(/(class:)([^ \t]*)/);
	if(c)
	{
		c=c[2];
	}else
	{
		c="";
	}
	if(c!="")
		return c+"::"+tagname+s;
	else
		return tagname+s;
}
function parse_ctags(ctags)
{
	var lines=ctags.split(/\n/);
	var r={};
	try
	{
		g_lines=g_config["code"].split(/\n/);
		for(var i=0;i<lines.length;i++)
		{
			if(lines[i]=="") continue;
			var a=lines[i].split(/;"/);
			var tagname=a[0].split(/\t/)[0];
			var linenum=a[0].split(/\t/)[1];
			var signature="";
			if(!isUndef(a[1]))
			{
				signature=parse_signature(tagname,a[1]);
			}else
			{
				signature=trim(g_lines[linenum-1]);
			}
			if(isUndef(r[tagname]))
			{
				r[tagname]=[{"linenum":linenum,"signature":signature}];
			}else
			{
				r[tagname].push({"linenum":linenum,"signature":signature});
			}
		}
		return r;
	}catch (e)
	{
		echo("WARNING:Encountering error when program parses content of ctags!");
		return {};
	}
}
