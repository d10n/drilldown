'use strict';

var dd = require('./drilldown');
var _ = require('lodash');

describe('drilldown', function() {
    var example;
    beforeEach(function() {
        example = {
            foo: 'foo value',
            bar: sinon.spy(),
            baz: [
                {name: 'item 0'},
                {name: 'item 1'},
                {name: 'item 2'}
            ],
            quux: {
                ping: {
                    pong: true
                }
            },
            person: {
                x: 0,
                y: 0,
                move: function(dx, dy) {
                    this.x += dx;
                    this.y += dy;
                }
            }
        };
    });

    it('should access top-level properties', function() {
        expect(dd(example)('foo').val).to.equal(example.foo);
    });
    it('should access deeply-nested properties', function() {
        expect(dd(example)('quux')('ping').val).to.equal(example.quux.ping);
    });
    it('should not fail when accessing non-object properties', function() {
        expect(dd(example)('nothing')('here').val).to.be.undefined();
    });
    it('should not fail when the first dd argument is undefined', function() {
        expect(dd(undefined)(null)(false).val).to.be.undefined();
    });
    it('should be able to access array indices', function() {
        expect(dd(example)('baz')(1)('name').val).to.equal(example.baz[1].name);
    });
    it('should be able to update the value of a deeply-nested property', function() {
        var originalValue = example.quux.ping.pong;
        expect(dd(example)('quux')('ping')('pong').val).to.equal(originalValue);
        var newValue = false;
        var newResult = dd(example)('quux')('ping')('pong').update(newValue);
        expect(newResult).to.equal(newValue);
        expect(example.quux.ping.pong).to.equal(newValue);
    });
    it('should not update the value of a nonexistent property', function() {
        var original = _.cloneDeep(example);
        var newResult = dd(example)('quux')('abc')('xyz').update(5);
        expect(example).to.eql(original);
        expect(newResult).to.be.undefined();
    });
    it('should indicate whether a property exists', function() {
        expect(dd(example)('foo').exists).to.be.true();
        expect(dd(example)('oof').exists).to.be.false();
    });
    it('should not drill into own properties', function() {
        expect(dd(example)('__proto__').exists).to.be.false();
        expect(dd(example)('__proto__')('hasOwnProperty').exists).to.be.false();
        expect(dd(Object)('prototype').exists).to.be.true();
        expect(dd(Object)('__proto__').exists).to.be.false();
    });
    it('should call functions which exist', function() {
        var exampleBar = dd(example)('bar');
        var arg = 'string argument';
        exampleBar.invoke(arg);
        expect(exampleBar.val.calledWith(arg)).to.be.true();
    });
    it('should call functions which exist with this', function() {
        var exampleWalk = dd(example)('person')('move');
        sinon.spy(exampleWalk, 'invoke');
        exampleWalk.invoke(3, 4);
        expect(example.person.x).to.equal(3);
        expect(example.person.y).to.equal(4);
        expect(exampleWalk.invoke.calledWith(3, 4)).to.be.true();
    });
    xit('should call the stub function for functions which do not exist', function() {
        var exampleBar = dd(example)('bar')('zzzz');
        sinon.spy(console, 'log');  // FIXME spying on console.log interferes with must
        var arg = 'string argument';
        exampleBar.invoke(arg);
        expect(console.log.called).to.be.true();
        console.log.restore();
    });
});
