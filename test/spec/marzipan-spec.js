describe("Marzipan", function() {

  describe("Utilities", function() {

    beforeEach(function() {
      //Remove cookies
      marzipan.cookie('__marzipan_user', null);
    });

    afterEach(function() {
      //Remove cookies
      marzipan.cookie('__marzipan_user', null);
    });    

    it("getCookie() should return cookie value", function() {
      var result; 
      document.cookie = "__marzipan_user=123456";
      result = marzipan.getCookie('__marzipan_user');
      expect(result).toEqual('123456');
    });

    it("setCookie() should be able to set a cookie", function() {
      var result; 
      marzipan.setCookie('__marzipan_user', '123');      
      result = marzipan.getCookie('__marzipan_user');
      expect(result).toEqual('123');
    });    
    
    it("querystring() should return value for a specific key", function() {
      var result;

      marzipan.getQueryString = function() {
        return 'foo=bar';
      };
      result = marzipan.querystring('foo');
      expect(result).toEqual('bar');

      marzipan.getQueryString = function() {
        return 'foo=bar&boop=foop';
      };
      result = marzipan.querystring('boop');
      expect(result).toEqual('foop');

    });

    it("uuid() should return a 36-digit id", function() {
      var result;
      result = marzipan.uuid();
      expect(result.length).toEqual(36);
    });    

  });

  describe("Check user stuff", function() {

    beforeEach(function() {
      //Remove cookies
      marzipan.cookie('__marzipan_user', null);
    });

    afterEach(function() {
      //Remove cookies
      marzipan.cookie('__marzipan_user', null);
    });    

    it("tagNewUser() should be able to set a UUID cookie", function() {
      var result, cookieVal;
      result = marzipan.tagNewUser();
      cookieVal = marzipan.getCookie('__marzipan_user');
      expect(result).toEqual(cookieVal);
    });   

    it("checkUser() should detect new user and set a cookie", function() {
      var result, cookieVal;
      result = marzipan.checkUser();
      cookieVal = marzipan.getCookie('__marzipan_user');      
      expect(result).toEqual(cookieVal);
    });     

    it("checkUser() should detect returning user", function() {
      var result, cookieVal;
      marzipan.setCookie('__marzipan_user', '123');

      result = marzipan.checkUser();
      expect(result).toEqual('123');
    });


  });


});