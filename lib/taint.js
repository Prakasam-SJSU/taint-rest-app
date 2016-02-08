require('./vvalues');
var unaryOps$1381 = {
    '-': function (x$1384) {
        return vvalues.unary('-', x$1384);
    },
    '+': function (x$1386) {
        return vvalues.unary('+', x$1386);
    },
    '++': function (x$1388) {
        return vvalues.unary('++', x$1388);
    },
    '--': function (x$1390) {
        return vvalues.unary('--', x$1390);
    },
    '!': function (x$1392) {
        return vvalues.unary('!', x$1392);
    },
    '~': function (x$1394) {
        return vvalues.unary('~', x$1394);
    },
    'typeof': function (x$1396) {
        return vvalues.unary('typeof', x$1396);
    },
    'void': function (x$1398) {
        return vvalues.unary('void', x$1398);
    }
};
var binaryOps$1382 = {
    '*': function (l$1400, r$1401) {
        return vvalues.binary('*', l$1400, r$1401);
    },
    '/': function (l$1403, r$1404) {
        return vvalues.binary('/', l$1403, r$1404);
    },
    '%': function (l$1406, r$1407) {
        return vvalues.binary('%', l$1406, r$1407);
    },
    '+': function (l$1409, r$1410) {
        return vvalues.binary('+', l$1409, r$1410);
    },
    '-': function (l$1412, r$1413) {
        return vvalues.binary('-', l$1412, r$1413);
    },
    '>>': function (l$1415, r$1416) {
        return vvalues.binary('>>', l$1415, r$1416);
    },
    '<<': function (l$1418, r$1419) {
        return vvalues.binary('<<', l$1418, r$1419);
    },
    '>>>': function (l$1421, r$1422) {
        return vvalues.binary('>>>', l$1421, r$1422);
    },
    '<': function (l$1424, r$1425) {
        return vvalues.binary('<', l$1424, r$1425);
    },
    '<=': function (l$1427, r$1428) {
        return vvalues.binary('<=', l$1427, r$1428);
    },
    '>': function (l$1430, r$1431) {
        return vvalues.binary('>=', l$1430, r$1431);
    },
    '>=': function (l$1433, r$1434) {
        return vvalues.binary('>', l$1433, r$1434);
    },
    'in': function (l$1436, r$1437) {
        return vvalues.binary('in', l$1436, r$1437);
    },
    'instanceof': function (l$1439, r$1440) {
        return vvalues.binary('instanceof', l$1439, r$1440);
    },
    '==': function (l$1442, r$1443) {
        return vvalues.binary('==', l$1442, r$1443);
    },
    '!=': function (l$1445, r$1446) {
        return vvalues.binary('!=', l$1445, r$1446);
    },
    '===': function (l$1448, r$1449) {
        return vvalues.binary('===', l$1448, r$1449);
    },
    '!==': function (l$1451, r$1452) {
        return vvalues.binary('!==', l$1451, r$1452);
    },
    '&': function (l$1454, r$1455) {
        return vvalues.binary('&', l$1454, r$1455);
    },
    '^': function (l$1457, r$1458) {
        return vvalues.binary('^', l$1457, r$1458);
    },
    '|': function (l$1460, r$1461) {
        return vvalues.binary('|', l$1460, r$1461);
    },
    '&&': function (l$1463, r$1464) {
        return vvalues.binary('&&', l$1463, r$1464);
    },
    '||': function (l$1466, r$1467) {
        return vvalues.binary('||', l$1466, r$1467);
    }
};
var x$1383 = function (taintingKey$1469) {
    if (this.taint) {
        return;
    }
    // this object is used to identify proxies created by the `taint` function
    this.taint = function (originalValue$1470) {
        if (// don't need to taint and already tainted value
            isTainted(originalValue$1470)) {
            return originalValue$1470;
        }
        var p$1471 = new Proxy(originalValue$1470, {
            // store the original untainted value for later
            originalValue: originalValue$1470,
            unary: function (target$1472, op$1473, operand$1474) {
                return taint(unaryOps$1381[op$1473](target$1472));
            },
            left: function (target$1475, op$1476, right$1477) {
                return taint(binaryOps$1382[op$1476](target$1475, right$1477));
            },
            right: function (target$1478, op$1479, left$1480) {
                return taint(binaryOps$1382[op$1479](left$1480, target$1478));
            }
        }, taintingKey$1469);
        return p$1471;
    };
    this.isTainted = function (x$1481) {
        if (// a value is tainted if it's a proxy created
            // with the `taintingKey`
            unproxy(x$1481, taintingKey$1469)) {
            return true;
        }
        return false;
    };
    this.untaint = function (value$1482) {
        if (isTainted(value$1482)) {
            // pulls the value out of its tainting proxy
            return unproxy(value$1482, taintingKey$1469).originalValue;
        }
        return value$1482;
    };
}({});