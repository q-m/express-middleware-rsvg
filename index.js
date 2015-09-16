/**
 * Express middleware for rendering SVG
 */
var Rsvg     = require('librsvg').Rsvg,
    sanitize = require('sanitize-filename'),
    formats  = ['svg', 'png', 'pdf'];

function process(res, format, width, height, name) {
  width  = parseInt(width);
  height = parseInt(height);
  name   = sanitize(name || 'image');
  svg    = new Rsvg();

  svg.on('finish', function() {
    if (width && !height) {
      height = height || (width * svg.height/svg.width);
    } else if (!width && height) {
      width = width || (height * svg.width/svg.height);
    } else if (!width && !height) {
      width = svg.width;
      height = svg.height;
    }

    res.attachment(name + '.' + format);
    res.send(svg.render({
      format: format,
      width: width,
      height: height
    }).data);
    res.end();
  });

  return svg;
}

function handleRaw(req, res, next) {
  var format = req.accepts(formats),
      svg    = process(res, format, req.query.width, req.query.height, req.query.name);

  req.on('data', function(chunk) {
    svg.write(chunk);
  });

  req.on('end', function() {
    svg.end();
  })
};

function handleForm(req, res, next) {
  var svg = process(res, req.body.format, req.body.width, req.body.height, req.body.name);

  svg.write(req.body.data);
  svg.end();
}

module.exports = function(req, res, next) {
  if (req.body) {
    return handleForm(req, res, next);
  } else {
    return handleRaw(req, res, next);
  }
}
