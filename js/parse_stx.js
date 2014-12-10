/*
	
	#abc=123
	#def=456
		def1
		def2
	#def=789
		def3
		def4
	#
	
	上述stx文件解析之后，stxMap的结构应该如下：
	stxMap:Object
		"abc":CType
			"123":CItem
				"extra":[]
		 "def":CType
		 	 "456":CItem
			     "extra":["def1","def2"]
		     "789":CItem
			 	 "extra":["def3","def4"]
	 
*/
//每一个配置类型都是一个CType对象。
function CType()
{
	this.items={};
	this.get=(function (index){
			var count=0;
			for(var i in this.items)
			{
				if(count==index) return toProperCase(i);
				count++;
			}
			return null;
		});
	this.appendItem=(function (itemName,_item){
		this.items[itemName]=_item;
	});
}
//每一个配置项都是一个CItem对象。
//extra是一个数组，存储所有额外的数据。
function CItem()
{
	this.extra=[];
	this.appendExtra=(function (str){
		this.extra[this.extra.length]=str;
	});
}
//解析stx文件。
function parseStx(stx)
{
	var lines=stx.split(/\n/);
	var stxMap={};//stx文件解析之后的map
	/*
		状态0表示打算读取一个#开始的键。
		1表示读取额外数据。
	*/
	var curState=0;
	var curItem=null;//当前需要增加extra数据的项目。
	for(var i=0;i<lines.length;i++)
	{
		//去掉行尾和行首的空格
		lines[i]=lines[i].replace(/(^\s*)|(\s*$)/g, "");
		if(lines[i]!="")
		{
			//忽略掉注释
			if(lines[i].substr(0,1)==';') continue;
			switch(curState)
			{
			case 0:
				if(lines[i].substr(0,1)=="#")
				{
					curItem=null;
					var curType=lines[i].split(/=/)[0].substr(1);
					if(curType!="")
					{
						if(isUndef(stxMap[curType]))//如果不存在这个类型
						{
							stxMap[curType]=new CType();
						}
						curItem=new CItem();
						stxMap[curType].appendItem(lines[i].replace(/^#.+?\=/,""),curItem);
						curState=1;
					}
				}
				break;
			case 1:
				if(lines[i].substr(0,1)=="#")
				{
					curState=0;
					i--;//重新读取这一行。
				}else
				{
					if(lines[i]!=""&&curItem!=null)
					{
						curItem.appendExtra(lines[i]);
					}
				}
				break;
			default:;
			}
		}
	}
	return stxMap;
}
