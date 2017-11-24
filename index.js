var fs = require('fs');
var express = require('express');
var app = express();
var vhost = require('vhost');
var ejs = require('ejs');

var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
// customize ejs set-up, for 'root' setting, etc.
const ejsOptions = {
  cache: app.get('view cache'),
  root: __dirname + '/views'
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

app.use(vhost("code.localhost", require("./code/server.js").app));

app.get('/*', function(request, response) {
  debugger;
  // TODO: Maybe fix the call to app.get('view engine'), to instead ref. var/environment var (find where the most appropriate, Node-y place for it would be)
  // TODO: think about using vhosts to split out/better structure subdomain handling, instead of performing a check for "www.paulsebastianbruno.com"
  var subdomain = request.hostname.indexOf("www") !== 0 && request.hostname.indexOf("localhost") !== 0 ? request.hostname.split('.')[0] : "";
  var path;

  if (fs.existsSync(__dirname + "/views/pages" + (path = (subdomain ? '/' + subdomain : '') + request.originalUrl) + "." + app.get("view engine"))) {
    response.render('pages/' + path, {
      // default vars, with default settings, to prevent "esc is not a function" errors
      section: '',
      page:    '',
      root:    __dirname + "/views/"
    });
  } else if (fs.existsSync(__dirname + "/views/pages" + (path = (subdomain ? '/' + subdomain : '') + request.originalUrl.trim().replace(/([^\/])$/, '$1/') + "index") + '.' + app.get("view engine"))) {
    response.render('pages/' + path, {
      // default vars, with default settings, to prevent "esc is not a function" errors
      section: '',
      page:    '',
      root:    __dirname + "/views/"
    });
  } else {
    // generate the 404
    response.render('pages/404'), {
      // default vars, with default settings, to prevent "esc is not a function" errors
      section: '',
      page:    '',
      root:    __dirname + "/views/"
    };
  }
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
