/**
 * Created by kerr on 2015/4/20.
 * Version: 0.0.1
 *//**
 * Created by kerr on 2015/2/15.
 */
(function() {
  //'use strict';
  var fn = function($) {
    var
      Ajaxs = (function() {
        return function() {
          var ajaxs = [],
            ends = [],
            loadIndex = 0,
            fnEnd = function() {
              if (ajaxs.end && $.type(ajaxs.end) === 'function') {
                ajaxs.end();
                $.each(ends, function(i, fn) {
                  fn();
                });
                ajaxs.isEnd = true;
              }
            };
          /**
           * [add 添加ajax]
           * @param {Function} fn [description]
           */
          ajaxs.add = function(fn) {
            ajaxs.push(fn);
          };
          /**
           * [fire 执行ajax]
           * @param  {[type]} star [开始事件]
           * @param  {[type]} end  [结束事件]
           * @return {[type]}      [description]
           */
          ajaxs.fire = function(star, end) {
            if (star && $.type(star) === 'function') {
              star();
            }
            ajaxs.end = end;

            if (ajaxs.length) {
              ajaxs.forEach(function(fn) {
                if (fn && $.type(fn) === 'function') {
                  fn();
                }
              });
            } else {
              fnEnd();
            }
          };
          ajaxs.onEnd = function(fn) {
            if (ajaxs.isEnd) {
              fn();
            } else {
              ends.push(fn);
            }
          };
          /**
           * [ok 添加数据并且执行结束事件]
           * @return {[type]} [description]
           */
          ajaxs.ok = function(obj, key, val) {
            if (obj && key) {
              if ($.type(key) === 'object') {
                obj = $.extend(obj, key);
              } else if (val) {
                obj[key] = val;
              }
            }
            loadIndex += 1;
            if (ajaxs.length === loadIndex) {
              fnEnd();
            }
          };

          return ajaxs;
        };
      }()),
      mvvm = {
        version: '0.0.1',
        /**
         * [init 初始化函数]
         * @return {[type]} [description]
         */
        init: function() {
          var self = this;
          if (self.binds) {
            $.each(self.binds, function(key, fn) {
              fn.call(self);
            });
          }
          window.VMODELS = {};
          return self;
        },
        noop: function() {},
        filters: {
          html: function(str) {

          }
        },
        bindInput: function(el, fn) {
          if(window.addEventListener) { //先执行W3C
            el.addEventListener("input", fn, false);
          } else {
  //          el.attachEvent("onpropertychange", function(e) {
  //            if(e.propertyName!=='value') return;
  //            fn();
  //          });
            el.attachEvent("onchange", fn);
            el.attachEvent("onkeyup", fn);
            el.attachEvent("onpaste", fn);
          }

          if(window.VBArray && window.addEventListener && window.attachEvent) { //IE9
            el.attachEvent("onkeydown", function() {
              var args = arguments;
              var key = window.event.keyCode;
              if (key === 8 || key === 46) { //处理回退与删除
                fn.apply(el, args);
              }
            });
            el.attachEvent("oncut", fn);//处理粘贴
          }

          if (el.attachEvent) {
            el.attachEvent('onmouseup', function(e) {
              setTimeout(function() {
                var newValue = el.value;
                if (newValue === '') {
                  fn();
                }
              }, 16);
            });
          }
        },
        binds: {
          /**
           * [fixArray 修改系统Array函数]
           * @return {[type]} [description]
           */
          fixArray: function() {
            $.extend(Array.prototype, {
              set: function(index, val) {
                return this.splice(index, 1, val);
              },
              removeAt: function(index) {
                return this.splice(index, 0);
              },
              indexOf: function(item) {
                return $.inArray(item, this);
              },
              unique: function() {
                var i = 0, n = this.length,ret = [];
                for (; i < n; i++) {
                  var item = this[i];
                  if (ret.indexOf(item) === -1) {
                    ret.push(item);
                  }
                }
                return ret;
              },
              remove: function(item) {
                var index = this.indexOf(item);
                return this.removeAt(index);
              },
              removeAll: function() {
                return this.splice(0, this.length);
              },
              ensure: function(item) {
                if (this.indexOf(item) === -1) { //只有不存在才push
                  this.push(item);
                }
                return this;
              },
              clear: function() {
                return this.splice(0, this.length);
              }
            });
          },
          /**
           * [fixIe678 给ie678加个函数，方便vbscript调用]
           * @return {[type]} [description]
           */
          fixIe678: function() {
            if (mvvm.ie678) {
              window.ie_model_get_and_set = function(obj, key, isSet, newVal, oldVal) {
                if (key !== '$event' && obj && obj.$event) {
                  if (isSet) {
                    obj.$event.fire2(obj, 'vbscript.set.' + key, [newVal, oldVal]);
                  } else {
                    obj.$event.fire2(obj, 'vbscript.get.' + key);
                  }
                }
              };
            }
          }
        },
        /**
         * [事件函数]
         * @param  {[type]} [description]
         * @param  {[type]} [description]
         * @return {[type]} [description]
         */
        Event: (function() {
          var Event = function() {
            this.events = {};
          };
          Event.prototype = {
            constructor: this,
            // 订阅
            add: function(e, callback) {
              var self = this;

              $.each(e.split(' '), function(eIndex, e) {
                if (!self[e]) {
                  self[e] = [];
                }
                for (var i = 0, len = self[e].length; i < len; i++) {
                  if (self[e][i] === callback) {
                    return false;
                  }
                }
                self[e].push(callback);
              });
            },
            // 分发事件
            fire: function(e) {
              this.fire2(this, e, Array.prototype.slice.call(arguments).slice(1));
            },
            fire2: function(obj, e, args) {
              var self = this;

              $.each(e.split(' '), function(eIndex, e) {
                if (self[e]) {
                  for (var i = 0, len = self[e].length; i < len; i++) {
                    self[e][i].apply(obj || self, args || []);
                  }
                }
              });
            }
          };
          return Event;
        }()),
        // IE 678
        ie678: !window.dispatchEvent,
        // 寻找模版的匹配
        re: /\{\{(.+?)\}\}/g,
        // dom 前缀
        prefix: 'vm-',
        // 得到get的列表
        hasGet: [],
        /**
         * [addProperty defineProperty get和set方法]
         * @param {[type]} obj   [description]
         * @param {[type]} name  [description]
         * @param {[type]} onGet [description]
         * @param {[type]} onSet [description]
         */
        addProperty: function (obj, name, onGet, onSet) {
          var
            oldValue = obj[name],
            getFn = function () {
              return onGet.apply(obj, [oldValue]);
            },
            setFn = function (newValue) {
              return (oldValue = onSet.apply(obj, [newValue, oldValue]));
            };
          obj.$event.add('fix.set.' + name, onSet);
          if (mvvm.ie678) {
            obj.$event.add('vbscript.get.' + name, onGet);
            obj.$event.add('vbscript.set.' + name, onSet);
          } else if (Object.defineProperty) {// Modern browsers, IE9+, and IE8 (must be a DOM object),
            Object.defineProperty(obj, name, {
              get: getFn,
              set: setFn
            });
          } else if (obj.__defineGetter__) { // Older Mozilla
            obj.__defineGetter__(name, getFn);
            obj.__defineSetter__(name, setFn);
          }
        },
        /**
         * [addProp 新增get和set方法]
         * @param {[type]} model [description]
         * @param {[type]} key   [description]
         * @param {[type]} fnGet [description]
         * @param {[type]} fnSet [description]
         */
        addProp: function(model, key, fnGet, fnSet) {
          mvvm.addProperty(model, key, function () {
            if (this.$event) {
              this.$event.fire('get', key, this);
            }
            return fnGet ? fnGet.call(model) : this["$" + key];
          }, function (newVal, oldVal) {
            if (fnSet) {
              fnSet.apply(this, arguments);
            }
            if (this.$event) {
              if (newVal !== oldVal) {
                this.$event.fire('watch.' + key, newVal, oldVal, this);
              }
            }
            if (mvvm.ie678) {
              if (this[key] !== newVal) {
                this[key] = newVal;
              }
            } else {
              if (this['$' + key] !== newVal) {
                this['$' + key] = newVal;
              }
            }
            if (this.$event) {
              this.$event.fire('set.' + key, key, newVal, this);
            }
            //eventCenter.fire(key, v)
          });
        },
        /**
         * [createEventAdd 通过str得到依赖再绑定到$event]
         * @param  {[type]}   vm        [description]
         * @param  {[type]}   str       [description]
         * @param  {Function} callback  [description]
         * @param  {[type]}   bindEvent [description]
         * @return {[type]}             [description]
         */
        createEventAdd: function(vm, str, callback, bindEvent, isFirst) {
          mvvm.hasGet = [];
          new Function('vm', 'var rtv; with(vm) { rtv = ' + str + '; } return rtv;')(vm);

          var newGet = [].concat(mvvm.hasGet);

          if (bindEvent && $.type(bindEvent) === 'function') {
            bindEvent(newGet);
          }

          var fn = function (my_key, my_val, my_obj) {
            var
              keys = [],
              vals = [],
              len = newGet.length;

            if (len === 1 && my_key && my_val) {
              keys.push(my_key);
              vals.push(my_val);
            } else {
              $.each(newGet, function(i, obj) {
                keys.push(obj.key);
  //          if (obj.key === my_key) {
  //            vals.push(my_val);
  //          } else {
  //            vals.push(obj.obj[obj.key]);
  //          }
                vals.push(obj.obj[obj.key]);
              });
            }

            keys.push('return ' + str + ';');
            //console.log(Function.apply(null, keys).apply(null, vals));
            var rtv = Function.apply(null, keys).apply(null, vals);
            //if (/^\$index/.test(str)) {
            //  //var array = vm[str.replace(/^\$index/, '$array')];
            //  //array.$event.fire('index', node, array);
            //} else {
            //  callback(rtv, newGet);
            //}
            callback(rtv, newGet);
          };
          $.each(isFirst ? newGet.slice(0, 1) : newGet, function(i, obj) {
            if (!/^\$/.test(obj.key)) {
              if (obj.obj && obj.obj.$event) {
                obj.obj.$event.add('set.' + obj.key, fn);
              }
            }
          });
          fn();
        },
        /**
         * [deelNode 处理节点]
         * @param  {[type]} n  [description]
         * @param  {[type]} vm [description]
         * @return {[type]}    [description]
         */
        deelNode: function(n, vm, $$) {
          var $n = $(n);
          if (n.nodeType === 3) {
            var text = $.trim($n.text()),
              execArr,
              len = text.length,
              i = 0,
              createNode = function(str, callback) {
                var rHasHtml = /\|\s*html\s*/,
                  node,
                  $before = $('<!-- html start -->'),
                  $after = $('<!-- html end -->');

                if (rHasHtml.test(str)) {
                  if ($.type(callback) === 'function') {
                    $n.before($before).after($after).remove();
                    callback(str.replace(rHasHtml, ''), $before, $after);
                  }
                } else {
                  node = document.createTextNode(str);
                  $n.before(node);
                  if ($.type(callback) === 'function') {
                    callback(str, node);
                  }
                }
              };

            if (/\{\{(.+?)\}\}/.test(text)) {
              n.nodeValue = '';
              while ((execArr = mvvm.re.exec(text)) != null) {
                if (i < execArr.index) {
                  createNode(text.slice(i, execArr.index));
                }
                createNode(execArr[1], function(str, node, $after) {
                  if ($$ && /^\$item/.test(str) && $$[str]) {
                    var repeatObjList = [];
                    mvvm.createEventAdd($$.repeatObj, $$[str], function(str) {
                      if ($after) {
                        var div = document.createElement('div');
                        div.innerHTML = str;
                        $.each(repeatObjList, function(i, n) {
                          $(n).remove();
                        });
                        while (div.firstChild) {
                          repeatObjList[repeatObjList.length - 1] = div.firstChild;
                          $after.before(div.firstChild);
                        }
                      } else {
                        node.nodeValue = str;
                      }
                    });
                  }
                  var myList = [];
                  mvvm.createEventAdd(vm, str, function(str) {
                    if ($after) {
                      var div = document.createElement('div');
                      div.innerHTML = str;
                      $.each(myList, function(i, n) {
                        $(n).remove();
                      });
                      while (div.firstChild) {
                        myList[myList.length - 1] = div.firstChild;
                        $after.before(div.firstChild);
                      }
                    } else {
                      node.nodeValue = str;
                    }
                  });
                });
                i = execArr.index + execArr[0].length;
              }
              if ( i < len) {
                createNode(text.slice(i, len));
              }
            }
          } else {
            $.each(mvvm.attrs, function(attr, fn) {
              var getAttr = $n.attr(mvvm.prefix + attr);
              if (getAttr) {
                fn($n, vm, getAttr);
              }
            });
          }
        },
        attrs: (function() {
          var rtv = {
            'class': function($n, vm, attrClass) {
              mvvm.createEventAdd(vm, attrClass, function(obj) {
                $.each(obj, function (key, val) {
                  if (val) {
                    $n.addClass(key);
                  } else {
                    $n.removeClass(key);
                  }
                });
              });
            },
            'classlist': function($n, vm, attrClass) {
              mvvm.createEventAdd(vm, attrClass, function(val) {
                $n.addClass(val);
              });
            },
            'attr': function($n, vm, attrClass) {
              mvvm.createEventAdd(vm, attrClass, function(obj) {
                $.each(obj, function (key, val) {
                  $n.attr(key, val);
                });
              });
            },
            'prop': function($n, vm, attrClass) {
              mvvm.createEventAdd(vm, attrClass, function(obj) {
                $.each(obj, function (key, val) {
                  $n.prop(key, val);
                });
              });
            },
            'css':  function($n, vm, attrClass) {
              mvvm.createEventAdd(vm, attrClass, function(obj) {
                $.each(obj, function (key, val) {
                  $n.css(key, val);
                });
              });
            },
            'if': function($n, vm, attrIf) {
              mvvm.createEventAdd(vm, attrIf, function(str) {
                var $else = $n.siblings('[' + mvvm.prefix + 'else]');

                $n[str ? 'show' : 'hide']();
                if ($else.length) {
                  $else[str ? 'hide' : 'show']();
                }
              });
            },
            'duplex': function($n, vm, attrDuplex) {
              mvvm.createEventAdd(vm, attrDuplex, function(str) {
                if ($n.val() !== str) {
                  $n.val(str);
                }
              }, function() {
                mvvm.bindInput($n.get(0), function(e) {
                  if ($n.val() !== vm[attrDuplex]) {
                    vm[attrDuplex] = $n.val();
                  }
                });
              }, true);
            },
            'data': function($n, vm, attrData) {
              mvvm.createEventAdd(vm, attrData, function(obj) {
                $n.data(obj);
              });
            },
            'value': function($n, vm, attrData) {
              mvvm.createEventAdd(vm, attrData, function(obj) {
                $n.val(obj);
              });
            }
          };
          $.each('click change'.split(' '), function(i, n) {
            rtv[n] = function($n, vm, attrData) {
              $n.on(n, function() {
                return new Function('vm', 'var rtv; with(vm) { rtv = ' + attrData + '; } return rtv;').call(this, vm);
              });
            };
          });
          return rtv;
        }()),
        /**
         * [deelRepeat 处理循环节点]
         * @param  {[type]} n      [description]
         * @param  {[type]} vm     [description]
         * @param  {[type]} nowNum [description]
         * @return {[type]}        [description]
         */
        deelRepeat: function(n, vm, nowNum, $$) {
          var $n = $(n),
            attrRepeat = $n.attr(mvvm.prefix + 'repeat').split(':'),
            repeatItem = attrRepeat[0],
            trackByIndex = !!attrRepeat[1],
            $before = $('<!-- repeat start -->'),
            $after = $('<!-- repeat end -->'),
            $clone = $n.clone().removeAttr(mvvm.prefix + 'repeat'),
            list = [];

          nowNum = nowNum || '';

          $n.before($before).after($after).remove();
          mvvm.createEventAdd(vm, repeatItem, function(arr) {
            if ($.type(arr) === 'array') {
              mvvm.arrayBindEvent(arr);
              var arrEvent = arr.$event || new mvvm.Event(),
                myArrEvent = new mvvm.Event();

              myArrEvent.add('delete', function(index, len, oldVal, newVal) {
                var listLen = list.length,
                  i = index,
                  toLen = Math.min(index + len, listLen);

                if (trackByIndex) {
                  if (index >= 0 && index < listLen) {
                    for (; i < listLen; i ++ ) {
                      list[i].remove();
                    }
                    list.splice(index, listLen);
                    if (oldVal && newVal) {
                      myArrEvent.fire('insert', index, newVal.slice(index));
                    }
                  }
                } else {
                  if (index >= 0) {
                    for (; i < toLen; i ++ ) {
                      list[i].remove();
                    }
                    list.splice(index, len);
                  }
                }
              });
              myArrEvent.add('insert', function(index, args) {
                // unshift   arrEvent.fire(0, [1, 2, 3]);
                var $last = list[index] || $after,
                  listLen = list.length;
                $.each(args, function(i, arg) {
                  var node = $clone.clone(),
                    $vm = vm;

                  $vm['$item' + nowNum] = arg;
                  $vm['$index' + nowNum] = listLen + i;
                  //$vm['$array' + nowNum] = arr;


                  // $after.before(node);
                  list.splice(index + i, 0, node);
                  mvvm.deelNode(node, $vm, $$);
                  $last.before(node);
                  mvvm.getChildNodes(node, $vm, nowNum + 1, $$);

                });
              });
              arrEvent.add('index', function(n, vm) {
                mvvm.deelNode(n, vm);
              });
              arrEvent.add('splice', function(args, oldVal, newVal) {
                var index = args[0],
                  delLen = args[1],
                  insert = [].slice.call(args, 2);

                myArrEvent.fire('delete', index, delLen, oldVal, newVal);
                myArrEvent.fire('insert', index, insert);
              });
              arrEvent.add('push', function(args, oldVal, newVal) {
                myArrEvent.fire('insert', list.length, args);
              });
              arrEvent.add('pop', function(args, oldVal, newVal) {
                myArrEvent.fire('delete', list.length - 1, 1, oldVal, newVal);
              });
              arrEvent.add('shift', function(args, oldVal, newVal) {
                myArrEvent.fire('delete', 0, 1, oldVal, newVal);
              });
              arrEvent.add('unshift', function(args, oldVal, newVal) {
                myArrEvent.fire('insert', 0, args);
              });
              arrEvent.add('sort reverse', function(args, oldVal, newVal) {
                if (trackByIndex) {
                  myArrEvent.fire('clear');
                  myArrEvent.fire('insert', list.length, newVal);
                } else {
                  for (var i = 0, n = oldVal.length; i < n; i++) {
                    var a = newVal[i],
                      b = oldVal[i];
                    if (a !== b) {
                      var index = oldVal.indexOf(a, i);
                      var remove2 = oldVal.splice(index, 1)[0];
                      oldVal.splice(i, 0, remove2);
                      myArrEvent.fire("move", index, i);
                    }
                  }
                }
              });
              myArrEvent.add('move', function(index, i) {
                list[i].before(list[index]);
                var remove = list.splice(index, 1)[0];
                list.splice(i, 0, remove);
              });
              myArrEvent.add('clear', function() {
                myArrEvent.fire('delete', 0, list.length);
              });
              myArrEvent.fire('clear');
              myArrEvent.fire('insert', list.length, arr);
              arr.$event = arrEvent;
              return false;
            }

            var repeatObj = arr;
            $.each(repeatObj, function($index, $item) {
              if (!/^\$/.test($index)) {
                var node = $clone.clone(),
                  $vm = vm,
                  $$ = {
                    repeatObj: repeatObj
                  };
                $vm['$item' + nowNum] = $item;
                $$['$item' + nowNum] = $vm['$index' + nowNum] = $index;
                mvvm.deelNode(node, $vm, $$);
                $after.before(node);
                mvvm.getChildNodes(node, $vm, nowNum + 1, $$);
              }
            });

          });

        },
        /**
         * [getChildNodes 循环获取子节点]
         * @param  {[type]} node [description]
         * @param  {[type]} vm   [description]
         * @param  {[type]} deep [description]
         * @return {[type]}      [description]
         */
        getChildNodes: function(node, vm, deep, $$) {
          var $childNodes = $(node).contents(),
            arr = [];
          deep = deep || 0;

          if ($childNodes.length) {
            //console.log($childNodes.html());
            $childNodes.each(function(i, n) {
              var $n = $(n),
                $childNodes = $n.contents(),
                attrRepest = $n.attr(mvvm.prefix + 'repeat');

              if (attrRepest) {
                mvvm.deelRepeat(n, vm, deep ++, $$);
              } else {
                mvvm.deelNode(n, vm, $$);
                if ($childNodes.length) {
                  arr.push({
                    node: n,
                    vm: vm
                  });
                }
              }
            });

            if (arr.length) {
              $.each(arr, function(i, obj) {
                mvvm.getChildNodes(obj.node, obj.vm, deep, $$);
              });
            }
          }
        },
        /**
         * [converVbObj 转换成vb对象]
         * @param  {[type]} jsObj [description]
         * @return {[type]}       [description]
         */
        converVbObj: function(jsObj) {
          var privates = [],
            getAndSet = [],
            class_name = 'class_name_' + new Date() * 1,
            create_class_name = 'create_class_name_' + new Date() * 1;

          $.each(jsObj, function(key, val) {
            if ($.type(val) === 'function') {
              privates.push('Public [' + key + ']');
            } else {
              privates.push('Public [$key_' + key + ']');
              privates.push('Public [$old_$key_' + key + ']');
              //console.log(val && val.get);
              getAndSet.push(['',
                'Public Property Let [' + key + '](strName)',
                '[$key_' + key + '] = strName',
                'Call ie_model_get_and_set(' + create_class_name + ', "' + key + '", 1, strName, [$old_$key_' + key + '])',
                '[$old_$key_' + key + '] = strName',
                'End Property',
                'Public Property Set [' + key + '](strName)',
                'Set [$key_' + key + '] = strName',
                'Call ie_model_get_and_set(' + create_class_name + ', "' + key + '", 1, strName, [$old_$key_' + key + '])',
                'Set [$old_$key_' + key + '] = strName',
                'End Property',
                'Public Property Get [' + key + ']()',
                "\tOn Error Resume Next", //必须优先使用set语句,否则它会误将数组当字符串返回
                '\t\tSet[' + key + '] = [$key_' + key + ']',
                "\tIf Err.Number <> 0 Then",
                '[' + key + '] = [$key_' + key + ']',
                "\tEnd If",
                "\tOn Error Goto 0",
                'Call ie_model_get_and_set(' + create_class_name + ', "' + key + '", 0)',
                'End Property'].join('\n'));
            }
          });

          //privates.push('Private [hasOwnProperty]');

          window.execScript(['Class [' + class_name + ']',
            privates.join('\n'),
            getAndSet.join('\n'),
            'End Class',
            'set [' + create_class_name + ']=new [' + class_name + ']'].join('\n'), 'vbscript');

          var rtv = window[create_class_name];


          $.each(jsObj, function(key, val) {
            var myVal = val;

            if (val) {
              var getter = val.get,
                setter = val.set;
              if ($.type(getter) === 'function' && $.type(setter) === 'function') {
                myVal = getter.call(jsObj);
              }
            }

            rtv[key] = myVal;

            //var getter = val && val.get,
            //  setter = val && val.set;
            //rtv[key] = getter && setter ? getter.call(jsObj) : val;
          });
  //    rtv.$event = $event;
          return rtv;
        },
        arrayBindEvent: function(myArray) {
          var methods = 'pop push shift unshift splice sort reverse concat slice'.split(' ');
          $.each(methods, function(i, name) {
            if (name in Array.prototype) {
              var pointer = Array.prototype[name];
              myArray[name] = function() {
                var oldData = [],
                  rtv;
                for (var i = 0, len = this.length; i < len; i++) {
                  oldData[i] = this[i];
                }
                rtv = pointer.apply(this, arguments);

                if (this.$event) {
                  this.$event.fire(name, arguments, oldData, this);
                }
                // console.log(this, name, arguments, oldData, this)
                return rtv;
              };
            }
          });
        },
        /**
         * 反悔有个get和set的对象
         * @param node
         * @param model
         * @returns {*|myModel._}
         */
        getExport: function(node, model) {
          var myModel = {},
            vm = $.extend({}, model);

          myModel._ = vm;
          (function getAndSet(parent, parent_key, obj) {
            if (typeof (obj) === 'object' && obj !== null) {
              var objEvent = new mvvm.Event(),
                oGetSet = {};

              obj.$event = objEvent;
              objEvent.add('get', function(key, obj) {
                mvvm.hasGet.push({
                  obj: obj,
                  key: key
                });
              });
              $.each(obj, function (key, val) {
                if (!/^\$/.test(key)) {
                  if ($.type(obj) === 'object') {
                    if (val && val.get && val.set) {
                      // 获取get的依赖
                      // 获取set的依赖
                      mvvm.addProp(obj, key, val.get, val.set);

                      oGetSet = {
                        obj: obj,
                        key: key,
                        fnGet: val.get,
                        fnSet: val.set
                      };

                    } else {
                      mvvm.addProp(obj, key);
                      obj[key] = val;
                    }
                  }
                  if (!(val && val.get && val.set)) {
                    getAndSet(obj, key, val);
                  }
                }
              });
              if (obj.$watch) {
                $.each(obj.$watch, function(key, fn) {
                  objEvent.add('watch.' + key, fn);
                });
              }
              //obj.$event = objEvent;

              if ($.type(obj) === 'object') {
                for (var num = 0; num < 10; num ++ ) {
                  var myNum = num || '';
                  mvvm.addProp(obj, '$item' + myNum);
                  mvvm.addProp(obj, '$index' + myNum);
                  //mvvm.addProp(obj, '$array' + myNum);
                  obj['$item' + myNum] = obj['$index' + myNum] = null;
                  //obj['$array' + myNum] = [];
                }
                if (oGetSet.obj) {
                  mvvm.hasGet = [];
                  oGetSet.fnGet.apply(obj);
                  $.each([].concat(mvvm.hasGet), function(i, myObj) {
                    obj.$event.add('watch.' + myObj.key, function() {
                      setTimeout(function() {
                        obj.$event.fire2(obj, 'fix.set.' + oGetSet.key, [oGetSet.fnGet.apply(obj), obj[oGetSet.key]]);
                      }, 0);
                    });
                  });
                }

                if (mvvm.ie678) {
                  var vbObj = mvvm.converVbObj(obj);
                  parent[parent_key] = vbObj;
                  if (oGetSet.obj) {
                    mvvm.hasGet = [];
                    oGetSet.fnGet.apply(vbObj);
                    $.each([].concat(mvvm.hasGet), function(i, obj) {
                      vbObj.$event.add('watch.' + obj.key, function() {
                        setTimeout(function() {
                          vbObj.$event.fire2(vbObj, 'vbscript.set.' + oGetSet.key, [oGetSet.fnGet.apply(vbObj), vbObj[oGetSet.key]]);
                        }, 0);
                      });
                    });
                  }
                }
              }
            }
          }(myModel, '_', vm));
          mvvm.deelNode(node, myModel._);

          mvvm.getChildNodes(node, myModel._);

          return myModel._;
        },
        parseDeps: (function () {
          var REQUIRE_RE = /"(?:\\"|[^"])*"|'(?:\\'|[^'])*'|\/\*[\S\s]*?\*\/|\/(?:\\\/|[^\/\r\n])+\/(?=[^\/])|\/\/.*|\.\s*require|(?:^|[^$])\brequire\s*\(\s*(["'])(.+?)\1\s*\)/g,
            SLASH_RE = /\\\\/g;
          return function(code) {
            var ret = [];
            code.replace(SLASH_RE, "").replace(REQUIRE_RE, function(m, m1, m2) {
              if (m2) {
                ret.push(m2);
              }
            });
            return ret;
          };
        }()),
        defineMap: {},
        defineEventMap: {},
        unique: function(arr) {
          var obj = {},
            rtv = [];
          $.each(arr, function(i, n) {
            if (!obj[n]) {
              obj[n] = true;
              rtv.push(n);
            }
          });
          return rtv;
        },
        dim: function(id, deps, factory) {
          var args = arguments,
            defineMap = mvvm.defineMap,
            defineEventMap = mvvm.defineEventMap;

          switch (args.length) {
            case 0:
              return false;
              break;
            case 1:
              factory = id;
              deps = [];
              id = 'anonymousId' + Math.random();
              break;
            case 2:
              if ($.type (id) === 'string') {
                factory = deps;
                deps = [];
              } else {
                factory = deps;
                deps = id;
                id = 'anonymousId' + Math.random();
              }
              break;
          }

          if ($.type(factory) === 'functoin') {
            deps = deps.concat(mvvm.parseDeps(factory.toString()))
          }

          deps = mvvm.unique(deps);

          defineMap[id] = {
            id: id,
            deps: deps,
            factory: factory
          };
          if (!defineEventMap[id]) {
            defineEventMap[id] = new Ajaxs();
          }
          deps.forEach(function(dep) {
            if (!defineEventMap[dep]) {
              defineEventMap[dep] = new Ajaxs();
            }

            defineEventMap[id].add(function() {
              defineEventMap[dep].onEnd(function() {
                defineEventMap[id].ok();
              });
            });
          });

          $(function() {
            defineEventMap[id].fire(function() {}, function() {
              var module = defineMap[id];
              module.exports = {};
              var localRequire = function(dep) {
                return defineMap[dep].exports;
              };

              var myExports,
                $id = $('#' + id);
              if ( $id && $id.length ) {
                myExports = $.type(factory) === 'function' ? (factory.apply($id, [localRequire, module.exports, module])  || module.exports) : factory;
                myExports = mvvm.getExport($id.get(0), myExports);
                window.VMODELS[id] = myExports;
                //if (myExports.init) {
                //  myExports.init();
                //}
              } else {
                myExports = $.type(factory) === 'function' ? (factory(localRequire, module.exports, module)  || module.exports) : factory;
                //myExports = mvvm.getExport(document.createElement('div'), myExports);
              }

              module.exports =  myExports;
            });
          });
        }
      };
    mvvm.init();
    $.dim = mvvm.dim;
    $.mc = function(model, ctrl) {
      ctrl && $.each(ctrl, function(i, n) {
        n && n.call(self, model);
      });
      return model;
    };
  };
  if (typeof define === 'function' && (define.amd || define.cmd)) {
    define(function(require, exports, module) {
      var jQuery = require('./jquery');
      fn(jQuery);
    });
  } else {
    fn(jQuery);
  }
}());