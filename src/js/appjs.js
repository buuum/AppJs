var Utils;

Utils = (function () {
  function Utils() {
  }

  Utils.merge = function (obj1, obj2) {
    if (obj1 == null) {
      obj1 = {};
    }
    if (obj2 == null) {
      obj2 = {};
    }
    return $.extend({}, obj1, obj2);
  };

  Utils.round = function (value, precision, mode) {
    var f, isHalf, m, sgn, valor;
    precision |= 0;
    m = Math.pow(10, precision);
    value *= m;
    sgn = (value > 0) | -(value < 0);
    isHalf = value % 1 === 0.5 * sgn;
    f = Math.floor(value);
    if (isHalf) {
      if (mode === 'PHP_ROUND_HALF_DOWN') {
        value = f + (sgn < 0);
      } else if (mode === 'PHP_ROUND_HALF_EVEN') {
        value = f + (f % 2 * sgn);
      } else if (mode === 'PHP_ROUND_HALF_ODD') {
        value = f + !(f % 2);
      } else {
        value = f + (sgn > 0);
      }
    }
    valor = isHalf ? value : Math.round(value);
    return valor / m;
  };

  Utils.isset = function () {
    var a, i, l;
    a = arguments;
    l = a.length;
    i = 0;
    if (l === 0) {
      return;
    }
    while (i !== l) {
      if (a[i] === void 0 || a[i] === null) {
        return false;
      }
      i++;
    }
    return true;
  };

  Utils.realSizes = function (obj, objsize) {
    var clone, height, height_, width, width_;
    if (objsize == null) {
      objsize = false;
    }
    width_ = window.innerWidth;
    height_ = window.innerHeight;
    clone = obj.clone();
    clone.css("visibility", "hidden");
    clone.css("display", "inline-block");
    $('body').append(clone);
    if (objsize) {
      width = clone.find(objsize).outerWidth();
      height = clone.find(objsize).outerHeight();
    } else {
      width = clone.outerWidth();
      height = clone.outerHeight();
    }
    clone.remove();
    return {
      window_w: width_,
      window_h: height_,
      width: width,
      height: height
    };
  };

  Utils.get_class_methods = function (name) {
    var consname, constructor, method, retArr;
    constructor = void 0;
    retArr = [];
    method = '';
    if (typeof name === 'function') {
      constructor = name;
      consname = "" + constructor.name;
    } else if (typeof name === 'string') {
      constructor = this.window[name];
      consname = "" + name;
    } else if (typeof name === 'object') {
      constructor = name;
      consname = "" + constructor.constructor.name;
      for (method in constructor.constructor) {
        method = method;
        if (typeof constructor.constructor[method] === 'function') {
          retArr.push(method);
        }
      }
    }
    for (method in constructor) {
      method = method;
      if (typeof constructor[method] === 'function') {
        retArr.push(method);
      }
    }
    for (method in constructor.prototype) {
      method = method;
      if (typeof constructor.prototype[method] === 'function') {
        retArr.push(method);
      }
    }
    return {
      classname: consname,
      functions: retArr
    };
  };

  Utils.serializeObject = function (obj) {
    var a, o;
    o = {};
    a = obj.serializeArray();
    $.each(a, function () {
      if (o[this.name] != null) {
        if (!o[this.name].push) {
          o[this.name] = [o[this.name]];
        }
        o[this.name].push(this.value || '');
      } else {
        o[this.name] = this.value || '';
      }
    });
    return o;
  };

  return Utils;

})();

var Config;

Config = (function () {
  function Config() {
    this.varconfigs = {
      version: '0.0.1'
    };
  }

  Config.prototype.get = function (attr) {
    if (this.varconfigs[attr] != null) {
      return this.varconfigs[attr];
    }
    return LocalData.get(attr);
  };

  Config.prototype.set = function (attr, value, persist) {
    if (persist == null) {
      persist = false;
    }
    this.varconfigs[attr] = value;
    if (persist) {
      LocalData.add(attr, value);
    }
  };

  return Config;

})();

