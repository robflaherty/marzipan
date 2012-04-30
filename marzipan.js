/*!
 * Marzipan | v0.2.0
 * Copyright (c) 2012 Rob Flaherty (@robflaherty)
 * Dual licensed under the MIT and GPL licenses.
 *
 * uuid()
 * Copyright (c) 2010 Robert Kieffer
 * Dual licensed under the MIT and GPL licenses.
 * Documentation and details at https://github.com/broofa/node-uuid
 * 
 * cookie()
 * (Plain JS port of jquery.cookie plugin)
 * Copyright (c) 2010 Klaus Hartl (stilbuero.de)
 * Dual licensed under the MIT and GPL licenses.
 */

(function(window) {
  
  // This will hold our data
  var _marzipan = {},

  // Static settings
  _config = {
    'cookieID' : '__marzipan_user'
  },

  // Main object
  marzipan = {

    // Return random number
    random: function() {
      return Math.round(Math.random() * 2147483647);
    },

    // Return UUID
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
      return uuid.join('');
    },

    // Cookie utility
    cookie: function(key, value, options) {
      var expiration, result, time;
      
      if (arguments.length > 1 && String(value) !== "[object Object]") {
        options = options || {};

        if (value === null || value === undefined) {
          options.expires = -1;
        }
        
        if (typeof options.expires === 'number') {
          expiration = options.expires;
          time = options.expires = new Date();
          time.setTime(time.getTime() + expiration * 24 * 60 * 60 * 1000);
        }
        
        return (document.cookie = [
          encodeURIComponent(key),
          '=',
          encodeURIComponent(value),
          options.expires ? '; expires=' + options.expires.toUTCString() : '',
          options.path ? '; path=' + options.path : '',
          options.domain ? '; domain=' + options.domain : '',
          options.secure ? '; secure' : ''
        ].join(''));
      }
      
      result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie);
      return result ? decodeURIComponent(result[1]) : null;
    },

    // Send data to the server
    ping: function(query) {
      var img = new Image(1, 1);
      return img.src = _marzipan.pingURL + '?' + query + '&req=' + this.random() ;
    },

    // Get cookie
    getCookie: function(name) {
      return this.cookie(name);
    },

    // Set cookie
    setCookie: function(name, id) {
      return this.cookie(name, id, { expires: 17531 });
    },

    // Get URL
    getURL: function() {
      return window.location.href;
    },

    // Get query string
    getQueryString: function() {
      return window.location.search.slice(1);
    },

    // Get query string value
    querystring: function(key) {
      /* 
       * Need to replace this with better solution when we add
       * query param tracking.
       */
      var search = this.getQueryString(),
        qs = search.split('&'),
        len = qs.length,
        i;

      for (i = 0; i < len; i++) {
        if (qs[i].split('=')[0] === key ) {
          return qs[i].split('=')[1];
        }
      }
    },

    // Check if known user
    checkUser: function() {
      var cookie = this.getCookie(_config.cookieID);
      if (cookie) {
        return cookie;
      } else {
        return this.tagNewUser();
      }      
    },

    // Tag new user
    tagNewUser: function() {
      var id = this.uuid();
      this.setCookie(_config.cookieID, id);
      return id;
    },

    // Track Pageview
    trackPageview: function() {
      var query = [];
      query.push( 'user=' + encodeURIComponent(_marzipan.user) );
      query.push( 'url='  + encodeURIComponent(_marzipan.url) );

      if (_marzipan.site) {
        query.push( 'site=' + encodeURIComponent(_marzipan.site) );
      }

      this.ping(query.join('&'));
    },

    // Track event
    trackEvent: function(data) {

    },

    // Init
    init: function() {
      // Reference to self/script element
      var script = document.getElementById('marzipan');

      // Get Ping URL
      _marzipan.pingURL = script.getAttribute('data-marzipan-ping'); 

      // Collect data
      _marzipan.site = script.getAttribute('data-marzipan-site');
      _marzipan.url  = this.getURL();
      _marzipan.user = this.checkUser();
    }

  };

  // Expose marzipan to global scope
  window.marzipan = marzipan;

  // Initialize and track pageview
  marzipan.init();
  marzipan.trackPageview();  

})(window);
