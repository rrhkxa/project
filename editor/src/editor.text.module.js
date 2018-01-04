/**
 * Created by zlf on 2017/7/11.
 */
define(function(require,exports,module){
    var $=require("jquery");
    var tools=require("utils")();
    var tips=require("tips");
    tools.register({
        type:"text",
        getData:function(ele){
            return {
                type:"text",
                text:$(ele).find("textarea").val(),
                pic:null,
                video:null,
                id:$(ele).attr("data-id")

            }
        }
    });
    var doc=document;
    var fn=function(opt){
        this.defaults={
            cache:{},
            cardBox:'[data-query="cardBox"]',
            addCard:'[data-query="addTextCardBtn"]'
        };
        this.options=$.extend(true,{},this.defaults,opt);
    };
    fn.prototype={
        init:function(){
            this.bindEvent();
        },
        bindEvent:function(){
            var _this=this;
            var options=this.options;
            $(doc).on("click",options.addCard,function(evt){
                var temp=tips.t7;
                var $ele=$(tools.generate({
                    type:"text",
                    defaultText:temp,
                    id:+(new Date())
                }));
                $ele.data("data",{type:"text",defaultText:temp});
                $(options.cardBox).append($ele);
                $ele.find("textarea").focus();
                _this.setPosition();
            })
        },
        setPosition:function(){
            $('html, body').stop(true,true).animate({scrollTop:$(doc).height()}, 100);
        }
    };
    module.exports=function(opt){
        return new fn(opt)
    }
});