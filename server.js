var express = require('express');
var app = express();
var vhost = require('vhost');
var ejs = require('ejs');
var path = require('path');
var { getView } = require('./helpers.js');

var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(path.join(__dirname, 'public')));

// views is directory for all template files
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
    subdomain: '',
    section: '',
    page:    ''
  }
};

app.use(vhost("code." + process.env.HOST, require("./code/server.js").app));

app.get('/*', function(request, response) {
  response.render(path.join('pages', getView(path.join(app.get('views'), 'pages'), request.originalUrl, app.get('view engine')) || '404'), {
    // default vars, with default settings, to prevent "esc is not a function" errors
    section: '',
    page:    '',
    root:    path.join(__dirname + 'views')
  });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
