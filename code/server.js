var express = require('express');
var app = express();
var path = require('path');
var ejs = require('ejs');

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

router.get('/', function(req, res, next) {
  console.log('Node vhosted app is running on subdomain code');
  res.render('pages/index');
});

app.use(router);

exports.app = app;
