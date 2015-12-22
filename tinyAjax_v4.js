;var FxCDN = function(){
  var Ajax = function(opt){
    function fn(){};
    opt = opt || {};
    var url = opt.url,
      async   = opt.async !== false,
      method  = opt.method  || 'GET',
      type  = opt.type    || 'text',
      encode  = opt.encode  || 'UTF-8',
      timeout = opt.timeout   || 100,
      data  = opt.data    || null,
      success = opt.success   || fn,
      error = opt.error   || fn;
      method  = method.toUpperCase();
    if(data && typeof data == 'object'){
      data = _serialize(data);
    }
    if(method == 'GET' && data){
      url += (url.indexOf('?') == -1 ? '?' : '&') + data;
      data = null;
    }

    //var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Msxml2.XMLHTTP.3.0');
    //var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Msxml2.XMLHTTP');

    if(!xhr){return;}
    var isTimeout = false, timer;
    if(timeout>0){
      timer = setTimeout(function(){
        xhr.abort();
        isTimeout = true;
      },timeout);
    }
    xhr.onreadystatechange = function(){
      if (xhr.readyState == 4 && !isTimeout){
        _onStateChange(xhr, type, success, error);
        clearTimeout(timer);
      }else{}
    };
    xhr.open(method,url,async);
    if(method == 'POST'){
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded;charset=' + encode);
    }
    xhr.send(data);
    //alert(2);
    return xhr;
  }

  var _serialize = function(obj){
    var a = [];
    for(var k in obj){
      var val = obj[k];
      if(val.constructor == Array){
        for(var i=0,len=val.length;i<len;i++){
          a.push(k + '=' + encodeURIComponent(val[i]));
        }
      }else{
        a.push(k + '=' + encodeURIComponent(val));
      }
    }
    return a.join('&');
  }
  var _onStateChange = function(xhr,type,success,error){
    var s = xhr.status, result;
    if(s>= 200 && s < 300){
      result = function(str){
        return (new Function('return ' + str))();
      }(xhr.responseText);
      alert(xhr.responseText);
      success(result);
    }else if(s===0){
      error(xhr,'request timeout');
    }else{
      error(xhr,xhr.status);
    }
    xhr = null;
  }
  return {
    ajax:Ajax
  }
}();