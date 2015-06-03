var definePropertyOf = include('dmail/object-define/definePropertyOf');
var clonePropertyOf = include('dmail/object-clone/clonePropertyOf');
var getValue;

if( 'getOwnPropertyDescriptor' in Object ){
	// custom setter/getter are merged without being called
	getValue = function getValue(object, name){
		var descriptor = Object.getOwnPropertyDescriptor(object, name);
		return descriptor && 'value' in descriptor ? descriptor.value : null;
	};
}
else{
	getValue = function getValue(object, name){
		return object[name];
	};
}

// set name in source cloning value and merging objects
function mergePropertyOf(object, name, owner){
	var sourceValue = getValue(owner, name), targetValue;

	if( typeof sourceValue == 'object' && sourceValue !== null ){
		targetValue = getValue(object, name);

		if( typeof targetValue == 'object' && targetValue !== null ){
			mergePropertiesOf(targetValue, sourceValue);
		}
		else{
			clonePropertyOf(object, name, owner);
		}
	}
	else{
		definePropertyOf(object, name, owner);
	}

	return object;
}

function mergePropertiesOf(target, source, names){
	var i = 0, j, name;

	if( names ){
		j = names.length;
		for(;i<j;i++){
			name = names[i];
			if( Object.prototype.hasOwnProperty.call(source, name) ){
				mergePropertyOf(target, name, source);
			}
		}
	}
	else{
		names = Object.keys(source);
		j = names.length;
		for(;i<j;i++){
			mergePropertyOf(target, names[i], source);
		}
	}

	return target;
}

Object.merge = mergePropertiesOf;

return mergePropertiesOf;