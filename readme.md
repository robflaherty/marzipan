# Marzipan
Marzipan is a client side tool for psuedo-de-anonymizing anonymous user pageview activity. It establishes an [RFC4122](http://www.ietf.org/rfc/rfc4122.txt)-compliant UUID for each visitor and pings the server with the URL and UUID on each pageview.

## Usage
User activity tracking requires work on both the client and server. Currently Marzipan only provides a solution for the client side. This means that what happens on the server is up to you. You can write something with Node, PHP, Sinatra, etc that fields the data and dumps into a database. Or you can just serve up the beacon image and parse over server logs.

A future version will include an optional server side component as well.

### Client side config
The client side implementation has one required setting:

* **data-marzipan-ping**: Ping URI

Optionally you can specify an Id for the tracked site:
* **data-marzipan-site**: Site identifier

You also have to specify the location of the Marzipan script. :)

### Asynchronous implementation (Recommended)
```html
  <script>
    (function() {
      var t = document.createElement('script'),
        s = document.getElementsByTagName('script')[0];
      t.async = true;
      t.id = 'marzipan';
      t.setAttribute('data-marzipan-site', '123');
      t.setAttribute('data-marzipan-ping', '/ping.gif');
      t.src = 'marzipan.js';
      s.parentNode.insertBefore(t, s);
    })();
  </script>
```
### Synchronous implementation
```html
  <script src="marzipan.js" id="marzipan" data-marzipan-site="123" data-marzipan-ping="/ping.gif"></script>
```

## Running Tests
I'm using Jasmine for tests. Coverage is not complete yet but if you want to run what's there make sure to run on a local server. (Reading/writing cookies doesn't work for local files.)

## Contact
* [Github page](https://github.com/robflaherty/marzipan)
* Find me on Twitter at [@robflaherty](https://twitter.com/#!/robflaherty)

## Changelog
0.2 (4/27/12): Rewrite. Removed server side component. Removed CoffeeScript. Added Jasmine tests.

0.1 (7/29/11): Initial release.

## License
Licensed under the MIT and GPL licenses.