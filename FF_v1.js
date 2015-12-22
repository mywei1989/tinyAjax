;void function(global, DOC) {
  var rword = /[^, ]+/g,
      rnoContent = /^(?:GET|HEAD)$/,
      rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,
      curl = DOC.URL,
      segments = rurl.exec(curl.toLowerCase()) || [];

  function FC(){}
  function mix(target,source){
    var args = [].slice.call(arguments),
    i = 1,
    key,
    ride = typeof args[args.length - 1] == 'boolean' ? args.pop() : true;
    if(args.length === 1){
      target = !this.window ? this : {};
      i = 0;
    }
    while((source = args[i++])){
      for(key in source){
        if(ride || !(key in target)){
          target[key] = source[key];
        }
      }
    }
    return target;
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

  function setOptions(opts){
    opts = FC.merge({}, defaults, opts);
    if (typeof opts.crossDomain !== "boolean") { //判定是否跨域
      var parts = rurl.exec(opts.url.toLowerCase());
        opts.crossDomain = !!(parts && (parts[1] !== segments[1] || parts[2] !== segments[2] || (parts[3] || (parts[1] === "http:" ? 80 : 443)) !== (segments[3] || (segments[1] === "http:" ? 80 : 443))));
    }
    if (opts.data && typeof opts.data !== "object") {
      $.error("data必须为对象");
    }
        var querystring = FC.param(opts.data);
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

  mix(FC,{
    init:function(opts){

    },
    merge:function(){
      var options, name, src, copy, copyIsArray, clone,
        target = arguments[0] || {}, // 默认第0个参数为目标参数
        i = 1,    // i表示从第几个参数凯斯想目标参数进行合并，默认从第1个参数开始向第0个参数进行合并
        length = arguments.length,
        deep = false;  // 默认为浅度拷贝
      if ( typeof target === "boolean" ) {
          deep = target;
          target = arguments[ i ] || {};
          i++;
      }
      if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
          target = {};
      }
      if ( i === length ) {
          target = this;
          i--;
      }
      for ( ; i < length; i++ ) {
          if ( (options = arguments[ i ]) != null ) {
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
    },
    param: function(json, bracket){
            if (!$.isPlainObject(json)) {
                return "";
            }
            bracket = typeof bracket === "boolean" ? bracket : !0;
            var buf = [],
                    key, val;
            for (key in json) {
                if (json.hasOwnProperty(key)) {
                    val = json[key];
                    key = encode(key);
                    if (isValidParamValue(val)) { //只处理基本数据类型,忽略空数组,函数,正则,日期,节点等
                        buf.push(key, "=", encode(val + ""), "&");
                    } else if (Array.isArray(val) && val.length) { //不能为空数组
                        for (var i = 0, n = val.length; i < n; i++) {
                            if (isValidParamValue(val[i])) {
                                buf.push(key, (bracket ? encode("[]") : ""), "=", encode(val[i] + ""), "&");
                            }
                        }
                    }
                }
            }
            buf.pop();
            return buf.join("").replace(r20, "+");
    },
    _XMLHttpRequest:function(opts){
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
        }
      };
      return obj;
    },
    ajaxTransports: {
            xhr: {
                //发送请求
                request: function() {
                    var self = this;
                    var opts = this.options;
                    $.log("XhrTransport.request.....");
                    var transport = this.transport = new $.xhr;
                    if (opts.crossDomain && !("withCredentials" in transport)) {
                        $.error("本浏览器不支持crossdomain xhr");
                    }
                    if (opts.username) {
                        transport.open(opts.type, opts.url, opts.async, opts.username, opts.password);
                    } else {
                        transport.open(opts.type, opts.url, opts.async);
                    }
                    if (this.mimeType && transport.overrideMimeType) {
                        transport.overrideMimeType(this.mimeType);
                    }
                    this.requestHeaders["X-Requested-With"] = "XMLHTTPRequest";
                    for (var i in this.requestHeaders) {
                        transport.setRequestHeader(i, this.requestHeaders[i]);
                    }
                    var dataType = this.options.dataType;
                    if ("responseType" in transport && /^(blob|arraybuffer|text)$/.test(dataType)) {
                        transport.responseType = dataType;
                        this.useResponseType = true;
                    }
                    transport.send(opts.hasContent && (this.formdata || this.querystring) || null);
                    //在同步模式中,IE6,7可能会直接从缓存中读取数据而不会发出请求,因此我们需要手动发出请求
                    if (!opts.async || transport.readyState === 4) {
                        this.respond();
                    } else {
                        if (transport.onerror === null) { //如果支持onerror, onload新API
                            transport.onload = transport.onerror = function(e) {
                                this.readyState = 4; //IE9+
                                this.status = e.type === "load" ? 200 : 500;
                                self.respond();
                            };
                        } else {
                            transport.onreadystatechange = function() {
                                self.respond();
                            };
                        }
                    }
                },
                //用于获取原始的responseXMLresponseText 修正status statusText
                //第二个参数为1时中止清求
                respond: function(event, forceAbort) {
                    var transport = this.transport;
                    if (!transport) {
                        return;
                    }
                    try {
                        var completed = transport.readyState === 4;
                        if (forceAbort || completed) {
                            transport.onerror = transport.onload = transport.onreadystatechange = $.noop;
                            if (forceAbort) {
                                if (!completed && typeof transport.abort === "function") { // 完成以后 abort 不要调用
                                    transport.abort();
                                }
                            } else {
                                var status = transport.status;
                                this.responseText = transport.responseText;
                                try {
                                    //当responseXML为[Exception: DOMException]时，
                                    //访问它会抛“An attempt was made to use an object that is not, or is no longer, usable”异常
                                    var xml = transport.responseXML
                                } catch (e) {
                                }
                                if (this.useResponseType) {
                                    this.response = transport.response;
                                }
                                if (xml && xml.documentElement) {
                                    this.responseXML = xml;
                                }
                                this.responseHeadersString = transport.getAllResponseHeaders();
                                //火狐在跨城请求时访问statusText值会抛出异常
                                try {
                                    var statusText = transport.statusText;
                                } catch (e) {
                                    statusText = "firefoxAccessError";
                                }
                                //用于处理特殊情况,如果是一个本地请求,只要我们能获取数据就假当它是成功的
                                if (!status && isLocal && !this.options.crossDomain) {
                                    status = this.responseText ? 200 : 404;
                                    //IE有时会把204当作为1223
                                    //returning a 204 from a PUT request - IE seems to be handling the 204 from a DELETE request okay.
                                } else if (status === 1223) {
                                    status = 204;
                                }
                                this.dispatch(status, statusText);
                            }
                        }
                    } catch (e) {
                        // 如果网络问题时访问XHR的属性，在FF会抛异常
                        // http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
                        if (!forceAbort) {
                            this.dispatch(500, e + "");
                        }
                    }
                }
            },
            jsonp: {
                preproccess: function() {
                    var namespace = DOC.URL.replace(/(#.+|\W)/g, ''); //得到框架的命名空间
                    var opts = this.options;
                    var name = this.jsonpCallback = opts.jsonpCallback || "jsonp" + setTimeout("1");
                    opts.url = opts.url + (rquery.test(opts.url) ? "&" : "?") + opts.jsonp + "=" + namespace + "." + name;
                    //将后台返回的json保存在惰性函数中
                    global[namespace][name] = function(json) {
                        $[name] = json;
                    };

                    return "script"
                }
            },
            script: {
                request: function() {
                    debugger;
                    var opts = this.options;
                    var node = this.transport = DOC.createElement("script");
                    $.log("ScriptTransport.sending.....");
                    if (opts.charset) {
                        node.charset = opts.charset;
                    }
                    var load = node.onerror === null; //判定是否支持onerror
                    var self = this;
                    node.onerror = node[load ? "onload" : "onreadystatechange"] = function() {
                        self.respond();
                    };
                    node.src = opts.url;
                    $.head.insertBefore(node, $.head.firstChild);
                },
                respond: function(event, forceAbort) {
                    var node = this.transport;
                    if (!node) {
                        return;
                    }
                    var execute = /loaded|complete|undefined/i.test(node.readyState);
                    if (forceAbort || execute) {
                        node.onerror = node.onload = node.onreadystatechange = null;
                        var parent = node.parentNode;
                        if (parent) {
                            parent.removeChild(node);
                        }
                        if (!forceAbort) {
                            var args = typeof $[this.jsonpCallback] === "function" ? [500, "error"] : [200, "success"];
                            this.dispatch.apply(this, args);
                        }
                    }
                }
            },
            upload: {
                preproccess: function() {
                    var opts = this.options;
                    var formdata = new FormData(opts.form); //将二进制什么一下子打包到formdata
                    $.each(opts.data, function(key, val) {
                        formdata.append(key, val); //添加客外数据
                    });
                    this.formdata = formdata;
                }
            }
    },
    ajax:function(opts){
      if(!opts || !opts.url){
        //无url报错
      }
      opts = setOptions(opts);
      var dummyXHR = this._XMLHttpRequest(opts);
      debugger;
      "complete success error".replace(rword, function(name) { //绑定回调
            if (typeof opts[name] === "function") {
                dummyXHR.bind(name, opts[name]);
                delete opts[name];
            }
      });
      var dataType = opts.dataType; //目标返回数据类型
      var transports = this.ajaxTransports;
      var name = opts.form ? "upload" : dataType;
      var transport = transports[name] || transports.xhr;
    }
  });


  global.FC = FC;
}(self, self.document);

;(function(){
  var isTimeout = false;

  var infoObj = {};


  //KgAck.getConfig(infoObj,callbackName);
  var initTimeout = setTimeout(function(){
    test();
  },100);

  function CDNCallback(cdnInfo){

  }


  function test(){
    FC.init();
    FC.ajax({
      type: "GET",
            url:"https://tcc.taobao.com/cc/json/mobile_tel_segment.htm?tel=15850781443",
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
})();