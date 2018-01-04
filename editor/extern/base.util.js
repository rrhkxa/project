/**
 * Created by zlf on 2017/5/10.
 * 常用方法合集
 */
define(function(require,exports,module){
    var fn=function(){};
    var win=window;
    var doc=document;
    fn.prototype={
        getCookie: function (k) {
            var all = doc.cookie.split(";");
            var cookieData = win.__cookie__ ={};
            for (var i = 0, l = all.length; i < l; i++) {
                var p = all[i].indexOf("=");
                var dataName = all[i].substring(0, p).replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,"");
                cookieData[dataName] = all[i].substring(p + 1);
            }
            return cookieData[k]
        },
        setCookie:function(k,v,t,domain){
            var d=new Date();
            t = t || 365 * 12 * 60 * 60;
            d.setTime(+d+1000*t);
            domain=domain?domain:doc.location.host;
            document.cookie = k + "=" + v +";expires="+d.toUTCString()+";max-age=" + t+";domain="+domain+";path=/";
        },
        clearCookie: function (k) {
            var d=new Date();
            d.setTime(+d-1000);
            doc.cookie = k + "=temp" +"expires="+d.toUTCString()+ ";max-age=0";
        },
        browser: function() {
            var ua=navigator.userAgent;
            var ret = {};
            var webkit,chrome,ie,firefox,safari,opera;
                webkit = ua.match( /WebKit\/([\d.]+)/ ),
                chrome = ua.match( /Chrome\/([\d.]+)/ ) ||
                    ua.match( /CriOS\/([\d.]+)/ ),

                    ie = ua.match( /MSIE\s([\d\.]+)/ ) ||
                        ua.match( /(?:trident)(?:.*rv:([\w.]+))?/i ),
                    firefox = ua.match( /Firefox\/([\d.]+)/ ),
                    safari = ua.match( /Safari\/([\d.]+)/ ),
                    opera = ua.match( /OPR\/([\d.]+)/ );
                webkit && (ret.webkit = parseFloat( webkit[ 1 ] ));
                chrome && (ret.chrome = parseFloat( chrome[ 1 ] ));
                ie && (ret.ie = parseFloat( ie[ 1 ] ));
                firefox && (ret.firefox = parseFloat( firefox[ 1 ] ));
                safari && (ret.safari = parseFloat( safari[ 1 ] ));
                opera && (ret.opera = parseFloat( opera[ 1 ] ));
                return ret;
        },
        os:function(){
            var platform=navigator .platform.toLowerCase();
            return {
                win:platform.indexOf("win")!==-1,
                mac:platform.indexOf("mac")!==-1
            }
        },
        getQueryString:function(name){
            var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
            var r = win.location.search.substring(1).match(reg);
            return r&&decodeURIComponent(r[2]);
        }
    };
    module.exports=new fn
});