/**
 * Created by kerr on 2015/4/20.
 * Version: 0.0.1
 */(function(name, deps, factory) {
  var run = function(require) {
    var params = [];
    for (var i = 0, len = deps.length; i < len; i ++) {
      var item = deps[i];
      params.push(require(item));
    }
    return factory.apply(null, params);
  };
  if (typeof define === 'function' && (define.amd || define.cmd)) {
    define(name, run);
  } else {
    window[name] = run(window);
  }
} ('jquery.model', ['jQuery', 'jquery.dim'], function($) {
  var
    ua = navigator.userAgent,
    isAndroid = ua.indexOf('Android') > 0,
    isIphone = /iP(ad|hone|od)/.test(ua),
    isWebView = (isAndroid || isIphone) && ua.match(/.*AppleWebKit(?!.*Safari)/i),
    $body = $('body'),
    fnTemp = function(settings) {
      settings = $.extend({
        viewClassName: 'view',
        pageClassName: 'page'
      }, settings);
    };

  fnTemp.status = function() {
    $body.addClass('open-status');
  };
  fnTemp.top = function(content) {};
  fnTemp.bottom = function(content) {};
  fnTemp.left = function(content) {};
  fnTemp.right = function(content) {};
  fnTemp.preloader = function() {
    $body.addClass('open-preloader');
  };


  fnTemp.modal = function() {

  };
  fnTemp.alert = function(title, content, callback) {
    $.dim('alert', ['modal'], function(require, exports, module) {
      var modal = require('modal');
      modal.data.push({
        title: title,
        content: content,
        callback: callback
      });
      modal.data.isShow = true;
    });
    fnTemp.modal({
      title: title,
      content: content,
      callback: callback
    });
  };


  $(document).on('click', function() {
    var $this = $(this);
    $.each(['status', 'top', 'left', 'right', 'bottom', 'preloader', 'modal'], function(i, n) {
      if ($this.hasClass('close' + n)) {
        $body.removeClass('open-' + n);
      }
    });
  });


  $.model = $.extend(fnTemp, {
    isAndroid: isAndroid,
    isIphone: isIphone,
    isWebView: isWebView
  });
}));