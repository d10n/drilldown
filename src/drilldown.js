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
 * dd(foo)('abc')('addOne').invoke(5); returns 6
 * dd(foo)('zzz')('aaa').invoke(5); returns undefined
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
 *  - invoke - the value if the value is a function, or else a dummy function
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
    drill.invoke = isFunction(object) ? object.bind(_context) : console.log.bind(null, 'dd', object);
    return drill;
}

module.exports = dd;

