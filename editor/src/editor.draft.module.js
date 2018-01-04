/**
 * Created by zlf on 2017/7/14.
 */
define(function(require,exports,module){
    var $=require("jquery");
    var tools=require("utils")();
    var tips=require("tips");
    var baseTools=require("tools");
    var fn=function(opt){
        this.defaults={
            id:'[data-query="draftId"]',
            cid:'[data-query="cid"]',
            title:'[data-query="title"]',
            tid:'#tid',
            getDraftUrl:'editor_xbb/getDraftByWhere',
            cardBox:'[data-query="cardBox"]',
            saveDraftBtn:'[data-query="saveDraftBtn"]',
            server:{
                autoSave:window.baseUrl+'editor_xbb/autosave'
            },
            time:30000,
            cache:{}
        };
        this.options=$.extend(true,{},this.defaults,opt);
    };
    var doc=document;
    var win=window;
    //require("draft");
    fn.prototype={
        cache:{},
        init:function(){
            var options=this.options;
            var cache=options.cache;
            this.bindEvent();
            this.autoSave();
            cache.uid=baseTools.getCookie("_discuz_uid")||11111111111;
            cache.tid=$(options.tid).val()||"";
            var isEdit=tools.getQueryString("a")==="edit";
            !isEdit&&this.initDraft();
        },
        bindEvent:function(){
            var options=this.options;
            var cache=options.cache;
            var _this=this;
            $.imgCountDel=0;//图片删除计数
            //测试
            $(doc).on("click",'[data-query="addCraft"]',function(){
                var id=$(options.id).val();
                $(doc).trigger("xbb.edit",[id]);
            });

            //响应删除事件
            $(doc).on("deleteCard",function(evt,type){
                //type==="pic"&&$.imgCountDel++;
                _this.saveDraft(false,false);
            });

            //更新uid
            $(doc).on("updateUid",function(evt,uid){
                cache.uid=uid
            });

            //保存草稿
            $(doc).on("click",options.saveDraftBtn,function(evt){
                _this.saveDraft(true,true);
                evt.preventDefault();
            });
            // 响应编辑加载
            $(doc).on("xbb.load",function(evt,data){
                $(options.cardBox).empty();
                if (data.title) {
                    $(options.title).val(data.title);
                }
                _this.render(data);
                $('div[data-query="video"]').trigger("click");

            });
            $(doc).on("draft.load",function(evt,response){
                $(options.cardBox).empty();
                var content=response.content;
                if (content.title) {
                    $(options.title).val(content.title);
                }
                $(options.id).val(response._id);
                _this.render(content.content||[{type:"text"}]);
                $('div[data-query="video"]').trigger("click");

            });
            $(doc).on("xbb.edit",function(evt,id){//加载草稿
                var xhr=_this.fetchData(win.baseUrl+options.getDraftUrl,{
                    uid:cache.uid,
                    tid:cache.tid
                },"POST");
                xhr.done(function(response){
                    if(!response){
                        tools.showMessage(tips.t29);
                        return;
                    }
                    tools.confirm({
                        title:tips.t23,
                        ok:{
                            text:"确定",
                            fn:function(){
                                $(options.cardBox).empty();
                                var content=response.content;
                                if (content.title) {
                                    $(options.title).val(content.title);
                                }
                                $(options.id).val(response._id);
                                _this.render(content.content);
                                $('div[data-query="video"]').trigger("click");
                            }
                        },
                        cancel:{
                            text:"取消"
                        }
                    });

                }).fail(function(xhr,tips,et){

                });

            });
        },
        initDraft:function(flag){
            var options=this.options;
            var cache=options.cache;
            var _this=this;
            var xhr=_this.fetchData(win.baseUrl+options.getDraftUrl,{uid:cache.uid,tid:cache.tid},"POST");
            xhr.done(function(response){
                if(!response){
                    return
                }

                $(doc).one("tips.tip",function(){
                    var temp={
                        title:'<b style="font-size:14px;">'+tips.t23+'</b>',
                        ok:{
                            text:'确定',
                            fn:function(){
                                $(doc).trigger("draft.load",[response]);
                            }
                        },
                        cancel:{
                            text:'取消',
                            fn:function(){
                                $(options.cardBox).find("textarea").eq(0).focus().blur();
                            }
                        }
                    };
                    tools.confirm(temp);
                });
                baseTools.browser().ie<10?tools.showMsg(tips.t42,function(){$(doc).trigger("tips.tip")}):$(doc).trigger("tips.tip");


            });



        },
        render:function(arr){
            if(!arr)return;
            var options=this.options;
            var temp;
            var m;
            var regExp=/rotate\/(\d+)\|/;
            var regExpW=/\/w\/(\d+)\|/;
            var id=1;
            for(var i=0,len=arr.length;i<len;i++){
                temp={
                    id:id++||+(new Date()),
                    type:arr[i].type,
                    src:arr[i].m3u8_url||arr[i].oPic||arr[i].pic||arr[i].video,
                    angle:arr[i].angle||arr[i].pic&&(m=arr[i].pic.match(regExp))&&+m[1]||0,
                    width:arr[i].width||arr[i].pic&&(m=arr[i].pic.match(regExpW))&&+m[1]||960,
                    height:arr[i].height||arr[i].picheight,
                    defaultText:arr[i].text||arr[i].description//文本卡片读text 图片卡片读description
                };
                if(!temp.defaultText){
                    temp.defaultText=arr[i].type==="pic"?tips.t6:arr[i].type==="text"?tips.t7:tips.t8;
                }
                if(arr[i].type==="video"){
                    temp.type=arr[i].qiniu_id?"video":"videoUrl";
                    temp.xbb_qiniu_id=arr[i].qiniu_id;
                    temp.duration=arr[i].duration;
                    temp.video_id=arr[i].video_id;// 备用
                    temp.height=arr[i].cover_height;
                    temp.width=arr[i].cover_width;
                    temp.video=arr[i].m3u8_url;
                }

                var $ele=$(tools.generate(temp));
                temp.defaultText=arr[i].type==="pic"?tips.t6:arr[i].type==="text"?tips.t7:tips.t8;
                $ele.data("data",temp);
                if(temp.defaultText !== tips.t6 || temp.defaultText !== tips.t7 || temp.defaultText !== tips.t8){
                    $ele.find('textarea').addClass('txt-writing');
                }
                $(options.cardBox).append($ele);
            }
            $(options.cardBox).find("textarea:last").focus();

        },
        getData:function(){
            var _this=this;
            var options=this.options;
            var cache=options.cache;
            var $item=$(options.cardBox).find('li[data-type]');
            var tempArr=[];
            $item.each(function(){
                var data=$(this).data("data");
                var v;   //所有的卡片将会保存
                /*if(data.type==="text"){
                    v=$.trim($(this).find("textarea").val());
                    if(v===data.defaultText||!v){
                        return true
                    }
                }*/
                tempArr.push(tools.getCardData(data.type,this));
            });

            return {
                banner:win.cover&&cover.getData().src||null,
                content:tempArr,
                tid:cache.tid,
                uid:cache.uid,
                subject:$(options.title).val().replace(tips.t22,"")/*,
                draft_content_id:+$(options.id).val(),
                cid:+$(options.cid).val()*/
            }

        },
        getDataCheck:function(){
            var _this=this;
            var options=this.options;
            var $item=$(options.cardBox).find('li[data-type]');
            var tempArr=[];
            $item.each(function(){
                var data=$(this).data("data");
                var v;   //所有的卡片将会保存
                if(data.type==="text"){
                     v=$.trim($(this).find("textarea").val());
                     if(v===data.defaultText||!v){
                     return true
                     }
                 }
                tempArr.push(tools.getCardData(data.type,this));
            });

            return {
                banner:win.cover&&cover.getData().src||null,
                content:tempArr,
                subject:$(options.title).val().replace(tips.t22,"")/*,
                 draft_content_id:+$(options.id).val(),
                 cid:+$(options.cid).val()*/
            }

        },
        saveDraft:function(flag,isCheck){
            var _this=this;
            var options=this.options;
            var tempData=_this.getData();
            var xhr;
            isCheck=typeof isCheck !=="undefined"?isCheck:true;
            if(isCheck&&!this.check(tempData,flag)){
                return
            }
            xhr=_this.fetchData(options.server.autoSave,tempData);
            xhr.done(function(response){
                if(response.error!==false){
                    return
                }
                flag&&tools.showMessage(tips.t15)
            }).fail(function(xhr,tips,throwTips){
                console.log(xhr,tips,throwTips)
            });
        },
        autoSave:function(){
            var cache=this.cache;
            var _this=this;
            var time=this.options.time;
            var _h=$.autoSave_h=setTimeout(function(){
                _this.saveDraft();
                _h=$.autoSave_h=setTimeout(arguments.callee,time);
            },time);
        },
        check:function(data,flag){
            var tempData=data;
            var textLimit,msg;
            /*if(!tempData.banner){
                flag&&tools.showMessage(tips.t11);
                return false
            }*/
            var tempCheckData=this.getDataCheck();
            if(!tempData.subject&&tempCheckData.content.length<1){
                flag&&tools.showMessage(tips.t17);
                return false
            }
            /*if(!tempData.subject){
                flag&&tools.showMessage(tips.t12);
                return false
            }*/
           /* if(tools.computeStrLength(tempData.subject)>60){
                flag&&tools.showMessage(tips.t14);
                return false
            }*/
            /*if(tempData.content.length<1){
                flag&&tools.showMessage(tips.t13);
                return false
            }*/




            /*for(var i=0,len=tempData.content.length;i<len;i++){
                temp=tempData.content[i];
                textLimit=temp.type==="text"?1600:500;
                msg=temp.type==="text"?tips.t25:temp.type==="pic"?tips.t26:tips.t28;
                if(tools.computeStrLength(temp.text)>textLimit){
                    tools.showMessage(msg);
                    return false;
                }
            }*/

            return true;
        },
        fetchData:function(url,data,type){
            return $.ajax({
                type:type||"POST",
                method:type||"POST",
                url:url,
                data:data,
                dataType:"json"
            })
        }

    };
    module.exports=function(opt){
        return new fn(opt);
    }
});