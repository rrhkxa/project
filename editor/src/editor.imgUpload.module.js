/**
 * Created by zlf on 2017/7/6.
 */
define(function(require,exports,module){
    var $=require("jquery");
    var tips=require("tips");
    var imgUploader=require("imgUploader");
    var tools=require("utils")();
        tools.register({
            type:"pic",
            getData:function(ele){
                var $ele=$(ele);
                var data=$ele.data("data");
                return {
                    type:"pic",
                    pic:data.src||$ele.find('img[data-angle]').attr("src")||"",//
                    text:$ele.find("textarea").val().replace(data.defaultText,""),
                    picwidth:data.width,
                    picheight:data.height,
                    angle:data.angle,
                    id:data.id
                }
            }
        });
    var win=window;
    var doc=document;
    win.setImgInfo=function(ele){
        tools.setImgInfo(ele)
    };
    var fn=function(opt){
        this.defaults={
            cache:{},
            progress:'[data-query="progress"]',
            imgCount:'[data-query="imgCount"]',//上传图片当前计数
            total:'[data-query="imgTotal"]',
            cardBox:'[data-query="cardBox"]',
            addCard:'[data-query="addPic"]',//新增图片卡片
            imgUploadBox:'[data-query="imgUploadBox"]',//图片上传弹层
            imgMaxWidth:910,
            uploaderOptions:{
                server:win.baseUrl+"bbs/post_card_ajax.php?a=upload_pic",
                swf: win.baseUrl+'bbs/uploadify/Uploader.swf',
                fileNumLimit:1000000,
                threads:20,
                runtimeOrder:"html5,flash",
                pick:"#file_upload"//上传按钮
            },
            getRotate:win.baseUrl+"bbs/post_card_ajax.php?a=rotate_pic",
            mask:'[data-query="mask"]',
            isHasQR_code:true,
            QR_Server:win.baseUrl+"editor_xbb/qrcodUpload",
            max:50//图片最大上传数量
        };
        this.options=$.extend(true,{},this.defaults,opt);
    };
    fn.prototype={
        init:function(){
            this.initStyle();
            this.initUploader();
            this.bindEvent();


        },
        initUploader:function(){
            var options=this.options;
            var cache=$.imgCache=options.cache;
            cache.uploader=imgUploader({
                uploaderOptions:options.uploaderOptions//上传按钮
            }).init();
        },
        bindEvent:function(){
            var cache=this.options.cache;
            var options=this.options;
            //var t=win.__T=win.__T||+(new Date());
            var _this=this;
            cache.imgCount=0;
            var fileId;
            var _H;
            var uploader=cache.uploader;
            var $progress=$(options.progress);
            var _hPicText;
            var eA,eB,eC;//这是一个神奇的需求为了满足产品变态的提示文案（7）种创建三种标识
            var $buttonMask=$('<div style="background-color:#fff;position:absolute;left:0;top:0;right:20px;bottom:0;opacity:0.1;filter:alpha(opacity=10)"></div>');
            var uploadComplete;
            var $ele;
            eA=eB=eC="";
            var eMsg={
                "A":"t37",//对应提示信息
                "B":"t36",
                "C":"t20",
                "AB":"t39",
                "BC":"t40",
                "AC":"t41",
                "ABC":"t38"
            };
            /*
            * 上传图片的错误有3种，分别是，大小不对（A），类型不对(B)，总数超了(C)，
            * 由此可以组合出，AB AC BC ABC 所以一共是7种提示 PS: - -!
            * */
            options.$mask=$(options.mask);
            cache.tempCount=0;// 一批几个计数
            cache.tempCount1=0;//被处理计数
            cache.tempErrorCount=0;//一批错误计数
            var $cardBox=$(options.cardBox);//卡片父元素
            cache.imgUploadCallback=[];
            //点击弹层
            $(doc).on("click",options.addCard,function(evt){
                if(uploadComplete)return;
                cache.maxPush=false;
                cache.imgUploadCallback=[];
                cache.imgCount=cache.tempCount>0?cache.imgCount:0;
                /*cache.imgCount=cache.imgCount-$.imgCountDel;//$('li[data-type="pic"]').length;
                if(cache.imgCount>=options.max){
                    tools.showMessage(tips.t20);
                    return
                }*/
                //$.imgCountDel=0;
                $(options.total).text(cache.tempCount>options.max?options.max:cache.tempCount);
                $(options.imgCount).text(0);
                $(options.imgUploadBox).css({"left":"50%","display":"block"});
                options.$mask.show();
                if(options.isHasQR_code){
                    cache._h&&clearTimeout(cache._h);
                    cache._h=setTimeout(function(){
                        _this.imgCallback();
                        cache._h=setTimeout(arguments.callee,3000);
                    },3000);
                }
                evt.preventDefault();
            });

            //PC图片上传完成 卡片生成
            $(doc).on("imgUpload.my",function(evt,file,response){
                var t;
                setTimeout(function(){
                    var temp=tips.t6;
                    if(response.status==="success"){
                        $ele=null;
                        $ele=$(tools.generate({
                            type:"pic",//
                            src:response.src,
                            angle:0,
                            id:+(new Date()),
                            defaultText:temp
                        }));
                        $cardBox.append($ele);
                        if(/gif$/.test(response.src)){
                            $ele.find('a[class^="rotate"]').hide();
                        }

                    }
                },0);
            });

            $(doc).on("click",'[data-query="rotateRight"]',function(evt){
                _this.processPic(this);
                evt.preventDefault();
            });
            $(doc).on("click",'[data-query="rotateLeft"]',function(evt){
                _this.processPic(this,true);
                evt.preventDefault();
            });

            //当文件被添加进队列前对文件进行过滤
            uploader.on("beforeFileQueued",function(file){
                if(cache.maxPush)return false;
                if(cache.imgCount+1>options.max){
                    eC="C";
                    /*cache.imgUploadCallback.push(function(){
                        tools.showMessage("图片最多可以上传"+options.max+"张！");
                    });*/
                    cache.maxPush=true;
                    return false
                }
                cache.tempCount++;
                //fileId&&uploader.removeFile(fileId,true);//移出队列

                $(options.total).text(cache.tempCount>options.max?options.max:cache.tempCount);
                //size=file.size;
                //name=file.name;
                //width=file._info&&file._info.width;当文件上传完毕后才会有file._info
                //height=file._info&&file._info.height;

            });
            // 当有文件添加进来的时候
            uploader.on( 'fileQueued', function( file ) {
                _H&&clearTimeout(_H);
                cache.imgCount++;

            });
            uploader.on( 'startUpload', function() {
                uploadComplete=true;
                $buttonMask.appendTo(options.imgUploadBox)
            });
            uploader.on( 'uploadFinished', function( ) {
                uploadComplete=false;
                $buttonMask.remove();
                $(options.imgUploadBox).css({"left":"-999999em"});
                $(options.progress).css({"width":0});
                (eA+eB+eC)?tools.showMessage(tips[eMsg[eA+eB+eC]]):$(options.mask).hide();
                //cache.tempErrorCount>0&&tools.showMessage("有"+cache.tempErrorCount+tips.t2);
                cache.tempCount1=cache.tempCount=cache.tempErrorCount=0;
                eA=eB=eC="";
                setTimeout(function(){$ele.find("textarea").focus();},1000);
                _this.setPosition();
            });

            uploader.on( 'uploadProgress', function( file, percentage ) {
                var percent=Math.ceil(percentage.toFixed(2)*100)+"%";
                //console.log(percentage,percent);
                $progress.stop().animate({"width":percent},3);
            });
            // 文件上传失败，显示上传出错。
            uploader.on( 'uploadError', function( file,reason ) {
                fileId=file.id;
                uploader.removeFile(fileId,true);//移出队列
                $(doc).trigger("my.count");

            });
            // 文件上传成功，
            uploader.on( 'uploadSuccess', function( file,response ) {
                fileId=file.id;
                if(response.status==="success"){
                    $(options.imgCount).text(cache.tempCount1-cache.tempErrorCount+1);
                    $(doc).trigger("imgUpload.my",[file,response]);
                }else{
                    tools.showMessage(response.msg);
                    cache.imgCount--;
                }
            });
            uploader.on( 'uploadComplete', function( file ) {
                $progress.stop().css({"width":0});
                cache.tempCount1++;
                $(doc).trigger("my.count");
                // console.log("complete")
            });
            uploader.on("error",function(type){
                if(type==="F_EXCEED_SIZE"){
                    eA="A"
                }
                if(type==="Q_TYPE_DENIED"){
                    eB="B"
                }
                if(type==="F_EXCEED_SIZE"||type==="Q_TYPE_DENIED"){
                    cache.tempErrorCount++;
                    cache.tempCount1++;
                    _H=setTimeout(function(){
                        $(doc).trigger("my.count");
                    },1000)
                }
                /*if(type=="Q_TYPE_DENIED"){
                 hidden_pic_dialog();
                 tools.showMessage("文件不符合要求");
                 }*/


                /* setTimeout(function(){
                 $("#graybg_pop").show();
                 show_pic_dialog()
                 },3000)*/
            });

        },
        processPic:function(ele,isLeft){
            var $li=$(ele).closest("li");
            var data=$li.data("data");
            var $img=$li.find('img[data-angle]');
            var angle=isLeft?-90:90;
            var xhr=this.fetchData({
                data:{
                    d:angle,       //旋转角度 90 -90
                    s:data.src, //图片地址
                    w:data.width,        //宽
                    h:data.height         //高
                }
            });
            xhr.done(function(response){
                if(response.status==="success"){
                    $img.attr("src",response.src)
                }else{
                    tools.showMessage(tips.t34)
                }

            }).fail(function(){
                tools.showMessage(tips.t34)
            });

        },
        fetchData:function(opt){
            var options=this.options;
            var defaults={
                url:options.getRotate,
                type:"POST",
                dataType:"json",
                timeout:5000
            };
            var params=$.extend(true,{},defaults,opt);
            return $.ajax(params)
        },
        getSrc:function(src,w,h,angle){
            return src.split("?")[0]+'?imageMogr2/rotate/' +
                    angle+
                    '|imageView2/2/w/' +
                    w+
                    '|watermark/2/text/54ix5Y2h5rG96L2m/font/5b6u6L2v6ZuF6buR/fontsize/300/fill/I0ZGRkZGRg==/dissolve/100/gravity/SouthEast/dx/5/dy/5/';
        },
        imgCallback:function(){
            var _this=this;
            var options=this.options;
            var cache=options.cache;
            //var $total=$(options.imgCount);

            $.ajax({
                url:options.QR_Server,
                type:"GET",
                method:"GET",
                dataType:"JSON",
                data:{
                    auth:$('#qrcode_auth').val(),
                    i:$('#uid_auth').val()
                },
                success:function(response){
                    if(response.error===false){
                        var img = response.data;
                        if (!img) {
                            return;
                        }
                        var img_count = img.length;

                        if (img_count < 1) {
                            return;
                        }
                        $(options.total).text(img_count);
                        for (var i = 0; i < img_count; i++) {
                            //if(cache.imgCount++===options.max){break} 限制总大小
                            $(options.imgCount).text(i+1);

                            var pic_url = img[i];
                            //line 74  借用
                            $(doc).trigger("imgUpload.my",["file",{
                                status:"success",
                                src:pic_url
                            }]);
                        }
                        //$.imgCountDel=0;//清除删除计数
                        $(options.mask).hide();
                        $(options.imgUploadBox).css({"left":"-999999em"});
                        $(options.progress).css({"width":0});
                        setTimeout(function(){
                            clearTimeout(cache._h);
                        },1000*60*30);
                    }

                },
                error:function(xhr,tips,et){
                    //console.log(xhr,tips,et)
                }

            })
        },
        setPosition:function(){
            $('html, body').stop(true,true).animate({scrollTop:$(doc).height()}, 100);
        },
        initStyle:function(){

        }
    };
    module.exports=function(opt){
        return new fn(opt);
    }
});