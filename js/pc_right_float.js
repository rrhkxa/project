// JavaScript Document
/*
 作者:zhu.jianxin
 日期:2018/1/3
 功能：用于产品页，返回顶部。
 使用方法：
 var FeedbackOptions={
 style:'cms',
 host:'info.xcar.com.cn'
 }
 <script src='本js地址'></script>
 注：
 配置内容为反馈表单信息，将拼接为
 http://my.xcar.com.cn/interface/cms_feedback.php?style=FeedbackOptions.style&host=FeedbackOptions.host

 */
(function(){
	var FeedbackOptions=FeedbackOptions||{};
	FeedbackOptions.style=FeedbackOptions.style||'cms';
	FeedbackOptions.host=FeedbackOptions.host||'info.xcar.com.cn';
	var className='return_coat';
	//if(document.body.clientWidth<1140)return;
	if(document.body.clientWidth<1280)className='control_coat1280';
	var htmlStr='<!-- 右侧随动 -->\
	<!-- 右侧随动 判断页面宽度为1024时，修改下面#control_coat的class修改为“control_coat1024” -->\
	<div class="'+className+'" style="display:none;" id="control_coat">\
	<div class="return_top" id="return_top"><a href="javascript:void(0)">回到顶部</a></div>\
	</div>\
	<!-- /右侧随动 -->';
	document.write(htmlStr);
	var controlCoat=document.getElementById('control_coat')
	window.onscroll=function(){
		var thisTop=document.body.scrollTop+document.documentElement.scrollTop;
		if(thisTop>50){
			controlCoat.style.display="block";

		}else{
			controlCoat.style.display="none";
		}
	}
	function backTop(){
		if(typeof jQuery!=='undefined'){
			jQuery('html,body').animate({scrollTop:0});
		}else{
			window.scrollTo(0,0);
		}
	}
	return_top.onclick=function(){
		backTop();
	}

})()