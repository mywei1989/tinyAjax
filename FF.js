;var FF = function(){
  var ie678 = !-[1,],
      win = window,
      doc = window.document,
      head = doc.getElementsByTagName('head')[0],
      done = false,
      rquery = /\?/,

      host = '',
      dhost = 'https://tcc.taobao.com/cc/json',
      hosts = [];

  var url,
      dataType,
      cache,
      async,
      method,
      type,
      encode,
      timeout,
      data,
      jsonpCallback,
      success,
      error,
      isTimeout = false,
      timer;
  var fn = function(){}

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

  var _getHost = function(){
    return host;
  }

  var init = function(cdnobj){
    debugger;
    var tempHost = [];
    for(var i in cdnobj.data){
      console.log(i);
      var list = cdnobj.data[i].list;
      for(var x=0;x<list.length;x++){
        for(var y = 0;y<list[x].length;y++){
          tempHost.push(list[x][y]);
        }
      }
    }


    hosts = tempHost;
    //debugger;
    host = hosts.shift()||dhost;
    return host;
  }

  var ChangNextHost = function(){
    host = hosts.shift()||dhost;
    return host;
  }

  var namea = '';

  var Ajax = function(opt,isUseDhost){
    opt = opt || {};
    url = opt.url,
    dataType = opt.dataType || 'json',
    cache = opt.cache || false,
    async   = opt.async !== false,
    method  = opt.method  || 'GET',
    method  = method.toUpperCase();
    type  = opt.type    || 'text',
    encode  = opt.encode  || 'UTF-8',
    timeout = opt.timeout   || 0,
    data  = opt.data    || null,
    jsonpCallback = opt.jsonpCallback || 'jsonp',
    success = opt.success   || fn,
    error = opt.error   || fn,

    rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,
    curl = doc.URL,
    segments = rurl.exec(curl.toLowerCase()) || [];

    var ccc = document.getElementsByTagName('aa'+namea);

    var script = doc.createElement('script');
    script.name = namea = 'aa'+setTimeout("1");

    if(data && typeof data == 'object'){
      url = url + (rquery.test(url) ? "&" : "?") + _serialize(data);
    }
    if(cache){
      url = url + (rquery.test(url) ? "&" : "?") + '_'+(new Date).getTime();
    }



    var namespace = doc.URL.replace(/(#.+|\W)/g, '');
    var name  = opt.jsonpCallback || "jsonp" + setTimeout("1");
    url = _getHost() + opt.url + (rquery.test(opt.url) ? "&" : "?") + "callback=" + namespace + "." + name;
    //console.log(url);


    if(timeout>0){
      timer = setTimeout(function(){
        isTimeout = true;
        ChangNextHost();
        if(host === dhost){
          Ajax(opt,true);
          if(isUseDhost){
            error.call(win,'script.timeout');
          }
        }else{
          clearTimeout(timer);
          Ajax(opt,false);
        }

      },timeout);
    }

    if(!ie678){
      script.onerror = function(){
        ChangNextHost();
        if(host === dhost){
          clearTimeout(timer);
          Ajax(opt,true);
          if(isUseDhost){
            error.call(win,'script.onerror');
          }
        }else{
          clearTimeout(timer);
          Ajax(opt,false);
        }
      }
    }else{
      script.onload = script.onerror = script.onreadystatechange = null;

      if( head && script.parentNode ){
        head.removeChild(script);
      }

    }





    win[namespace] = {};
    win[namespace][name] = function(json) {
      clearTimeout(timer);
      if(!isTimeout){
        success.call(win,json);
      }

    };
    script.src = url;


    head.insertBefore(script, head.firstChild);
  }

  return {
    init:init,
    ajax:Ajax
  }
}();

;(function(){
var infoObj = {
  appid:'1',
  clientver:'1',
  clienttime:new Date().getTime(),
  plats:[10006]
};


KgAck.getConfig(infoObj,'FF.init',false);

FF.ajax({
      type: "GET",
            url:'/mobile_tel_segment.htm?tel=15850781443',
            //url:"/service.php",
            timeout:1000,
            success: function(json) {
                alert('success:'+JSON.stringify(json));
            },
            error:function(textStatus){
                alert(textStatus);
            },
            dataType: "jsonp"
});

})();
/*;(function(){
  var isTimeout = false;

  var infoObj = {};
  KgAck.getConfig(infoObj,Test2);



  function CDNCallback(cdnInfo){

  }


  function test(){
    FF.init(cdnObj);

    FF.ajax({
      type: "GET",
            url:'/mobile_tel_segment.htm?tel=15850781443',
            //url:"/service.php",
            timeout:1000,
            success: function(json) {
                alert('success:'+JSON.stringify(json));
            },
            error:function(textStatus){
                alert(textStatus);
            },
            dataType: "jsonp"
    });
  }

})();*/

