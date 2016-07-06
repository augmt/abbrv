var express = require("express");
var app = express();

app.get("/", function (req, res) {
    res.send("<p>Lorem ipsum dolor sit amet &hellip;</p>");
});
app.listen(process.env.PORT);
