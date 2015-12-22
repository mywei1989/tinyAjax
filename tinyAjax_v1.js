;var FxCDN = function(){
    var ajax = function(opt){
        function fn(){}
        var url = opt.url,
            timeout = opt.timeout||100,
            async   = opt.async !== false,
            method  = opt.method    || 'GET',
            data    = opt.data      || null,
            success = opt.success   || fn,
            error = opt.error   || fn;
            method  = method.toUpperCase();
        if(method == 'GET' && data){
            url += (url.indexOf('?') == -1 ? '?' : '&') + data;
            data = null;
        }
        var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
        xhr.onreadystatechange = function(){
            _onStateChange(xhr,success,error);
        };

        /*debugger;
        if(async&&timeout>0){
          xhr.timeoutID = setTimeout(function() {
            xhr.abort("timeout");

          }, timeout);
        }*/

        xhr.open(method,url,async);
        if(method == 'POST'){
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded;');
        }


        debugger;
        if(async&&timeout>0){
          xhr.timeout = timeout;
          xhr.ontimeout = function(){
            //alert('超时');
            xhr.abort("timeout");
          }
        }

        xhr.send(data);
        return xhr;
    }
    var _onStateChange = function(xhr,success,error){
        if(xhr.readyState == 4){
          try{
            var s = xhr.status;
            if(s>= 200 && s < 300){
                success(xhr.response);
            }else{
                error(xhr,'timeout');
            }
          }catch(e){}
        }else{}
    }
    return {
      ajax:ajax
    };
}();