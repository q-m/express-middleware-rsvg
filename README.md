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

## License

This software is released under the terms of the [MIT license](LICENSE.md).
