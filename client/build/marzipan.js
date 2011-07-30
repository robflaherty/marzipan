(function() {
  var root;
  root = this;
  root.marzipan = (function(settings) {
    var checkUser, config, createBeacon, getCookie, logPageview, makeUUID, page, setCookie, tagNewUser, user, utils, _ref, _ref2;
    config = {
      site: settings.site,
      cookie: '_sbmVisitor',
      testing: (_ref = settings.testing) != null ? _ref : false
    };
    utils = {
      random: function() {
        return Math.round(Math.random() * 2147483647);
      },
      cookie: function(key, value, options) {
        var expiration, result, time;
        if (options == null) {
          options = {};
        }
        if (arguments.length > 1 && String(value) !== "[object Object]") {
          if (value === null) {
            options.expires = -1;
          }
          if (typeof options.expires === 'number') {
            expiration = options.expires;
            time = options.expires = new Date();
            time.setTime(time.getTime() + expiration * 60 * 60 * 1000);
          }
          return document.cookie = [encodeURIComponent(key), '=', encodeURIComponent(value), options.expires ? '; expires=' + options.expires.toUTCString() : '', options.path ? '; path=' + options.path : '', options.domain ? '; domain=' + options.domain : '', options.secure ? '; secure' : ''].join('');
        }
        result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie);
        if (result) {
          return decodeURIComponent(result[1]);
        } else {
          return null;
        }
      },
      uuid: function() {
        var chars, i, r, rnd, uuid;
        chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
        uuid = new Array(36);
        rnd = 0;
        i = 0;
        while (i < 36) {
          if (i === 8 || i === 13 || i === 18 || i === 23) {
            uuid[i] = "-";
          } else if (i === 14) {
            uuid[i] = "4";
          } else {
            if (rnd <= 0x02) {
              rnd = 0x2000000 + (Math.random() * 0x1000000) | 0;
            }
            r = rnd & 0xf;
            rnd = rnd >> 4;
            uuid[i] = chars[(i === 19 ? (r & 0x3) | 0x8 : r)];
          }
          i++;
        }
        return uuid.join("");
      }
    };
    getCookie = function() {
      return utils.cookie(config.cookie);
    };
    setCookie = function(id) {
      return utils.cookie(config.cookie, id, {
        expires: 17531
      });
    };
    makeUUID = function() {
      return utils.uuid();
    };
    tagNewUser = function() {
      var id;
      id = makeUUID();
      setCookie(id);
      return id;
    };
    checkUser = function() {
      var cookie;
      cookie = getCookie();
      if (cookie) {
        return cookie;
      } else {
        return tagNewUser();
      }
    };
    createBeacon = function(query) {
      var img;
      img = new Image(1, 1);
      return img.src = 'image.gif?' + encodeURIComponent(query + '&req=' + utils.random());
    };
    page = {
      title: document.title,
      url: window.location.href,
      referrer: (_ref2 = location.referrer) != null ? _ref2 : false,
      site: config.site
    };
    user = {
      id: checkUser()
    };
    logPageview = function() {
      var query;
      query = ['title=' + page.title, 'url=' + page.url, 'referrer=' + page.referrer, 'site=' + page.site, 'user=' + user.id];
      return createBeacon(query.join('&'));
    };
    if (config.testing === false) {
      return {
        logPageview: logPageview
      };
    } else {
      return {
        logPageview: logPageview,
        tagNewUser: tagNewUser,
        checkUser: checkUser,
        config: config,
        utils: utils
      };
    }
  })(settings);
}).call(this);
