/**
 * Created by zlf on 2017/7/10.
 */
define(function(require,exports,module){
    var picStr='' +
        '<li data-type="pic" data-id="{{id}}" class="ui-state-default f_item_pic  mt10">' +
            '<div class="move_box">' +
                '<a href="javascript: void(0);" data-query="close" class="close"></a>' +
                '<div class="drag_drop">' +
                    '<span><i class="icon_drag"></i></span>' +
                '</div>' +
                '<div class="f_p_con">' +
                    '<div class="f_p_picture" ondragstart="return false">' +
                        '<img src="{{src}}"  data-angle="{{angle}}" alt="" onload="window.setImgInfo(this)" style="max-width:910px" />' +
                        '<a href="javascript:void(0);" data-query="rotateLeft" class="rotate_left"></a>' +
                        '<a href="javascript:void(0);" data-query="rotateRight" class="rotate_right"></a>' +
                    '</div>' +
                    '<div class="main_textbox">' +
                        '<textarea data-type="pic" autocomplete="off"  class="f_p_area f_p_border f_p_area_imgbg">{{defaultText}}</textarea>' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<em class="cont" style="display:none">0/250</em>' +
        '</li>';
    var textStr='' +
        '<li data-type="text" data-id="{{id}}" class="ui-state-default f_item_txt f_p_active mt10">' +
            '<div class="move_box">' +
                '<a  href="javascript: void(0);" data-query="close"   class="close"></a>' +
                '<div class="drag_drop ui-sortable-handle">' +
                    '<span><i class="icon_drag"></i></span>' +
                '</div>' +
                '<div class="f_p_con">' +
                    '<div class="main_textbox">' +
                        '<textarea  data-type="text"  autocomplete="off" class="f_p_area f_p_border">{{defaultText}}</textarea>' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<em class="cont" style="display: none;">0/1000</em>' +
        '</li>';
    var videoStr='' +
        '<li data-src="{{src}}" data-id="{{id}}" data-type="video" class="ui-state-default mt10 f_item_video ">' +
            '<div class="move_box">' +
                '<a href="javascript: void(0);"  data-query="close"   class="close"></a>' +
                '<div class="drag_drop">' +
                    '<span><i class="icon_drag"></i></span>' +
                '</div>' +
                '<div class="f_p_con">' +
                    '<div class="f_p_vd">' +
                        '<div data-query="video">' +
                            '<img src="http://icon.xcar.com.cn/cwy/XBB/images/convertVideo.jpg" width="911">' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</li>';
    var videoStr2='' +
        '<li data-type="video" data-id="{{id}}" class="ui-state-default mt10 f_item_video ">' +
            '<div class="move_box">' +
                '<a  href="javascript: void(0);" data-query="close"   class="close"></a>' +
                '<div class="drag_drop">' +
                    '<span><i class="icon_drag"></i></span>' +
                '</div>' +
                '<div class="f_p_con">' +
                    '<div class="f_p_vd">' +
                        '<embed src="{{src}}" quality="high" width="910" height="560" align="middle" allowScriptAccess="always" allowFullScreen="true" wmode="transparent" type="application/x-shockwave-flash"></embed>' +
                    '</div>' +
                    '<div class="main_textbox mt20">' +
                        '<textarea  data-type="video"  autocomplete="off" class="f_p_area f_p_border">{{defaultText}}</textarea>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</li>';
    var videoStr3='' +
        '<li  data-type="video" class="ui-state-default mt10 f_item_video ">'+
            '<div class="move_box">'+
                '<a  href="javascript: void(0);" data-query="close"  class="close"></a>'+
                '<div class="drag_drop">'+
                    '<span><i class="icon_drag"></i></span>'+
                '</div>'+
                '<div class="f_p_con">'+
                    '<div class="f_p_vd">'+
                    '<iframe style="border:none" frameborder="0" src="{{src}}&width=910&height=560" width="910" height="560"></iframe>'+
                    '</div>'+
                    '<div class="main_textbox mt20">'+
                        '<textarea  autocomplete="off" class="f_p_area f_p_border">{{defaultText}}</textarea>'+
                    '</div>'+
                '</div>'+
            '</div>'+
        '</li>';

    module.exports={
        pic:picStr,
        text:textStr,
        video:videoStr,
        videoUrl:videoStr2,
        videoIFrame:videoStr3
    }
});