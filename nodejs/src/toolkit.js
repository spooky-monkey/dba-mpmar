'use strict';

var color = require('bash-color'),
    _lang = 'en',
    _err = require('./errors'),
    _ignore = -1,
    _ctl = false,
    _map = {
        2: 'command'
    };

function output(message, prefix, clr, action) {
    if (typeof prefix === 'string' && prefix.length>0) {
        message = color.wrap(prefix, color.colors[clr], color.styles.bold) + ' ' + message;
    }
    if (typeof action === 'function') {
        action(message);
    } else {
        console.log(message);
    }
}


function toolkit() {

    var _args = [],
        _rawArgs = [],
        _drive = {},
        _command = false;

    this._isArray = function (input) {
        return (typeof input.push === 'function'
        && typeof input.length === 'number');
    };


    this.push = function(cmd, args) {
        try {
            console.log('CMD');
            console.log(cmd);
            console.log('ARGS');
            console.log(args);
            _ctl = require('./' + cmd);
            _ctl.args(args).run();

        } catch (e) {
            throw new Error(_err[_lang].controllerRenderErr + ': ' + cmd);
        }
    };

    this.dispatch = function (args) {
        try {

            _drive = this.parseAndMap(args);
            this.push(_drive.cmd, _drive.args);

        } catch (e) {
            console.log('');
            output(e.message, 'Error:', 'RED', console.error);
            console.log('');
            process.exit(1);
        }
    };

    this.parseAndMap = function (args) {
        _rawArgs = JSON.parse(JSON.stringify(args));
        if (!this._isArray(_rawArgs) || _rawArgs.length === 0) {
            throw new Error(_rawArgs[_lang].emptyCliArgs);
        } else {
            for (var i in _rawArgs) {
                _ignore = (_rawArgs[i].indexOf('nodejs') > -1 && _rawArgs[i].indexOf('cli.js') > -1)
                    ? i+1 : _ignore;
                if (_ignore > 0 && i > _ignore) {
                    if (_command === false) {
                        _command = _rawArgs[i];
                    } else {
                        _args.push(_rawArgs[i]);
                    }
                }
            }
            if (_command.length === 0) {
                throw new Error(_err[_lang].controller404);
            }
            if (_args.length === 0 && _command !== 'help') {
                throw new Error(_err[_lang].emptyCliArgs);
            }
            return JSON.parse(JSON.stringify({
                cmd: _command,
                args: _args
            }));
        }
    };

}

module.exports = function _toolkit(args) {
    return (new toolkit()).dispatch(args);
};

