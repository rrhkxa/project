/**
 * Created by zlf on 2017/7/4.
 */
define(function(require,exports,module){
    var confirmStr='' +
        '<div class="bomb_box bomb_box_card ie6fixed_m"  data-query="msgBox">'+
            '<a id="cgt_box_confirm_close" href="#" class="close" data-query="close"></a>'+
            '<p id="cgt_confirm_message">'+
                '{{#title}}'+
                '<br>'+
            '</p>'+
            '<div class="bomb_box_btn">'+
                '<a  href="#"  data-query="ok" class="cancel_btn" style="margin-right:10px;">{{okText}}</a>'+
                '<a  href="#"  data-query="cancel" class="cancel_btn">{{cancelText}}</a>'+
            '</div>'+
        '</div>';
    var maskStr='<div id="cgt_graybg_pop" data-query="mask" class="graybg_pop ie6fixed_t" style="display:none"></div>';
    var messageStr='<div data-query="mBox" class="bomb_box bomb_box_save ie6fixed_m"><p>{{msg}}</p> </div>';
    var messageStr2='<div data-query="msgBox" class="bomb_box bomb_box_save ie6fixed_m"><a id="cgt_box_confirm_close" href="#" class="close" data-query="tipsClose"></a><p style="margin-top:40px;text-align:left;padding:0 20px">{{#msg}}</p> </div>';


    module.exports={
        confirm:confirmStr,
        mask:maskStr,
        message:messageStr,
        message2:messageStr2
    }
});