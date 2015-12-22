;var FxCDN = function(){

  var r20 = /%20/g,
      rnoContent = /^(?:GET|HEAD)$/,
      rquery = /\?/,
      rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,
      curl = this.document.URL,
      segments = rurl.exec(curl.toLowerCase()) || [];

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


  var GetXHR = function(){
    var s = ["XMLHttpRequest", "ActiveXObject('Msxml2.XMLHTTP.6.0')",
        "ActiveXObject('Msxml2.XMLHTTP.3.0')", "ActiveXObject('Msxml2.XMLHTTP')"];
    if (!"1" [0]) { //判定IE67
        s[0] = location.protocol === "file:" ? "!" : s[0];
    }
    for (var i = 0, axo; axo = s[i++]; ) {
        try {
            if (eval("new " + axo)) {
                return new Function("return new " + axo);
                break;
            }
        } catch (e) {
        }
    }
  }

  var GetXMLHttpRequest = function(opts){

  }

  var ObjMerge = function(){
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

  var Param = function(json, bracket){
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

  var isValidParamValue = function(val) {
        var t = typeof val; // If the type of val is null, undefined, number, string, boolean, return true.
        return val == null || (t !== 'object' && t !== 'function');
  }

  var SetOptions = function(opts) {
    opts = ObjMerge({}, defaults, opts);
    if (typeof opts.crossDomain !== "boolean") { //判定是否跨域
      var parts = rurl.exec(opts.url.toLowerCase());
      opts.crossDomain = !!(parts && (parts[1] !== segments[1] || parts[2] !== segments[2] || (parts[3] || (parts[1] === "http:" ? 80 : 443)) !== (segments[3] || (segments[1] === "http:" ? 80 : 443))));
    }
    if (opts.data && typeof opts.data !== "object") {
        //$.error("data必须为对象");
    }
    var querystring = Param(opts.data);
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

  var Ajax = function(opts){
    if (!opts || !opts.url) {
      $.error("参数必须为Object并且拥有url属性");
    }
    debugger;
    opts = SetOptions(opts); //处理用户参数，比如生成querystring, type大写化

    //创建一个伪XMLHttpRequest,能处理complete,success,error等多投事件
  }

  return {
    ajax:Ajax
  }
}();