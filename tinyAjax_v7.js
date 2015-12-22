;(function(){
  var Md5 = {
      hex_chr : "0123456789abcdef",
      rhex : function (num) {
        var str = "";
        for (var j = 0; j <= 3; j++){
          str += this.hex_chr.charAt((num >> (j * 8 + 4)) & 0x0F) + this.hex_chr.charAt((num >> (j * 8)) & 0x0F);
        }
        return str;
      },
      str2blks_MD5 : function(str) {
        var nblk = ((str.length + 8) >> 6) + 1;
        var blks = new Array(nblk * 16);
        for (var i = 0; i < nblk * 16; i++){
          blks[i] = 0;
        }
        for (var i = 0; i < str.length; i++){
          blks[i >> 2] |= str.charCodeAt(i) << ((i % 4) * 8);
        }
        blks[i >> 2] |= 0x80 << ((i % 4) * 8);
        blks[nblk * 16 - 2] = str.length * 8;
        return blks;
      },
      add : function(x, y){
        var lsw = (x & 0xFFFF) + (y & 0xFFFF);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
      },
      rol : function(num, cnt) {
        return (num << cnt) | (num >>> (32 - cnt));
      },
      cmn : function(q, a, b, x, s, t){
        return this.add(this.rol(this.add(this.add(a, q), this.add(x, t)), s), b);
      },
      ff : function(a, b, c, d, x, s, t){
        return this.cmn((b & c) | ((~b) & d), a, b, x, s, t);
      },
      gg : function(a, b, c, d, x, s, t){
        return this.cmn((b & d) | (c & (~d)), a, b, x, s, t);
      },
      hh : function (a, b, c, d, x, s, t){
        return this.cmn(b ^ c ^ d, a, b, x, s, t);
      },
      ii : function(a, b, c, d, x, s, t){
        return this.cmn(c ^ (b | (~d)), a, b, x, s, t);
      },
      md5 : function(str){
        var x = this.str2blks_MD5(str);
        var a = 1732584193;
        var b = -271733879;
        var c = -1732584194;
        var d = 271733878;
        for (var i = 0; i < x.length; i += 16) {
          var olda = a;
          var oldb = b;
          var oldc = c;
          var oldd = d;
          a = this.ff(a, b, c, d, x[i + 0], 7, -680876936);
          d = this.ff(d, a, b, c, x[i + 1], 12, -389564586);
          c = this.ff(c, d, a, b, x[i + 2], 17, 606105819);
          b = this.ff(b, c, d, a, x[i + 3], 22, -1044525330);
          a = this.ff(a, b, c, d, x[i + 4], 7, -176418897);
          d = this.ff(d, a, b, c, x[i + 5], 12, 1200080426);
          c = this.ff(c, d, a, b, x[i + 6], 17, -1473231341);
          b = this.ff(b, c, d, a, x[i + 7], 22, -45705983);
          a = this.ff(a, b, c, d, x[i + 8], 7, 1770035416);
          d = this.ff(d, a, b, c, x[i + 9], 12, -1958414417);
          c = this.ff(c, d, a, b, x[i + 10], 17, -42063);
          b = this.ff(b, c, d, a, x[i + 11], 22, -1990404162);
          a = this.ff(a, b, c, d, x[i + 12], 7, 1804603682);
          d = this.ff(d, a, b, c, x[i + 13], 12, -40341101);
          c = this.ff(c, d, a, b, x[i + 14], 17, -1502002290);
          b = this.ff(b, c, d, a, x[i + 15], 22, 1236535329);
          a = this.gg(a, b, c, d, x[i + 1], 5, -165796510);
          d = this.gg(d, a, b, c, x[i + 6], 9, -1069501632);
          c = this.gg(c, d, a, b, x[i + 11], 14, 643717713);
          b = this.gg(b, c, d, a, x[i + 0], 20, -373897302);
          a = this.gg(a, b, c, d, x[i + 5], 5, -701558691);
          d = this.gg(d, a, b, c, x[i + 10], 9, 38016083);
          c = this.gg(c, d, a, b, x[i + 15], 14, -660478335);
          b = this.gg(b, c, d, a, x[i + 4], 20, -405537848);
          a = this.gg(a, b, c, d, x[i + 9], 5, 568446438);
          d = this.gg(d, a, b, c, x[i + 14], 9, -1019803690);
          c = this.gg(c, d, a, b, x[i + 3], 14, -187363961);
          b = this.gg(b, c, d, a, x[i + 8], 20, 1163531501);
          a = this.gg(a, b, c, d, x[i + 13], 5, -1444681467);
          d = this.gg(d, a, b, c, x[i + 2], 9, -51403784);
          c = this.gg(c, d, a, b, x[i + 7], 14, 1735328473);
          b = this.gg(b, c, d, a, x[i + 12], 20, -1926607734);
          a = this.hh(a, b, c, d, x[i + 5], 4, -378558);
          d = this.hh(d, a, b, c, x[i + 8], 11, -2022574463);
          c = this.hh(c, d, a, b, x[i + 11], 16, 1839030562);
          b = this.hh(b, c, d, a, x[i + 14], 23, -35309556);
          a = this.hh(a, b, c, d, x[i + 1], 4, -1530992060);
          d = this.hh(d, a, b, c, x[i + 4], 11, 1272893353);
          c = this.hh(c, d, a, b, x[i + 7], 16, -155497632);
          b = this.hh(b, c, d, a, x[i + 10], 23, -1094730640);
          a = this.hh(a, b, c, d, x[i + 13], 4, 681279174);
          d = this.hh(d, a, b, c, x[i + 0], 11, -358537222);
          c = this.hh(c, d, a, b, x[i + 3], 16, -722521979);
          b = this.hh(b, c, d, a, x[i + 6], 23, 76029189);
          a = this.hh(a, b, c, d, x[i + 9], 4, -640364487);
          d = this.hh(d, a, b, c, x[i + 12], 11, -421815835);
          c = this.hh(c, d, a, b, x[i + 15], 16, 530742520);
          b = this.hh(b, c, d, a, x[i + 2], 23, -995338651);
          a = this.ii(a, b, c, d, x[i + 0], 6, -198630844);
          d = this.ii(d, a, b, c, x[i + 7], 10, 1126891415);
          c = this.ii(c, d, a, b, x[i + 14], 15, -1416354905);
          b = this.ii(b, c, d, a, x[i + 5], 21, -57434055);
          a = this.ii(a, b, c, d, x[i + 12], 6, 1700485571);
          d = this.ii(d, a, b, c, x[i + 3], 10, -1894986606);
          c = this.ii(c, d, a, b, x[i + 10], 15, -1051523);
          b = this.ii(b, c, d, a, x[i + 1], 21, -2054922799);
          a = this.ii(a, b, c, d, x[i + 8], 6, 1873313359);
          d = this.ii(d, a, b, c, x[i + 15], 10, -30611744);
          c = this.ii(c, d, a, b, x[i + 6], 15, -1560198380);
          b = this.ii(b, c, d, a, x[i + 13], 21, 1309151649);
          a = this.ii(a, b, c, d, x[i + 4], 6, -145523070);
          d = this.ii(d, a, b, c, x[i + 11], 10, -1120210379);
          c = this.ii(c, d, a, b, x[i + 2], 15, 718787259);
          b = this.ii(b, c, d, a, x[i + 9], 21, -343485551);
          a = this.add(a, olda);
          b = this.add(b, oldb);
          c = this.add(c, oldc);
          d = this.add(d, oldd);
        }
        return this.rhex(a) + this.rhex(b) + this.rhex(c) + this.rhex(d);
      }
  };
  window.Md5 = Md5;
})();

