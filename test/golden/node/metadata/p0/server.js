var express = require('express');
var bodyParser = require('body-parser');
var busboy = require('busboy');
var request = require('request');
var Kaltura = require('./../../lib/KalturaClient.js');
var config = new Kaltura.KalturaConfiguration(1760921);
config.serviceUrl = "https://www.kaltura.com/";
var client = new Kaltura.KalturaClient(config);
client.session.start(function(ks) {
  if (ks.code && ks.message) {
    console.log('Error starting session', success, ks);
  } else {
    client.setKs(ks);
  }
}, "8d6cb692ab0f41bfa6bde373204c4b40",
"lucybot@example.com",
Kaltura.enums.KalturaSessionType.ADMIN,
1760921)

var app = express();
app.use('/', express.static(__dirname + '/www'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  res.render('index');
})

app.post('/addMetadataProfile', function(req, res) {
  metadataProfile = new Kaltura.objects.KalturaMetadataProfile();
  metadataProfile.metadataObjectType = Kaltura.enums.KalturaMetadataObjectType.ENTRY;
  metadataProfile.createMode = Kaltura.enums.KalturaMetadataProfileCreateMode.API;

  var xsdData = "<xsd:schema></xsd:schema>";
  var viewsData = null;

  client.metadataProfile.add(function(results) {
    if (results.code && results.message) {
      console.log('Kaltura Error', results);
      res.render('metadataProfileShow', {request: req.body, result: results})
    } else {
      res.render('metadataProfileShow', {request: req.body, result: results})
    }
  },
  metadataProfile,
  xsdData,
  viewsData);
});

app.listen(process.env.PORT || 3333);
