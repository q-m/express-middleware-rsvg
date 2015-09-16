# Express Middleware for librsvg

This module is an [expressjs](http://expressjs.com/) middleware for converting
SVG images to other formats (PNG, PDF and SVG) using [librsvg](https://en.wikipedia.org/wiki/Librsvg).

## Usage
A basic app that just converts SVG to other formats could look like the following:

```js
var express     = require('express'),
    rsvgHandler = require('express-middleware-rsvg'),
    app         = express();

app.post('/render', rsvgHandler);
app.listen(3000);
```


### Raw submission

One could then POST a file to `/render` to render the file `test.svg` to a PNG image:

```sh
curl -H 'Accept: image/png' --data-binary @test.svg http://localhost:3000/render >test.png
```

To obtain a PDF file, use the `Accept: application/pdf` header instead.

The SVG's width and height are used by default, but those can be overridden
using query parameters, e.g. `http://localhost:3000/render?width=800&height=600`.
When only one of width and height is specified, the other is computed using
the SVG's aspect ratio.

The query parameter `name` can be supplied to change the returned filename.

Please note that when you're using a `body-parser` in your express middleware, you
may need to set the submission content-type to something that is not parsed by it.
Add `-H 'Content-Type: image/svg+xml'` to your curl invocation.


### Form submission

Alternatively, form submissions are accepted. Make sure that you've loaded a
`body-parser` middleware that sets `req.body` on the request. The following
parameters are then recognised:

- `format` - the desired output format, one of `png`, `pdf` or `svg`.
- `width` and `height` - size of the output
- `name` - filename returned from the request

An example app could look like:

```js
var express     = require('express'),
    bodyParser  = require('body-parser'),
    rsvgHandler = require('express-middleware-rsvg'),
    app         = express();

app.use(bodyParser.urlencoded());
app.post('/render', rsvgHandler);
app.listen(3000);
```

Then an html page could look like the following:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Demo</title>
</head>
<body>
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" version="1.1" width="400px">
    <rect x="10" y="10" width="80" height="80" rx="5" ry="5" fill="yellow" stroke="black" stroke-width="2"/>
  </svg>
  <form action="http://localhost:3000/render" method="post">
    <input type="hidden" name="format" value="png">
    <input type="hidden" name="data" value="" id="data">
    <input type="submit">
  </form>
  <script type="text/javascript">
    document.forms[0].onsubmit = function() {
      var serializer = new XMLSerializer(),
          svg        = document.getElementsByTagName("svg")[0];
      document.getElementById("data").value = serializer.serializeToString(svg);
    }
  </script>
</body>
</html>
```

If you want to have a white background for the image (instead of transparent),
you may want to [draw a white rectangle](http://stackoverflow.com/questions/11293026)
before other elements.


## License

This software is released under the terms of the [MIT license](LICENSE.md).