;var FxCDN = function(){

  var ie678 = !-[1,],
      win = window,
      doc = window.document,
      head = doc.getElementsByTagName('head')[0],
      done = false,
      rquery = /\?/;

  var fn = function(){}
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

  var Ajax = function(opt){
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
    error = opt.error   || fn;

    if(data && typeof data == 'object'){
      data = _serialize(data);
    }

    if(dataType === 'json'){
      if(method == 'GET' && data){
        url += (url.indexOf('?') == -1 ? '?' : '&') + data;
        data = null;
      }
      var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
      if(!xhr){return;}


      if(timeout>0){
        timer = setTimeout(function(){
          isTimeout = true;
          xhr.abort();
          error.call(win,'timeout');
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
      return xhr;
    }else{

      var script = doc.createElement('script');

      if(!ie678){
        script.onerror = function(){
          error.call(win,'script.onerror');
        }
      }else{
        script.onload = script.onerror = script.onreadystatechange = null;
        if( head && script.parentNode ){
          head.removeChild(script);
        }
      }
      if(data){
        url += '?' + data;
      }
      if(cache){
        if(data){
          url += '&ts=';
        }else{
          url += '?ts='
        }
        url += (new Date).getTime();
      }
      url = url + (rquery.test(url) ? "&" : "?") + 'callback=FxCDN.jsonpCallback';
      script.src = url;

      if(timeout>0){
        timer = setTimeout(function(){
          isTimeout = true;
          error.call(win,'timeout');
        },timeout);
      }

      head.insertBefore(script, head.firstChild);
    }
  }


  var jsonpCallback = function(jsonp){
    clearTimeout(timer);
    if(!isTimeout){
      success.call(win,jsonp);
    }
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
      success.call(win,result);
    }else{
      error.call(win,xhr.status);
    }
    xhr = null;
  }




  return {
    ajax:Ajax,
    jsonpCallback:jsonpCallback
  }
}();