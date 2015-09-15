/**
 * Express middleware for rendering SVG
 */
var Rsvg     = require('librsvg').Rsvg,
    sanitize = require('sanitize-filename');

module.exports = function(req, res, next) {
  var format = req.accepts(['svg', 'png', 'pdf']),
      width  = parseInt(req.query.width),
      height = parseInt(req.query.height),
      name   = sanitize(req.query.name || 'chart'),
      svg    = new Rsvg();

  req.on('data', function(chunk) {
    svg.write(chunk);
  });

  req.on('end', function() {
    svg.end();
  })

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
};
