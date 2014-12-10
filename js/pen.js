g_init_list.push(function() {
	var ctx=$("#drawing_board").get(0).getContext("2d");
	var is_draw=0;
	$("#drawing_board").mousemove(function(e) {
		if(is_draw)
		{
			if(g_cur_cursor_type=="eraser")
			{
				ctx.clearRect(e.offsetX-10,e.offsetY-10,20,20);
			}else
			{
				ctx.lineTo(e.offsetX,e.offsetY);
				ctx.stroke();
			}
		}
	}).mousedown(function(e) {
		if(this.setCapture)
		{
			this.setCapture();
		}
		ctx.lineJoin=ctx.lineCap='round';
		ctx.lineWidth=g_pen_weight;
		is_draw=1;
		ctx.strokeStyle=g_pen_color;
		ctx.beginPath();
		ctx.moveTo(e.offsetX,e.offsetY);
    }).mouseup(function(e) {
		if(this.releaseCapture)
		{
			this.releaseCapture();
		}
		is_draw=0;
        ctx.closePath();
    });
});
