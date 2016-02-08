'use strict';
var mysql$1381 = require('mysql');
function search$1382(req$1384, res$1385) {
    query$1383(req$1384.query.lastname, function (err$1386, rows$1387) {
        console.log('err: %s,  rows:%s : ', JSON.stringify(err$1386), JSON.stringify(rows$1387));
        if (err$1386) {
            return res$1385.send(JSON.stringify(err$1386));
        }
        res$1385.send(JSON.stringify(rows$1387));
    });
}
function query$1383(lastname$1388, callback$1389) {
    var connection$1390 = mysql$1381.createConnection({
        host: 'localhost',
        user: 'webappuser',
        password: 'WSXwer43@',
        database: 'test',
        multipleStatements: true
    });
    var searchSQL$1393 = vvalues.binary('+', vvalues.binary('+', 'select * from student where lastname = \'', lastname$1388), '\';');
    connection$1390.connect();
    connection$1390.query(searchSQL$1393, function (err$1394, rows$1395, fields$1396) {
        if (err$1394) {
            return callback$1389(err$1394, null);
        }
        callback$1389(null, rows$1395);
    });
    connection$1390.end();
}
module.exports = search$1382;