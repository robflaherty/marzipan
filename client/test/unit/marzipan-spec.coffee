describe "Users", ->
  # Set-up
  marzipan.utils.cookie(marzipan.config.cookie, null)
  userID = marzipan.tagNewUser()

  describe "Tagging a new user", ->
    it "Sets a cookie", ->
      (expect userID).toBeTruthy()
    
    it "Cookie values equals user ID", ->
      cookie = marzipan.utils.cookie(marzipan.config.cookie)
      (expect cookie).toEqual(userID)
    
  describe "Detecting return user", ->
    it "Can read cookie", ->
      user = marzipan.checkUser()
      (expect user).toEqual(userID)
        