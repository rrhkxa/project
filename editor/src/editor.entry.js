/**
 * Created by zlf on 2017/7/4.
 */
define(function(require,exports,module){
    var $=window.jQuery=require("jquery");
    var main=require("main");
    var brow=require("brow");
    var doc=document;
    var win=window;
    var imgUpload=require("imgUploadModule");
    var textModule=require("textModule");
    var videoUrlModule=require("videoUrlModule");
    var draft=require("draftModule");
    win.baseUrl="http://"+win.location.hostname+"/";
    var fn=function(opt){
        this.defaults={

        };
        this.options=$.extend(true,{},this.defaults,opt);
    };
    fn.prototype={
        init:function(){
            this.initStyle();
            this.bindEvent();
            this.main();
        },
        main:function(){
            //初始化main 主逻辑
            main({
                cardBox:"#sortable",//卡片容器
                title:"#post_title",//标题
                submit:"#btn_publish",//提示按钮
                browBox:"#cmd_bq",// 表情容器
                server:{
                    clearDraft:win.baseUrl+'bbs/post_task_ajax.php?a=clean_draft',
                    editLoad:win.baseUrl+'bbs/post_task_ajax.php'
                }
            }).init();
            //初始化图片上传、
            imgUpload({
                addCard:"#f_p_img",//新增卡片按钮
                cardBox:"#sortable",//卡片容器
                imgUploadBox:"#bomb_box_img",//图片上传弹层
                progress:'.progress_num',//进度条
                imgCount:'.active_num',//上传图片当前计数
                total:'.total_num',//单闪上传总数
                QR_Server:win.baseUrl+"bbs/post_task_ajax.php?a=upload",//扫码接口
                uploaderOptions:{
                    pick:"#pickfiles",//上传按钮
                    server:win.baseUrl+"bbs/post_task_ajax.php?a=upload_pic",
                    formData:{a:"upload_pic"}
                },
                getRotate:win.baseUrl+'bbs/post_task_ajax.php?a=rotate_pic'
            }).init();//图片卡片模块
            //卡片模块
            textModule({
                addCard:"#f_p_word",
                cardBox:"#sortable"
            }).init();//文本卡片模块
            $("#f_p_word").trigger("click");
            //视频模块
            videoUrlModule({
                cardBox:"#sortable",
                addCard:"#f_p_video",
                box:"#bomb_box_video",
                addVideoCardBtn:"#box_video_save",
                urlInput:"#video_url"
            }).init();//视频卡片模块
            //表情模块
            brow({
                box:"#cmd_bq",
                browBtn:"#f_p_phiz",
                cardBox:"#sortable"
            }).init();//
            // 草稿
            draft({
                id:'[data-query="draftId"]',
                cid:'[data-query="cid"]',
                title:"#post_title",
                getDraftUrl:'bbs/post_task_ajax.php?a=load',
                cardBox:'#sortable',
                saveDraftBtn:'#btn_save_draft',
                server:{
                    autoSave:window.baseUrl+'bbs/post_task_ajax.php?a=autosave'
                }
            }).init();


        },
        initStyle:function(){

        },
        bindEvent:function(){

        }
    };
    $(function(){
        (new fn()).init()
    })
});