#
# Marzipan
# Copyright (c) 2011 Rob Flaherty (@robflaherty)
# Dual licensed under the MIT and GPL licenses.
#

# Define root object (window in browser)
root = this

# Marzipan module, import settings global
root.marzipan = do (settings) ->
  
  # Config takes data from global settings object
  config =
    site: settings.site
    cookie: '_sbmVisitor'
    testing: settings.testing ? off
    
  # Utils: random number, cookie tool, uuid generator
  utils =
    
    # Generate random number
    random: ->
      Math.round Math.random() * 2147483647
    
    # Plain JS port of jquery.cookie plugin
    # Copyright (c) 2010 Klaus Hartl (stilbuero.de)
    # Dual licensed under the MIT and GPL licenses.
    cookie: (key, value, options = {}) ->
      if arguments.length > 1 and String(value) isnt "[object Object]"
    
        options.expires = -1 if value == null
    
        if typeof options.expires == 'number'
          expiration = options.expires
          time = options.expires = new Date()
          time.setTime(time.getTime() + expiration * 60 * 60 * 1000)

        return document.cookie = [
          encodeURIComponent(key), '=', encodeURIComponent(value),
          if options.expires then '; expires=' + options.expires.toUTCString() else '',
          if options.path then '; path=' + options.path else '',
          if options.domain then '; domain=' + options.domain else '',
          if options.secure then '; secure' else ''
        ].join('')
      
      result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)
      if result then decodeURIComponent(result[1]) else null
    
    # uuid.js
    # Copyright (c) 2010 Robert Kieffer
    # Dual licensed under the MIT and GPL licenses.  
    uuid: ->
      chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("")
      uuid = new Array(36)
      rnd = 0
      i = 0
    
      while i < 36
        if i == 8 or i == 13 or i == 18 or i == 23
          uuid[i] = "-"
        else if i == 14
          uuid[i] = "4"
        else      
          rnd = 0x2000000 + (Math.random() * 0x1000000) | 0  if rnd <= 0x02
          r = rnd & 0xf
          rnd = rnd >> 4
          uuid[i] = chars[(if (i == 19) then (r & 0x3) | 0x8 else r)]    
        i++
      uuid.join ""    
    
  #
  # Private methods
  #
  
  # Fetch cookie
  getCookie = ->
    utils.cookie(config.cookie)
  
  # Set cookie  
  setCookie = (id) ->
    utils.cookie(config.cookie, id, { expires: 17531 })
  
  # Generate UUID  
  makeUUID = ->
    utils.uuid()    
  
  # Tag new user
  tagNewUser = ->
    id = makeUUID()
    setCookie id
    id
  
  # Check if user is a new user
  checkUser = ->
    cookie = getCookie()    
    if cookie then cookie else tagNewUser()

  # Generate beacon
  createBeacon = (query) ->
    img = new Image(1, 1)
    img.src = 'image.gif?' + encodeURIComponent(query + '&req=' + utils.random())    
  
  #
  # Private variables
  #
  
  # Page data
  page =
    title: document.title
    url: window.location.href
    referrer: location.referrer ? no
    site: config.site
  
  # User data  
  user =
    id: checkUser()
  
  #
  # Public methods
  #
  
  # Log a pageview event
  logPageview = ->
    query = [
      'title=' + page.title
      'url=' + page.url
      'referrer=' + page.referrer
      'site=' + page.site
      'user=' + user.id
    ]
  
    createBeacon(query.join('&'))
  
  # 
  # Public API
  #
  
  if config.testing is off  
    return {
      logPageview: logPageview
    }
  else
    return {
      logPageview: logPageview
      tagNewUser: tagNewUser
      checkUser: checkUser
    }  
    
  