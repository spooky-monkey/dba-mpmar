'use strict';

var jacin = require('jacin');

function read() {

    this.args = [];
    this.path = false;

    this.args = function (a) {
        this.args = a;
        return this;
    };

    this.path = function (p) {
        this.path = p;
        return this;
    };

    this.run = function() {

        console.log('Boo');
        process.exit(1);

        console.log('file');
        console.log(this.args[0]);
        console.log('query');
        console.log(this.args[1]);
        console.log('path');
        console.log(this.path);

        var _obj = jacin();
            _obj.read(this.path + '/' + this.args[0]);

        console.log('object');
        console.log(_obj);

        console.log('result');
        console.log(_obj.getJsonpath(this.args[1]));

        return _obj.getJsonpath(this.args[1]);
    }
};



module.exports = new read();
