/**
 * Created by zlf on 2017/7/6.
 */
define(function(require,exports,module){
    var $=require("jquery");
    var template=require("artTemplate");
    var msg=require("msgTpl");
    var cardTpl=require("cardTemplate");
    var tips=require("tips");
    var win=window;
    var doc=document;
    var fn=function(opt){
        this.defaults={
            cache:{},
            ok:'[data-query="ok"]',// 确认
            cancel:'[data-query="cancel"]',//取消
            close:'[data-query="close"]',
            mask:'[data-query="mask"]',
            msgBox:'[data-query="msgBox"]',//弹窗结构
            mBox:'[data-query="mBox"]'//弹窗结构

        };
        this.options=$.extend(true,{},this.defaults,opt);
    };
    fn.prototype={
        constructor:fn,
        cache:{},
        init:function(){
            this.initStyle();
            this.bindEvent();
            return this;
        },
        bindEvent:function(){
            var _this=this;
            var options=this.options;
            var cache=options.cache;
            $(doc).off("click.ko").on("click.ko",options.ok+","+options.cancel,function(evt){
                $(this).closest(options.msgBox).remove();
                $(options.mask).hide();
                evt.preventDefault();
            });
            $(doc).off("click.kc").on("click.kc",options.close,function(evt){
                var $ele=$(this).closest(options.msgBox);
                if($ele.length>0){
                    $ele.hide();$(options.mask).hide();
                }
                evt.preventDefault();
            })

        },
        showMessage:function(tips,flag,t){
            win.showMegFlag=true;
            var cache=this.options.cache;
            var options=this.options;
            var _h;
            cache.msgRender=cache.msgRender?cache.msgRender:template.compile(msg.message);
            cache.$msgMessage=$(cache.msgRender({msg:tips})).appendTo("body");
            $(options.mask).show();
            setTimeout(function(){$("#blurFocus1977").focus()},300);//兼容IE 9
            $(options.mask).one("click.msk",function(){
                //cache.$msgMessage.remove();
                $(options.mBox).remove();
                $(this).hide();
                clearTimeout(_h);
                win.showMegFlag=false;
            });
            if(!flag){
                _h=setTimeout(function(){
                    //cache.$msgMessage.remove();
                    $(options.mBox).remove();
                    $(options.mask).hide();
                    $(options.mask).off("click.msk");
                    win.showMegFlag=false;
                },t||3000);
            }
        },
        showMsg:function(tips,fn){

            var cache=this.options.cache;
            var options=this.options;
            var _h;
            var render=template.compile(msg.message2);
            $(render({msg:tips})).appendTo("body");
            $(options.mask).show();
            setTimeout(function(){$("#blurFocus1977").focus()},300);//兼容IE 9
            fn&&$(doc).on("click",'[data-query="tipsClose"]',function(evt){
                $(options.mask).hide();
                $(this).closest(options.msgBox).remove();
                fn();
                evt.preventDefault();
            });
        },
        confirm:function(opt){
            var cache=this.options.cache;
            var options=this.options;
            cache.confirmRender=cache.confirmRender?cache.confirmRender:template.compile(msg.confirm);
            var confirmEleStr=cache.confirmRender({
                title:opt.title,
                okText:opt.ok.text,
                cancelText:opt.cancel.text
            });
            $(options.mask).appendTo("body").show();
            var $ele=$(confirmEleStr);
            cache.$cfBox=$ele.appendTo("body");
            opt.data&&$ele.data("data",opt.data);
            if(opt.ok.fn){
                $ele.find(options.ok).one("click",function(evt){
                    opt.ok.fn();
                    evt.preventDefault();
                });
            }

            opt.cancel.fn&&$ele.find(options.cancel).one("click",function(evt){
                opt.cancel.fn();
                evt.preventDefault();
            });


        },
        initStyle:function(){
            $(this.options.mask).length<1&&$(msg.mask).appendTo("body");
            $("#blurFocus1977").remove();
            $('<input id="blurFocus1977" type="text" style="position:fixed;left:-9999em;top:0;" />').appendTo("body")
        },
        generate:function(opt){
            return this["fn"+opt.type]&&this["fn"+opt.type](opt)
        },
        register:function(opt){
            var cache=this.options.cache;
            this.constructor.prototype["fn"+opt.type]=function(data){
                var tempFn=opt.type+"Render";
                cache[tempFn]=cache[tempFn]?cache[tempFn]:template.compile(cardTpl[opt.tml||opt.type]);
                return cache[tempFn](data);
            };
            this.constructor.prototype["getData"+opt.type]=function(ele){
                var data;
                return (data=opt.getData&&opt.getData(ele))?data:{}
            }
        },
        getCardData:function(type,ele){
            return this["getData"+type]&&this["getData"+type](ele)
        },
        getQueryString:function(name){
            var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
            var r = win.location.search.substring(1).match(reg);
            return r&&decodeURIComponent(r[2]);
        },
        getSrc2:function(src,w,h,angle){
            return src.split("?")[0]+'?imageMogr2/rotate/' +
                angle+
                '/thumbnail/' +
                w+
                'x>';
        },
        getSrc:function(src,w,h,angle){
            return src.split("?")[0]+'?imageMogr2/rotate/' +
                angle+
                '|imageView2/2/w/' +
                w+
                '|watermark/2/text/54ix5Y2h5rG96L2m/font/5b6u6L2v6ZuF6buR/fontsize/300/fill/I0ZGRkZGRg==/dissolve/100/gravity/SouthEast/dx/5/dy/5/';
        },
        computeStrLength:function(str){
            var count=0;
            if(str.length<1)return 0;
            var regExp=/[^\w\u4e00-\u9fa5,\n.!?<>\[\]{}\\/~_\-+=%&*()（）@#—《》￥，。、！？【】｛｝…]/g;
            str=str.replace(/\[[\:\u4e00-\u9fa5]+\]/g,"xxxx").replace(regExp,"x").replace(/[^\x00-\xff]/g,"xx");
             //var regExp=/[^\x00-\xff]/;///[\u4e00-\u9fa5]+/;
            return str.length;
        },
        getCutEnd:function(str,numLimit){
            var count=0;
            if(str.length<1)return 0;
            str=str.replace(/\[[\:\u4e00-\u9fa5]+\]/g,"xxxx");
            var regExp=/[^\x00-\xff]/;///[\u4e00-\u9fa5]+/;
            for(var i=0, len=str.length;i<len;i++){
                regExp.test(str[i])?count+=2:count++;
                if(count>numLimit){
                    break
                }
            }
            return i;
        },
        setImgInfo:function(ele){
            var _this=this;
            var nw=ele.naturalWidth||ele.width;
            var nh=ele.naturalHeight||ele.height;
            var regExp=/rotate\/(\d+)\|/;

            var w,h,m;
            w=nw>960?960:nw;
            h=Math.round(w/nw*nh);
            var angle=(m=ele.src.match(regExp))&&+m[1]||0;
            //$(this).css({"width":w+"px"});
            var $li=$(ele).closest("li");
            $(ele).closest("li").data("data",{
                width:w,
                height:h,
                src:ele.src,//,_this.getSrc(ele.src,w,h,angle),
                angle:angle,
                type:"pic",
                defaultText:tips.t6,
                id:$li.attr("data-id")
            });

        },
        setPosition:function(){
            $('html, body').stop(true,true).animate({scrollTop:$(doc).height()}, 100);
        }

    };
    module.exports=function(opt){
        return new fn(opt).init();
    }
});
