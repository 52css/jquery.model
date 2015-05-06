/**
 * Created by kerr on 2015/4/20.
 * Version: 0.0.1
 */define(function(require, exports, module) {
  var $ = require('./jquery'),
    fastclick = require('./fastclick'),
    IScroll = require('./iscroll');

  require('./jquery.dim');
  fastclick.attach(document.body);
  document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

  $.dim('left', function(r, exports, module) {
    var
      self = this,
      mc = function(model, ctrl) {
        ctrl && $.each(ctrl, function(i, n) {
          n && n.call(self, model);
        });
        return model;
      };

    module.exports = mc({
      data: {
        show: false
      },
      isShow: function() {
        var model = module.exports;
        return model.data.show;
      },
      show: function() {
        var model = module.exports;
        model.data.show = true;
      },
      hide: function() {
        var model = module.exports;
        model.data.show = false;
      }
    });
  });
  $.dim('right', function(r, exports, module) {
    var
      self = this,
      mc = function(model, ctrl) {
        ctrl && $.each(ctrl, function(i, n) {
          n && n.call(self, model);
        });
        return model;
      };

    module.exports = mc({
      data: {
        show: false
      },
      isShow: function() {
        var model = module.exports;
        return model.data.show;
      },
      show: function() {
        var model = module.exports;
        model.data.show = true;
      },
      hide: function() {
        var model = module.exports;
        model.data.show = false;
      }
    });
  });
  $.dim('top', function(r, exports, module) {
    var
      self = this,
      mc = function(model, ctrl) {
        ctrl && $.each(ctrl, function(i, n) {
          n && n.call(self, model);
        });
        return model;
      };

    module.exports = mc({
      data: {
        show: false,
        content: 'this is top'
      },
      isShow: function() {
        var model = module.exports;
        return model.data.show;
      },
      show: function(content) {
        var model = module.exports;
        model.data.content = content;
        model.data.show = true;
      },
      hide: function() {
        var model = module.exports;
        model.data.show = false;
      }
    });
  });
  $.dim('bottom', function(r, exports, module) {
    var
      self = this,
      mc = function(model, ctrl) {
        ctrl && $.each(ctrl, function(i, n) {
          n && n.call(self, model);
        });
        return model;
      };

    module.exports = mc({
      data: {
        show: false,
        content: ''
      },
      isShow: function() {
        var model = module.exports;
        return model.data.show;
      },
      show: function(content) {
        var model = module.exports;
        model.data.content = content;
        model.data.show = true;
      },
      hide: function() {
        var model = module.exports;
        model.data.show = false;
      }
    }, {
      close: function() {
        $(this).on('click', '.close-bottom', function() {
          var model = module.exports;
          model.hide();
        });
      }
    });
  });
  $.dim('mask', function(r, exports, module) {
    var
      self = this,
      mc = function(model, ctrl) {
        ctrl && $.each(ctrl, function(i, n) {
          n && n.call(self, model);
        });
        return model;
      };

    module.exports = mc({
      data: {
        show: false,
        black: true
      },
      isShow: function() {
        var model = module.exports;
        return model.data.show;
      },
      showBlack: function() {
        var model = module.exports;
        model.data.black = true;
        model.data.show = true;
      },
      showWhite: function() {
        var model = module.exports;
        model.data.black = false;
        model.data.show = true;
      },
      hide: function() {
        var model = module.exports;
        model.data.show = false;
      }
    });
  });
  $.dim('indicator', ['mask'], function(r, exports, module) {
    var
      self = this,
      mask = r('mask'),
      mc = function(model, ctrl) {
        ctrl && $.each(ctrl, function(i, n) {
          n && n.call(self, model);
        });
        return model;
      };

    module.exports = mc({
      data: {
        show: false
      },
      isShow: function() {
        var model = module.exports;
        return model.data.show;
      },
      show: function() {
        var model = module.exports;
        mask.showWhite();
        model.data.show = true;
      },
      hide: function() {
        var model = module.exports;
        mask.hide();
        model.data.show = false;
      }
    });
  });
  $.dim('modal', ['mask'], function(r, exports, module) {
    var
      self = this,
      mask = r('mask'),
      mc = function(model, ctrl) {
        ctrl && $.each(ctrl, function(i, n) {
          n && n.call(self, model);
        });
        return model;
      },
      create = function(text, title, btn, callbackOk, callbackCancel) {
        var model = module.exports,
          $alertFirst,
          $alert;

        model.data.push({
          show: false,
          title: title,
          content: text,
          btn: btn
        });

        mask.showBlack();
        $alertFirst = $('.alert:first');

        $alert = $('.alert:eq(' + (model.data.length - 1) + ')');
        if (callbackOk) {
          $alert.find('.btn:last').on('click', callbackOk);
        }
        if (callbackCancel) {
          $alert.find('.btn:first').on('click', callbackCancel);
        }
        if (!model.data[0].show) {
          model.data[0].show = true;
          $alertFirst.show();
          setTimeout(function() {
            $alertFirst.find('.alert-in').addClass('open-alert');
          }, 0);
        }
      };

    module.exports = mc({
      data: [],
      confirm: function(text, title, callbackOk, cancelCallback) {
        create(text, title, [{text: 'Cancel'}, {text: 'Ok'}], callbackOk, cancelCallback);
      },
      alert: function(text, title, callbackOk) {
        create(text, title, [{text: 'Ok'}], callbackOk);
      },
      preloader: function(title) {
        create('<i class="fa fa-spinner fa-pulse fa-2x"></i>', title || 'Loading...', []);
      },
      preloader2: function(title) {
        create('333<i class="fa fa-spinner fa-pulse fa-2x"></i>', title || 'Loading...', []);
      },
      isShow: function() {
        var model = module.exports;
        return model.data.length;
      },
      hide: function() {
        var model = module.exports,
          $second = $('.alert:eq(1)').show();
        $('.alert:first .alert-in').removeClass('open-alert').addClass('close-alert').on('transitionend webkitTransitionEnd', function() {
          model.data.shift();
          if (model.data.length) {
          } else {
            mask.hide();
          }
        });
        setTimeout(function() {
          $second.find('.alert-in').addClass('open-alert');
        }, 0);
      },
      hideAll: function() {
        var model = module.exports;
        model.data.clear();
      }
    }, {
      closeBtn: function() {
        $(this).on('click', '.btn', function() {
          var model = module.exports;
          model.hide();
        });
      }
    });
  });
  $.dim('bottomBtn', ['mask'], function(r, exports, module) {
    var
      self = this,
      mask = r('mask'),
      mc = function(model, ctrl) {
        ctrl && $.each(ctrl, function(i, n) {
          n && n.call(self, model);
        });
        return model;
      };

    module.exports = mc({
      data: {
        show: false,
        list: []
      },
      isShow: function() {
        var model = module.exports;
        return model.data.show;
      },
      show: function(list) {
        var model = module.exports;
        model.data.list = list;
        mask.showBlack();
        model.data.show = true;
      },
      hide: function() {
        var model = module.exports;
        mask.hide();
        model.data.show = false;
      }
    }, {
      close: function() {
        $(this).on('click', function(e) {
          var model = module.exports,
            $target = $(e.target),
            $btn = $target.closest('.btn'),
            $bottomBtn = $target.hasClass('bottom-btn');

          if ($btn.length || $bottomBtn) {
            model.hide();
          }
        });
      }
    });
  });
  $.dim('router', ['indicator', 'left', 'right', 'bottomBtn'], function(r, exports, module) {
    var
      self = this,
      indicator = r('indicator'),
      left = r('left'),
      right = r('right'),
      bottomBtn = r('bottomBtn'),
      mc = function(model, ctrl) {
        ctrl && $.each(ctrl, function(i, n) {
          n && n.call(self, model);
        });
        return model;
      },
      router = {
        pages: {
          main: [],
          left: [],
          right: []
        },
        events: {
          ajaxRender: [],
          pageFirstInit: [],
          pageInit: [],
          pageBeforeAnimate: [],
          pageAfterAnimate: [],
          pageOut: []
        },
        history: [],
        visitor: [],
        index: -1,
        areaClassName: 'main',
        viewClassName: 'view',
        pageClassName: 'page',
        pageAnimateClassName: 'slide',
        on: function (eventName, pageName, callback) {
          var
            args = arguments;
          if (args.length === 2) {
            callback = pageName;
            pageName = null;
          }
          var arr = eventName.split('.'),
            eName = arr[0],
            key = arr[1];
          router.events[eName].push({
            key: key,
            pageName: pageName,
            callback: callback
          });
          return router;
        },
        off: function (eventName) {
          var
            arr = eventName.split('.'),
            eName = arr[0],
            key = arr[1];

          if (eName) {
            router.events[eName] = key ? router.events[eName].map2(function (n) {
              if (n.key === key) {
                return null;
              }
            }) : [];
          } else {
            if (key) {
              for (var e in router.events) {
                router.events[e] = router.events[e].forEach(function (n) {
                  if (n.key === key) {
                    return null;
                  }
                });
              }
            }
          }

          return app;
        },
        getState: function(hash) {
          var rtv = {
              query: {}
            },
            arr,
            arr1;
          hash = hash || location.hash;

          if (/^#!\//.test(hash)) {
            rtv.isUrl = true;
            rtv.url = hash;
            hash = hash.slice(3);
            arr = hash.split('?');
            if (arr[0]) {
              rtv.pageId = arr[0];
              rtv.href = rtv.pageId + '.html' + (arr[1] ? '?' + arr[1] : '');
            }

            if (arr[1]) {
              arr1 = arr[1].split('#');
              /// arr1.replace()
              arr1[0].replace(
                new RegExp("([^?=&]+)(=([^&]*))?", "g"),
                function ($0, $1, $2, $3) {
                  rtv.query[$1] = unescape($3);
                }
              );
              if (arr1[1]) {
                rtv.anchor = arr[1];
              }
            }
          } else if (/^[\w -]+\.html/.test(hash)) {
            rtv.isUrl = true;
            rtv.href = hash;
            arr = hash.split('?');
            if (arr[0]) {
              rtv.pageId = arr[0].split('.').slice(0, -1).join('.');
              rtv.url = '#!/' + rtv.pageId + (arr[1] ? '?' + arr[1] : '');
            }
            if (arr[1]) {
              arr1 = arr[1].split('#');
              /// arr1.replace()
              arr1[0].replace(
                new RegExp("([^?=&]+)(=([^&]*))?", "g"),
                function ($0, $1, $2, $3) {
                  rtv.query[$1] = unescape($3);
                }
              );
              if (arr1[1]) {
                rtv.anchor = arr[1];
              }
            }
          } else {
            rtv.isUrl = false;
          }

          return rtv;
        },
        getArea: function() {
          var router = this;
          if (window.routerIndex >= 0) {
            return router.history[window.routerIndex].area;
          }
          return router.areaClassName;
        },
        getAreaByPageId: function(pageId) {
          var rtv,
            router = this;

          $.each(router.pages, function(area, val) {
            $.each(val, function(i, page) {
              if (page.id === pageId) {
                rtv = area;
                return false;
              }
            });
            if (rtv) {
              return false;
            }
          });

          return rtv;
        },
        getAreaIndex: function(pageId) {
          var getIndex = -1;
          $.each(router.history, function(i, st) {
            if (st.pageId === pageId) {
              getIndex = i;
              return false;
            }
          });

          return getIndex;
        },
        switchPage: function(state) {
          var
            router = this,
            title,
            url = state.url,
            pageId = state.pageId,
            index = router.getAreaIndex(pageId),
            $page = $('#' + pageId),
            page = $page[0],
            from = router.history[window.routerIndex],
            fromPageId,
            $fromPage,
            fromPage,
            fromIndex,
            isVisitor;

          if (from) {
            fromPageId = from.pageId;
            fromIndex = router.getAreaIndex(fromPageId);
            $fromPage = $('#' + fromPageId);
            fromPage = $fromPage[0];
            $.each(router.events.pageOut, function(i, n) {
              if (n.pageName === formPageId || n.pageName === void(0) || n.pageName === null) {
                n.callback(fromPage, state);
              }
            });

            if (from.area === state.area) {
              $fromPage.css('visibility', 'visible').addClass('out').addClass(router.getPageAnimateClassName(fromPage)).removeClass('in');
              $page.css('visibility', 'visible').removeClass('out').addClass(router.getPageAnimateClassName(page)).addClass('in');
              if (fromIndex > index && index >= 0) {
                $fromPage.addClass('reverse');
                $page.addClass('reverse');
              } else {
                $fromPage.removeClass('reverse');
                $page.removeClass('reverse');
              }
            } else {
              switch (state.area) {
                case 'left':
                  $page.css('visibility', 'visible').removeClass('out').addClass('in');
                  left.show();
                  break;
                case 'right':
                  $page.css('visibility', 'visible').removeClass('out').addClass('in');
                  right.show();
                  break;
                case 'main':
                  switch (from.area) {
                    case 'left':
                      $fromPage.removeClass('in').addClass('out');
                      left.hide();
                      $page
                        .css('visibility', 'visible')
                        .removeClass('out')
                        .addClass('in')
                        .siblings()
                        .css('visibility', 'hidden')
                        .removeClass('in')
                        .addClass('out');
                      break;
                    case 'right':
                      $fromPage.removeClass('in').addClass('out');
                      right.hide();
                      break;
                  }
                  break;
              }
            }


            $.each(router.visitor, function(i, n) {
              if (n.pageId == state.pageId) { //  && $.param(n.query) === $.param(state.query)
                isVisitor = true;
                return false;
              }
            });

          } else {
            $page.css('visibility', 'visible').removeClass('out').addClass('in');
          }

          if (!isVisitor) {
            $.each(router.events.pageFirstInit, function(i, n) {
              if (n.pageName === pageId || n.pageName === void(0) || n.pageName === null) {
                n.callback(page, state);
              }
            });
          }

          $.each(router.events.pageInit, function(i, n) {
            if (n.pageName === pageId || n.pageName === void(0) || n.pageName === null) {
              n.callback(page, state);
            }
          });

          title = state.title = $page.attr('data-title') || document.title;
          document.title = title;
          state.time = new Date();
          router.visitor.push(state);
          var getIndex;
          $.each(router.history, function(i, st) {
            if (st.pageId === state.pageId && $.param(st.query) === $.param(state.query)) {
              getIndex = i;
              return false;
            }
          });

          if (getIndex >= 0) {
            window.routerIndex = index;
          } else {
            if (from) {
              router.history = router.history.slice(0, window.routerIndex + 1);
              router.history.push(state);
              window.routerIndex = router.history.length - 1;
              history.pushState(state, title, url);
            } else {
              router.history.push(state);
              window.routerIndex = router.history.length - 1;
              history.replaceState(state, title, url);
            }

          }

        },
        loadPage: function(url, callback) {
          var
            router = this,
            err,
            page,
            area = router.getArea();
//            indicator.show();
          $.ajax({
            url: url,
            success: function(content) {
              page = $(content).appendTo($('.' + area + ' .' + router.viewClassName))[0];
              router.pages[area].push(page);
            },
            error: function() {
              err = '请求超时，请重试。';
            },
            complete: function() {
//                indicator.hide();
              callback(err, page);
            }
          });
        },
        go: function(url) {
          var
            router = this,
            area = router.getArea(),
            getArea,
            page,
            pageId,
            state = router.getState(url),
            index = -1;

          if (state.isUrl) {

            $.each(router.history, function(i, st) {
              if (st.pageId === state.pageId && $.param(st.query) === $.param(state.query)) {
                index = i;
                return false;
              }
            });

            if (index >= 0) {
              history.go(index - window.routerIndex);
            } else {
              pageId = state.pageId;
              getArea = router.getAreaByPageId(pageId);

              if (getArea) {
                state.area = getArea;
                router.switchPage(state);
              } else {
                state.area = area;

                router.loadPage(state.href, function(err, page) {
                  if (err) {

                    return false;
                  }
                  router.switchPage(state);
                });
              }
            }

          } else {
            page = router.pages[area][0];
            pageId = page.id;
            state = router.getState('#!/' + pageId);
            state.area = area;
            router.switchPage(state);
          }
        },
        back: function() {
          history.back();
        },
        getPageAnimateClassName: function(page) {
          var router = this;

          return $(page).attr('data-animate') || router.pageAnimateClassName;
        },
        pageBindEvent: function(page) {
          var router = this;

          $(page)
            .on('webkitAnimationEnd', function() {
              var page = this,
                id = page.id,
                $page = $(page),
                pageAnimateClassName = router.getPageAnimateClassName(page);

              $page.removeClass(pageAnimateClassName);
              if (!$page.hasClass('in')) {
                $page.css('visibility', 'hidden');
              } else {
                $.each(router.events.pageAfterAnimate, function(i, n) {
                  if (n.pageName === id || n.pageName === void(0) || n.pageName === null) {
                    n.callback(page);
                  }
                });
              }
            })
            .on('webkitAnimationStart', function () {
              var page = this,
                id = page.id,
                $page = $(page);

              if ($page.hasClass('in')) {
                $.each(router.events.pageBeforeAnimate, function(i, n) {
                  if (n.pageName === id || n.pageName === void(0) || n.pageName === null) {
                    n.callback(page);
                  }
                });
              }
            });
        },
        fillPages: function() {
          var router = this;

          $('.main')
            .on('webkitAnimationEnd', function() {
            });
          $.each(router.pages, function(area, val) {
            $('.' + area + ' .' + router.pageClassName)
              .each(function() {
                router.pageBindEvent(this, area);
                val.push(this);
              });
          });
        },
        init: function() {
          router.fillPages();
          router.go();
        }
      };



//      router
//        .on('pageFirstInit', 'theme', function(page) {
//          var body = document.body;
//          ['layout', 'theme'].forEach(function(actionName) {
//            [].slice.call(page.querySelectorAll('[data-' + actionName + ']')).forEach(function(node) {
//              var className = node.getAttribute('data-' + actionName + '');
//              node.addEventListener('click', function() {
//                [].slice.call(body.classList).forEach(function(className) {
//                  if (new RegExp('^' + actionName + '\\-').test(className)) {
//                    body.classList.remove(className);
//                  }
//                });
//                body.classList.add('' + actionName + '-' + className);
//              }, false);
//            });
//          });
//        });

//      window.router = router;

    router.on('pageFirstInit', function(page) {
      new IScroll($(page).find('.wrapper')[0], { mouseWheel: true });
    });

    module.exports = mc(router, {
      aClick: function() {
        $(document).on('click', 'a', function() {
          var $this = $(this),
            href = $this.attr('href'),
            rel = $this.attr('data-rel');

          if (href && (/^#!\//.test(href) || /^[\w -]+\.html/.test(href)) && rel !== 'external') {
            router.go(href);
            return false;
          }
        });
      },
      popstate: function() {
        window.addEventListener('popstate', function (event) {
          router.switchPage(event.state);
        });
      },
      mainClick: function() {
        $(document).on('click', function(e) {
          var target = e.target,
            $main = $(target).closest('.main'),
            goIndex = -1;
          if ($main && $main.length) {
            if (left.isShow()) {
              for (var i = router.visitor.length - 2; i >= 0; i --) {
                if (router.visitor[i].area !== 'left') {
                  history.go(goIndex);
                  break;
                } else {
                  goIndex -- ;
                }
              }
            }

            if (right.isShow()) {
              for (var i = router.visitor.length - 2; i >= 0; i --) {
                if (router.visitor[i].area !== 'right') {
                  history.go(goIndex);
                  break;
                } else {
                  goIndex -- ;
                }
              }
            }

            if (bottomBtn.isShow()) {
              bottomBtn.hide();
            }
          }
        });
      }
    });
  });
  $.dim('app', ['top', 'bottom', 'left', 'right', 'modal', 'indicator', 'bottomBtn', 'router'], function(r, exports, module) {
    var
      self = this,
      top = r('top'),
      bottom = r('bottom'),
      left = r('left'),
      right = r('right'),
      modal = r('modal'),
      indicator = r('indicator'),
      bottomBtn = r('bottomBtn'),
      router = r('router'),
      mc = function(model, ctrl) {
        ctrl && $.each(ctrl, function(i, n) {
          n && n.call(self, model);
        });
        return model;
      };

    module.exports = mc({
      isShowLeft: left.isShow,
      showLeft: left.show,
      hideLeft: left.hide,
      isShowRight: right.isShow,
      showRight: right.show,
      hideRight: right.hide,
      isShowTop: top.isShow,
      showTop: top.show,
      hideTop: top.hide,
      isShowBottom: bottom.isShow,
      showBottom: bottom.show,
      hideBottom: bottom.hide,
      isShowIndicator: indicator.isShow,
      showIndicator: indicator.show,
      hideIndicator: indicator.hide,
      isShowModal: modal.isShow,
      alert: modal.alert,
      confirm: modal.confirm,
      showPreloader: modal.preloader,
      hidePreloader: modal.hide,
      showPreloader2: modal.preloader2,
      isShowBottomBtn: bottomBtn.isShow,
      showBottomBtn: bottomBtn.show,
      hideBottomBtn: bottomBtn.hide,
      on: router.on,
      off: router.off,
      go: router.go,
      back: router.back,
      init: router.init,
      getState: router.getState
    }, {
      backbutton: function() {
        $(document).on('backbutton', function() {
          if (top.isShow()) {
            top.hide();
            return false;
          }
          if (bottom.isShow()) {
            bottom.hide();
            return false;
          }

          if (modal.isShow()) {
            modal.hideAll();
            return false;
          }

          if (bottomBtn.isShow()) {
            bottomBtn.hide();
            return false;
          }
        });
      }
    });
  });



  $.dim('app-fn', ['app'], function(r, exports, module) {
    var
      self = this,
      app = r('app'),
      mc = function(model, ctrl) {
        ctrl && $.each(ctrl, function(i, n) {
          n && n.call(self, model);
        });
        return model;
      };

    module.exports = mc({
    }, {
      tab: function() {
        $(document).on('click', 'a', function() {
          var
            $this = $(this),
            href = $this.attr('href');

          if (/^#\w+/.test(href)) {
            $this.addClass('active').siblings().removeClass('active');
            $(href).css({
              visibility: 'visible',
              display: 'block'
            }).siblings().css({
              visibility: 'hidden',
              display: 'none'
            });
            return false;
          }
        });
      }
    });
  });
});
