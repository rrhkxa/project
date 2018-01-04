/**
 * Created by zlf on 2017/7/26.
 */
define(function(require,exports,module){
    var eleStr='' +
        '<div class=" bomb_box_face clearfix " id="cmd_bq" style="display: none;">'+
            '<div class="face_list ie6fixed_t">'+
                '<div class="face_tab_list">'+
                    '<ul class="face_tab clearfix">'+
                        '<li class="face_active" data-query="tag"><a href="#">基础表情</a></li>'+
                        '<li class=""  data-query="tag"><a href="#">咔咔</a></li>'+
                    '</ul>'+
                '</div>'+
                '<div class="face_img_list">'+
                    '<div  style="display: block;" data-query="browBox">'+
                        '<ul class="xim_cgipad">' +
                            '{{each list1 as value i}}'+
                                '<li style="float: left;"><a href="#"><img  src="{{value.src}}" alt="{{value.title}}" title="{{value.title}}" data-s="{{value.title}}" width="30" height="30" ></a></li>' +
                            '{{/each}}'+
                        '</ul>'+
                    '</div>'+
                    '<div style="display: none;"  data-query="browBox">'+
                        '<ul class="xim_cgipad">' +
                            '{{each list2 as value i}}'+
                                '<li style="float: left;"><a href="#"><img src="{{value.src}}"  alt="{{value.title}}" title="{{value.title}}"  data-s="{{value.title}}" width="30" height="30" ></a></li>' +
                            '{{/each}}'+
                        '</ul>'+
                    '</div>'+
                '</div>'+
            '</div>'+
        '</div>';
    module.exports={
        tml1:eleStr
    }
});