(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.dd = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// drilldown.js
// simple nevernull alternative
'use strict';

var isFunction = (function() {
    // Thanks to underscore for identifying typeof bugs
    var regexTypeofIsCorrect = typeof /./ !== 'function';
    var int8ArrayTypeofIsCorrect = typeof Int8Array !== 'object';
    if (regexTypeofIsCorrect && int8ArrayTypeofIsCorrect) {
        return function(obj) {
            return typeof obj === 'function' || false;
        };
    }
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
 * dd(foo)('abc')('addOne').func(5); returns 6
 * dd(foo)('zzz')('aaa').func(5); returns undefined
 *
 * Set values if the original value exists:
 * var foo = {abc: {def: {ghi: 'jkl'}}};
 * var newValue = {ping: 'pong'};
 * dd(foo)('abc')('def').set(newValue);
 *   - foo is now {abc: {def: {ping: 'pong'}}}
 *   - {ping: 'pong'} is returned
 * dd(foo)('abc')('zzz').set(5);
 *   - foo is unchanged
 *   - undefined is returned
 *
 * Available properties:
 *  - val - the value
 *  - exists - true if val is defined
 *  - set function(value) - sets the value if the value exists
 *  - func - the value if the value is a function, or else a dummy function
 *
 * @param {object} object
 * @param _context
 * @param _key
 * @returns {Function}
 */
function dd(object, _context, _key) {
    var drill = function(key) {
        return dd(object && object[key], object, key);
    };
    drill.val = object;
    drill.exists = object !== undefined;
    drill.set = function(value) {
        if (drill.exists) {
            _context[_key] = value;
            drill.val = value;
            return value;
        }
    };
    drill.func = isFunction(object) ? object : console.log.bind(null, 'dd', object);
    return drill;
}

module.exports = dd;


},{}]},{},[1])(1)
});