
var castaway = module.exports = function(params, schema) {
	Object.keys(schema).forEach(function(key) {
		if(params[key] === undefined) return;

		if(schema[key].schema) castaway(params[key], schema[key].schema);

		params[key] = adjustType(params[key], schema[key].type);

		if(params[key] instanceof Array && schema[key].each) {

			if(schema[key].each.type) {
				params[key] = params[key].map(function(val) {
					return adjustType(val, schema[key].each.type);
				});
			}

			if(schema[key].each.schema) {
				params[key] = params[key].map(function(val) {
					return castaway(val, schema[key].each.schema);
				});
			}
		}
	});
	return params;
};

var TRUE = { '1': true, 'true': true, 'TRUE': true, 'yes': true, 'YES': true },
	FALSE = { '0': true, 'false': true, 'FALSE': true, 'no': true, 'NO': true };

function adjustType(value, type) {
	switch(type) {
		case Number:
			value = Number(value);
			break;
		case Boolean:
			value = value in TRUE ? true : value in FALSE ? false : null;
			break;
		case Date:
			//TODO: handle invalid dates - set to null
			value = Date.parse(value);
			value = !!value ? new Date(value) : null;
			break;
		case Array:
			// attempt to convert csv params into an array
			if(typeof value == 'string') {
				value = value
					.split(',')
					.filter(function(val) {
						return !!val;
					});
			}
			break;
	}
	return value;
}
