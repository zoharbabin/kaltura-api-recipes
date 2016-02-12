var Express = require('express');
var http = require('http');
var https = require('https');
var fs = require('fs');

var LucyConsole = require('lucy-console');
var Swagger = require('./swagger.js');
var Recipes = require('./recipes/recipes.js');

var App = Express();
App.set('views', __dirname + '/views')
App.set('view engine', 'jade');
App.engine('jade', require('jade').__express);

if (process.env.USE_BASIC_AUTH && process.env.LUCYBOT_USERNAME && process.env.LUCYBOT_PASSWD) {
  App.use(require('./routes/basic-auth.js'));
}

App.use('/', Express.static(__dirname + '/static'));
App.use('/img', Express.static(__dirname + '/img'));

App.use('/auth', require('./routes/partner-auth.js'));

if (process.env.DEVELOPMENT) {
  App.use('/strapping', require('strapping')({
    basePath: '/strapping',
    output: {
      styles: __dirname + '/static/css/bootstrap.css',
      settings: __dirname + '/static/css/config.json',
    }
  }))
}

var sitemapUrls = Object.keys(Recipes.recipes).map(function(r) {
  return {url: '/recipes/' + r, priority: .3}
});
sitemapUrls.push({url: '/', priority: .9})
var sitemap = require('sitemap').createSitemap({
  hostname: 'https://developer.kaltura.org',
  cacheTime: 1000 * 60 * 10, // ten minutes
  urls: sitemapUrls,
});
App.use('/sitemap.xml', function(req, res) {
  sitemap.toXML(function(err, xml) {
    if (err) return res.status(500).send(err);
    res.header('Content-Type', 'application/xml');
    res.send( xml );
  })
})

var apiConsole = new LucyConsole({
  swagger: Swagger,
  cssIncludes: ['/css/bootstrap.css', '/css/console.css'],
  disableAutorefresh: true,
  codegenPath: '/code/build/kc_request',
  basePath: '/console_embed',
  development: process.env.DEVELOPMENT || false,
  embedParameters: {
    format: 1,
  },
})
App.use('/console_embed', apiConsole.router);
require('./codegen').initialize(function(router) {
  App.use('/console_embed', router);
})

App.get('/swagger.json', function(req, res) {
  res.json(Swagger);
})
require('./routes/recipes.js').getRouter(function(router) {
  App.use('/recipes_embed', router);
  App.use('/', require('./routes/pages.js'));

  if (process.env.LUCYBOT_DEV) {
    console.log('----DEVELOPMENT ENVIRONMENT----');
    App.listen(process.env.KALTURA_RECIPES_PORT || 3000);
  } else {
    var port = process.env.KALTURA_RECIPES_PORT || 443
    var sslOptions = {
      key: fs.readFileSync('/etc/ssl/certs/kaltura.org.key'),
      cert: fs.readFileSync('/etc/ssl/certs/kaltura.org.crt'),
      ca: fs.readFileSync('/etc/ssl/certs/ca-kaltura.org.crt'),
      requestCert: true,
      rejectUnauthorized: false
    };
    var secureServer = https.createServer(sslOptions, App).listen(port, function(){
      console.log("Secure Express server listening on port "+port);
    });
    // Redirect from http port 80 to https
    http.createServer(function (req, res) {
      res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
      res.end();
    }).listen(80);
  }
});