Config = new Config();

var Appjs;

Appjs = (function () {
  function Appjs() {
  }

  Appjs.prototype.addController = function (name) {
    App[name] = new window[name]();
  };

  Appjs.prototype.addControllers = function (controllers) {
    $.each(controllers, (function (_this) {
      return function (i, el) {
        _this.addController(el);
      };
    })(this));
  };

  return Appjs;

})();

var Controller;

Controller = (function () {
  function Controller() {
  }

  Controller.prototype.addEvent = function (event, target, callback, preventdefault) {
    if (preventdefault == null) {
      preventdefault = true;
    }
    if (typeof callback !== "function") {
      return;
    }
    if (target === 'window') {
      return $(window).on(event, (function (_this) {
        return function (e) {
          return callback(e);
        };
      })(this));
    } else {
      return $('body').on(event, target, (function (_this) {
        return function (e) {
          if (preventdefault) {
            e.preventDefault();
          }
          return callback($(e.currentTarget));
        };
      })(this));
    }
  };

  Controller.prototype.removeEvent = function (event, target) {
    if (target === 'window') {
      return $(window).off(event);
    } else {
      return $('body').off(event, target);
    }
  };

  return Controller;

})();

var Ajax, AjaxService;

AjaxService = (function () {
  function AjaxService() {
  }

  AjaxService.prototype.call = function (options) {
    return $.ajax({
      type: options.method,
      url: options.url,
      data: options.params,
      dataType: "json",
      timeout: options.timeout,
      beforeSend: (function (_this) {
        return function (xhr) {
          if (options.headers) {
            xhr.setRequestHeader("" + options.headers.name, "Bearer " + options.headers.value);
          }
        };
      })(this)
    });
  };

  AjaxService.prototype.callAjax = function (options, callback) {
    return this.call(options).done((function (_this) {
      return function (data) {
        if (callback) {
          return callback(data, false);
        }
        return data;
      };
    })(this)).fail((function (_this) {
      return function (xhr) {
        if (callback) {
          return callback(xhr, true);
        }
        return xhr;
      };
    })(this));
  };

  AjaxService.prototype.get = function (options, callback) {
    options = this.getOptions('GET', options);
    return this.callAjax(options, callback);
  };

  AjaxService.prototype.post = function (options, callback) {
    options = this.getOptions('POST', options);
    return this.callAjax(options, callback);
  };

  AjaxService.prototype.put = function (options, callback) {
    options = this.getOptions('PUT', options);
    return this.callAjax(options, callback);
  };

  AjaxService.prototype["delete"] = function (options, callback) {
    options = this.getOptions('DELETE', options);
    return this.callAjax(options, callback);
  };

  AjaxService.prototype.getOptions = function (method, options) {
    var defaultoptions;
    if (options == null) {
      options = [];
    }
    defaultoptions = {
      timeout: 0,
      headers: false,
      method: method,
      url: '',
      params: {}
    };
    return Utils.merge(defaultoptions, options);
  };

  return AjaxService;

})();

Ajax = new AjaxService();

var LocalData;

LocalData = (function () {
  function LocalData() {
  }

  LocalData.prototype.clear = function () {
    localStorage.clear();
  };

  LocalData.prototype.remove = function ($key) {
    localStorage.removeItem($key);
  };

  LocalData.prototype.add = function ($key, $value) {
    var err, json;
    try {
      json = JSON.parse($value);
    } catch (_error) {
      err = _error;
      json = JSON.stringify($value);
    }
    localStorage.setItem($key, json);
  };

  LocalData.prototype.get = function ($key) {
    var $value, err, salida;
    $value = localStorage.getItem($key);
    salida = false;
    if ($value !== null && $value !== void 0) {
      try {
        salida = JSON.parse($value);
      } catch (_error) {
        err = _error;
        salida = $value;
      }
    }
    return salida;
  };

  return LocalData;

})();

LocalData = new LocalData();
