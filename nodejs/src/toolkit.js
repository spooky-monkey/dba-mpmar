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

    var _output  = false,
        _args    = [],
        _rawArgs = [],
        _drive   = {},
        _path    = false,
        _command = false;

    this._isArray = function (input) {
        return (typeof input.push === 'function'
            && typeof input.length === 'number');
    };

    this.push = function(cmd, path, args) {
        try {
            console.log('CMD');
            console.log(cmd);
            console.log('PATH');
            console.log(path);
            console.log('ARGS');
            console.log(args);
            _ctl = require('./' + cmd + '.js');

            console.log('OBJ');
            console.log(_ctl);

            _output = _ctl.path(path).args(args).run();
            console.log(_output);

        } catch (e) {
            console.log(e.message);
            throw new Error(_err[_lang].controllerRenderErr + ': ' + cmd);
        }
    };

    this.dispatch = function (args) {
        try {

            _drive = this.parseAndMap(args);
            console.log('DRIVE');
            console.log(_drive);
            this.push(_drive.cmd, _drive.path, _drive.args);

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
                    if (_path === false) {
                        _path = _rawArgs[i];
                    } else {
                        if (_command === false) {
                            _command = _rawArgs[i];
                        } else {
                            _args.push(_rawArgs[i]);
                        }
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
                path: _path,
                cmd: _command,
                args: _args
            }));
        }
    };

}

module.exports = function _toolkit(args) {
    return (new toolkit()).dispatch(args);
};

