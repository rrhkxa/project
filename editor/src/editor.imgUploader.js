/**
 * Created by zlf on 2017/6/15.
 */
;;(function($,doc,win,undefined){
    var WebUploader=win.WebUploader;
    var fn=function(opt){
        this.defaults={
            //depends:"http://js.xcar.com.cn/source/widgets/webuploader-0.1.5/webuploader.min.js",
            uploaderOptions:{
                auto: true, // 选完文件后，是否自动上传。
                pick:"filePicker",//上传按钮
                cacheImage:true,
                accept: {
                    title: 'Images',
                    extensions: 'gif,jpg,jpeg,bmp,png',
                    mimeTypes: 'image/jpg,image/jpeg,image/png,image/gif,image/bmp'
                },
                // swf文件路径
                swf: win.baseUrl+'xbb/Uploader.swf',
                //是否禁掉整个页面的拖拽功能，如果不禁用，图片拖进来的时候会默认被浏览器打开。
                disableGlobalDnd: true,
                compress:{
                    width: 1920,
                    height:24000,
                    // 图片质量，只有type为`image/jpeg`的时候才有效。
                    quality: 90,

                    // 是否允许放大，如果想要生成小图的时候不失真，此选项应该设置为false.
                    allowMagnify: true,
                    // 是否允许裁剪。
                    crop: false,
                    type: 'image/jpeg',

                    // 是否保留头部meta信息。
                    preserveHeaders: true,
                    // 如果发现压缩后文件大小比原来还大，则使用原来图片
                    // 此属性可能会影响图片自动纠正功能
                    noCompressIfLarger: true,
                    // 单位字节，如果图片大小小于此值，不会采用压缩。
                    compressSize: 0
                },
                runtimeOrder:"html5,flash",
                prepareNextFile:true,
                chunked:false,
                chunkRetry:2,
                threads:3,
                chunkSize:0,
                thumb:{
                    width: 0,
                    height: 0
                },
                formData:{},
                duplicate:true,
                // 服务器接收端
                server:win.baseUrl+"editor_xbb/upload",
                //验证文件总数量, 超出则不允许加入队列。
                fileNumLimit: 100,
                fileVal:"Filedata",
                //验证文件总大小是否超出限制, 超出则不允许加入队列。
                fileSizeLimit: 50000* 1024 * 1024,    //
                fileSingleSizeLimit: 10.01 * 1024 *1024  // 10 M
            }
        };
        this.options=$.extend(true,{},this.defaults,opt);
    };
    fn.prototype={
        init:function(){
            this.initDepends(this.initUploader);
            return this.initUploader();
        },
        initDepends:function(callback){
            var options=this.options;
            var _this=this;
            if(WebUploader){return}
            $.getScript(options.depends,function(){
                cacllback.call(_this);
            });
        },
        initUploader:function(){
            var _this=this;
            //确认支持性
            if ( !WebUploader.Uploader.support() ) {
                alert( 'Web Uploader 不支持您的浏览器！如果你使用的是IE浏览器，请尝试升级 flash 播放器');
                //throw new Error( 'WebUploader does not support the browser you are using.' );
                return
            }

            // 实例化LOGO上传
            var uploader = WebUploader.create(this.options.uploaderOptions);
            var fileId;

            /*//当文件被添加进队列前对文件进行过滤
            uploader.on("beforeFileQueued",function(file){
                if(fileID)
                    uploader.removeFile(fileID,true);//移出队列

                //size=file.size;
                //name=file.name;
                //width=file._info&&file._info.width;当文件上传完毕后才会有file._info
                //height=file._info&&file._info.height;
                $(doc).trigger("beforeFileQueued",[_this,file])
            });
            // 当有文件添加进来的时候
            uploader.on( 'fileQueued', function( file ) {
                $(doc).trigger("fileQueued",[_this,file]);

            });
            //文件开始上传时操作
            //uploader.on("startUpload",function(){});
            // 文件上传过程中创建进度条实时显示。

            uploader.on( 'uploadProgress', function( file, percentage ) {
                $(doc).trigger("uploadProgress",[_this,file,percentage]);
            });

            // 文件上传成功，给item添加成功class, 用样式标记上传成功。
            uploader.on( 'uploadSuccess', function( file,response ) {
                $(doc).trigger("uploadSuccess",[_this,file,response]);

            });
            //获取服务端反馈
            uploader.on('uploadAccept',function(object,ret){
                $(doc).trigger("uploadAccept",[_this,object,ret]);
            });

            // 文件上传失败，显示上传出错。
            uploader.on( 'uploadError', function( file,reason ) {
                $(doc).trigger("uploadError",[_this,file,reason]);
            });

            // 完成上传完了，成功或者失败，先删除进度条。
            uploader.on( 'uploadComplete', function( file ) {
                $(doc).trigger("uploadComplete",[_this,file]);
            });

            //错误
            uploader.on("error",function(type){
                $(doc).trigger("error",[_this,type]);
            });*/
            return uploader

        }
    };

    if(typeof define === "function" && define.amd){
        define(function(require,exports,module){
            $=require("jquery");
            WebUploader=require("webuploader");
            module.exports=function(opt){
                return new fn(opt)
            }
        });

    }
    win.imgUploader=function(opt){
        return new fn(opt)
    }
})(window.jQuery,document,window);