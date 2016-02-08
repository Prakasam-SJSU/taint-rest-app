require("./vvalues");

var unaryOps = {
    "-":      function(x) { return -x; },
    "+":      function(x) { return +x; },
    "++":     function(x) { return ++x; },
    "--":     function(x) { return --x; },
    "!":      function(x) { return !x; },
    "~":      function(x) { return ~x; },
    "typeof": function(x) { return typeof x; },
    "void":   function(x) { return void x; }
};

var binaryOps = {
    "*":          function(l, r) { return l * r; },
    "/":          function(l, r) { return l / r; },
    "%":          function(l, r) { return l % r; },
    "+":          function(l, r) { return l + r; },
    "-":          function(l, r) { return l - r; },
    ">>":         function(l, r) { return l >> r; },
    "<<":         function(l, r) { return l << r; },
    ">>>":        function(l, r) { return l >>> r; },
    "<":          function(l, r) { return l < r; },
    "<=":         function(l, r) { return l <= r; },
    ">":          function(l, r) { return l > r; },
    ">=":         function(l, r) { return l >= r; },
    "in":         function(l, r) { return l in r; },
    "instanceof": function(l, r) { return l instanceof r; },
    "==":         function(l, r) { return l == r; },
    "!=":         function(l, r) { return l != r; },
    "===":        function(l, r) { return l === r; },
    "!==":        function(l, r) { return l !== r; },
    "&":          function(l, r) { return l & r; },
    "^":          function(l, r) { return l ^ r; },
    "|":          function(l, r) { return l | r; },
    "&&":         function(l, r) { return l && r; },
    "||":         function(l, r) { return l || r; }
};

var x = function (taintingKey) {
    if (this.taint) {
        return;
    }

    // this object is used to identify proxies created by the `taint` function
    this.taint = function (originalValue) {
        // don't need to taint and already tainted value
        if (isTainted(originalValue)) {
            return originalValue;
        }

        var p = new Proxy(originalValue, {
            // store the original untainted value for later
            originalValue: originalValue,

            unary: function(target, op, operand) {
                return taint(unaryOps[op](target));
            },

            left: function(target, op, right) {
                return taint(binaryOps[op](target, right));
            },

            right: function(target, op, left) {
                return taint(binaryOps[op](left, target));
            }
        }, taintingKey);
        return p;
    }

    this.isTainted = function (x) {
        // a value is tainted if it's a proxy created
        // with the `taintingKey`
        if (unproxy(x, taintingKey)) {
            return true;
        }
        return false;
    }

    this.untaint = function (value) {
        if (isTainted(value)) {
            // pulls the value out of its tainting proxy
            return unproxy(value, taintingKey).originalValue;
        }
        return value;
    }
}({});

/** end tainting extension code **/
