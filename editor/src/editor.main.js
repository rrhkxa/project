/**
 * Created by zlf on 2017/7/4.
 */
define(function(require,exports,module){
    var $=require("jquery");
    var tools=require("utils")();
    var tips=require("tips");
    var baseTools=require("tools");
    require("xsortable");
    var win=window;
    var doc=document;
    var pos=require('pos');
    var fn=function(opt){
        this.defaults={
            cache:{},
            id:'[data-query="draftId"]',//草稿id
            cid:'[data-query="cid"]',//新闻id
            title:'[data-query="title"]',
            cardBox:'[data-query="cardBox"]',
            submit:'[data-query="submit"]',
            msgDraftBox:'[data-query="msgDraftBox"]',
            ok:'[data-query="ok"]',// 确认
            cancel:'[data-query="cancel"]',//取消
            close:'[data-query="close"]',
            mask:'[data-query="mask"]',
            browBox:'[data-query="browBox"]',
            preview:'[data-query="preview"]',
            server:{
                autoSave:window.baseUrl+'editor_xbb/autosave',
                submit:win.baseUrl+"editor_xbb/doPost",
                clearDraft:win.baseUrl+"bbs/post_card_ajax.php?a=clean_draft",
                url:win.baseUrl+"xbb/",
                preview:win.baseUrl+"editor_xbb/showInfo/",
                editLoad:win.baseUrl+'bbs/post_card_ajax.php'

            },
            pid:'[data-query="pid"]',
            msgBox:'[data-query="msgBox"]'//弹窗结构
        };
        this.options=$.extend(true,{},this.defaults,opt);
    };
    fn.prototype={
        init:function(){
            this.options.cache.uid=baseTools.getCookie("_discuz_uid")||11111111111;
            this.initStyle();
            this.bindEvent();
            this.editModeLoad();
        },

        bindEvent:function(){
            var _this=this;
            var options=this.options;
            var cache=options.cache;
            var limitCount;
            var $tools=$("#toolbar").closest("div");
            var tTop=$tools.offset().top;
            $(doc).on("click","#btn_load_draft",function(evt){
                $(doc).trigger("xbb.edit",[0]);
                evt.preventDefault()
            });
            var $copy=$tools.clone(true);
            var isShow;
            $copy.css({"position":"fixed","left":"-9999em","top":"-20px","width":"915px","margin-left":"-478px"}).appendTo("body");
            $(options.title).on("focus",function(evt){
                if(win.showMegFlag){
                    this.blur();
                    return;
                }
                $.trim(this.value)===tips.t22&&(this.value="");
                tools.computeStrLength(this.value)<61?$(this).css({"border":"1px solid #e4e4e4"}):$(this).css({"border":"1px solid red"});
            }).on("blur",function(){
                this.value=!$.trim(this.value)?tips.t22:this.value;
                if(tools.computeStrLength(this.value)>60){
                    $(this).css({"border":"1px solid red"});
                    $(options.browBox).hide();
                    tools.showMessage(tips.t14);

                }else{
                    $(this).css({"border":"1px solid #e4e4e4"})
                }
            });/*.on("keyup keypress",function(evt){
             var len;
             if(tools.computeStrLength(this.value)>60){
             len=tools.getCutEnd(this.value,60);
             this.value=this.value.substring(0,len);
             //tools.showMessage(tips.t14);
             }
             });*/
            $(doc).on("click",'[data-query="cancelVideoUrl"]',function(evt){
                $(options.mask).hide();
                $("#bomb_box_video").hide();
                evt.preventDefault();
            });

            $(win).on("scroll",function(){
                var st=$(win).scrollTop();
                if(st>tTop){
                    !cache.d&&$copy.css({'left':"50%"}).show();
                    cache.t=false;
                    cache.d=true;
                }else{
                    !cache.t&&$copy.css({'left':"-99999em"}).hide();
                    cache.t=true;
                    cache.d=false;
                }

            });
            //删除卡片
            $(options.cardBox).on("click",options.close,function(evt){
                var $li=$(this).closest("li");
                var data=$li.data("data");
                var type=$li.attr("data-type");
                if(type!=="text"){
                    tools.confirm({title:tips.t19,ok:{text:"确定",fn:function(){
                        $li.remove();$(doc).trigger("deleteCard",[type]);
                        var $ele=$(options.cardBox).find("textarea");
                        pos.save($ele.eq($ele.length-1)[0]);
                    }
                    },cancel:{text:"取消"},data:"card"});
                }else{
                    var v=$.trim($li.find("textarea").val());
                    if(v===data.defaultText||!v){
                        $li.remove();
                        var $ele=$(options.cardBox).find("textarea");
                        pos.save($ele.eq($ele.length-1)[0]);
                    }else{
                        tools.confirm({title:tips.t19,ok:{text:"确定",fn:function(){
                            $li.remove();$(doc).trigger("deleteCard",[type]);
                            var $ele=$(options.cardBox).find("textarea");
                            pos.save($ele.eq($ele.length-1)[0]);
                        }
                        },cancel:{text:"取消"},data:"card"});
                    }
                }

                evt.preventDefault();
            });

            //预览
            $(doc).on("click",options.preview,function(evt){
                if(cache.preview) return;
                var tempData=_this.getData();
                if(!_this.check(tempData,true)){return}
                cache.preview=true;
                var xhr=_this.fetchData(options.server.autoSave,tempData);
                xhr.done(function(response){
                    $(options.id).val(response.id);
                    win.open(win.baseUrl+options.server.preview+response.id)
                }).fail(function(){
                    delete cache.preview
                });
                evt.preventDefault()
            });
            $(options.cardBox).on("focusin","textarea",function(){
                if(win.showMegFlag){
                    this.blur();
                    return;
                }
                var temp;
                $(this).css({"border":"1px solid #e4e4e4"});
                var v=$.trim(this.value);
                var data=$(this).closest("li").data("data");
                if(!data){
                    this.value="";
                    return
                }
                var dt=data.defaultText;
                if(v===dt){
                    this.value="";
                    $(this).addClass('txt-writing');
                    temp=dt;
                }

            }).on("blur","textarea",function(){
                var _this=this;
                var v=$.trim(_this.value);
                var data=$(_this).closest("li").data("data");
                if(!data)return;
                var dt=data.defaultText;
                //_this.value=!v?dt:_this.value;
                if(!v){
                    _this.value=dt;
                    $(this).removeClass('txt-writing')
                }
                var max=data.type==="text"?16000:500;
                var msg;
                msg=(data.type==="video"||data.type==="videoUrl")?tips.t28:tips.t26;
                msg=data.type==="text"?tips.t32:msg;
                if(tools.computeStrLength(_this.value)>max){
                    $(_this).css({"border":"1px solid red"});
                    $(options.browBox).hide();
                    tools.showMessage(msg)
                }

            });
            /* $(options.cardBox).on("focusin","textarea",function(evt){
             //console.log("focusin");
             var ele=evt.target;
             var _h;
             var cType=ele.getAttribute("data-type");
             limitCount=cType==="pic"?250:1000;
             var $em=$(ele).closest("li").find("em.cont");
             setTimeout(function(){
             var len=_this.computeStrLength(ele.value);
             $em.html(len+"/"+limitCount);
             },10);

             $em.show();
             $(ele).off("keyup.my paste.my").on("keyup.my paste.my",function(evt){
             setTimeout(function(){
             var len=_this.computeStrLength(ele.value);
             $em.html(len+"/"+limitCount);
             if(len>limitCount){
             cType!=="pic"&&$(this).css("border","1px solid red");
             $em.css("color","red");
             }else{
             cType!=="pic"&&$(this).css("border","1px solid #e4e4e4");
             $em.css("color","inherit");
             }
             },100);
             });
             })
             .on("focusout","textarea",function(evt){
             var cType=this.getAttribute("data-type");
             if(cType==="pic"){
             //this.value=$.trim(this.value.substring(0,250));
             var $em=$(this).closest("li").find("em.cont");
             $em.html(250+"/"+250);
             }
             // console.log("focusout");
             var ele=evt.target;
             $(ele).closest("li").find("em.cont").hide();
             });*/


            $(doc).on("click",options.submit,function(evt){
                _this.postData(true);
                evt.preventDefault();
            });

            // 处理拖动
            $("#sortable").xsortable({
                axis:'y',
                handle:'.drag_drop',
                helper:'clone',
                placeholder: "ui-state-highlight"
            });

        },
        getData:function(){
            var _this=this;
            var options=this.options;
            var $item=$(options.cardBox).find('li[data-type]');
            var tempArr=[];
            $item.each(function(){
                var data=$(this).data("data");
                var v;
                if(data.type==="text"){
                    v=$.trim($(this).find("textarea").val());
                    if(v===data.defaultText||!v){
                        return true
                    }
                }
                tempArr.push(tools.getCardData(data.type,this));
            });

            return {
                content:tempArr,
                subject:$(options.title).val().replace(tips.t22,"")
            }

        },
        postData:function(flag){
            var _this=this;
            var options=this.options;
            var cache=this.options.cache;
            var tempData=this.getData();
            var fid = $('#fid').val();
            var extra = $('#extra').val();
            var sign = $('#sign').val();
            var url='bbs/post.php?action=newthread&topicsubmit=yes&fromcard=1&htmlon=10&big_task=yes&fid='+fid+'&extra='+encodeURIComponent(extra);
            var isEdit=tools.getQueryString("a")==="edit";
            var pid=tools.getQueryString("pid");
            var tid=tools.getQueryString("tid");
            url=isEdit?"bbs/post.php?action=edit&editsubmit=yes&fromcard=1&htmlon=10&fid="+fid+"&tid="+tid+"&pid="+pid+"&extra="+encodeURIComponent(extra):url;
            if(cache.submit) return;
            if(!this.check(tempData,flag)){
                return
            }
            cache.submit=true;
            //$.post(options.server.clearDraft,{tid:tid,uid:cache.uid},function(response){});
            _this.formPost({
                action:win.baseUrl+url,
                method:"post",
                data:[
                    {
                        name:"subject",
                        value:_this.htmlFilter(tempData.subject)
                    },
                    {
                        name:"message",
                        value:_this.convert(tempData.content)
                    },
                    {
                        name:"formhash",
                        value:$("#formhash").val()
                    },
                    {
                        name:"task_id",
                        value:$("#task_id").val()
                    }
                ]
            })

        },
        check:function(data,flag){
            //提交验证
            var tempData=data;
            var temp;
            var r1=/^[^\w\u4e00-\u9fa5,\.\!\?\[\]{}（）\\/~_\-\+\=%&*()@#—《》￥，"“”;^$；'‘：:。、！？【】｛｝…]+$/;//非法字符
            var count=0;//非法文本卡片计数
            var delArr=[];//删除多余非法文本
            var tempEle;
            var isShow=true;

            if(!tempData.subject.replace(/<\/?[a-zA-Z][^>]*>/g,"")){//过滤标签</a><a>
                flag&&tools.showMessage(tips.t12);
                $(this.options.title).val(tips.t22);
                return false
            }
            if(tools.computeStrLength(tempData.subject)>60){//标题超
                flag&&tools.showMessage(tips.t14);
                return false
            }
            if(tempData.content.length<1){//没有卡片
                flag&&tools.showMessage(tips.t13);
                return false
            }
            if(r1.test(tempData.subject)){//全部非法字符
                flag&&tools.showMessage(tips.t33);
                $(this.options.title).val(tips.t22);
                return false
            }
            for(var i=0,len=tempData.content.length;i<len;i++){
                temp=tempData.content[i];
                //图注
                if(temp.type==="pic"){
                    isShow=false;
                    if(tools.computeStrLength(temp.text)>500){
                        tools.showMessage(tips.t26);
                        return false;
                    }
                }
                //视频
                if(temp.type==="video"){
                    isShow=false;
                    if(tools.computeStrLength(temp.text)>500){
                        tools.showMessage(tips.t28);
                        return false;
                    }
                }
                //文本卡片
                if(temp.type==="text"){
                    if(tools.computeStrLength(temp.text)>16000){
                        tools.showMessage(tips.t25);
                        return false;
                    }
                    if(!temp.text.replace(/<\/?[a-zA-Z][^>]*>|\n/g,"")){//全标签视为空卡片
                        $('[data-id="'+temp.id+'"]').find("textarea").val(tips.t7);
                        tools.showMessage(tips.t13);
                        return false;
                    }
                    isShow=!isShow?false:r1.test(temp.text)&&++count&&delArr.push(temp.id);

                }
            }
            /*
             * 全部为非法卡片给出提示，否则提交正确卡片
             * 如果全部为非法卡片保留一个卡片文本置为默认删除多余卡片
             * */
            isShow=isShow&&$('[data-type="pic"],[data-type="video"]').length<1;
            isShow&&tools.showMessage(tips.t13);
            if(count){
                tempEle=$('[data-id="'+delArr[0]+'"]').find("textarea");
                if(count>1){
                    for(var l=delArr.length,c=1;c!==l;c++){
                        $('[data-id="'+delArr[c]+'"]').remove();
                    }
                }
                if(!isShow){return true}//虽有非法通过验证
                tempEle.val(tips.t7).text(tips.t7);
                tempEle.css({"border":"1px solid red"});
                tools.showMessage(tips.t35);
                return false
            }

            return true;
        },
        fetchData:function(url,data){
            return $.ajax({
                type:"POST",
                method:"POST",
                url:url,
                data:data,
                dataType:"json"
            })
        },
        formPost:function(opt){
            var cache=this.options.cache;
            var options=this.options;
            var method=opt.method||"get";
            var charset=opt.charset&&"accept-charset"+opt.charset||"";
            var inputEle='';
            var action=opt.action||"";

            if(cache.isSubmit) return;
            for(var i=0, l=opt.data.length;i<l;i++){
                inputEle+='<input type="hidden"  />'
            }
            var eleStr='<form action="'+action+'" method="'+method+'" '+charset+'>'+inputEle+'</form>';
            var $form=$(eleStr).appendTo("body");
            $form.find('input').each(function(i){
                this.value=opt.data[i].value;
                this.name=opt.data[i].name
            });
            cache.isSubmit=true;
            $(options.submit).css({"cursor":"default","background":"gray","border-radius":"4px"});
            $form[0].submit();


        },
        convert:function(data){
            /*
             * 对提交数据进行格式转换
             * 空文本卡片及空注释不会被创建
             *  */
            var eleStr="";
            var temp;
            var regExp=/[^\w\u4e00-\u9fa5,.!?\s\[\]{}\\/~_\-+=%&*()（）@#—《》￥^$，"“”'‘’：:。、！？【】｛｝…]/g;
            var cardStr="";
            for(var i=0,len=data.length;i<len;i++){
                if(data[i].type==="text"){
                    eleStr+=this.htmlFilter(data[i].text)?'[textcard]'+this.htmlFilter(data[i].text)+"[/textcard]":"";
                    continue
                }
                temp=data[i].text.replace(/<\/?[a-zA-Z][^>]*>|\n/g,"").replace(regExp,"").length<1?"":"[mtip]"+this.htmlFilter(data[i].text)+"[/mtip]";

                if(data[i].type==="pic"){
                    eleStr+='[piccard][img='+data[i].picwidth+','+(data[i].picheight||960)+']'+data[i].pic+'[/img]'+temp+'[/piccard]';
                    continue
                }
                if(data[i].type==="video"){
                    eleStr+='[videocard][video_src]'+data[i].video+'[/video_src]'+temp+'[/videocard]';
                }
            }
            return  eleStr

        },
        htmlFilter:function(str){
            var regExp=/[^\w\u4e00-\u9fa5,\:.!?\s\[\]{}\\/~_\-+=%&*()（）@#—《》￥，^$"“”‘’'：;；。<>、！？【】｛｝…]/g;
            return str.replace(/(\n|<br[^>]*>){3,}/g,'\n\n\n').replace(/\u0020{2,}/g," ").replace(/<\/?[a-zA-Z][^>]*>/g,"").replace(regExp,"");
        },
        convertDataStr:function(dataStr){
            //解析编辑模式字符数据
            var tempArr=dataStr.replace(/[\r\n\t]/g,"");
            tempArr=tempArr.match(/\[(\w+)card\][\s\S]*?\[\/\1card\]/g)||[];
            var data=[];
            var r1=/\[mtip\]([\s\S]*?)\[\/mtip\]/;
            var r2=/\[video_src\]([\s\S]*?)\[\/video_src\]/;
            var r3=/\[img\=(\d+),(\d+)\](\S+?)(?:-w(\d+)wm(\d)\.\w+)*\[\/img\]/;//1宽2高3原地址4宽5角度
            var r4=/^\[textcard\][\s\S]+?/;
            var r5=/^\[piccard\][\s\S]+?/;
            var r6=/^\[videocard\][\s\S]+?/;
            var r7=/\[textcard\]([\s\S]*?)\[\/textcard\]/;
            var r8=/<br[^>]*>/g;//TODO 有待优化
            var r9=/((<br[^>]*>){2,})/g;
            var temp,tempStr,tM;

            for(var i=0,len=tempArr.length;i<len;i++){
                temp={};
                data.push(temp);
                tempStr=tempArr[i];
                temp.type=r4.test(tempStr)?"text":r5.test(tempStr)?"pic":r6.test(tempStr)?"video":"unknow";
                temp.text=temp.type==="text"?(tM=tempStr.match(r7))&&tM[1]:(tM=tempStr.match(r1))&&tM[1];
                temp.text=temp.text&&temp.text.replace(r8,"\n")||"";//后台会把前台传入的\n 转换成 <br /> 返回 所以编辑模式要处理 两个\n是一个行换，但是两个换行是三个\n - -！
                temp.video=(tM=tempStr.match(r2))&&tM[1];
                temp.pic=(tM=tempStr.match(r3))&&tM[3];
                if(!temp.pic)continue;
                temp.picwidth=tM[1];
                temp.picheight=tM[2];
                temp.angle=tM[5];
                //temp.pic=tools.getSrc(temp.pic,tM[1],tM[2],tM[5]||0);
            }

            return data
        },
        editModeLoad:function(){
            var _this=this;
            var options=this.options;
            var cache=options.cache;
            var isEdit=tools.getQueryString("a")==="edit";
            if(!isEdit) return;
            var pid=tools.getQueryString("pid");
            $.ajax({
                type:"GET",
                method:"GET",
                url:options.server.editLoad,
                dataType:"json",
                data:{
                    pid:pid,
                    a:"load_post"
                },
                success:function(response){
                    if(response.error) return;
                    cache.uid=response.uid;
                    $(doc).trigger("updateUid",[cache.uid]);
                    var data=_this.convertDataStr(response.content);
                    data.title=response.title;
                    $(doc).trigger("xbb.load",[data])
                },
                error:function(){

                }
            });
        },
        initStyle:function(){
            var style='' +
                '<style type="text/css">' +
                '.webuploader-pick {'+
                'position: relative;'+
                'display: inline-block;'+
                'cursor: pointer;'+
                'background: transparent;'+
                'padding: 1px 34px;'+
                'color: #fff;'+
                'text-align: center;'+
                'border-radius: 3px;'+
                'overflow: hidden;'+
                '}' +
                '.progress_num{width:0}' +
                'div.bomb_box_face{z-index:140}' +
                '.f_p_seach .text{width:743px;}' +
                '</style>';
            $(style).appendTo("body");
        }

    };
    module.exports=function(opt){
        return new fn(opt);
    }
});