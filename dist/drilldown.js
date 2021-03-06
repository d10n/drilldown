(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.dd = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// drilldown.js
// simple nevernull alternative
'use strict';

var isFunction = (function() {
    // Thanks to underscore for identifying typeof bugs
    var regexTypeofIsCorrect = typeof /./ !== 'function';
    var int8ArrayTypeofIsCorrect = typeof Int8Array !== 'object';
    /* istanbul ignore else */
    if (regexTypeofIsCorrect && int8ArrayTypeofIsCorrect) {
        return function(obj) {
            return typeof obj === 'function' || false;
        };
    }
    /* istanbul ignore next */
    return function(obj) {
        return Object.prototype.toString.call(obj) === '[object Function]';
    };
})();

/**
 * drilldown
 * Safely accesses deep properties of objects.
 *
 * var foo;
 * foo.bar;
 * // TypeError: Cannot read property 'bar' of undefined
 *
 * var foo = {abc: {def: {ghi: 'jkl'}}};
 * dd(foo)('abc')('def')('ghi').val is 'jkl'
 * dd(foo)('abc')('zzz')('yyy').val is undefined
 *
 * Check if a deep property exists:
 * dd(foo)('abc').exists
 *
 * Works with arrays too:
 * var foo = {abc: [ {bar: 'def'},{bar: 'ghi'} ]};
 * dd(foo)('abc')(0)('bar') is 'def'
 *
 * Safely call functions:
 * var foo = {abc: {addOne: function(x) { return x + 1; }}};
 * dd(foo)('abc')('addOne').invoke(5); returns 6
 * dd(foo)('zzz')('aaa').invoke(5); returns undefined
 *
 * Update values if the original value exists:
 * var foo = {abc: {def: {ghi: 'jkl'}}};
 * var newValue = {ping: 'pong'};
 * dd(foo)('abc')('def').update(newValue);
 *   - foo is now {abc: {def: {ping: 'pong'}}}
 *   - {ping: 'pong'} is returned
 * dd(foo)('abc')('zzz').update(5);
 *   - foo is unchanged
 *   - undefined is returned
 *
 * Set values even if the path drilled to does not exist:
 * var foo = {abc: {}};
 * dd(foo)('abc')('def')('ghi').set('jkl');
 *   - foo is now {abc: {def: {ghi: 'jkl}}}
 *
 * To prevent confusion, only own properties are drilled into.
 *
 * Available properties:
 *  - val - the value
 *  - exists - true if val is defined
 *  - update function(value) - sets the value if the value exists
 *  - set function(value) - sets the value at any path
 *  - invoke - the value if the value is a function, or else a dummy function
 *
 * @param {object} object
 * @param _context
 * @param _key
 * @param _root
 * @param _rootPath
 * @returns {Function}
 */
function dd(object, _context, _key, _root, _rootPath) {
    _root = _root || object;
    _rootPath = _rootPath || [];
    var drill = function(key) {
        var nextObject = (
            object &&
            object.hasOwnProperty(key) &&
            object[key] ||
            undefined
        );
        return dd(nextObject, object, key, _root, _rootPath.concat(key));
    };
    drill.val = object;
    drill.exists = object !== undefined;
    drill.set = function(value) {
        if (_rootPath.length === 0) {
            return;
        }
        var contextIterator = _root;
        for (var depth = 0; depth < _rootPath.length; depth++) {
            var key = _rootPath[depth];
            var isFinalDepth = (depth === _rootPath.length - 1);
            if (!isFinalDepth) {
                contextIterator[key] = (
                    contextIterator.hasOwnProperty(key) &&
                    typeof contextIterator[key] === 'object' ?
                        contextIterator[key] : {}
                );
                contextIterator = contextIterator[key];
            } else {
                _context = contextIterator;
                _key = key;
            }
        }
        _context[_key] = value;
        drill.val = value;
        drill.exists = value !== undefined;
        return value;
    };
    drill.update = function(value) {
        if (drill.exists) {
            _context[_key] = value;
            drill.val = value;
            return value;
        }
    };
    drill.invoke = isFunction(object) ? Function.prototype.bind.call(object, _context) : function () {
    };

    return drill;
}

module.exports = dd;


},{}]},{},[1])(1)
});