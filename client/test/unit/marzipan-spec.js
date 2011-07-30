(function() {
  describe("Users", function() {
    var userID;
    marzipan.utils.cookie(marzipan.config.cookie, null);
    userID = marzipan.tagNewUser();
    describe("Tagging a new user", function() {
      it("Sets a cookie", function() {
        return (expect(userID)).toBeTruthy();
      });
      return it("Cookie values equals user ID", function() {
        var cookie;
        cookie = marzipan.utils.cookie(marzipan.config.cookie);
        return (expect(cookie)).toEqual(userID);
      });
    });
    return describe("Detecting return user", function() {
      return it("Can read cookie", function() {
        var user;
        user = marzipan.checkUser();
        return (expect(user)).toEqual(userID);
      });
    });
  });
}).call(this);
