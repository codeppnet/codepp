if(is_in_office())
{
	Office.initialize=function (reason) {
		app.init();
	};
}else
{
	$(document).ready(function (e){
		app.init();
	});
}
