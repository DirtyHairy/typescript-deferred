(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.typescriptDeferred = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
function create() {
    return new Deferred(DispatchDeferred);
}
exports.create = create;
function when(value) {
    if (value instanceof Promise) {
        return value;
    }
    return create().resolve(value).promise;
}
exports.when = when;
function DispatchDeferred(closure) {
    setTimeout(closure, 0);
}
var PromiseState;
(function (PromiseState) {
    PromiseState[PromiseState["Pending"] = 0] = "Pending";
    PromiseState[PromiseState["ResolutionInProgress"] = 1] = "ResolutionInProgress";
    PromiseState[PromiseState["Resolved"] = 2] = "Resolved";
    PromiseState[PromiseState["Rejected"] = 3] = "Rejected";
})(PromiseState || (PromiseState = {}));
var Client = (function () {
    function Client(_dispatcher, _successCB, _errorCB) {
        this._dispatcher = _dispatcher;
        this._successCB = _successCB;
        this._errorCB = _errorCB;
        this.result = new Deferred(_dispatcher);
    }
    Client.prototype.resolve = function (value, defer) {
        var _this = this;
        if (typeof (this._successCB) !== 'function') {
            this.result.resolve(value);
            return;
        }
        if (defer) {
            this._dispatcher(function () { return _this._dispatchCallback(_this._successCB, value); });
        }
        else {
            this._dispatchCallback(this._successCB, value);
        }
    };
    Client.prototype.reject = function (error, defer) {
        var _this = this;
        if (typeof (this._errorCB) !== 'function') {
            this.result.reject(error);
            return;
        }
        if (defer) {
            this._dispatcher(function () { return _this._dispatchCallback(_this._errorCB, error); });
        }
        else {
            this._dispatchCallback(this._errorCB, error);
        }
    };
    Client.prototype._dispatchCallback = function (callback, arg) {
        var result, then, type;
        try {
            result = callback(arg);
            this.result.resolve(result);
        }
        catch (err) {
            this.result.reject(err);
            return;
        }
    };
    return Client;
})();
var Deferred = (function () {
    function Deferred(_dispatcher) {
        this._dispatcher = _dispatcher;
        this._stack = [];
        this._state = 0 /* Pending */;
        this.promise = new Promise(this);
    }
    Deferred.prototype._then = function (successCB, errorCB) {
        if (typeof (successCB) !== 'function' && typeof (errorCB) !== 'function') {
            return this.promise;
        }
        var client = new Client(this._dispatcher, successCB, errorCB);
        switch (this._state) {
            case 0 /* Pending */:
            case 1 /* ResolutionInProgress */:
                this._stack.push(client);
                break;
            case 2 /* Resolved */:
                client.resolve(this._value, true);
                break;
            case 3 /* Rejected */:
                client.reject(this._error, true);
                break;
        }
        return client.result.promise;
    };
    Deferred.prototype.resolve = function (value) {
        var _this = this;
        if (this._state !== 0 /* Pending */) {
            return this;
        }
        var type = typeof (value), then, pending = true;
        try {
            if (value !== null && (type === 'object' || type === 'function') && typeof (then = value.then) === 'function') {
                if (value === this.promise) {
                    throw new TypeError('recursive resolution');
                }
                this._state = 1 /* ResolutionInProgress */;
                then.call(value, function (result) {
                    if (pending) {
                        pending = false;
                        _this._state = 0 /* Pending */;
                        _this.resolve(result);
                    }
                }, function (error) {
                    if (pending) {
                        pending = false;
                        _this._state = 1 /* ResolutionInProgress */;
                        _this.reject(error);
                    }
                });
            }
            else {
                this._state = 1 /* ResolutionInProgress */;
                this._dispatcher(function () {
                    _this._state = 2 /* Resolved */;
                    _this._value = value;
                    var i, stackSize = _this._stack.length;
                    for (i = 0; i < stackSize; i++) {
                        _this._stack[i].resolve(value, false);
                    }
                    _this._stack.splice(0, stackSize);
                });
            }
        }
        catch (err) {
            if (pending) {
                this.reject(err);
            }
        }
        return this;
    };
    Deferred.prototype.reject = function (error) {
        var _this = this;
        this._state = 1 /* ResolutionInProgress */;
        this._dispatcher(function () {
            _this._state = 3 /* Rejected */;
            _this._error = error;
            var stackSize = _this._stack.length, i = 0;
            for (i = 0; i < stackSize; i++) {
                _this._stack[i].reject(error, false);
            }
            _this._stack.splice(0, stackSize);
        });
        return this;
    };
    return Deferred;
})();
var Promise = (function () {
    function Promise(_deferred) {
        this._deferred = _deferred;
    }
    Promise.prototype.then = function (successCB, errorCB) {
        return this._deferred._then(successCB, errorCB);
    };
    Promise.prototype.otherwise = function (errorCB) {
        return this._deferred._then(undefined, errorCB);
    };
    Promise.prototype.always = function (errorCB) {
        return this._deferred._then(errorCB, errorCB);
    };
    return Promise;
})();

},{}]},{},[1])(1)
});