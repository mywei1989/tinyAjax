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
  var global = this,
      DOC = global.document,
      head = DOC.getElementsByTagName('head')[0],
      rword = /[^, ]+/g,

      rnoContent = /^(?:GET|HEAD)$/,
      rquery = /\?/,
      rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,
      curl = DOC.URL,
      segments = rurl.exec(curl.toLowerCase()) || [],
      s = ["XMLHttpRequest", "ActiveXObject('Msxml2.XMLHTTP.6.0')",
        "ActiveXObject('Msxml2.XMLHTTP.3.0')", "ActiveXObject('Msxml2.XMLHTTP')"];
      if (!"1" [0]) { //判定IE67
          s[0] = location.protocol === "file:" ? "!" : s[0];
      }
      for (var i = 0, axo; axo = s[i++]; ) {
          try {
              if (eval("new " + axo)) {
                  xhr = new Function("return new " + axo);
                  break;
              }
          } catch (e) {
          }
      }

  var accepts = {
        xml: "application/xml, text/xml",
        html: "text/html",
        text: "text/plain",
        json: "application/json, text/javascript",
        script: "text/javascript, application/javascript",
        "*": ["*/"] + ["*"] //避免被压缩掉
  },
  defaults = {
        type: "GET",
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        async: true,
        jsonp: "callback"
  };

  var _objMerge = function(){
    var options, name, src, copy, copyIsArray, clone,
        target = arguments[0] || {}, // 默认第0个参数为目标参数
        i = 1,    // i表示从第几个参数凯斯想目标参数进行合并，默认从第1个参数开始向第0个参数进行合并
        length = arguments.length,
        deep = false;  // 默认为浅度拷贝

    // 判断第0个参数的类型，若第0个参数是boolean类型，则获取其为true还是false
    // 同时将第1个参数作为目标参数，i从当前目标参数的下一个
    // Handle a deep copy situation
    if ( typeof target === "boolean" ) {
        deep = target;

        // Skip the boolean and the target
        target = arguments[ i ] || {};
        i++;
    }

    //  判断目标参数的类型，若目标参数既不是object类型，也不是function类型，则为目标参数重新赋值
    // Handle case when target is a string or something (possible in deep copy)
    if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
        target = {};
    }

    // 若目标参数后面没有参数了，如$.extend({_name:'wenzi'}), $.extend(true, {_name:'wenzi'})
    // 则目标参数即为jQuery本身，而target表示的参数不再为目标参数
    // Extend jQuery itself if only one argument is passed
    if ( i === length ) {
        target = this;
        i--;
    }

    // 从第i个参数开始
    for ( ; i < length; i++ ) {
        // 获取第i个参数，且该参数不为null，
        // 比如$.extend(target, {}, null);中的第2个参数null是不参与合并的
        // Only deal with non-null/undefined values
        if ( (options = arguments[ i ]) != null ) {

            // 使用for~in获取该参数中所有的字段
            // Extend the base object
            for ( name in options ) {
                src = target[ name ];   // 目标参数中name字段的值
                copy = options[ name ]; // 当前参数中name字段的值

                // 若参数中字段的值就是目标参数，停止赋值，进行下一个字段的赋值
                // 这是为了防止无限的循环嵌套，我们把这个称为，在下面进行比较详细的讲解
                // Prevent never-ending loop
                if ( target === copy ) {
                    continue;
                }

                // 若deep为true，且当前参数中name字段的值存在且为object类型或Array类型，则进行深度赋值
                // Recurse if we're merging plain objects or arrays
                if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
                    // 若当前参数中name字段的值为Array类型
                    // 判断目标参数中name字段的值是否存在，若存在则使用原来的，否则进行初始化
                    if ( copyIsArray ) {
                        copyIsArray = false;
                        clone = src && jQuery.isArray(src) ? src : [];

                    } else {
                        // 若原对象存在，则直接进行使用，而不是创建
                        clone = src && jQuery.isPlainObject(src) ? src : {};
                    }

                    // 递归处理，此处为2.2
                    // Never move original objects, clone them
                    target[ name ] = jQuery.extend( deep, clone, copy );

                // deep为false，则表示浅度拷贝，直接进行赋值
                // 若copy是简单的类型且存在值，则直接进行赋值
                // Don't bring in undefined values
                } else if ( copy !== undefined ) {
                    // 若原对象存在name属性，则直接覆盖掉；若不存在，则创建新的属性
                    target[ name ] = copy;
                }
            }
        }
    }

    // 返回修改后的目标参数
    // Return the modified object
    return target;
  }

  var _param = function(json, bracket){
    if (typeof json != 'object') {
      return "";
    }
            bracket = typeof bracket === "boolean" ? bracket : !0;
            var buf = [],
                    key, val;
            for (key in json) {
                if (json.hasOwnProperty(key)) {
                    val = json[key];
                    key = encodeURIComponent(key);
                    if (isValidParamValue(val)) { //只处理基本数据类型,忽略空数组,函数,正则,日期,节点等
                        buf.push(key, "=", encodeURIComponent(val + ""), "&");
                    } else if (Array.isArray(val) && val.length) { //不能为空数组
                        for (var i = 0, n = val.length; i < n; i++) {
                            if (isValidParamValue(val[i])) {
                                buf.push(key, (bracket ? encodeURIComponent("[]") : ""), "=", encodeURIComponent(val[i] + ""), "&");
                            }
                        }
                    }
                }
            }
            buf.pop();
            return buf.join("").replace(r20, "+");
  }

  var _setOptions = function(opts) {
    opts = _objMerge({}, defaults, opts);
    if (typeof opts.crossDomain !== "boolean") { //判定是否跨域
      var parts = rurl.exec(opts.url.toLowerCase());
        opts.crossDomain = !!(parts && (parts[1] !== segments[1] || parts[2] !== segments[2] || (parts[3] || (parts[1] === "http:" ? 80 : 443)) !== (segments[3] || (segments[1] === "http:" ? 80 : 443))));
    }
        if (opts.data && typeof opts.data !== "object") {
            $.error("data必须为对象");
        }
        var querystring = _param(opts.data);
        opts.querystring = querystring || "";
        opts.url = opts.url.replace(/#.*$/, "").replace(/^\/\//, segments[1] + "//");
        opts.type = opts.type.toUpperCase();
        opts.hasContent = !rnoContent.test(opts.type); //是否为post请求
        if (!opts.hasContent) {
            if (querystring) { //如果为GET请求,则参数依附于url上
                opts.url += (rquery.test(opts.url) ? "&" : "?") + querystring;
            }
            if (opts.cache === false) { //添加时间截
                opts.url += (rquery.test(opts.url) ? "&" : "?") + "_time=" + Date.now();
            }
        }
        return opts;
  }

  var _XMLHttpRequest = function(opts){

    var obj = {
      options:opts,
      events:{},
      bind:function(type,callback){
        var listener = this.events[type];
        if(listener){
          listener.push(callback);
        }else{
          this.events[type] = [callback];
        }
      },
      setRequestHeader:function(){},
      toString:function(type){},
      abort:function(statusText){},
      dispatch:function(status,statusText){}
    };

    return obj;
  }

  var _ajaxTransports = function(){
    var obj = {
      xhr:{
        request:function(){},
        respond:function(){}
      },
      jsonp:{
        preproccess:function(){
          var namespace = DOC.URL.replace(/(#.+|\W)/g, ''); //得到框架的命名空间
                    var opts = this.options;
                    var name = this.jsonpCallback = opts.jsonpCallback || "jsonp" + setTimeout("1");
                    opts.url = opts.url + (rquery.test(opts.url) ? "&" : "?") + opts.jsonp + "=" + namespace + "." + name;
                    //将后台返回的json保存在惰性函数中
                    global[namespace] = {};
                    global[namespace][name] = function(json) {
                      debugger;
                        $[name] = json;
                    };
                    return "script";
        },
        request:function(){
          debugger;
          var opts = this.options;
          var node = this.transport = DOC.createElement("script");
          if (opts.charset) {
            node.charset = opts.charset;
          }
          var load = node.onerror === null; //判定是否支持onerror
          var self = this;
          node.onerror = node[load ? "onload" : "onreadystatechange"] = function() {
            self.respond();
          };
          node.src = opts.url;
          head.insertBefore(node, head.firstChild);

        },
        respond:function(){}
      },
      script:{
        request:function(){},
        respond:function(){}
      }
    };
    return obj;
  }



  var Ajax = function(opts){
    if (!opts || !opts.url) {
      alert("参数必须为Object并且拥有url属性");
    }
        opts = _setOptions(opts); //处理用户参数，比如生成querystring, type大写化
        //创建一个伪XMLHttpRequest,能处理complete,success,error等多投事件
        var dummyXHR = _XMLHttpRequest(opts);

        "complete success error".replace(rword, function(name) { //绑定回调
            if (typeof opts[name] === "function") {
                dummyXHR.bind(name, opts[name]);
                delete opts[name];
            }
        });
        var dataType = opts.dataType; //目标返回数据类型
        var transports = _ajaxTransports();
        var name = opts.form ? "upload" : dataType;
        var transport = transports[name] || transports.xhr;
        dummyXHR = _objMerge(dummyXHR,transport );//取得传送器的request, respond, preproccess
        if (dummyXHR.preproccess) { //这用于jsonp upload传送器
            dataType = dummyXHR.preproccess() || dataType;
        }
        //设置首部 1、Content-Type首部
        if (opts.contentType) {
            dummyXHR.setRequestHeader("Content-Type", opts.contentType);
        }
        //2、Accept首部
        dummyXHR.setRequestHeader("Accept", accepts[dataType] ? accepts[dataType] + ", */*; q=0.01" : accepts["*"]);
        for (var i in opts.headers) { //3 haders里面的首部
            dummyXHR.setRequestHeader(i, opts.headers[i]);
        }
        // 处理超时
        if (opts.async && opts.timeout > 0) {
            dummyXHR.timeoutID = setTimeout(function() {
                dummyXHR.abort("timeout");
            }, opts.timeout);
        }
        debugger;
        dummyXHR.request();
        return dummyXHR;
  }

  return {
    ajax:Ajax,
    //jsonpCallback:jsonpCallback
  }
}();

;(function(){
  FxCDN.ajax({
            type: "GET",
            //url: "https://tcc.taobao.com/cc/json/mobile_tel_segment.htm?tel=15850781443",
            url:"https://tcc.taobao.com/cc/json/mobile_tel_segment.htm?tel=15850781443",
            timeout:1000,
            success: function(json) {
                //alert(JSON.stringify(json))
                //alert(json[0].title);
                //alert('success:'+JSON.parse(json)[0].title);

                alert('success:'+JSON.stringify(json));
            },
            error:function(textStatus){
                //alert(xhr);
                alert(textStatus);
            },
            dataType: "jsonp"
        });


})();