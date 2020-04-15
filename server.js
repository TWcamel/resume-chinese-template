// simple express server
var express = require("express");
var app = express();

app.use(express.static("dist"));
app.get("/", function (req, res) {
    res.sendfile("dist/base.html");
});

app.listen(5000);
