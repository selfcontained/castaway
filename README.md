[![browser support](http://ci.testling.com/selfcontained/castaway.png)](http://ci.testling.com/selfcontained/castaway)

[![Build Status](https://secure.travis-ci.org/selfcontained/castaway.png?branch=master)](http://travis-ci.org/selfcontained/castaway)

castaway
========

cast an object's values to a specified schema

```bash
npm install castaway
```

Given an object, and a schema defining the types of the objects properties, castaway will convert the values to the appropriate JS primitives.

```javascript
var cast = require('castaway');

var obj = { foo: '1337'},
	schema = { foo: { type: Number }};

cast(obj, schema);

console.log(typeof obj.foo); // number
```

Supported `type` values are:

+	Number
+	Boolean
+	Date
+	Array (converts a CSV string into an Array)

Arrays also support defining member schemas via an `each` property, and specifying the schema or types:

Here's an example of specifying the schema via `each` for an array...

```javascript
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
	// for each entry in foo, id is a Number, when is a Date, hee is still a String
```

And here's an example of just specifying the `type` for an array via `each`...

```javascript
var schema = { foo: { type: Array, each: { type: Number } } },
	obj = { foo: '1,2,3,4,5,6,7,8,9' };

cast(obj, schema);
// foo is an array of numbers
```
