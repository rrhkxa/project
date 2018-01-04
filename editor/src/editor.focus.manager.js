/**
 * Created by weng.xuesong on 17-8-7.
 */
define(function(require,exports,module){
    var cur={
        obj:null,
        pos:{
            start:0,
            end:0
        }
    };
    function getPos(obj){
        if(typeof obj.selectionStart == 'number'){
            cur.pos.start=obj.selectionStart;
            cur.pos.end=obj.selectionEnd;
        }else if(document.selection){//这里是ie8的兼容处理
            var range=document.selection.createRange();
            if(range.parentElement().className==obj.className){
                var range_all=document.body.createTextRange();
                range_all.moveToElementText(obj);
                for(cur.pos.start=0;range_all.compareEndPoints('StartToStart',range)<0;cur.pos.start++){
                    range_all.moveStart('character',1);
                }
                for(var i=0;i<=cur.pos.start;i++){
                    if(obj.value.charAt(i)=='\n'){
                        cur.pos.start++;
                    }
                }
                range_all=document.body.createTextRange();
                range_all.moveToElementText(obj);
                for(cur.pos.end=0;range_all.compareEndPoints('StartToEnd',range)<0;cur.pos.end++){
                    range_all.moveStart('character',1);
                }
                for(i=0;i<=cur.pos.end;i++){
                    if(obj.value.charAt(i)=='\n'){
                        cur.pos.end++;
                    }
                }
            }
        }
        return cur.pos;
    }
    function moveCursorToPos(pos,obj){
        pos=pos||obj.value.length;
        if(obj.createTextRange){
            var range=obj.createTextRange();
            range.moveStart('character',pos);
            range.collapse(true);
            range.select();
        }else{
            obj.setSelectionRange(obj.value.length,pos);
        }
        obj.focus();
    }

    function insert(txt,obj){
        obj=obj||cur.obj;
        var val=obj.value;
        var pre=val.substr(0,cur.pos.start);
        var post=val.substr(cur.pos.end);
        obj.value=pre+txt+post;
        moveCursorToPos(cur.pos.start+txt.length,obj);
    }

    return {
        save:function(obj){
            cur.obj=obj;
            getPos(obj);
        },
        insert:insert,
        setObj:function(obj){
            cur.obj=obj;
        },
        getPos:getPos
    }
});