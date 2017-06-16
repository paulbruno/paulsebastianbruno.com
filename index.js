var fs = require('fs');
var express = require('express');
var app = express();
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');

var schema = buildSchema(`
  type Query {
    hello: String
  }
`);

var root = { hello: () => 'Hello world!' };

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// set "global" vars, including overridable defaults
app.locals = {
  site: {
    section: ''
  }
};

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/*', function(request, response) {
  // TODO: Maybe fix the call to app.get('view engine'), to instead ref. var/environment var (find where the most appropriate, Node-y place for it would be)
  if (fs.existsSync(__dirname + "/views/pages" + request.originalUrl + "." + app.get("view engine"))) {
    response.render('pages/' + request.originalUrl, {
      // default vars, with default settings, to prevent "esc is not a function" errors
      section: ""
    });
  } else {
    // generate the 404
    response.render('pages/404');
  }
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

