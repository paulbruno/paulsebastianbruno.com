var express = require('express');
var app = express();
var path = require('path');
var ejs = require('ejs');
var { getView } = require('./helpers.js');

app.set('views', path.join(__dirname, 'views'));
// customize ejs set-up, for 'root' setting, etc.
const ejsOptions = {
  cache: app.get('view cache'),
  root: path.join(__dirname, 'views')
};
app.engine('ejs', (path, data, cb) => {
  ejs.renderFile(path, data, ejsOptions, cb);
});
app.set('view engine', 'ejs');

// set "global" vars, including overridable defaults
app.locals = {
  site: {
    subdomain: 'code',
    section: '',
    page:    ''
  }
};

var router = express.Router();

router.get('/*', function(request, response, next) {
  console.log('Node vhosted app is running on subdomain code');
  response.render(path.join('pages', getView(path.join(app.get('views'), 'pages'), request.originalUrl, app.get('view engine')) || '404'), {
    // default vars, with default settings, to prevent "esc is not a function" errors
    section: '',
    page:    '',
    root:    __dirname + "/views/"
  });
});

app.use(router);

exports.app = app;
