function parseColor(strColors)
{
	var lines=strColors.split(/\n/);
	var colors={};
	for(var i=0;i<lines.length;i++)
	{
		var token=lines[i].split(/\=/);
		if(token.length==2)
		{
			colors[token[0]]=token[1].replace(/\r+$/,"");
		}
	}
	return colors;
}
