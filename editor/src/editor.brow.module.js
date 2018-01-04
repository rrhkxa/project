/**
 * Created by zlf on 2017/7/12.
 */
define(function(require,exports,module){
    var $=require("jquery");
    var template=require("artTemplate");
    var tml=require("browTml");
    var browJson=require("browJson");
    var tools=require("utils")();
    var baseTools=require("tools");
    var tips=require("tips");
    var pos=require('pos');
    var win=window;
    var doc=document;
    if(!win.console){
        win.console={};
        win.console.log=function(){};
    }
    var fn=function(opt){
        this.defaults={
            cache:{},
            sItem:'[data-s]',
            ele:"",
            box:'[data-query="brow"]',
            tag:'[data-query="tag"]',
            browBox:'[data-query="browBox"]',
            browBtn:'[data-query="browBtn"]',
            cardBox:'[data-query="cardBox"]'
        };
        this.options=$.extend(true,{},this.defaults,opt);
    };
    fn.prototype={
        init:function(){
            this.initStyle();
            this.bindEvent();

        },
        bindEvent:function(){
            var _this=this;
            var options=this.options;
            var cache=options.cache;
            cache.currentNode=1111;
            $(doc).on("click",options.sItem,function(evt){
                _this.insertEmoticon(this.getAttribute("data-s"));
                evt.preventDefault()
            });
            $(doc).on("click",options.box,function(){
                options.cache.m=true;
                setTimeout(function(){
                    options.cache.m=false
                },100);
            });
            $(doc).on("click",function(evt){
                if(evt.target.id==="f_p_phiz"||options.cache.m){return}
                $(options.box).hide();
            });


            $(doc).on("focusin focusout mousedown mouseup keyup keydown select",'textarea',function(evt){
                cache.currentNode=this;

                pos.save(this);
            });
            $(doc).on("click",options.browBtn,function(evt){
                var $li=$(options.cardBox).find("li");
                if($li.length<1){
                    tools.showMessage(tips.t30);
                    return
                }
                $(options.box).toggle();
                evt.preventDefault();
            });
            $(doc).on("click",options.tag,function(evt){
                var index=$(this).index();
                $(this).addClass("face_active").siblings().removeClass("face_active");
                $(options.browBox).eq(index).show().siblings().hide();
                evt.preventDefault();
            });

        },
        insertEmoticon:function(s){
            var ele=this.options.cache.currentNode;
            if(ele===1111){
                tools.showMessage(tips.t30);
                $(this.options.box).hide();
                return;
            }
            if(!ele)return;
            baseTools.os().mac&&baseTools.browser().safari&&win.scrollTo(0,ele.getBoundingClientRect().top+$(window).scrollTop()-300);
            if(ele.value===tips.t7 || ele.value === tips.t10 || ele.value === tips.t6){
                ele.value='';
            }
            pos.insert(s);
            pos.save(ele);
        },
        initStyle:function(){
            var _this=this;
            var options=this.options;
            options.ele&&$(options.ele).appendTo("body");
            var render=template.compile(tml.tml1);
            var eleStr=render({
                list1:browJson.list1,
                list2:browJson.list2
            });
            $(eleStr).appendTo("body");
        }

    };
    module.exports=function(opt){
        return new fn(opt)
    }
});