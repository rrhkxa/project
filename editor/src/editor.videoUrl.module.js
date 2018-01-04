/**
 * Created by zlf on 2017/7/11.
 */
define(function(require,exports,module){
    var $=require("jquery");
    var tips=require("tips");
    var tools=require("utils")();
        tools.register({
            type:"videoUrl",
            tml:"videoIFrame",
            getData:function(ele){
                var data=$(ele).data("data");
                return {
                    type:"video",
                    video:data.src,
                    pic:null,
                    text:$(ele).find("textarea").val().replace(data.defaultText,""),
                    id:data.id
                }
            }
        });
    var doc=document;
    var fn=function(opt){
        this.defaults={
            cache:{},
            cardBox:'[data-query="cardBox"]',
            addVideoCardBtn:'[data-query="addVideoUrlCardBtn"]',//弹窗确定
            box:'[data-query="videoUrlBox"]',//视频弹窗
            mask:'[data-query="mask"]',
            urlInput:'[data-query="urlInput"]',//url 地址
            addCard:'[data-query="videoCardBtn"]',//点击弹窗
            count:'[data-query="videoCount"]',
            max:5
        };
        this.options=$.extend(true,{},this.defaults,opt);
    };
    fn.prototype={
        init:function(){
          this.bindEvent();
          $.videoUrlCache=this.options.cache;
            this.options.cache.videoCount=0;
        },
        bindEvent:function(){
            var _this=this;
            var options=this.options;
            var $box=$(options.box);
            var $mask=$(options.mask);
            var $input=$(options.urlInput);
            var cache=options.cache;
            $(doc).on("click",options.addVideoCardBtn,function(evt){
                var src=$.trim($input.val());//TODO 视频弹窗
                var id=src.match(/\/id_([\w\=]+)\.html/);
                if(!src||!(src=_this.getSrc(src))){
                    $box.hide();
                    $mask.hide();
                    $input.val("");
                    /*setTimeout(function(){
                        $box.show();
                        $mask.show();
                    },3000);*/
                    tools.showMessage(tips.t9);
                    return
                }
               /* if(cache[src]){
                    $box.hide();
                    $mask.hide();
                    $input.val("");
                    tools.showMessage(tips.t27);
                    return
                }
                cache[src]=true;*/
                var temp=tips.t10;
                var $ele=$(tools.generate({
                    type:"videoUrl",
                    src:src,
                    defaultText:temp,
                    id:+(new Date())
                }));
                $ele.data("data",{type:"videoUrl",src:"http://xtv.xcar.com.cn/player.php?vid="+id[1],defaultText:temp});
                $(options.cardBox).append($ele);

                $(options.count).text(++cache.videoCount);
                $box.hide();
                $mask.hide();
                $input.val("");
                _this.setPosition();
                $ele.find("textarea").focus();
                evt.preventDefault()
            });
            $(doc).on("click",options.addCard,function(evt){
                var count=+$(options.count).text();
                if(count>=options.max){
                    tools.showMessage(tips.t21);
                    return
                }
                $mask.show();
                $box.show();
                evt.preventDefault()
            });

        },
        getSrc:function(url){
            var temp=url.match(/\/id_([\w\=]+)\.html/);
            //return temp?"http://player.youku.com/player.php/sid/"+temp[1]+"/v.swf":false;
            return temp?"http://xtv.xcar.com.cn/player.php?vid="+temp[1]:false
        },
        setPosition:function(){
            $('html, body').stop(true,true).animate({scrollTop:$(doc).height()}, 100);
        }

    };
    module.exports=function(opt){
        return new fn(opt)
    }
});