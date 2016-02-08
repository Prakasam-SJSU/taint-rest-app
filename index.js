"use strict";
require("./lib/taint");

var app = require('express')();

app.use(function (req, res, next) {
    Object.keys(req.query).forEach(function(element) {
        req.query[element] = taint(req.query[element]);
    });

    next();
});

app.get('/search', require('./src/user'));

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});