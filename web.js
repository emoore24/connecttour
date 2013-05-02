var express = require("express");
var app = express();
var connString = "postgres://shcpmwtwyxuxax:IFYCad_h0oQi_YAvjercNOIsto@ec2-54-235-152-226.compute-1.amazonaws.com:5432/dfu6b4s2s6n3v1";
app.use(express.logger());

app.get('/', function(request, response) {
  response.send('Hello World!');
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});