drilldown.js
============

Safely accesses deep properties of objects.

```JavaScript
// npm install drilldown
// bower install drilldown
var dd = require('drilldown');
```
Strict version locking is recommended during release 0.0.x

Ever run into this?
```JavaScript
var foo;
foo.bar;
// TypeError: Cannot read property 'bar' of undefined
```

You can now check deeply nested properties cleanly!
```JavaScript
var foo = {abc: {def: {ghi: 'jkl'}}};
dd(foo)('abc')('def')('ghi').val is 'jkl'
dd(foo)('abc')('zzz')('yyy').val is undefined

// You don't need to use this ugly idiom anymore!
(((foo || {}).abc || {}).def || {}).ghi  // no
```

Check if a deep property exists:
```JavaScript
dd(foo)('abc').exists
```

Works with arrays too:
```JavaScript
var foo = {abc: [ {bar: 'def'},{bar: 'ghi'} ]};
dd(foo)('abc')(0)('bar').val is 'def'
```

Safely call functions:
```JavaScript
var foo = {abc: {addOne: function(x) { return x + 1; }}};
dd(foo)('abc')('addOne').invoke(5); returns 6
dd(foo)('zzz')('aaa').invoke(5); returns undefined
```

Update values if the original value exists:
```JavaScript
var foo = {abc: {def: {ghi: 'jkl'}}};
var newValue = {ping: 'pong'};

dd(foo)('abc')('def').update(newValue);
//  - foo is now {abc: {def: {ping: 'pong'}}}
//  - {ping: 'pong'} is returned

dd(foo)('abc')('zzz').update(5);
//  - foo is unchanged
//  - undefined is returned
```

Set values even if the path drilled to does not exist:
```JavaScript
var foo = {abc: {}};
dd(foo)('abc')('def')('ghi').set('jkl');
//  - foo is now {abc: {def: {ghi: 'jkl}}}
```

To prevent confusion, only own properties are drilled into.

Available dd properties:
 * val - the value
 * exists - true if val is defined
 * update function(value) - sets the value if the value exists
 * set function(value) - sets the value at any path
 * invoke - the value if the value is a function, or else a dummy function
