var assert = require('chai').assert,
	cast = require('../castaway');

describe('casting types', function(){

	describe('Number', function() {
		var schema = { foo: { type: Number } };

		it('should turn a string into a Number', function() {
			var obj = { foo: '1' };

			cast(obj, schema);
			assert.isNumber(obj.foo);
		});

		it('should turn leave a Number a Number', function() {
			var obj = { foo: 1 };

			cast(obj, schema);
			assert.isNumber(obj.foo);
		});

		it('should turn a string 0 into a Number', function() {
			var obj = { foo: '0' };

			cast(obj, schema);
			assert.isNumber(obj.foo);
			assert.strictEqual(obj.foo, 0);
		});

		it('should turn a non-numeric string into NaN', function(){
			var obj = { foo: 'bar' };

			cast(obj, schema);
			assert.isTrue(isNaN(obj.foo));
		});

	});

	describe('Date', function() {
		var schema = { foo: { type: Date } };

		it('should turn a properly formatted date-time string into a Date', function() {
			var obj = { foo: '2013-02-28 16:31:13' };

			cast(obj, schema);
			assert.equal(obj.foo.constructor, Date);
		});

		it('should turn a properly formatted date string into a Date', function() {
			var obj = { foo: '2013-02-28' };

			cast(obj, schema);
			assert.equal(obj.foo.constructor, Date);
			assert.equal(obj.foo.getTime(), new Date('2013-02-28').getTime());
		});

		it('should turn an improperly formatted date-string into null', function() {
			var obj = { foo: 'this is not a date' };

			cast(obj, schema);
			assert.equal(obj.foo, null);
		});

	});

	describe('Array', function() {
		var schema = { foo: { type: Array }};

		it('should turn a csv into an array of strings', function() {
			var obj = { foo: '1,2,3,4,5,6,7,8,9' };

			cast(obj, schema);
			assert.isArray(obj.foo);
			assert.deepEqual(obj.foo, ['1','2','3','4','5','6','7','8','9']);
		});

		it('should turn a csv into an array of numbers when specified', function() {
			var schema = { foo: { type: Array, each: { type: Number } } },
				obj = { foo: '1,2,3,4,5,6,7,8,9' };

			cast(obj, schema);
			assert.isArray(obj.foo);
			assert.deepEqual(obj.foo, [1,2,3,4,5,6,7,8,9]);
		});

		it('should handle an array of objects that have schemas defined', function() {
			var schema = {
					foo: {
						type: Array,
						each: {
							schema: {
								id: { type: Number },
								when: { type: Date }
							}
						}
					}
				},
				obj = { foo: [
					{ id: '1', hee: 'haw', when: '2013-02-28 16:31:13' },
					{ id: '2', hee: 'hoo', when: '2013-02-28' }
				]};

			cast(obj, schema);
			assert.isArray(obj.foo);
			assert.lengthOf(obj.foo, 2);
			assert.equal(obj.foo[0].id, 1);
			assert.equal(obj.foo[1].id, 2);
			assert.equal(obj.foo[0].hee, 'haw');
			assert.equal(obj.foo[1].hee, 'hoo');
			assert.equal(obj.foo[0].when.constructor, Date);
			assert.equal(obj.foo[1].when.constructor, Date);
			assert.equal(obj.foo[0].when.getTime(), (new Date('2013-02-28 16:31:13')).getTime());
			assert.equal(obj.foo[1].when.getTime(), (new Date('2013-02-28')).getTime());
		});

	});

	describe('Boolean', function() {
		var schema = { foo: { type: Boolean } };

		it('should turn 0 into false', function() {
			var obj = { foo: 0 };

			cast(obj, schema);
			assert.isFalse(obj.foo);
		});

		it('should turn "0" into false', function() {
			var obj = { foo: '0' };

			cast(obj, schema);
			assert.isFalse(obj.foo);
		});

		it('should turn "false" into false', function() {
			var obj = { foo: 'false' };

			cast(obj, schema);
			assert.isFalse(obj.foo);
		});

		it('should turn "FALSE" into false', function() {
			var obj = { foo: 'FALSE' };

			cast(obj, schema);
			assert.isFalse(obj.foo);
		});

		it('should turn "no" into false', function() {
			var obj = { foo: 'no' };

			cast(obj, schema);
			assert.isFalse(obj.foo);
		});

		it('should turn "NO" into false', function() {
			var obj = { foo: 'NO' };

			cast(obj, schema);
			assert.isFalse(obj.foo);
		});

		it('should turn 1 into true', function() {
			var obj = { foo: 1 };

			cast(obj, schema);
			assert.isTrue(obj.foo);
		});

		it('should turn "1" into true', function() {
			var obj = { foo: '1' };

			cast(obj, schema);
			assert.isTrue(obj.foo);
		});

		it('should turn "true" into true', function() {
			var obj = { foo: 'true' };

			cast(obj, schema);
			assert.isTrue(obj.foo);
		});

		it('should turn "TRUE" into true', function() {
			var obj = { foo: 'TRUE' };

			cast(obj, schema);
			assert.isTrue(obj.foo);
		});

		it('should turn "yes" into true', function() {
			var obj = { foo: 'yes' };

			cast(obj, schema);
			assert.isTrue(obj.foo);
		});

		it('should turn "YES" into true', function() {
			var obj = { foo: 'YES' };

			cast(obj, schema);
			assert.isTrue(obj.foo);
		});

		it('should turn 2 into null', function() {
			var obj = { foo: 2 };

			cast(obj, schema);
			assert.isNull(obj.foo);
		});

		it('should turn "2" into null', function() {
			var obj = { foo: '2' };

			cast(obj, schema);
			assert.isNull(obj.foo);
		});

		it('should turn "foobar" into null', function() {
			var obj = { foo: 'foobar' };

			cast(obj, schema);
			assert.isNull(obj.foo);
		});

		it('should leave false as false', function() {
			var obj = { foo: false };

			cast(obj, schema);
			assert.isFalse(obj.foo);
		});

		it('should leave true as true', function() {
			var obj = { foo: true };

			cast(obj, schema);
			assert.isTrue(obj.foo);
		});

	});

	describe('schema', function() {
		var schema = {
				foo: {
					schema: {
						id: { type: Number },
						when: { type: Date }
					}
				}
			},
			obj = {
				foo: {
					id: '123',
					when: '2013-02-28'
				}
			};

		cast(obj, schema);

	});

});
