(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}




// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	/**_UNUSED/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**_UNUSED/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**/
	if (typeof x.$ === 'undefined')
	//*/
	/**_UNUSED/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0 = 0;
var _Utils_Tuple0_UNUSED = { $: '#0' };

function _Utils_Tuple2(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2_UNUSED(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3_UNUSED(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr(c) { return c; }
function _Utils_chr_UNUSED(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil = { $: 0 };
var _List_Nil_UNUSED = { $: '[]' };

function _List_Cons(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons_UNUSED(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log = F2(function(tag, value)
{
	return value;
});

var _Debug_log_UNUSED = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString(value)
{
	return '<internals>';
}

function _Debug_toString_UNUSED(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File === 'function' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[94m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash_UNUSED(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.b4.ao === region.cn.ao)
	{
		return 'on line ' + region.b4.ao;
	}
	return 'on lines ' + region.b4.ao + ' through ' + region.cn.ao;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return word
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**_UNUSED/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList === 'function' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap_UNUSED(value) { return { $: 0, a: value }; }
function _Json_unwrap_UNUSED(value) { return value.a; }

function _Json_wrap(value) { return value; }
function _Json_unwrap(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.c2,
		impl.dj,
		impl.dg,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**_UNUSED/, _Json_errorToString(result.a) /**/);
	var managers = {};
	result = init(result.a);
	var model = result.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		result = A2(update, msg, model);
		stepper(model = result.a, viewMetadata);
		_Platform_dispatchEffects(managers, result.b, subscriptions(model));
	}

	_Platform_dispatchEffects(managers, result.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				p: bag.n,
				q: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.q)
		{
			x = temp.p(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		r: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].r;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		r: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].r;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**/
	var node = args['node'];
	//*/
	/**_UNUSED/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS


function _VirtualDom_noScript(tag)
{
	return tag == 'script' ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return /^(on|formAction$)/i.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,'')) ? '' : value;
}

function _VirtualDom_noJavaScriptUri_UNUSED(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,''))
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value) ? '' : value;
}

function _VirtualDom_noJavaScriptOrHtmlUri_UNUSED(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value)
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		s: func(record.s),
		b6: record.b6,
		bZ: record.bZ
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.s;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.b6;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.bZ) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.c2,
		impl.dj,
		impl.dg,
		function(sendToApp, initialModel) {
			var view = impl.dl;
			/**/
			var domNode = args['node'];
			//*/
			/**_UNUSED/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.c2,
		impl.dj,
		impl.dg,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.b2 && impl.b2(sendToApp)
			var view = impl.dl;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.cP);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.dh) && (_VirtualDom_doc.title = title = doc.dh);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.c7;
	var onUrlRequest = impl.c8;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		b2: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.cC === next.cC
							&& curr.cp === next.cp
							&& curr.cz.a === next.cz.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		c2: function(flags)
		{
			return A3(impl.c2, flags, _Browser_getUrl(), key);
		},
		dl: impl.dl,
		dj: impl.dj,
		dg: impl.dg
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { c_: 'hidden', cR: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { c_: 'mozHidden', cR: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { c_: 'msHidden', cR: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { c_: 'webkitHidden', cR: 'webkitvisibilitychange' }
		: { c_: 'hidden', cR: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		cG: _Browser_getScene(),
		cM: {
			bn: _Browser_window.pageXOffset,
			bo: _Browser_window.pageYOffset,
			S: _Browser_doc.documentElement.clientWidth,
			L: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		S: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		L: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			cG: {
				S: node.scrollWidth,
				L: node.scrollHeight
			},
			cM: {
				bn: node.scrollLeft,
				bo: node.scrollTop,
				S: node.clientWidth,
				L: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			cG: _Browser_getScene(),
			cM: {
				bn: x,
				bo: y,
				S: _Browser_doc.documentElement.clientWidth,
				L: _Browser_doc.documentElement.clientHeight
			},
			cV: {
				bn: x + rect.left,
				bo: y + rect.top,
				S: rect.width,
				L: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}
var $author$project$Main$UrlChanged = function (a) {
	return {$: 1, a: a};
};
var $author$project$Main$UrlRequested = function (a) {
	return {$: 2, a: a};
};
var $elm$core$Basics$EQ = 1;
var $elm$core$Basics$GT = 2;
var $elm$core$Basics$LT = 0;
var $elm$core$List$cons = _List_cons;
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === -2) {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (!node.$) {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Result$Err = function (a) {
	return {$: 1, a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 0, a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 2, a: a};
};
var $elm$core$Basics$False = 1;
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Maybe$Nothing = {$: 1};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 0:
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 1) {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 1:
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 2:
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 0, a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 1, a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.e) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.f),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.f);
		} else {
			var treeLen = builder.e * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.g) : builder.g;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.e);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.f) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.f);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{g: nodeList, e: (len / $elm$core$Array$branchFactor) | 0, f: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = 0;
var $elm$core$Result$isOk = function (result) {
	if (!result.$) {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 0:
			return 0;
		case 1:
			return 1;
		case 2:
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 1, a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = $elm$core$Basics$identity;
var $elm$url$Url$Http = 0;
var $elm$url$Url$Https = 1;
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {cY: fragment, cp: host, cx: path, cz: port_, cC: protocol, cD: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 1) {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		0,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		1,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = $elm$core$Basics$identity;
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(0);
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return 0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0;
		return A2($elm$core$Task$map, tagger, task);
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			A2($elm$core$Task$map, toMessage, task));
	});
var $elm$browser$Browser$application = _Browser_application;
var $author$project$Demo$Url$Button = {$: 1};
var $author$project$Demo$Buttons$defaultModel = {};
var $author$project$Demo$Cards$defaultModel = {};
var $author$project$Material$Checkbox$Internal$Checked = 1;
var $author$project$Material$Checkbox$checked = 1;
var $elm$core$Dict$RBEmpty_elm_builtin = {$: -2};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $elm$core$Dict$Black = 1;
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: -1, a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$Red = 0;
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === -1) && (!right.a)) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === -1) && (!left.a)) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === -1) && (!left.a)) && (left.d.$ === -1)) && (!left.d.a)) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === -2) {
			return A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1) {
				case 0:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 1:
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$fromList = function (assocs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, dict) {
				var key = _v0.a;
				var value = _v0.b;
				return A3($elm$core$Dict$insert, key, value, dict);
			}),
		$elm$core$Dict$empty,
		assocs);
};
var $author$project$Material$Checkbox$Internal$Unchecked = 0;
var $author$project$Material$Checkbox$unchecked = 0;
var $author$project$Demo$Checkbox$defaultModel = {
	Y: $elm$core$Dict$fromList(
		_List_fromArray(
			[
				_Utils_Tuple2('checked-hero-checkbox', $author$project$Material$Checkbox$checked),
				_Utils_Tuple2('unchecked-hero-checkbox', $author$project$Material$Checkbox$unchecked),
				_Utils_Tuple2('unchecked-checkbox', $author$project$Material$Checkbox$unchecked),
				_Utils_Tuple2('checked-checkbox', $author$project$Material$Checkbox$checked)
			]))
};
var $author$project$Demo$Chips$Small = 1;
var $elm$core$Set$Set_elm_builtin = $elm$core$Basics$identity;
var $elm$core$Dict$singleton = F2(
	function (key, value) {
		return A5($elm$core$Dict$RBNode_elm_builtin, 1, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
	});
var $elm$core$Set$singleton = function (key) {
	return A2($elm$core$Dict$singleton, key, 0);
};
var $author$project$Demo$Chips$defaultModel = {
	I: $elm$core$Set$singleton('Tops'),
	aY: $elm$core$Maybe$Just('Chip One'),
	J: $elm$core$Set$singleton('Alice'),
	a$: 'One',
	A: '',
	k: _List_fromArray(
		['Portland', 'Biking']),
	bk: 1
};
var $author$project$Demo$CircularProgress$defaultModel = {};
var $elm$core$Set$empty = $elm$core$Dict$empty;
var $author$project$Demo$DataTable$defaultModel = {i: $elm$core$Set$empty};
var $author$project$Demo$DenseTopAppBar$defaultModel = {};
var $author$project$Demo$Dialog$defaultModel = {u: $elm$core$Maybe$Nothing};
var $author$project$Demo$DismissibleDrawer$defaultModel = {u: false, bi: 0};
var $author$project$Demo$Drawer$defaultModel = {};
var $author$project$Demo$Elevation$defaultModel = {};
var $author$project$Demo$Fabs$defaultModel = {};
var $author$project$Demo$FixedTopAppBar$defaultModel = {};
var $author$project$Demo$IconButton$defaultModel = {l: $elm$core$Set$empty};
var $author$project$Demo$ImageList$defaultModel = {};
var $author$project$Demo$LayoutGrid$defaultModel = {};
var $author$project$Demo$LinearProgress$defaultModel = {};
var $author$project$Demo$Lists$defaultModel = {aR: 'Star', Y: $elm$core$Set$empty, ax: $elm$core$Maybe$Nothing, bj: 'Star'};
var $author$project$Demo$Menus$defaultModel = {au: false, bd: false, be: false};
var $author$project$Demo$ModalDrawer$defaultModel = {u: false, bi: 0};
var $author$project$Demo$PermanentDrawer$defaultModel = {bi: 0};
var $author$project$Demo$ProminentTopAppBar$defaultModel = {};
var $author$project$Demo$RadioButtons$defaultModel = {
	ay: $elm$core$Dict$fromList(
		_List_fromArray(
			[
				_Utils_Tuple2('hero', 'radio-buttons-hero-radio-1'),
				_Utils_Tuple2('example', 'radio-buttons-example-radio-1')
			]))
};
var $author$project$Demo$Ripple$defaultModel = {};
var $author$project$Demo$Selects$defaultModel = {aZ: $elm$core$Maybe$Nothing, a_: $elm$core$Maybe$Nothing, a0: $elm$core$Maybe$Nothing, cZ: $elm$core$Maybe$Nothing, bf: $elm$core$Maybe$Nothing, bg: $elm$core$Maybe$Nothing};
var $author$project$Demo$ShortCollapsedTopAppBar$defaultModel = {};
var $author$project$Demo$ShortTopAppBar$defaultModel = {};
var $author$project$Demo$Slider$defaultModel = {
	p: $elm$core$Dict$fromList(
		_List_fromArray(
			[
				_Utils_Tuple2('hero-slider', 25),
				_Utils_Tuple2('continuous-slider', 25),
				_Utils_Tuple2('discrete-slider', 25),
				_Utils_Tuple2('discrete-slider-with-tick-marks', 25)
			]))
};
var $author$project$Material$Snackbar$MessageId = $elm$core$Basics$identity;
var $author$project$Material$Snackbar$Queue = $elm$core$Basics$identity;
var $author$project$Material$Snackbar$initialQueue = {B: _List_Nil, at: 0};
var $author$project$Demo$Snackbar$defaultModel = {m: $author$project$Material$Snackbar$initialQueue};
var $author$project$Demo$StandardTopAppBar$defaultModel = {};
var $author$project$Demo$Switch$defaultModel = {
	aH: $elm$core$Dict$fromList(
		_List_fromArray(
			[
				_Utils_Tuple2('hero-switch', true)
			]))
};
var $author$project$Demo$TabBar$defaultModel = {aS: 0, o: 0, aT: 0, aU: 0, aV: 0};
var $author$project$Demo$TextFields$defaultModel = {bm: ''};
var $author$project$Demo$Theme$defaultModel = {};
var $author$project$Demo$TopAppBar$defaultModel = {};
var $author$project$Demo$Typography$defaultModel = {};
var $author$project$Main$defaultModel = function (key) {
	return {cQ: $author$project$Demo$Buttons$defaultModel, W: $author$project$Demo$Cards$defaultModel, x: false, X: $author$project$Demo$Checkbox$defaultModel, Z: $author$project$Demo$Chips$defaultModel, _: $author$project$Demo$CircularProgress$defaultModel, aa: $author$project$Demo$DataTable$defaultModel, ab: $author$project$Demo$DenseTopAppBar$defaultModel, ac: $author$project$Demo$Dialog$defaultModel, af: $author$project$Demo$DismissibleDrawer$defaultModel, cU: $author$project$Demo$Drawer$defaultModel, ag: $author$project$Demo$Elevation$defaultModel, ah: $author$project$Demo$Fabs$defaultModel, ai: $author$project$Demo$FixedTopAppBar$defaultModel, al: $author$project$Demo$IconButton$defaultModel, am: $author$project$Demo$ImageList$defaultModel, cq: key, an: $author$project$Demo$LayoutGrid$defaultModel, ap: $author$project$Demo$LinearProgress$defaultModel, aq: $author$project$Demo$Lists$defaultModel, ar: $author$project$Demo$Menus$defaultModel, as: $author$project$Demo$ModalDrawer$defaultModel, av: $author$project$Demo$PermanentDrawer$defaultModel, aw: $author$project$Demo$ProminentTopAppBar$defaultModel, ax: $author$project$Demo$RadioButtons$defaultModel, az: $author$project$Demo$Ripple$defaultModel, aA: $author$project$Demo$Selects$defaultModel, aB: $author$project$Demo$ShortCollapsedTopAppBar$defaultModel, aC: $author$project$Demo$ShortTopAppBar$defaultModel, aD: $author$project$Demo$Slider$defaultModel, aE: $author$project$Demo$Snackbar$defaultModel, aF: $author$project$Demo$StandardTopAppBar$defaultModel, aG: $author$project$Demo$Switch$defaultModel, aI: $author$project$Demo$TabBar$defaultModel, aK: $author$project$Demo$TextFields$defaultModel, aL: $author$project$Demo$Theme$defaultModel, di: $author$project$Demo$TopAppBar$defaultModel, aP: $author$project$Demo$Typography$defaultModel, a: $author$project$Demo$Url$Button};
};
var $author$project$Demo$Url$Card = {$: 2};
var $author$project$Demo$Url$Checkbox = {$: 3};
var $author$project$Demo$Url$Chips = {$: 4};
var $author$project$Demo$Url$CircularProgress = {$: 5};
var $author$project$Demo$Url$DataTable = {$: 36};
var $author$project$Demo$Url$DenseTopAppBar = {$: 31};
var $author$project$Demo$Url$Dialog = {$: 6};
var $author$project$Demo$Url$DismissibleDrawer = {$: 8};
var $author$project$Demo$Url$Drawer = {$: 7};
var $author$project$Demo$Url$Elevation = {$: 11};
var $author$project$Demo$Url$Error404 = function (a) {
	return {$: 37, a: a};
};
var $author$project$Demo$Url$Fab = {$: 12};
var $author$project$Demo$Url$FixedTopAppBar = {$: 30};
var $author$project$Demo$Url$IconButton = {$: 13};
var $author$project$Demo$Url$ImageList = {$: 14};
var $author$project$Demo$Url$LayoutGrid = {$: 15};
var $author$project$Demo$Url$LinearProgress = {$: 16};
var $author$project$Demo$Url$List = {$: 17};
var $author$project$Demo$Url$Menu = {$: 21};
var $author$project$Demo$Url$ModalDrawer = {$: 9};
var $author$project$Demo$Url$PermanentDrawer = {$: 10};
var $author$project$Demo$Url$ProminentTopAppBar = {$: 32};
var $author$project$Demo$Url$RadioButton = {$: 18};
var $author$project$Demo$Url$Ripple = {$: 19};
var $author$project$Demo$Url$Select = {$: 20};
var $author$project$Demo$Url$ShortCollapsedTopAppBar = {$: 34};
var $author$project$Demo$Url$ShortTopAppBar = {$: 33};
var $author$project$Demo$Url$Slider = {$: 22};
var $author$project$Demo$Url$Snackbar = {$: 23};
var $author$project$Demo$Url$StandardTopAppBar = {$: 29};
var $author$project$Demo$Url$StartPage = {$: 0};
var $author$project$Demo$Url$Switch = {$: 24};
var $author$project$Demo$Url$TabBar = {$: 25};
var $author$project$Demo$Url$TextField = {$: 26};
var $author$project$Demo$Url$Theme = {$: 27};
var $author$project$Demo$Url$TopAppBar = {$: 28};
var $author$project$Demo$Url$Typography = {$: 35};
var $author$project$Demo$Url$fromString = function (url) {
	switch (url) {
		case '':
			return $author$project$Demo$Url$StartPage;
		case 'buttons':
			return $author$project$Demo$Url$Button;
		case 'cards':
			return $author$project$Demo$Url$Card;
		case 'checkbox':
			return $author$project$Demo$Url$Checkbox;
		case 'chips':
			return $author$project$Demo$Url$Chips;
		case 'circular-progress':
			return $author$project$Demo$Url$CircularProgress;
		case 'dialog':
			return $author$project$Demo$Url$Dialog;
		case 'drawer':
			return $author$project$Demo$Url$Drawer;
		case 'dismissible-drawer':
			return $author$project$Demo$Url$DismissibleDrawer;
		case 'modal-drawer':
			return $author$project$Demo$Url$ModalDrawer;
		case 'permanent-drawer':
			return $author$project$Demo$Url$PermanentDrawer;
		case 'elevation':
			return $author$project$Demo$Url$Elevation;
		case 'fab':
			return $author$project$Demo$Url$Fab;
		case 'icon-button':
			return $author$project$Demo$Url$IconButton;
		case 'image-list':
			return $author$project$Demo$Url$ImageList;
		case 'layout-grid':
			return $author$project$Demo$Url$LayoutGrid;
		case 'linear-progress':
			return $author$project$Demo$Url$LinearProgress;
		case 'lists':
			return $author$project$Demo$Url$List;
		case 'radio-buttons':
			return $author$project$Demo$Url$RadioButton;
		case 'ripple':
			return $author$project$Demo$Url$Ripple;
		case 'select':
			return $author$project$Demo$Url$Select;
		case 'menu':
			return $author$project$Demo$Url$Menu;
		case 'slider':
			return $author$project$Demo$Url$Slider;
		case 'snackbar':
			return $author$project$Demo$Url$Snackbar;
		case 'switch':
			return $author$project$Demo$Url$Switch;
		case 'tabbar':
			return $author$project$Demo$Url$TabBar;
		case 'text-field':
			return $author$project$Demo$Url$TextField;
		case 'theme':
			return $author$project$Demo$Url$Theme;
		case 'top-app-bar':
			return $author$project$Demo$Url$TopAppBar;
		case 'top-app-bar/standard':
			return $author$project$Demo$Url$StandardTopAppBar;
		case 'top-app-bar/fixed':
			return $author$project$Demo$Url$FixedTopAppBar;
		case 'top-app-bar/dense':
			return $author$project$Demo$Url$DenseTopAppBar;
		case 'top-app-bar/prominent':
			return $author$project$Demo$Url$ProminentTopAppBar;
		case 'top-app-bar/short':
			return $author$project$Demo$Url$ShortTopAppBar;
		case 'top-app-bar/short-collapsed':
			return $author$project$Demo$Url$ShortCollapsedTopAppBar;
		case 'typography':
			return $author$project$Demo$Url$Typography;
		case 'data-table':
			return $author$project$Demo$Url$DataTable;
		default:
			return $author$project$Demo$Url$Error404(url);
	}
};
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $author$project$Demo$Url$fromUrl = function (url) {
	return $author$project$Demo$Url$fromString(
		A2($elm$core$Maybe$withDefault, '', url.cY));
};
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $author$project$Main$init = F3(
	function (flags, url, key) {
		var initialModel = $author$project$Main$defaultModel(key);
		return _Utils_Tuple2(
			_Utils_update(
				initialModel,
				{
					a: $author$project$Demo$Url$fromUrl(url)
				}),
			$elm$core$Platform$Cmd$none);
	});
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$core$Platform$Sub$none = $elm$core$Platform$Sub$batch(_List_Nil);
var $author$project$Main$subscriptions = function (model) {
	return $elm$core$Platform$Sub$none;
};
var $author$project$Main$ButtonsMsg = function (a) {
	return {$: 5, a: a};
};
var $author$project$Main$CardsMsg = function (a) {
	return {$: 6, a: a};
};
var $author$project$Main$CheckboxMsg = function (a) {
	return {$: 7, a: a};
};
var $author$project$Main$ChipsMsg = function (a) {
	return {$: 8, a: a};
};
var $author$project$Main$CircularProgressMsg = function (a) {
	return {$: 9, a: a};
};
var $author$project$Main$FabsMsg = function (a) {
	return {$: 14, a: a};
};
var $author$project$Main$IconButtonMsg = function (a) {
	return {$: 15, a: a};
};
var $author$project$Main$ListsMsg = function (a) {
	return {$: 19, a: a};
};
var $author$project$Main$NoOp = {$: 0};
var $author$project$Main$RadioButtonsMsg = function (a) {
	return {$: 23, a: a};
};
var $author$project$Main$SelectMsg = function (a) {
	return {$: 25, a: a};
};
var $author$project$Main$SliderMsg = function (a) {
	return {$: 26, a: a};
};
var $author$project$Main$SnackbarMsg = function (a) {
	return {$: 27, a: a};
};
var $author$project$Main$SwitchMsg = function (a) {
	return {$: 29, a: a};
};
var $author$project$Main$TabBarMsg = function (a) {
	return {$: 30, a: a};
};
var $author$project$Main$TextFieldMsg = function (a) {
	return {$: 31, a: a};
};
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $elm$core$Task$onError = _Scheduler_onError;
var $elm$core$Task$attempt = F2(
	function (resultToMessage, task) {
		return $elm$core$Task$command(
			A2(
				$elm$core$Task$onError,
				A2(
					$elm$core$Basics$composeL,
					A2($elm$core$Basics$composeL, $elm$core$Task$succeed, resultToMessage),
					$elm$core$Result$Err),
				A2(
					$elm$core$Task$andThen,
					A2(
						$elm$core$Basics$composeL,
						A2($elm$core$Basics$composeL, $elm$core$Task$succeed, resultToMessage),
						$elm$core$Result$Ok),
					task)));
	});
var $elm$browser$Browser$Navigation$load = _Browser_load;
var $elm$core$Platform$Cmd$map = _Platform_map;
var $elm$core$Tuple$mapFirst = F2(
	function (func, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return _Utils_Tuple2(
			func(x),
			y);
	});
var $elm$core$Tuple$mapSecond = F2(
	function (func, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return _Utils_Tuple2(
			x,
			func(y));
	});
var $elm$core$Basics$neq = _Utils_notEqual;
var $elm$browser$Browser$Dom$setViewportOf = _Browser_setViewportOf;
var $author$project$Demo$Url$toString = function (url) {
	switch (url.$) {
		case 0:
			return '#';
		case 1:
			return '#buttons';
		case 2:
			return '#cards';
		case 3:
			return '#checkbox';
		case 4:
			return '#chips';
		case 5:
			return '#circular-progress';
		case 6:
			return '#dialog';
		case 7:
			return '#drawer';
		case 8:
			return '#dismissible-drawer';
		case 9:
			return '#modal-drawer';
		case 10:
			return '#permanent-drawer';
		case 11:
			return '#elevation';
		case 12:
			return '#fab';
		case 13:
			return '#icon-button';
		case 14:
			return '#image-list';
		case 15:
			return '#layout-grid';
		case 16:
			return '#linear-progress';
		case 17:
			return '#lists';
		case 18:
			return '#radio-buttons';
		case 19:
			return '#ripple';
		case 20:
			return '#select';
		case 21:
			return '#menu';
		case 22:
			return '#slider';
		case 23:
			return '#snackbar';
		case 24:
			return '#switch';
		case 25:
			return '#tabbar';
		case 26:
			return '#text-field';
		case 27:
			return '#theme';
		case 28:
			return '#top-app-bar';
		case 29:
			return '#top-app-bar/standard';
		case 30:
			return '#top-app-bar/fixed';
		case 31:
			return '#top-app-bar/dense';
		case 32:
			return '#top-app-bar/prominent';
		case 33:
			return '#top-app-bar/short';
		case 34:
			return '#top-app-bar/short-collapsed';
		case 35:
			return '#typography';
		case 36:
			return '#data-table';
		default:
			var requestedHash = url.a;
			return requestedHash;
	}
};
var $author$project$Demo$Buttons$Focused = function (a) {
	return {$: 1, a: a};
};
var $elm$browser$Browser$Dom$focus = _Browser_call('focus');
var $author$project$Demo$Buttons$update = F2(
	function (msg, model) {
		if (!msg.$) {
			var id = msg.a;
			return _Utils_Tuple2(
				model,
				A2(
					$elm$core$Task$attempt,
					$author$project$Demo$Buttons$Focused,
					$elm$browser$Browser$Dom$focus(id)));
		} else {
			return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Demo$Cards$Focused = function (a) {
	return {$: 1, a: a};
};
var $author$project$Demo$Cards$update = F2(
	function (msg, model) {
		if (!msg.$) {
			var id = msg.a;
			return _Utils_Tuple2(
				model,
				A2(
					$elm$core$Task$attempt,
					$author$project$Demo$Cards$Focused,
					$elm$browser$Browser$Dom$focus(id)));
		} else {
			return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Demo$Checkbox$Focused = function (a) {
	return {$: 2, a: a};
};
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === -2) {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1) {
					case 0:
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 1:
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $elm$core$Dict$getMin = function (dict) {
	getMin:
	while (true) {
		if ((dict.$ === -1) && (dict.d.$ === -1)) {
			var left = dict.d;
			var $temp$dict = left;
			dict = $temp$dict;
			continue getMin;
		} else {
			return dict;
		}
	}
};
var $elm$core$Dict$moveRedLeft = function (dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.e.d.$ === -1) && (!dict.e.d.a)) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var lLeft = _v1.d;
			var lRight = _v1.e;
			var _v2 = dict.e;
			var rClr = _v2.a;
			var rK = _v2.b;
			var rV = _v2.c;
			var rLeft = _v2.d;
			var _v3 = rLeft.a;
			var rlK = rLeft.b;
			var rlV = rLeft.c;
			var rlL = rLeft.d;
			var rlR = rLeft.e;
			var rRight = _v2.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				0,
				rlK,
				rlV,
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					rlL),
				A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rlR, rRight));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v4 = dict.d;
			var lClr = _v4.a;
			var lK = _v4.b;
			var lV = _v4.c;
			var lLeft = _v4.d;
			var lRight = _v4.e;
			var _v5 = dict.e;
			var rClr = _v5.a;
			var rK = _v5.b;
			var rV = _v5.c;
			var rLeft = _v5.d;
			var rRight = _v5.e;
			if (clr === 1) {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$moveRedRight = function (dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.d.d.$ === -1) && (!dict.d.d.a)) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var _v2 = _v1.d;
			var _v3 = _v2.a;
			var llK = _v2.b;
			var llV = _v2.c;
			var llLeft = _v2.d;
			var llRight = _v2.e;
			var lRight = _v1.e;
			var _v4 = dict.e;
			var rClr = _v4.a;
			var rK = _v4.b;
			var rV = _v4.c;
			var rLeft = _v4.d;
			var rRight = _v4.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				0,
				lK,
				lV,
				A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					lRight,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight)));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v5 = dict.d;
			var lClr = _v5.a;
			var lK = _v5.b;
			var lV = _v5.c;
			var lLeft = _v5.d;
			var lRight = _v5.e;
			var _v6 = dict.e;
			var rClr = _v6.a;
			var rK = _v6.b;
			var rV = _v6.c;
			var rLeft = _v6.d;
			var rRight = _v6.e;
			if (clr === 1) {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$removeHelpPrepEQGT = F7(
	function (targetKey, dict, color, key, value, left, right) {
		if ((left.$ === -1) && (!left.a)) {
			var _v1 = left.a;
			var lK = left.b;
			var lV = left.c;
			var lLeft = left.d;
			var lRight = left.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				lK,
				lV,
				lLeft,
				A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, lRight, right));
		} else {
			_v2$2:
			while (true) {
				if ((right.$ === -1) && (right.a === 1)) {
					if (right.d.$ === -1) {
						if (right.d.a === 1) {
							var _v3 = right.a;
							var _v4 = right.d;
							var _v5 = _v4.a;
							return $elm$core$Dict$moveRedRight(dict);
						} else {
							break _v2$2;
						}
					} else {
						var _v6 = right.a;
						var _v7 = right.d;
						return $elm$core$Dict$moveRedRight(dict);
					}
				} else {
					break _v2$2;
				}
			}
			return dict;
		}
	});
var $elm$core$Dict$removeMin = function (dict) {
	if ((dict.$ === -1) && (dict.d.$ === -1)) {
		var color = dict.a;
		var key = dict.b;
		var value = dict.c;
		var left = dict.d;
		var lColor = left.a;
		var lLeft = left.d;
		var right = dict.e;
		if (lColor === 1) {
			if ((lLeft.$ === -1) && (!lLeft.a)) {
				var _v3 = lLeft.a;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					key,
					value,
					$elm$core$Dict$removeMin(left),
					right);
			} else {
				var _v4 = $elm$core$Dict$moveRedLeft(dict);
				if (_v4.$ === -1) {
					var nColor = _v4.a;
					var nKey = _v4.b;
					var nValue = _v4.c;
					var nLeft = _v4.d;
					var nRight = _v4.e;
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						$elm$core$Dict$removeMin(nLeft),
						nRight);
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			}
		} else {
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				value,
				$elm$core$Dict$removeMin(left),
				right);
		}
	} else {
		return $elm$core$Dict$RBEmpty_elm_builtin;
	}
};
var $elm$core$Dict$removeHelp = F2(
	function (targetKey, dict) {
		if (dict.$ === -2) {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_cmp(targetKey, key) < 0) {
				if ((left.$ === -1) && (left.a === 1)) {
					var _v4 = left.a;
					var lLeft = left.d;
					if ((lLeft.$ === -1) && (!lLeft.a)) {
						var _v6 = lLeft.a;
						return A5(
							$elm$core$Dict$RBNode_elm_builtin,
							color,
							key,
							value,
							A2($elm$core$Dict$removeHelp, targetKey, left),
							right);
					} else {
						var _v7 = $elm$core$Dict$moveRedLeft(dict);
						if (_v7.$ === -1) {
							var nColor = _v7.a;
							var nKey = _v7.b;
							var nValue = _v7.c;
							var nLeft = _v7.d;
							var nRight = _v7.e;
							return A5(
								$elm$core$Dict$balance,
								nColor,
								nKey,
								nValue,
								A2($elm$core$Dict$removeHelp, targetKey, nLeft),
								nRight);
						} else {
							return $elm$core$Dict$RBEmpty_elm_builtin;
						}
					}
				} else {
					return A5(
						$elm$core$Dict$RBNode_elm_builtin,
						color,
						key,
						value,
						A2($elm$core$Dict$removeHelp, targetKey, left),
						right);
				}
			} else {
				return A2(
					$elm$core$Dict$removeHelpEQGT,
					targetKey,
					A7($elm$core$Dict$removeHelpPrepEQGT, targetKey, dict, color, key, value, left, right));
			}
		}
	});
var $elm$core$Dict$removeHelpEQGT = F2(
	function (targetKey, dict) {
		if (dict.$ === -1) {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_eq(targetKey, key)) {
				var _v1 = $elm$core$Dict$getMin(right);
				if (_v1.$ === -1) {
					var minKey = _v1.b;
					var minValue = _v1.c;
					return A5(
						$elm$core$Dict$balance,
						color,
						minKey,
						minValue,
						left,
						$elm$core$Dict$removeMin(right));
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			} else {
				return A5(
					$elm$core$Dict$balance,
					color,
					key,
					value,
					left,
					A2($elm$core$Dict$removeHelp, targetKey, right));
			}
		} else {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		}
	});
var $elm$core$Dict$remove = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$removeHelp, key, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$update = F3(
	function (targetKey, alter, dictionary) {
		var _v0 = alter(
			A2($elm$core$Dict$get, targetKey, dictionary));
		if (!_v0.$) {
			var value = _v0.a;
			return A3($elm$core$Dict$insert, targetKey, value, dictionary);
		} else {
			return A2($elm$core$Dict$remove, targetKey, dictionary);
		}
	});
var $author$project$Demo$Checkbox$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 0:
				var index = msg.a;
				var checkboxes = A3(
					$elm$core$Dict$update,
					index,
					function (state) {
						return _Utils_eq(
							state,
							$elm$core$Maybe$Just($author$project$Material$Checkbox$checked)) ? $elm$core$Maybe$Just($author$project$Material$Checkbox$unchecked) : $elm$core$Maybe$Just($author$project$Material$Checkbox$checked);
					},
					model.Y);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{Y: checkboxes}),
					$elm$core$Platform$Cmd$none);
			case 1:
				var id = msg.a;
				return _Utils_Tuple2(
					model,
					A2(
						$elm$core$Task$attempt,
						$author$project$Demo$Checkbox$Focused,
						$elm$browser$Browser$Dom$focus(id)));
			default:
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Demo$Chips$Focused = function (a) {
	return {$: 9, a: a};
};
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $elm$core$Set$insert = F2(
	function (key, _v0) {
		var dict = _v0;
		return A3($elm$core$Dict$insert, key, 0, dict);
	});
var $elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var $elm$core$List$member = F2(
	function (x, xs) {
		return A2(
			$elm$core$List$any,
			function (a) {
				return _Utils_eq(a, x);
			},
			xs);
	});
var $elm$core$Dict$member = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$get, key, dict);
		if (!_v0.$) {
			return true;
		} else {
			return false;
		}
	});
var $elm$core$Set$member = F2(
	function (key, _v0) {
		var dict = _v0;
		return A2($elm$core$Dict$member, key, dict);
	});
var $elm$core$Basics$not = _Basics_not;
var $elm$core$Set$remove = F2(
	function (key, _v0) {
		var dict = _v0;
		return A2($elm$core$Dict$remove, key, dict);
	});
var $elm$core$List$takeReverse = F3(
	function (n, list, kept) {
		takeReverse:
		while (true) {
			if (n <= 0) {
				return kept;
			} else {
				if (!list.b) {
					return kept;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs,
						$temp$kept = A2($elm$core$List$cons, x, kept);
					n = $temp$n;
					list = $temp$list;
					kept = $temp$kept;
					continue takeReverse;
				}
			}
		}
	});
var $elm$core$List$takeTailRec = F2(
	function (n, list) {
		return $elm$core$List$reverse(
			A3($elm$core$List$takeReverse, n, list, _List_Nil));
	});
var $elm$core$List$takeFast = F3(
	function (ctr, n, list) {
		if (n <= 0) {
			return _List_Nil;
		} else {
			var _v0 = _Utils_Tuple2(n, list);
			_v0$1:
			while (true) {
				_v0$5:
				while (true) {
					if (!_v0.b.b) {
						return list;
					} else {
						if (_v0.b.b.b) {
							switch (_v0.a) {
								case 1:
									break _v0$1;
								case 2:
									var _v2 = _v0.b;
									var x = _v2.a;
									var _v3 = _v2.b;
									var y = _v3.a;
									return _List_fromArray(
										[x, y]);
								case 3:
									if (_v0.b.b.b.b) {
										var _v4 = _v0.b;
										var x = _v4.a;
										var _v5 = _v4.b;
										var y = _v5.a;
										var _v6 = _v5.b;
										var z = _v6.a;
										return _List_fromArray(
											[x, y, z]);
									} else {
										break _v0$5;
									}
								default:
									if (_v0.b.b.b.b && _v0.b.b.b.b.b) {
										var _v7 = _v0.b;
										var x = _v7.a;
										var _v8 = _v7.b;
										var y = _v8.a;
										var _v9 = _v8.b;
										var z = _v9.a;
										var _v10 = _v9.b;
										var w = _v10.a;
										var tl = _v10.b;
										return (ctr > 1000) ? A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A2($elm$core$List$takeTailRec, n - 4, tl))))) : A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A3($elm$core$List$takeFast, ctr + 1, n - 4, tl)))));
									} else {
										break _v0$5;
									}
							}
						} else {
							if (_v0.a === 1) {
								break _v0$1;
							} else {
								break _v0$5;
							}
						}
					}
				}
				return list;
			}
			var _v1 = _v0.b;
			var x = _v1.a;
			return _List_fromArray(
				[x]);
		}
	});
var $elm$core$List$take = F2(
	function (n, list) {
		return A3($elm$core$List$takeFast, 0, n, list);
	});
var $elm$core$String$trim = _String_trim;
var $author$project$Demo$Chips$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 0:
				var chip = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							aY: $elm$core$Maybe$Just(chip)
						}),
					$elm$core$Platform$Cmd$none);
			case 1:
				var size = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bk: size}),
					$elm$core$Platform$Cmd$none);
			case 4:
				var newInput = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{A: newInput}),
					$elm$core$Platform$Cmd$none);
			case 2:
				var accessory = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							I: (A2($elm$core$Set$member, accessory, model.I) ? $elm$core$Set$remove(accessory) : $elm$core$Set$insert(accessory))(model.I)
						}),
					$elm$core$Platform$Cmd$none);
			case 3:
				var contact = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							J: (A2($elm$core$Set$member, contact, model.J) ? $elm$core$Set$remove(contact) : $elm$core$Set$insert(contact))(model.J)
						}),
					$elm$core$Platform$Cmd$none);
			case 5:
				var inputChip = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							k: A2(
								$elm$core$List$filter,
								$elm$core$Basics$neq(inputChip),
								model.k)
						}),
					$elm$core$Platform$Cmd$none);
			case 6:
				var keyCode = msg.a;
				var trimmedInput = $elm$core$String$trim(model.A);
				var enter = 13;
				var backspace = 8;
				return (_Utils_eq(keyCode, enter) && (!$elm$core$String$isEmpty(trimmedInput))) ? _Utils_Tuple2(
					_Utils_update(
						model,
						{
							A: '',
							k: (!A2($elm$core$List$member, trimmedInput, model.k)) ? _Utils_ap(
								model.k,
								_List_fromArray(
									[trimmedInput])) : model.k
						}),
					$elm$core$Platform$Cmd$none) : ((_Utils_eq(keyCode, backspace) && $elm$core$String$isEmpty(model.A)) ? _Utils_Tuple2(
					_Utils_update(
						model,
						{
							k: A2(
								$elm$core$List$take,
								$elm$core$List$length(model.k) - 1,
								model.k)
						}),
					$elm$core$Platform$Cmd$none) : _Utils_Tuple2(model, $elm$core$Platform$Cmd$none));
			case 7:
				var focus = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{a$: focus}),
					$elm$core$Platform$Cmd$none);
			case 8:
				var id = msg.a;
				return _Utils_Tuple2(
					model,
					A2(
						$elm$core$Task$attempt,
						$author$project$Demo$Chips$Focused,
						$elm$browser$Browser$Dom$focus(id)));
			default:
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Demo$CircularProgress$update = F2(
	function (msg, model) {
		return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
	});
var $elm$core$Set$fromList = function (list) {
	return A3($elm$core$List$foldl, $elm$core$Set$insert, $elm$core$Set$empty, list);
};
var $author$project$Demo$DataTable$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 0:
				return model;
			case 1:
				var key = msg.a;
				return _Utils_update(
					model,
					{
						i: A2($elm$core$Set$member, key, model.i) ? A2($elm$core$Set$remove, key, model.i) : A2($elm$core$Set$insert, key, model.i)
					});
			case 2:
				return _Utils_update(
					model,
					{
						i: $elm$core$Set$fromList(
							_List_fromArray(
								['Frozen yogurt', 'Ice cream sandwich', 'Eclair']))
					});
			default:
				return _Utils_update(
					model,
					{i: $elm$core$Set$empty});
		}
	});
var $author$project$Demo$DenseTopAppBar$update = F2(
	function (msg, model) {
		return model;
	});
var $author$project$Demo$Dialog$update = F2(
	function (msg, model) {
		if (!msg.$) {
			return _Utils_update(
				model,
				{u: $elm$core$Maybe$Nothing});
		} else {
			var id = msg.a;
			return _Utils_update(
				model,
				{
					u: $elm$core$Maybe$Just(id)
				});
		}
	});
var $author$project$Demo$DismissibleDrawer$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 0:
				return _Utils_update(
					model,
					{u: !model.u});
			case 1:
				return _Utils_update(
					model,
					{u: false});
			default:
				var index = msg.a;
				return _Utils_update(
					model,
					{bi: index});
		}
	});
var $author$project$Demo$Drawer$update = F2(
	function (msg, model) {
		return model;
	});
var $author$project$Demo$Elevation$update = F2(
	function (msg, model) {
		return model;
	});
var $author$project$Demo$Fabs$Focused = function (a) {
	return {$: 1, a: a};
};
var $author$project$Demo$Fabs$update = F2(
	function (msg, model) {
		if (!msg.$) {
			var id = msg.a;
			return _Utils_Tuple2(
				model,
				A2(
					$elm$core$Task$attempt,
					$author$project$Demo$Fabs$Focused,
					$elm$browser$Browser$Dom$focus(id)));
		} else {
			return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Demo$FixedTopAppBar$update = F2(
	function (msg, model) {
		return model;
	});
var $author$project$Demo$IconButton$Focused = function (a) {
	return {$: 2, a: a};
};
var $author$project$Demo$IconButton$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 0:
				var id = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							l: A2($elm$core$Set$member, id, model.l) ? A2($elm$core$Set$remove, id, model.l) : A2($elm$core$Set$insert, id, model.l)
						}),
					$elm$core$Platform$Cmd$none);
			case 1:
				var id = msg.a;
				return _Utils_Tuple2(
					model,
					A2(
						$elm$core$Task$attempt,
						$author$project$Demo$IconButton$Focused,
						$elm$browser$Browser$Dom$focus(id)));
			default:
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Demo$ImageList$update = F2(
	function (msg, model) {
		return model;
	});
var $author$project$Demo$LayoutGrid$update = F2(
	function (msg, model) {
		return model;
	});
var $author$project$Demo$LinearProgress$update = F2(
	function (msg, model) {
		return model;
	});
var $author$project$Demo$Lists$Focused = function (a) {
	return {$: 5, a: a};
};
var $author$project$Demo$Lists$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 0:
				var id = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							Y: A2($elm$core$Set$member, id, model.Y) ? A2($elm$core$Set$remove, id, model.Y) : A2($elm$core$Set$insert, id, model.Y)
						}),
					$elm$core$Platform$Cmd$none);
			case 1:
				var id = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							ax: $elm$core$Maybe$Just(id)
						}),
					$elm$core$Platform$Cmd$none);
			case 2:
				var id = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aR: id}),
					$elm$core$Platform$Cmd$none);
			case 3:
				var id = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bj: id}),
					$elm$core$Platform$Cmd$none);
			case 4:
				var id = msg.a;
				return _Utils_Tuple2(
					model,
					A2(
						$elm$core$Task$attempt,
						$author$project$Demo$Lists$Focused,
						$elm$browser$Browser$Dom$focus(id)));
			default:
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Demo$Menus$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 0:
				return _Utils_update(
					model,
					{au: true});
			case 1:
				return _Utils_update(
					model,
					{au: false});
			case 2:
				var open2 = msg.a;
				return _Utils_update(
					model,
					{bd: open2});
			default:
				var open3 = msg.a;
				return _Utils_update(
					model,
					{be: open3});
		}
	});
var $author$project$Demo$ModalDrawer$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 0:
				return _Utils_update(
					model,
					{u: true});
			case 1:
				return _Utils_update(
					model,
					{u: false});
			default:
				var index = msg.a;
				return _Utils_update(
					model,
					{bi: index});
		}
	});
var $author$project$Demo$PermanentDrawer$update = F2(
	function (msg, model) {
		var index = msg;
		return _Utils_update(
			model,
			{bi: index});
	});
var $author$project$Demo$ProminentTopAppBar$update = F2(
	function (msg, model) {
		return model;
	});
var $author$project$Demo$RadioButtons$Focused = function (a) {
	return {$: 2, a: a};
};
var $author$project$Demo$RadioButtons$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 0:
				var group = msg.a;
				var index = msg.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							ay: A3($elm$core$Dict$insert, group, index, model.ay)
						}),
					$elm$core$Platform$Cmd$none);
			case 1:
				var id = msg.a;
				return _Utils_Tuple2(
					model,
					A2(
						$elm$core$Task$attempt,
						$author$project$Demo$RadioButtons$Focused,
						$elm$browser$Browser$Dom$focus(id)));
			default:
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Demo$Ripple$update = F2(
	function (msg, model) {
		return model;
	});
var $author$project$Demo$Selects$Focused = function (a) {
	return {$: 7, a: a};
};
var $author$project$Demo$Selects$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 0:
				var hero = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{cZ: hero}),
					$elm$core$Platform$Cmd$none);
			case 1:
				var filled = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aZ: filled}),
					$elm$core$Platform$Cmd$none);
			case 2:
				var outlined = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bf: outlined}),
					$elm$core$Platform$Cmd$none);
			case 3:
				var filledWithIcon = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{a_: filledWithIcon}),
					$elm$core$Platform$Cmd$none);
			case 4:
				var outlinedWithIcon = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bg: outlinedWithIcon}),
					$elm$core$Platform$Cmd$none);
			case 5:
				var focused = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{a0: focused}),
					$elm$core$Platform$Cmd$none);
			case 6:
				var id = msg.a;
				return _Utils_Tuple2(
					model,
					A2(
						$elm$core$Task$attempt,
						$author$project$Demo$Selects$Focused,
						$elm$browser$Browser$Dom$focus(id)));
			case 7:
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			default:
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Demo$ShortCollapsedTopAppBar$update = F2(
	function (msg, model) {
		return model;
	});
var $author$project$Demo$ShortTopAppBar$update = F2(
	function (msg, model) {
		return model;
	});
var $author$project$Demo$Slider$Focused = function (a) {
	return {$: 2, a: a};
};
var $author$project$Demo$Slider$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 0:
				var id = msg.a;
				var value = msg.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							p: A3($elm$core$Dict$insert, id, value, model.p)
						}),
					$elm$core$Platform$Cmd$none);
			case 1:
				var id = msg.a;
				return _Utils_Tuple2(
					model,
					A2(
						$elm$core$Task$attempt,
						$author$project$Demo$Slider$Focused,
						$elm$browser$Browser$Dom$focus(id)));
			default:
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Material$Snackbar$inc = function (_v0) {
	var messageId = _v0;
	return messageId + 1;
};
var $author$project$Material$Snackbar$addMessage = F2(
	function (message_, _v0) {
		var queue = _v0;
		return _Utils_update(
			queue,
			{
				B: _Utils_ap(
					queue.B,
					_List_fromArray(
						[
							_Utils_Tuple2(queue.at, message_)
						])),
				at: $author$project$Material$Snackbar$inc(queue.at)
			});
	});
var $author$project$Demo$Snackbar$Click = function (a) {
	return {$: 4, a: a};
};
var $elm$json$Json$Encode$string = _Json_wrap;
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$class = $elm$html$Html$Attributes$stringProperty('className');
var $author$project$Material$Snackbar$Icon = function (a) {
	return {$: 0, a: a};
};
var $author$project$Material$Snackbar$customIcon = F3(
	function (node, attributes, nodes) {
		return $author$project$Material$Snackbar$Icon(
			{aW: attributes, a7: node, a8: nodes});
	});
var $elm$html$Html$i = _VirtualDom_node('i');
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $author$project$Material$Snackbar$icon = function (iconName) {
	return A3(
		$author$project$Material$Snackbar$customIcon,
		$elm$html$Html$i,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('material-icons')
			]),
		_List_fromArray(
			[
				$elm$html$Html$text(iconName)
			]));
};
var $author$project$Material$Snackbar$Message = $elm$core$Basics$identity;
var $author$project$Material$Snackbar$message = function (label) {
	return {
		bp: $elm$core$Maybe$Nothing,
		bq: $elm$core$Maybe$Nothing,
		b: label,
		bK: false,
		bR: $elm$core$Maybe$Nothing,
		bS: $elm$core$Maybe$Nothing,
		b3: false,
		b9: $elm$core$Maybe$Just(5000)
	};
};
var $author$project$Material$Snackbar$setActionButton = F2(
	function (actionButton, _v0) {
		var message_ = _v0;
		return _Utils_update(
			message_,
			{bp: actionButton});
	});
var $author$project$Material$Snackbar$setActionIcon = F2(
	function (actionIcon, _v0) {
		var message_ = _v0;
		return _Utils_update(
			message_,
			{bq: actionIcon});
	});
var $author$project$Material$Snackbar$setOnActionButtonClick = F2(
	function (onActionButtonClick, _v0) {
		var message_ = _v0;
		return _Utils_update(
			message_,
			{
				bR: $elm$core$Maybe$Just(onActionButtonClick)
			});
	});
var $author$project$Demo$Snackbar$baselineMessage = A2(
	$author$project$Material$Snackbar$setActionIcon,
	$elm$core$Maybe$Just(
		$author$project$Material$Snackbar$icon('close')),
	A2(
		$author$project$Material$Snackbar$setOnActionButtonClick,
		$author$project$Demo$Snackbar$Click,
		A2(
			$author$project$Material$Snackbar$setActionButton,
			$elm$core$Maybe$Just('Retry'),
			$author$project$Material$Snackbar$message('Can\'t send photo. Retry in 5 seconds.'))));
var $author$project$Material$Snackbar$close = F2(
	function (messageId, _v0) {
		var queue = _v0;
		return _Utils_update(
			queue,
			{
				B: function () {
					var _v1 = queue.B;
					if (!_v1.b) {
						return _List_Nil;
					} else {
						var _v2 = _v1.a;
						var currentMessageId = _v2.a;
						var otherMessages = _v1.b;
						return _Utils_eq(currentMessageId, messageId) ? otherMessages : queue.B;
					}
				}()
			});
	});
var $author$project$Material$Snackbar$setLeading = F2(
	function (leading, _v0) {
		var message_ = _v0;
		return _Utils_update(
			message_,
			{bK: leading});
	});
var $author$project$Demo$Snackbar$leadingMessage = A2(
	$author$project$Material$Snackbar$setActionIcon,
	$elm$core$Maybe$Just(
		$author$project$Material$Snackbar$icon('close')),
	A2(
		$author$project$Material$Snackbar$setOnActionButtonClick,
		$author$project$Demo$Snackbar$Click,
		A2(
			$author$project$Material$Snackbar$setActionButton,
			$elm$core$Maybe$Just('Undo'),
			A2(
				$author$project$Material$Snackbar$setLeading,
				true,
				$author$project$Material$Snackbar$message('Your photo has been archived.')))));
var $author$project$Material$Snackbar$setStacked = F2(
	function (stacked, _v0) {
		var message_ = _v0;
		return _Utils_update(
			message_,
			{b3: stacked});
	});
var $author$project$Demo$Snackbar$stackedMessage = A2(
	$author$project$Material$Snackbar$setActionIcon,
	$elm$core$Maybe$Just(
		$author$project$Material$Snackbar$icon('close')),
	A2(
		$author$project$Material$Snackbar$setOnActionButtonClick,
		$author$project$Demo$Snackbar$Click,
		A2(
			$author$project$Material$Snackbar$setActionButton,
			$elm$core$Maybe$Just('Add a new label'),
			A2(
				$author$project$Material$Snackbar$setStacked,
				true,
				$author$project$Material$Snackbar$message('This item already has the label \"travel\". You can add a new label.')))));
var $author$project$Demo$Snackbar$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 0:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							m: A2($author$project$Material$Snackbar$addMessage, $author$project$Demo$Snackbar$baselineMessage, model.m)
						}),
					$elm$core$Platform$Cmd$none);
			case 1:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							m: A2($author$project$Material$Snackbar$addMessage, $author$project$Demo$Snackbar$leadingMessage, model.m)
						}),
					$elm$core$Platform$Cmd$none);
			case 2:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							m: A2($author$project$Material$Snackbar$addMessage, $author$project$Demo$Snackbar$stackedMessage, model.m)
						}),
					$elm$core$Platform$Cmd$none);
			case 3:
				var messageId = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							m: A2($author$project$Material$Snackbar$close, messageId, model.m)
						}),
					$elm$core$Platform$Cmd$none);
			default:
				var messageId = msg.a;
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Demo$StandardTopAppBar$update = F2(
	function (msg, model) {
		return model;
	});
var $author$project$Demo$Switch$Focused = function (a) {
	return {$: 2, a: a};
};
var $author$project$Demo$Switch$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 0:
				var id = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							aH: A3(
								$elm$core$Dict$update,
								id,
								function (state) {
									return $elm$core$Maybe$Just(
										!A2($elm$core$Maybe$withDefault, false, state));
								},
								model.aH)
						}),
					$elm$core$Platform$Cmd$none);
			case 1:
				var id = msg.a;
				return _Utils_Tuple2(
					model,
					A2(
						$elm$core$Task$attempt,
						$author$project$Demo$Switch$Focused,
						$elm$browser$Browser$Dom$focus(id)));
			default:
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Demo$TabBar$Focused = function (a) {
	return {$: 6, a: a};
};
var $author$project$Demo$TabBar$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 0:
				var index = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{o: index}),
					$elm$core$Platform$Cmd$none);
			case 1:
				var index = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aT: index}),
					$elm$core$Platform$Cmd$none);
			case 2:
				var index = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aV: index}),
					$elm$core$Platform$Cmd$none);
			case 3:
				var index = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aU: index}),
					$elm$core$Platform$Cmd$none);
			case 4:
				var index = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aS: index}),
					$elm$core$Platform$Cmd$none);
			case 5:
				var id = msg.a;
				return _Utils_Tuple2(
					model,
					A2(
						$elm$core$Task$attempt,
						$author$project$Demo$TabBar$Focused,
						$elm$browser$Browser$Dom$focus(id)));
			default:
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Demo$TextFields$Focused = function (a) {
	return {$: 2, a: a};
};
var $author$project$Demo$TextFields$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 0:
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			case 1:
				var id = msg.a;
				return _Utils_Tuple2(
					model,
					A2(
						$elm$core$Task$attempt,
						$author$project$Demo$TextFields$Focused,
						$elm$browser$Browser$Dom$focus(id)));
			default:
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Demo$Theme$update = F2(
	function (msg, model) {
		return model;
	});
var $author$project$Demo$TopAppBar$update = F2(
	function (msg, model) {
		return model;
	});
var $author$project$Demo$Typography$update = F2(
	function (msg, model) {
		return model;
	});
var $author$project$Main$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 0:
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			case 2:
				if (!msg.a.$) {
					var url = msg.a.a;
					return _Utils_Tuple2(
						model,
						$elm$browser$Browser$Navigation$load(
							$author$project$Demo$Url$toString(
								$author$project$Demo$Url$fromUrl(url))));
				} else {
					var string = msg.a.a;
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 1:
				var url = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							x: (!_Utils_eq(
								$author$project$Demo$Url$fromUrl(url),
								$author$project$Demo$Url$StartPage)) ? model.x : false,
							a: $author$project$Demo$Url$fromUrl(url)
						}),
					(!_Utils_eq(
						$author$project$Demo$Url$fromUrl(url),
						model.a)) ? A2(
						$elm$core$Task$attempt,
						function (_v1) {
							return $author$project$Main$NoOp;
						},
						A3($elm$browser$Browser$Dom$setViewportOf, 'demo-content', 0, 0)) : $elm$core$Platform$Cmd$none);
			case 3:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{x: true}),
					$elm$core$Platform$Cmd$none);
			case 4:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{x: false}),
					$elm$core$Platform$Cmd$none);
			case 5:
				var msg_ = msg.a;
				return A2(
					$elm$core$Tuple$mapSecond,
					$elm$core$Platform$Cmd$map($author$project$Main$ButtonsMsg),
					A2(
						$elm$core$Tuple$mapFirst,
						function (buttons) {
							return _Utils_update(
								model,
								{cQ: buttons});
						},
						A2($author$project$Demo$Buttons$update, msg_, model.cQ)));
			case 6:
				var msg_ = msg.a;
				return A2(
					$elm$core$Tuple$mapSecond,
					$elm$core$Platform$Cmd$map($author$project$Main$CardsMsg),
					A2(
						$elm$core$Tuple$mapFirst,
						function (cards) {
							return _Utils_update(
								model,
								{W: cards});
						},
						A2($author$project$Demo$Cards$update, msg_, model.W)));
			case 7:
				var msg_ = msg.a;
				return A2(
					$elm$core$Tuple$mapSecond,
					$elm$core$Platform$Cmd$map($author$project$Main$CheckboxMsg),
					A2(
						$elm$core$Tuple$mapFirst,
						function (checkbox) {
							return _Utils_update(
								model,
								{X: checkbox});
						},
						A2($author$project$Demo$Checkbox$update, msg_, model.X)));
			case 8:
				var msg_ = msg.a;
				return A2(
					$elm$core$Tuple$mapSecond,
					$elm$core$Platform$Cmd$map($author$project$Main$ChipsMsg),
					A2(
						$elm$core$Tuple$mapFirst,
						function (chips) {
							return _Utils_update(
								model,
								{Z: chips});
						},
						A2($author$project$Demo$Chips$update, msg_, model.Z)));
			case 9:
				var msg_ = msg.a;
				return A2(
					$elm$core$Tuple$mapSecond,
					$elm$core$Platform$Cmd$map($author$project$Main$CircularProgressMsg),
					A2(
						$elm$core$Tuple$mapFirst,
						function (circularProgress) {
							return _Utils_update(
								model,
								{_: circularProgress});
						},
						A2($author$project$Demo$CircularProgress$update, msg_, model._)));
			case 10:
				var msg_ = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							ac: A2($author$project$Demo$Dialog$update, msg_, model.ac)
						}),
					$elm$core$Platform$Cmd$none);
			case 13:
				var msg_ = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							ag: A2($author$project$Demo$Elevation$update, msg_, model.ag)
						}),
					$elm$core$Platform$Cmd$none);
			case 12:
				var msg_ = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							cU: A2($author$project$Demo$Drawer$update, msg_, model.cU)
						}),
					$elm$core$Platform$Cmd$none);
			case 11:
				var msg_ = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							af: A2($author$project$Demo$DismissibleDrawer$update, msg_, model.af)
						}),
					$elm$core$Platform$Cmd$none);
			case 21:
				var msg_ = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							as: A2($author$project$Demo$ModalDrawer$update, msg_, model.as)
						}),
					$elm$core$Platform$Cmd$none);
			case 22:
				var msg_ = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							av: A2($author$project$Demo$PermanentDrawer$update, msg_, model.av)
						}),
					$elm$core$Platform$Cmd$none);
			case 14:
				var msg_ = msg.a;
				return A2(
					$elm$core$Tuple$mapSecond,
					$elm$core$Platform$Cmd$map($author$project$Main$FabsMsg),
					A2(
						$elm$core$Tuple$mapFirst,
						function (fabs) {
							return _Utils_update(
								model,
								{ah: fabs});
						},
						A2($author$project$Demo$Fabs$update, msg_, model.ah)));
			case 15:
				var msg_ = msg.a;
				return A2(
					$elm$core$Tuple$mapSecond,
					$elm$core$Platform$Cmd$map($author$project$Main$IconButtonMsg),
					A2(
						$elm$core$Tuple$mapFirst,
						function (iconButton) {
							return _Utils_update(
								model,
								{al: iconButton});
						},
						A2($author$project$Demo$IconButton$update, msg_, model.al)));
			case 16:
				var msg_ = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							am: A2($author$project$Demo$ImageList$update, msg_, model.am)
						}),
					$elm$core$Platform$Cmd$none);
			case 20:
				var msg_ = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							ar: A2($author$project$Demo$Menus$update, msg_, model.ar)
						}),
					$elm$core$Platform$Cmd$none);
			case 23:
				var msg_ = msg.a;
				return A2(
					$elm$core$Tuple$mapSecond,
					$elm$core$Platform$Cmd$map($author$project$Main$RadioButtonsMsg),
					A2(
						$elm$core$Tuple$mapFirst,
						function (radio) {
							return _Utils_update(
								model,
								{ax: radio});
						},
						A2($author$project$Demo$RadioButtons$update, msg_, model.ax)));
			case 24:
				var msg_ = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							az: A2($author$project$Demo$Ripple$update, msg_, model.az)
						}),
					$elm$core$Platform$Cmd$none);
			case 25:
				var msg_ = msg.a;
				return A2(
					$elm$core$Tuple$mapSecond,
					$elm$core$Platform$Cmd$map($author$project$Main$SelectMsg),
					A2(
						$elm$core$Tuple$mapFirst,
						function (selects) {
							return _Utils_update(
								model,
								{aA: selects});
						},
						A2($author$project$Demo$Selects$update, msg_, model.aA)));
			case 26:
				var msg_ = msg.a;
				return A2(
					$elm$core$Tuple$mapSecond,
					$elm$core$Platform$Cmd$map($author$project$Main$SliderMsg),
					A2(
						$elm$core$Tuple$mapFirst,
						function (slider) {
							return _Utils_update(
								model,
								{aD: slider});
						},
						A2($author$project$Demo$Slider$update, msg_, model.aD)));
			case 27:
				var msg_ = msg.a;
				return A2(
					$elm$core$Tuple$mapSecond,
					$elm$core$Platform$Cmd$map($author$project$Main$SnackbarMsg),
					A2(
						$elm$core$Tuple$mapFirst,
						function (snackbar) {
							return _Utils_update(
								model,
								{aE: snackbar});
						},
						A2($author$project$Demo$Snackbar$update, msg_, model.aE)));
			case 29:
				var msg_ = msg.a;
				return A2(
					$elm$core$Tuple$mapSecond,
					$elm$core$Platform$Cmd$map($author$project$Main$SwitchMsg),
					A2(
						$elm$core$Tuple$mapFirst,
						function (_switch) {
							return _Utils_update(
								model,
								{aG: _switch});
						},
						A2($author$project$Demo$Switch$update, msg_, model.aG)));
			case 31:
				var msg_ = msg.a;
				return A2(
					$elm$core$Tuple$mapSecond,
					$elm$core$Platform$Cmd$map($author$project$Main$TextFieldMsg),
					A2(
						$elm$core$Tuple$mapFirst,
						function (textfields) {
							return _Utils_update(
								model,
								{aK: textfields});
						},
						A2($author$project$Demo$TextFields$update, msg_, model.aK)));
			case 30:
				var msg_ = msg.a;
				return A2(
					$elm$core$Tuple$mapSecond,
					$elm$core$Platform$Cmd$map($author$project$Main$TabBarMsg),
					A2(
						$elm$core$Tuple$mapFirst,
						function (tabbar) {
							return _Utils_update(
								model,
								{aI: tabbar});
						},
						A2($author$project$Demo$TabBar$update, msg_, model.aI)));
			case 17:
				var msg_ = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							an: A2($author$project$Demo$LayoutGrid$update, msg_, model.an)
						}),
					$elm$core$Platform$Cmd$none);
			case 19:
				var msg_ = msg.a;
				return A2(
					$elm$core$Tuple$mapSecond,
					$elm$core$Platform$Cmd$map($author$project$Main$ListsMsg),
					A2(
						$elm$core$Tuple$mapFirst,
						function (lists) {
							return _Utils_update(
								model,
								{aq: lists});
						},
						A2($author$project$Demo$Lists$update, msg_, model.aq)));
			case 32:
				var msg_ = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							aL: A2($author$project$Demo$Theme$update, msg_, model.aL)
						}),
					$elm$core$Platform$Cmd$none);
			case 33:
				var msg_ = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							di: A2($author$project$Demo$TopAppBar$update, msg_, model.di)
						}),
					$elm$core$Platform$Cmd$none);
			case 18:
				var msg_ = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							ap: A2($author$project$Demo$LinearProgress$update, msg_, model.ap)
						}),
					$elm$core$Platform$Cmd$none);
			case 34:
				var msg_ = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							aP: A2($author$project$Demo$Typography$update, msg_, model.aP)
						}),
					$elm$core$Platform$Cmd$none);
			case 40:
				var msg_ = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							aa: A2($author$project$Demo$DataTable$update, msg_, model.aa)
						}),
					$elm$core$Platform$Cmd$none);
			case 28:
				var msg_ = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							aF: A2($author$project$Demo$StandardTopAppBar$update, msg_, model.aF)
						}),
					$elm$core$Platform$Cmd$none);
			case 39:
				var msg_ = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							ai: A2($author$project$Demo$FixedTopAppBar$update, msg_, model.ai)
						}),
					$elm$core$Platform$Cmd$none);
			case 36:
				var msg_ = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							ab: A2($author$project$Demo$DenseTopAppBar$update, msg_, model.ab)
						}),
					$elm$core$Platform$Cmd$none);
			case 38:
				var msg_ = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							aw: A2($author$project$Demo$ProminentTopAppBar$update, msg_, model.aw)
						}),
					$elm$core$Platform$Cmd$none);
			case 35:
				var msg_ = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							aB: A2($author$project$Demo$ShortCollapsedTopAppBar$update, msg_, model.aB)
						}),
					$elm$core$Platform$Cmd$none);
			default:
				var msg_ = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							aC: A2($author$project$Demo$ShortTopAppBar$update, msg_, model.aC)
						}),
					$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Main$CloseCatalogDrawer = {$: 4};
var $author$project$Main$DataTableMsg = function (a) {
	return {$: 40, a: a};
};
var $author$project$Main$DenseTopAppBarMsg = function (a) {
	return {$: 36, a: a};
};
var $author$project$Main$DialogMsg = function (a) {
	return {$: 10, a: a};
};
var $author$project$Main$DismissibleDrawerMsg = function (a) {
	return {$: 11, a: a};
};
var $author$project$Main$DrawerMsg = function (a) {
	return {$: 12, a: a};
};
var $author$project$Main$ElevationMsg = function (a) {
	return {$: 13, a: a};
};
var $author$project$Main$FixedTopAppBarMsg = function (a) {
	return {$: 39, a: a};
};
var $author$project$Main$ImageListMsg = function (a) {
	return {$: 16, a: a};
};
var $author$project$Main$LayoutGridMsg = function (a) {
	return {$: 17, a: a};
};
var $author$project$Main$LinearProgressMsg = function (a) {
	return {$: 18, a: a};
};
var $author$project$Main$MenuMsg = function (a) {
	return {$: 20, a: a};
};
var $author$project$Main$ModalDrawerMsg = function (a) {
	return {$: 21, a: a};
};
var $author$project$Main$OpenCatalogDrawer = {$: 3};
var $author$project$Main$PermanentDrawerMsg = function (a) {
	return {$: 22, a: a};
};
var $author$project$Main$ProminentTopAppBarMsg = function (a) {
	return {$: 38, a: a};
};
var $author$project$Main$RippleMsg = function (a) {
	return {$: 24, a: a};
};
var $author$project$Main$ShortCollapsedTopAppBarMsg = function (a) {
	return {$: 35, a: a};
};
var $author$project$Main$ShortTopAppBarMsg = function (a) {
	return {$: 37, a: a};
};
var $author$project$Main$StandardTopAppBarMsg = function (a) {
	return {$: 28, a: a};
};
var $author$project$Main$ThemeMsg = function (a) {
	return {$: 32, a: a};
};
var $author$project$Main$TopAppBarMsg = function (a) {
	return {$: 33, a: a};
};
var $author$project$Main$TypographyMsg = function (a) {
	return {$: 34, a: a};
};
var $elm$html$Html$div = _VirtualDom_node('div');
var $elm$html$Html$h1 = _VirtualDom_node('h1');
var $author$project$Material$Typography$headline1 = $elm$html$Html$Attributes$class('mdc-typography--headline1');
var $author$project$Material$Button$Internal$Config = $elm$core$Basics$identity;
var $author$project$Material$Button$config = {br: _List_Nil, bA: false, ad: false, ak: $elm$core$Maybe$Nothing, c: $elm$core$Maybe$Nothing, bL: $elm$core$Maybe$Nothing, bc: $elm$core$Maybe$Nothing, b8: $elm$core$Maybe$Nothing, aN: true, bl: false};
var $author$project$Material$Button$Internal$Icon = function (a) {
	return {$: 0, a: a};
};
var $author$project$Material$Button$customIcon = F3(
	function (node, attributes, nodes) {
		return $author$project$Material$Button$Internal$Icon(
			{aW: attributes, a7: node, a8: nodes});
	});
var $elm$svg$Svg$Attributes$fill = _VirtualDom_attribute('fill');
var $elm$svg$Svg$Attributes$points = _VirtualDom_attribute('points');
var $elm$svg$Svg$trustedNode = _VirtualDom_nodeNS('http://www.w3.org/2000/svg');
var $elm$svg$Svg$polygon = $elm$svg$Svg$trustedNode('polygon');
var $author$project$Demo$ElmLogo$elmLogo = _List_fromArray(
	[
		A2(
		$elm$svg$Svg$polygon,
		_List_fromArray(
			[
				$elm$svg$Svg$Attributes$fill('#5A6378'),
				$elm$svg$Svg$Attributes$points('0,2 48,50 0,98')
			]),
		_List_Nil),
		A2(
		$elm$svg$Svg$polygon,
		_List_fromArray(
			[
				$elm$svg$Svg$Attributes$fill('#7FD13B'),
				$elm$svg$Svg$Attributes$points('2,0 25.585786437626904,23.585786437626904 71.58578643762691,23.585786437626904 48,0')
			]),
		_List_Nil),
		A2(
		$elm$svg$Svg$polygon,
		_List_fromArray(
			[
				$elm$svg$Svg$Attributes$fill('#7FD13B'),
				$elm$svg$Svg$Attributes$points('2,0 25.585786437626904,23.585786437626904 71.58578643762691,23.585786437626904 48,0')
			]),
		_List_Nil),
		A2(
		$elm$svg$Svg$polygon,
		_List_fromArray(
			[
				$elm$svg$Svg$Attributes$fill('#F0AD00'),
				$elm$svg$Svg$Attributes$points('28.414213562373096,26.414213562373096 71.58578643762691,26.414213562373096 50,48')
			]),
		_List_Nil),
		A2(
		$elm$svg$Svg$polygon,
		_List_fromArray(
			[
				$elm$svg$Svg$Attributes$fill('#60B5CC'),
				$elm$svg$Svg$Attributes$points('52,0 100,0 100,48')
			]),
		_List_Nil),
		A2(
		$elm$svg$Svg$polygon,
		_List_fromArray(
			[
				$elm$svg$Svg$Attributes$fill('#F0AD00'),
				$elm$svg$Svg$Attributes$points('100,52 77,75 100,98')
			]),
		_List_Nil),
		A2(
		$elm$svg$Svg$polygon,
		_List_fromArray(
			[
				$elm$svg$Svg$Attributes$fill('#60B5CC'),
				$elm$svg$Svg$Attributes$points('2,100 50,52 98,100')
			]),
		_List_Nil),
		A2(
		$elm$svg$Svg$polygon,
		_List_fromArray(
			[
				$elm$svg$Svg$Attributes$fill('#7FD13B'),
				$elm$svg$Svg$Attributes$points('52,50 75,27 98,50 75,73')
			]),
		_List_Nil)
	]);
var $author$project$Material$Button$icon = function (iconName) {
	return A3(
		$author$project$Material$Button$customIcon,
		$elm$html$Html$i,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('material-icons')
			]),
		_List_fromArray(
			[
				$elm$html$Html$text(iconName)
			]));
};
var $author$project$Material$Button$Raised = 1;
var $elm$html$Html$a = _VirtualDom_node('a');
var $elm$html$Html$button = _VirtualDom_node('button');
var $elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return $elm$core$Maybe$Just(
				f(value));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 0, a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $elm$html$Html$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $author$project$Material$Button$clickHandler = function (_v0) {
	var onClick = _v0.bc;
	return A2($elm$core$Maybe$map, $elm$html$Html$Events$onClick, onClick);
};
var $author$project$Material$Button$denseCs = function (_v0) {
	var dense = _v0.bA;
	return dense ? $elm$core$Maybe$Just(
		$elm$html$Html$Attributes$class('mdc-button--dense')) : $elm$core$Maybe$Nothing;
};
var $elm$json$Json$Encode$bool = _Json_wrap;
var $elm$html$Html$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$bool(bool));
	});
var $elm$html$Html$Attributes$disabled = $elm$html$Html$Attributes$boolProperty('disabled');
var $author$project$Material$Button$disabledAttr = function (_v0) {
	var disabled = _v0.ad;
	return $elm$core$Maybe$Just(
		$elm$html$Html$Attributes$disabled(disabled));
};
var $elm$virtual_dom$VirtualDom$property = F2(
	function (key, value) {
		return A2(
			_VirtualDom_property,
			_VirtualDom_noInnerHtmlOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var $elm$html$Html$Attributes$property = $elm$virtual_dom$VirtualDom$property;
var $author$project$Material$Button$disabledProp = function (_v0) {
	var disabled = _v0.ad;
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$Attributes$property,
			'disabled',
			$elm$json$Json$Encode$bool(disabled)));
};
var $elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _v0 = f(mx);
		if (!_v0.$) {
			var x = _v0.a;
			return A2($elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var $elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			$elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var $elm$html$Html$Attributes$href = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'href',
		_VirtualDom_noJavaScriptUri(url));
};
var $author$project$Material$Button$hrefAttr = function (_v0) {
	var href = _v0.ak;
	return A2($elm$core$Maybe$map, $elm$html$Html$Attributes$href, href);
};
var $elm$html$Html$span = _VirtualDom_node('span');
var $author$project$Material$Button$labelElt = function (label) {
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$span,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('mdc-button__label')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(label)
				])));
};
var $elm$virtual_dom$VirtualDom$attribute = F2(
	function (key, value) {
		return A2(
			_VirtualDom_attribute,
			_VirtualDom_noOnOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var $elm$html$Html$Attributes$attribute = $elm$virtual_dom$VirtualDom$attribute;
var $elm$svg$Svg$Attributes$class = _VirtualDom_attribute('class');
var $elm$virtual_dom$VirtualDom$map = _VirtualDom_map;
var $elm$html$Html$map = $elm$virtual_dom$VirtualDom$map;
var $author$project$Material$Button$iconElt = function (_v0) {
	var config_ = _v0;
	return A2(
		$elm$core$Maybe$map,
		$elm$html$Html$map($elm$core$Basics$never),
		function () {
			var _v1 = config_.c;
			if (!_v1.$) {
				if (!_v1.a.$) {
					var node = _v1.a.a.a7;
					var attributes = _v1.a.a.aW;
					var nodes = _v1.a.a.a8;
					return $elm$core$Maybe$Just(
						A2(
							node,
							A2(
								$elm$core$List$cons,
								$elm$html$Html$Attributes$class('mdc-button__icon'),
								A2(
									$elm$core$List$cons,
									A2($elm$html$Html$Attributes$attribute, 'aria-hidden', 'true'),
									attributes)),
							nodes));
				} else {
					var node = _v1.a.a.a7;
					var attributes = _v1.a.a.aW;
					var nodes = _v1.a.a.a8;
					return $elm$core$Maybe$Just(
						A2(
							node,
							A2(
								$elm$core$List$cons,
								$elm$svg$Svg$Attributes$class('mdc-button__icon'),
								A2(
									$elm$core$List$cons,
									A2($elm$html$Html$Attributes$attribute, 'aria-hidden', 'true'),
									attributes)),
							nodes));
				}
			} else {
				return $elm$core$Maybe$Nothing;
			}
		}());
};
var $author$project$Material$Button$leadingIconElt = function (config_) {
	var trailingIcon = config_.bl;
	return (!trailingIcon) ? $author$project$Material$Button$iconElt(config_) : $elm$core$Maybe$Nothing;
};
var $author$project$Material$Menu$closeHandler = function (_v0) {
	var onClose = _v0.bT;
	return A2(
		$elm$core$Maybe$map,
		A2(
			$elm$core$Basics$composeL,
			$elm$html$Html$Events$on('MDCMenuSurface:close'),
			$elm$json$Json$Decode$succeed),
		onClose);
};
var $elm$virtual_dom$VirtualDom$node = function (tag) {
	return _VirtualDom_node(
		_VirtualDom_noScript(tag));
};
var $elm$html$Html$node = $elm$virtual_dom$VirtualDom$node;
var $author$project$Material$Menu$openProp = function (_v0) {
	var open = _v0.u;
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$Attributes$property,
			'open',
			$elm$json$Json$Encode$bool(open)));
};
var $author$project$Material$Menu$quickOpenProp = function (_v0) {
	var quickOpen = _v0.b_;
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$Attributes$property,
			'quickOpen',
			$elm$json$Json$Encode$bool(quickOpen)));
};
var $author$project$Material$Menu$rootCs = $elm$core$Maybe$Just(
	$elm$html$Html$Attributes$class('mdc-menu mdc-menu-surface'));
var $author$project$Material$Menu$menu = F2(
	function (config_, nodes) {
		var additionalAttributes = config_.br;
		return A3(
			$elm$html$Html$node,
			'mdc-menu',
			_Utils_ap(
				A2(
					$elm$core$List$filterMap,
					$elm$core$Basics$identity,
					_List_fromArray(
						[
							$author$project$Material$Menu$rootCs,
							$author$project$Material$Menu$openProp(config_),
							$author$project$Material$Menu$quickOpenProp(config_),
							$author$project$Material$Menu$closeHandler(config_)
						])),
				additionalAttributes),
			nodes);
	});
var $author$project$Material$Button$rippleElt = $elm$core$Maybe$Just(
	A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('mdc-button__ripple')
			]),
		_List_Nil));
var $author$project$Material$Button$rootCs = $elm$core$Maybe$Just(
	$elm$html$Html$Attributes$class('mdc-button'));
var $elm$json$Json$Encode$int = _Json_wrap;
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $author$project$Material$Button$tabIndexProp = function (_v0) {
	var disabled = _v0.ad;
	return disabled ? $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$Attributes$property,
			'tabIndex',
			$elm$json$Json$Encode$int(-1))) : $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$Attributes$property,
			'tabIndex',
			$elm$json$Json$Encode$int(0)));
};
var $elm$html$Html$Attributes$target = $elm$html$Html$Attributes$stringProperty('target');
var $author$project$Material$Button$targetAttr = function (_v0) {
	var href = _v0.ak;
	var target = _v0.b8;
	return (!_Utils_eq(href, $elm$core$Maybe$Nothing)) ? A2($elm$core$Maybe$map, $elm$html$Html$Attributes$target, target) : $elm$core$Maybe$Nothing;
};
var $author$project$Material$Button$touchCs = function (_v0) {
	var touch = _v0.aN;
	return touch ? $elm$core$Maybe$Just(
		$elm$html$Html$Attributes$class('mdc-button--touch')) : $elm$core$Maybe$Nothing;
};
var $author$project$Material$Button$touchElt = function (_v0) {
	var touch = _v0.aN;
	return touch ? $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('mdc-button__touch')
				]),
			_List_Nil)) : $elm$core$Maybe$Nothing;
};
var $author$project$Material$Button$trailingIconElt = function (config_) {
	var trailingIcon = config_.bl;
	return trailingIcon ? $author$project$Material$Button$iconElt(config_) : $elm$core$Maybe$Nothing;
};
var $author$project$Material$Button$variantCs = function (variant) {
	switch (variant) {
		case 0:
			return $elm$core$Maybe$Nothing;
		case 1:
			return $elm$core$Maybe$Just(
				$elm$html$Html$Attributes$class('mdc-button--raised'));
		case 2:
			return $elm$core$Maybe$Just(
				$elm$html$Html$Attributes$class('mdc-button--unelevated'));
		default:
			return $elm$core$Maybe$Just(
				$elm$html$Html$Attributes$class('mdc-button--outlined'));
	}
};
var $author$project$Material$Button$button = F3(
	function (variant, config_, label) {
		var innerConfig = config_;
		var additionalAttributes = innerConfig.br;
		var touch = innerConfig.aN;
		var href = innerConfig.ak;
		var wrapTouch = function (node) {
			return touch ? A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('mdc-touch-target-wrapper')
					]),
				_List_fromArray(
					[node])) : node;
		};
		var wrapMenu = function (node) {
			var _v0 = innerConfig.bL;
			if (_v0.$ === 1) {
				return node;
			} else {
				var _v1 = _v0.a;
				var menuConfig = _v1.a;
				var menuNodes = _v1.b;
				return A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('mdc-menu-surface--anchor')
						]),
					_List_fromArray(
						[
							node,
							A2($author$project$Material$Menu$menu, menuConfig, menuNodes)
						]));
			}
		};
		return wrapMenu(
			wrapTouch(
				A3(
					$elm$html$Html$node,
					'mdc-button',
					A2(
						$elm$core$List$filterMap,
						$elm$core$Basics$identity,
						_List_fromArray(
							[
								$author$project$Material$Button$disabledProp(config_)
							])),
					_List_fromArray(
						[
							A2(
							(!_Utils_eq(href, $elm$core$Maybe$Nothing)) ? $elm$html$Html$a : $elm$html$Html$button,
							_Utils_ap(
								A2(
									$elm$core$List$filterMap,
									$elm$core$Basics$identity,
									_List_fromArray(
										[
											$author$project$Material$Button$rootCs,
											$author$project$Material$Button$variantCs(variant),
											$author$project$Material$Button$denseCs(config_),
											$author$project$Material$Button$touchCs(config_),
											$author$project$Material$Button$disabledAttr(config_),
											$author$project$Material$Button$tabIndexProp(config_),
											$author$project$Material$Button$hrefAttr(config_),
											$author$project$Material$Button$targetAttr(config_),
											$author$project$Material$Button$clickHandler(config_)
										])),
								additionalAttributes),
							A2(
								$elm$core$List$filterMap,
								$elm$core$Basics$identity,
								_List_fromArray(
									[
										$author$project$Material$Button$rippleElt,
										$author$project$Material$Button$leadingIconElt(config_),
										$author$project$Material$Button$labelElt(label),
										$author$project$Material$Button$trailingIconElt(config_),
										$author$project$Material$Button$touchElt(config_)
									])))
						]))));
	});
var $author$project$Material$Button$raised = F2(
	function (config_, label) {
		return A3($author$project$Material$Button$button, 1, config_, label);
	});
var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var $elm$html$Html$Attributes$style = $elm$virtual_dom$VirtualDom$style;
var $author$project$Demo$Buttons$rowMargin = A2($elm$html$Html$Attributes$style, 'margin', '8px 16px');
var $author$project$Material$Button$setAttributes = F2(
	function (additionalAttributes, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{br: additionalAttributes});
	});
var $author$project$Material$Button$setIcon = F2(
	function (icon_, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{c: icon_});
	});
var $author$project$Material$Button$Internal$SvgIcon = function (a) {
	return {$: 1, a: a};
};
var $elm$svg$Svg$svg = $elm$svg$Svg$trustedNode('svg');
var $author$project$Material$Button$svgIcon = F2(
	function (attributes, nodes) {
		return $author$project$Material$Button$Internal$SvgIcon(
			{aW: attributes, a7: $elm$svg$Svg$svg, a8: nodes});
	});
var $elm$svg$Svg$Attributes$viewBox = _VirtualDom_attribute('viewBox');
var $author$project$Demo$Buttons$customIconButtons = function () {
	var config = function (icon) {
		return A2(
			$author$project$Material$Button$setIcon,
			$elm$core$Maybe$Just(icon),
			A2(
				$author$project$Material$Button$setAttributes,
				_List_fromArray(
					[$author$project$Demo$Buttons$rowMargin]),
				$author$project$Material$Button$config));
	};
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$author$project$Material$Button$raised,
				config(
					$author$project$Material$Button$icon('favorite')),
				'Material Icon'),
				A2(
				$author$project$Material$Button$raised,
				config(
					A3(
						$author$project$Material$Button$customIcon,
						$elm$html$Html$i,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('fab fa-font-awesome')
							]),
						_List_Nil)),
				'Font Awesome'),
				A2(
				$author$project$Material$Button$raised,
				config(
					A2(
						$author$project$Material$Button$svgIcon,
						_List_fromArray(
							[
								$elm$svg$Svg$Attributes$viewBox('0 0 100 100')
							]),
						$author$project$Demo$ElmLogo$elmLogo)),
				'SVG')
			]));
}();
var $author$project$Demo$Buttons$Focus = function (a) {
	return {$: 0, a: a};
};
var $elm$html$Html$Attributes$id = $elm$html$Html$Attributes$stringProperty('id');
var $author$project$Material$Button$setHref = F2(
	function (href, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{ak: href});
	});
var $author$project$Material$Button$setOnClick = F2(
	function (onClick, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{
				bc: $elm$core$Maybe$Just(onClick)
			});
	});
var $author$project$Demo$Buttons$focusButton = A2(
	$elm$html$Html$div,
	_List_Nil,
	_List_fromArray(
		[
			A2(
			$author$project$Material$Button$raised,
			A2(
				$author$project$Material$Button$setAttributes,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$id('my-button')
					]),
				$author$project$Material$Button$config),
			'Button'),
			$elm$html$Html$text('\u00A0'),
			A2(
			$author$project$Material$Button$raised,
			A2(
				$author$project$Material$Button$setOnClick,
				$author$project$Demo$Buttons$Focus('my-button'),
				$author$project$Material$Button$config),
			'Focus'),
			$elm$html$Html$text('\u00A0'),
			A2(
			$author$project$Material$Button$raised,
			A2(
				$author$project$Material$Button$setAttributes,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$id('my-link-button')
					]),
				A2(
					$author$project$Material$Button$setHref,
					$elm$core$Maybe$Just('#'),
					$author$project$Material$Button$config)),
			'Link button'),
			$elm$html$Html$text('\u00A0'),
			A2(
			$author$project$Material$Button$raised,
			A2(
				$author$project$Material$Button$setOnClick,
				$author$project$Demo$Buttons$Focus('my-link-button'),
				$author$project$Material$Button$config),
			'Focus')
		]));
var $elm$html$Html$h3 = _VirtualDom_node('h3');
var $author$project$Demo$Buttons$heroMargin = A2($elm$html$Html$Attributes$style, 'margin', '16px 32px');
var $author$project$Material$Button$Outlined = 3;
var $author$project$Material$Button$outlined = F2(
	function (config_, label) {
		return A3($author$project$Material$Button$button, 3, config_, label);
	});
var $author$project$Material$Button$Text = 0;
var $author$project$Material$Button$text = F2(
	function (config_, label) {
		return A3($author$project$Material$Button$button, 0, config_, label);
	});
var $author$project$Material$Button$Unelevated = 2;
var $author$project$Material$Button$unelevated = F2(
	function (config_, label) {
		return A3($author$project$Material$Button$button, 2, config_, label);
	});
var $author$project$Demo$Buttons$heroButtons = function () {
	var config = A2(
		$author$project$Material$Button$setAttributes,
		_List_fromArray(
			[$author$project$Demo$Buttons$heroMargin]),
		$author$project$Material$Button$config);
	return _List_fromArray(
		[
			A2($author$project$Material$Button$text, config, 'Text'),
			A2($author$project$Material$Button$raised, config, 'Raised'),
			A2($author$project$Material$Button$unelevated, config, 'Unelevated'),
			A2($author$project$Material$Button$outlined, config, 'Outlined')
		]);
}();
var $author$project$Material$Button$setDense = F2(
	function (dense, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{bA: dense});
	});
var $author$project$Demo$Buttons$buttonsRow = F2(
	function (button, additionalAttributes) {
		var config = A2(
			$author$project$Material$Button$setAttributes,
			A2($elm$core$List$cons, $author$project$Demo$Buttons$rowMargin, additionalAttributes),
			$author$project$Material$Button$config);
		return A2(
			$elm$html$Html$div,
			_List_Nil,
			_List_fromArray(
				[
					A2(button, config, 'Default'),
					A2(
					button,
					A2($author$project$Material$Button$setDense, true, config),
					'Dense'),
					A2(
					button,
					A2(
						$author$project$Material$Button$setIcon,
						$elm$core$Maybe$Just(
							$author$project$Material$Button$icon('favorite')),
						config),
					'Icon')
				]));
	});
var $author$project$Demo$Buttons$linkButtons = A2(
	$author$project$Demo$Buttons$buttonsRow,
	F2(
		function (config, label) {
			return A2(
				$author$project$Material$Button$text,
				A2(
					$author$project$Material$Button$setHref,
					$elm$core$Maybe$Just('#'),
					config),
				label);
		}),
	_List_Nil);
var $author$project$Demo$Buttons$outlinedButtons = A2($author$project$Demo$Buttons$buttonsRow, $author$project$Material$Button$outlined, _List_Nil);
var $author$project$Demo$Buttons$raisedButtons = A2($author$project$Demo$Buttons$buttonsRow, $author$project$Material$Button$raised, _List_Nil);
var $author$project$Demo$Buttons$shapedButtons = A2(
	$author$project$Demo$Buttons$buttonsRow,
	$author$project$Material$Button$unelevated,
	_List_fromArray(
		[
			A2($elm$html$Html$Attributes$style, 'border-radius', '18px')
		]));
var $author$project$Material$Typography$subtitle1 = $elm$html$Html$Attributes$class('mdc-typography--subtitle1');
var $author$project$Demo$Buttons$textButtons = A2($author$project$Demo$Buttons$buttonsRow, $author$project$Material$Button$text, _List_Nil);
var $author$project$Demo$Buttons$unelevatedButtons = A2($author$project$Demo$Buttons$buttonsRow, $author$project$Material$Button$unelevated, _List_Nil);
var $author$project$Demo$Buttons$view = function (model) {
	return {
		cS: _List_fromArray(
			[
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Text Button')
					])),
				$author$project$Demo$Buttons$textButtons,
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Raised Button')
					])),
				$author$project$Demo$Buttons$raisedButtons,
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Unelevated Button')
					])),
				$author$project$Demo$Buttons$unelevatedButtons,
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Outlined Button')
					])),
				$author$project$Demo$Buttons$outlinedButtons,
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Shaped Button')
					])),
				$author$project$Demo$Buttons$shapedButtons,
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Link Button')
					])),
				$author$project$Demo$Buttons$linkButtons,
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Button with Custom Icon')
					])),
				$author$project$Demo$Buttons$customIconButtons,
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Focus Button')
					])),
				$author$project$Demo$Buttons$focusButton
			]),
		cZ: $author$project$Demo$Buttons$heroButtons,
		c9: 'Buttons communicate an action a user can take. They are typically placed throughout your UI, in places like dialogs, forms, cards, and toolbars.',
		db: {
			cT: $elm$core$Maybe$Just('https://package.elm-lang.org/packages/aforemny/material-components-web-elm/latest/Material-Button'),
			c3: $elm$core$Maybe$Just('https://material.io/go/design-buttons'),
			df: $elm$core$Maybe$Just('https://github.com/material-components/material-components-web/tree/master/packages/mdc-button')
		},
		dh: 'Button'
	};
};
var $elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
		}
	});
var $elm$core$List$concat = function (lists) {
	return A3($elm$core$List$foldr, $elm$core$List$append, _List_Nil, lists);
};
var $elm$core$List$isEmpty = function (xs) {
	if (!xs.b) {
		return true;
	} else {
		return false;
	}
};
var $author$project$Material$Card$actionsElt = function (content) {
	var _v0 = content.T;
	if (!_v0.$) {
		var buttons = _v0.a.cQ;
		var icons = _v0.a.c$;
		var fullBleed = _v0.a.bI;
		return _List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$filterMap,
					$elm$core$Basics$identity,
					_List_fromArray(
						[
							$elm$core$Maybe$Just(
							$elm$html$Html$Attributes$class('mdc-card__actions')),
							fullBleed ? $elm$core$Maybe$Just(
							$elm$html$Html$Attributes$class('mdc-card__actions--full-bleed')) : $elm$core$Maybe$Nothing
						])),
				$elm$core$List$concat(
					_List_fromArray(
						[
							(!$elm$core$List$isEmpty(buttons)) ? _List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('mdc-card__action-buttons')
									]),
								A2(
									$elm$core$List$map,
									function (_v1) {
										var button_ = _v1;
										return button_;
									},
									buttons))
							]) : _List_Nil,
							(!$elm$core$List$isEmpty(icons)) ? _List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('mdc-card__action-icons')
									]),
								A2(
									$elm$core$List$map,
									function (_v2) {
										var icon_ = _v2;
										return icon_;
									},
									icons))
							]) : _List_Nil
						])))
			]);
	} else {
		return _List_Nil;
	}
};
var $author$project$Material$Card$blocksElt = function (_v0) {
	var blocks = _v0.V;
	return A2(
		$elm$core$List$map,
		function (_v1) {
			var html = _v1;
			return html;
		},
		blocks);
};
var $author$project$Material$Card$outlinedCs = function (_v0) {
	var outlined = _v0.bf;
	return outlined ? $elm$core$Maybe$Just(
		$elm$html$Html$Attributes$class('mdc-card--outlined')) : $elm$core$Maybe$Nothing;
};
var $author$project$Material$Card$rootCs = $elm$core$Maybe$Just(
	$elm$html$Html$Attributes$class('mdc-card'));
var $author$project$Material$Card$card = F2(
	function (config_, content) {
		var additionalAttributes = config_.br;
		return A3(
			$elm$html$Html$node,
			'mdc-card',
			_Utils_ap(
				A2(
					$elm$core$List$filterMap,
					$elm$core$Basics$identity,
					_List_fromArray(
						[
							$author$project$Material$Card$rootCs,
							$author$project$Material$Card$outlinedCs(config_)
						])),
				additionalAttributes),
			$elm$core$List$concat(
				_List_fromArray(
					[
						$author$project$Material$Card$blocksElt(content),
						$author$project$Material$Card$actionsElt(content)
					])));
	});
var $author$project$Material$Card$Config = $elm$core$Basics$identity;
var $author$project$Material$Card$config = {br: _List_Nil, bf: false};
var $author$project$Material$Card$Block = $elm$core$Basics$identity;
var $author$project$Material$Card$block = $elm$core$Basics$identity;
var $author$project$Material$Typography$body2 = $elm$html$Html$Attributes$class('mdc-typography--body2');
var $author$project$Material$Theme$textSecondaryOnBackground = $elm$html$Html$Attributes$class('mdc-theme--text-secondary-on-background');
var $author$project$Demo$Cards$demoBody = $author$project$Material$Card$block(
	A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$author$project$Material$Typography$body2,
				$author$project$Material$Theme$textSecondaryOnBackground,
				A2($elm$html$Html$Attributes$style, 'padding', '0 1rem 0.5rem 1rem')
			]),
		_List_fromArray(
			[
				$elm$html$Html$text('\n                Visit ten places on our planet that are undergoing the biggest\n                changes today.\n                ')
			])));
var $author$project$Material$Card$SixteenToNine = 1;
var $author$project$Material$Card$aspectCs = function (aspect) {
	if (!aspect.$) {
		if (!aspect.a) {
			var _v1 = aspect.a;
			return $elm$core$Maybe$Just(
				$elm$html$Html$Attributes$class('mdc-card__media--square'));
		} else {
			var _v2 = aspect.a;
			return $elm$core$Maybe$Just(
				$elm$html$Html$Attributes$class('mdc-card__media--16-9'));
		}
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Material$Card$backgroundImageAttr = function (url) {
	return $elm$core$Maybe$Just(
		A2($elm$html$Html$Attributes$style, 'background-image', 'url(\"' + (url + '\")')));
};
var $author$project$Material$Card$mediaCs = $elm$core$Maybe$Just(
	$elm$html$Html$Attributes$class('mdc-card__media'));
var $author$project$Material$Card$mediaView = F3(
	function (aspect, additionalAttributes, backgroundImage) {
		return A2(
			$elm$html$Html$div,
			_Utils_ap(
				A2(
					$elm$core$List$filterMap,
					$elm$core$Basics$identity,
					_List_fromArray(
						[
							$author$project$Material$Card$mediaCs,
							$author$project$Material$Card$backgroundImageAttr(backgroundImage),
							$author$project$Material$Card$aspectCs(aspect)
						])),
				additionalAttributes),
			_List_Nil);
	});
var $author$project$Material$Card$sixteenToNineMedia = F2(
	function (additionalAttributes, backgroundImage) {
		return A3(
			$author$project$Material$Card$mediaView,
			$elm$core$Maybe$Just(1),
			additionalAttributes,
			backgroundImage);
	});
var $author$project$Demo$Cards$demoMedia = A2($author$project$Material$Card$sixteenToNineMedia, _List_Nil, 'images/photos/3x2/2.jpg');
var $elm$html$Html$h2 = _VirtualDom_node('h2');
var $author$project$Material$Typography$headline6 = $elm$html$Html$Attributes$class('mdc-typography--headline6');
var $author$project$Material$Typography$subtitle2 = $elm$html$Html$Attributes$class('mdc-typography--subtitle2');
var $author$project$Demo$Cards$demoTitle = $author$project$Material$Card$block(
	A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'padding', '1rem')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$h2,
				_List_fromArray(
					[
						$author$project$Material$Typography$headline6,
						A2($elm$html$Html$Attributes$style, 'margin', '0')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Our Changing Planet')
					])),
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[
						$author$project$Material$Typography$subtitle2,
						$author$project$Material$Theme$textSecondaryOnBackground,
						A2($elm$html$Html$Attributes$style, 'margin', '0')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('by Kurt Wagner')
					]))
			])));
var $author$project$Material$Card$primaryActionCs = $elm$html$Html$Attributes$class('mdc-card__primary-action');
var $author$project$Material$Card$tabIndexProp = function (tabIndex) {
	return A2(
		$elm$html$Html$Attributes$property,
		'tabIndex',
		$elm$json$Json$Encode$int(tabIndex));
};
var $author$project$Material$Card$primaryAction = F2(
	function (additionalAttributes, blocks) {
		return _List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_Utils_ap(
					_List_fromArray(
						[
							$author$project$Material$Card$primaryActionCs,
							$author$project$Material$Card$tabIndexProp(0)
						]),
					additionalAttributes),
				A2(
					$elm$core$List$map,
					function (_v0) {
						var html = _v0;
						return html;
					},
					blocks))
			]);
	});
var $author$project$Material$Card$setAttributes = F2(
	function (additionalAttributes, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{br: additionalAttributes});
	});
var $author$project$Demo$Cards$exampleCard1 = A2(
	$author$project$Material$Card$card,
	A2(
		$author$project$Material$Card$setAttributes,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'margin', '48px 0'),
				A2($elm$html$Html$Attributes$style, 'width', '350px')
			]),
		$author$project$Material$Card$config),
	{
		T: $elm$core$Maybe$Nothing,
		V: A2(
			$author$project$Material$Card$primaryAction,
			_List_Nil,
			_List_fromArray(
				[$author$project$Demo$Cards$demoMedia, $author$project$Demo$Cards$demoTitle, $author$project$Demo$Cards$demoBody]))
	});
var $author$project$Material$Card$Actions = $elm$core$Basics$identity;
var $author$project$Material$Card$actions = function (_v0) {
	var buttons = _v0.cQ;
	var icons = _v0.c$;
	return {cQ: buttons, bI: false, c$: icons};
};
var $author$project$Material$Card$Button = $elm$core$Basics$identity;
var $author$project$Material$Card$button = F2(
	function (_v0, label) {
		var buttonConfig = _v0;
		return A2(
			$author$project$Material$Button$text,
			_Utils_update(
				buttonConfig,
				{
					br: A2(
						$elm$core$List$cons,
						$elm$html$Html$Attributes$class('mdc-card__action'),
						A2(
							$elm$core$List$cons,
							$elm$html$Html$Attributes$class('mdc-card__action--button'),
							buttonConfig.br))
				}),
			label);
	});
var $author$project$Material$IconButton$Internal$Config = $elm$core$Basics$identity;
var $author$project$Material$IconButton$config = {br: _List_Nil, ad: false, b: $elm$core$Maybe$Nothing, bL: $elm$core$Maybe$Nothing, bc: $elm$core$Maybe$Nothing};
var $author$project$Material$Card$Icon = $elm$core$Basics$identity;
var $author$project$Material$IconButton$clickHandler = function (_v0) {
	var onClick = _v0.bc;
	return A2($elm$core$Maybe$map, $elm$html$Html$Events$onClick, onClick);
};
var $author$project$Material$IconButton$rootCs = $elm$core$Maybe$Just(
	$elm$html$Html$Attributes$class('mdc-icon-button'));
var $author$project$Material$Menu$surfaceAnchor = $elm$html$Html$Attributes$class('mdc-menu-surface--anchor');
var $elm$html$Html$Attributes$tabindex = function (n) {
	return A2(
		_VirtualDom_attribute,
		'tabIndex',
		$elm$core$String$fromInt(n));
};
var $author$project$Material$IconButton$tabIndexProp = $elm$core$Maybe$Just(
	$elm$html$Html$Attributes$tabindex(0));
var $author$project$Material$IconButton$iconButton = F2(
	function (config_, icon_) {
		var innerConfig = config_;
		var additionalAttributes = innerConfig.br;
		var wrapMenu = function (node) {
			var _v1 = innerConfig.bL;
			if (_v1.$ === 1) {
				return node;
			} else {
				var _v2 = _v1.a;
				var menuConfig = _v2.a;
				var menuNodes = _v2.b;
				return A2(
					$elm$html$Html$div,
					_List_fromArray(
						[$author$project$Material$Menu$surfaceAnchor]),
					_List_fromArray(
						[
							node,
							A2($author$project$Material$Menu$menu, menuConfig, menuNodes)
						]));
			}
		};
		return wrapMenu(
			A3(
				$elm$html$Html$node,
				'mdc-icon-button',
				_Utils_ap(
					A2(
						$elm$core$List$filterMap,
						$elm$core$Basics$identity,
						_List_fromArray(
							[
								$author$project$Material$IconButton$rootCs,
								$author$project$Material$IconButton$tabIndexProp,
								$author$project$Material$IconButton$clickHandler(config_)
							])),
					additionalAttributes),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$map,
						$elm$core$Basics$never,
						function () {
							if (!icon_.$) {
								var node = icon_.a.a7;
								var attributes = icon_.a.aW;
								var nodes = icon_.a.a8;
								return A2(
									node,
									A2(
										$elm$core$List$cons,
										$elm$html$Html$Attributes$class('mdc-icon-button__icon'),
										attributes),
									nodes);
							} else {
								var node = icon_.a.a7;
								var attributes = icon_.a.aW;
								var nodes = icon_.a.a8;
								return A2(
									node,
									A2(
										$elm$core$List$cons,
										$elm$svg$Svg$Attributes$class('mdc-icon-button__icon'),
										attributes),
									nodes);
							}
						}())
					])));
	});
var $author$project$Material$Card$icon = F2(
	function (_v0, icon_) {
		var iconButtonConfig = _v0;
		return A2(
			$author$project$Material$IconButton$iconButton,
			_Utils_update(
				iconButtonConfig,
				{
					br: A2(
						$elm$core$List$cons,
						$elm$html$Html$Attributes$class('mdc-card__action'),
						A2(
							$elm$core$List$cons,
							$elm$html$Html$Attributes$class('mdc-card__action--icon'),
							iconButtonConfig.br))
				}),
			icon_);
	});
var $author$project$Material$IconButton$Internal$Icon = function (a) {
	return {$: 0, a: a};
};
var $author$project$Material$IconButton$customIcon = F3(
	function (node, attributes, nodes) {
		return $author$project$Material$IconButton$Internal$Icon(
			{aW: attributes, a7: node, a8: nodes});
	});
var $author$project$Material$IconButton$icon = function (iconName) {
	return A3(
		$author$project$Material$IconButton$customIcon,
		$elm$html$Html$i,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('material-icons')
			]),
		_List_fromArray(
			[
				$elm$html$Html$text(iconName)
			]));
};
var $author$project$Demo$Cards$demoActions = $author$project$Material$Card$actions(
	{
		cQ: _List_fromArray(
			[
				A2($author$project$Material$Card$button, $author$project$Material$Button$config, 'Read'),
				A2($author$project$Material$Card$button, $author$project$Material$Button$config, 'Bookmark')
			]),
		c$: _List_fromArray(
			[
				A2(
				$author$project$Material$Card$icon,
				$author$project$Material$IconButton$config,
				$author$project$Material$IconButton$icon('favorite_border')),
				A2(
				$author$project$Material$Card$icon,
				$author$project$Material$IconButton$config,
				$author$project$Material$IconButton$icon('share')),
				A2(
				$author$project$Material$Card$icon,
				$author$project$Material$IconButton$config,
				$author$project$Material$IconButton$icon('more_vert'))
			])
	});
var $author$project$Demo$Cards$exampleCard2 = A2(
	$author$project$Material$Card$card,
	A2(
		$author$project$Material$Card$setAttributes,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'margin', '48px 0'),
				A2($elm$html$Html$Attributes$style, 'width', '350px')
			]),
		$author$project$Material$Card$config),
	{
		T: $elm$core$Maybe$Just($author$project$Demo$Cards$demoActions),
		V: A2(
			$author$project$Material$Card$primaryAction,
			_List_Nil,
			_List_fromArray(
				[$author$project$Demo$Cards$demoTitle, $author$project$Demo$Cards$demoBody]))
	});
var $author$project$Demo$Cards$exampleCard3 = A2(
	$author$project$Material$Card$card,
	A2(
		$author$project$Material$Card$setAttributes,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'margin', '48px 0'),
				A2($elm$html$Html$Attributes$style, 'width', '350px'),
				A2($elm$html$Html$Attributes$style, 'border-radius', '24px 8px')
			]),
		$author$project$Material$Card$config),
	{
		T: $elm$core$Maybe$Just($author$project$Demo$Cards$demoActions),
		V: A2(
			$author$project$Material$Card$primaryAction,
			_List_Nil,
			_List_fromArray(
				[$author$project$Demo$Cards$demoTitle, $author$project$Demo$Cards$demoBody]))
	});
var $author$project$Demo$Cards$Focus = function (a) {
	return {$: 0, a: a};
};
var $author$project$Demo$Cards$focusCard = A2(
	$elm$html$Html$div,
	_List_Nil,
	_List_fromArray(
		[
			A2(
			$author$project$Material$Card$card,
			A2(
				$author$project$Material$Card$setAttributes,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$id('my-card'),
						A2($elm$html$Html$Attributes$style, 'margin', '48px 0'),
						A2($elm$html$Html$Attributes$style, 'width', '350px')
					]),
				$author$project$Material$Card$config),
			{
				T: $elm$core$Maybe$Just($author$project$Demo$Cards$demoActions),
				V: A2(
					$author$project$Material$Card$primaryAction,
					_List_Nil,
					_List_fromArray(
						[$author$project$Demo$Cards$demoTitle, $author$project$Demo$Cards$demoBody]))
			}),
			$elm$html$Html$text('\u00A0'),
			A2(
			$author$project$Material$Button$raised,
			A2(
				$author$project$Material$Button$setOnClick,
				$author$project$Demo$Cards$Focus('my-card'),
				$author$project$Material$Button$config),
			'Focus')
		]));
var $author$project$Demo$Cards$heroCard = _List_fromArray(
	[
		A2(
		$author$project$Material$Card$card,
		A2(
			$author$project$Material$Card$setAttributes,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'width', '350px')
				]),
			$author$project$Material$Card$config),
		{
			T: $elm$core$Maybe$Just($author$project$Demo$Cards$demoActions),
			V: A2(
				$author$project$Material$Card$primaryAction,
				_List_Nil,
				_List_fromArray(
					[$author$project$Demo$Cards$demoMedia, $author$project$Demo$Cards$demoTitle, $author$project$Demo$Cards$demoBody]))
		})
	]);
var $author$project$Demo$Cards$view = function (model) {
	return {
		cS: _List_fromArray(
			[$author$project$Demo$Cards$exampleCard1, $author$project$Demo$Cards$exampleCard2, $author$project$Demo$Cards$exampleCard3, $author$project$Demo$Cards$focusCard]),
		cZ: $author$project$Demo$Cards$heroCard,
		c9: 'Cards contain content and actions about a single subject.',
		db: {
			cT: $elm$core$Maybe$Just('https://package.elm-lang.org/packages/aforemny/material-components-web-elm/latest/Material-Card'),
			c3: $elm$core$Maybe$Just('https://material.io/go/design-cards'),
			df: $elm$core$Maybe$Just('https://github.com/material-components/material-components-web/tree/master/packages/mdc-card')
		},
		dh: 'Card'
	};
};
var $author$project$Material$List$Item$Internal$Activated = 1;
var $author$project$Material$List$Item$activated = 1;
var $author$project$Material$TopAppBar$alignStart = $elm$html$Html$Attributes$class('mdc-top-app-bar__section--align-start');
var $author$project$Material$Drawer$Dismissible$appContent = $elm$html$Html$Attributes$class('mdc-drawer-app-content');
var $author$project$Material$Typography$body1 = $elm$html$Html$Attributes$class('mdc-typography--body1');
var $author$project$Demo$CatalogPage$catalogDrawerItems = _List_fromArray(
	[
		{b: 'Home', a: $author$project$Demo$Url$StartPage},
		{b: 'Button', a: $author$project$Demo$Url$Button},
		{b: 'Card', a: $author$project$Demo$Url$Card},
		{b: 'Checkbox', a: $author$project$Demo$Url$Checkbox},
		{b: 'Chips', a: $author$project$Demo$Url$Chips},
		{b: 'Circular Progress Indicator', a: $author$project$Demo$Url$CircularProgress},
		{b: 'DataTable', a: $author$project$Demo$Url$DataTable},
		{b: 'Dialog', a: $author$project$Demo$Url$Dialog},
		{b: 'Drawer', a: $author$project$Demo$Url$Drawer},
		{b: 'Elevation', a: $author$project$Demo$Url$Elevation},
		{b: 'FAB', a: $author$project$Demo$Url$Fab},
		{b: 'Icon Button', a: $author$project$Demo$Url$IconButton},
		{b: 'Image List', a: $author$project$Demo$Url$ImageList},
		{b: 'Layout Grid', a: $author$project$Demo$Url$LayoutGrid},
		{b: 'Linear Progress Indicator', a: $author$project$Demo$Url$LinearProgress},
		{b: 'List', a: $author$project$Demo$Url$List},
		{b: 'Menu', a: $author$project$Demo$Url$Menu},
		{b: 'Radio Button', a: $author$project$Demo$Url$RadioButton},
		{b: 'Ripple', a: $author$project$Demo$Url$Ripple},
		{b: 'Select', a: $author$project$Demo$Url$Select},
		{b: 'Slider', a: $author$project$Demo$Url$Slider},
		{b: 'Snackbar', a: $author$project$Demo$Url$Snackbar},
		{b: 'Switch', a: $author$project$Demo$Url$Switch},
		{b: 'Tab Bar', a: $author$project$Demo$Url$TabBar},
		{b: 'Text Field', a: $author$project$Demo$Url$TextField},
		{b: 'Theme', a: $author$project$Demo$Url$Theme},
		{b: 'Top App Bar', a: $author$project$Demo$Url$TopAppBar},
		{b: 'Typography', a: $author$project$Demo$Url$Typography}
	]);
var $author$project$Material$Typography$typography = $elm$html$Html$Attributes$class('mdc-typography');
var $author$project$Demo$CatalogPage$catalogPageContainer = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'position', 'relative'),
		$author$project$Material$Typography$typography
	]);
var $author$project$Material$Drawer$Dismissible$Config = $elm$core$Basics$identity;
var $author$project$Material$Drawer$Dismissible$config = {br: _List_Nil, bT: $elm$core$Maybe$Nothing, u: false};
var $author$project$Material$List$Config = $elm$core$Basics$identity;
var $author$project$Material$List$config = {br: _List_Nil, bu: false, bA: false, bP: false, cb: false, dk: false, cg: false};
var $author$project$Material$List$Item$Internal$Config = $elm$core$Basics$identity;
var $author$project$Material$List$Item$config = {
	br: _List_Nil,
	ad: false,
	ak: $elm$core$Maybe$Nothing,
	a7: $elm$html$Html$text(''),
	bc: $elm$core$Maybe$Nothing,
	de: $elm$core$Maybe$Nothing,
	b8: $elm$core$Maybe$Nothing
};
var $author$project$Material$TopAppBar$Config = $elm$core$Basics$identity;
var $author$project$Material$TopAppBar$config = {br: _List_Nil, bA: false, bF: false};
var $author$project$Material$Drawer$Dismissible$content = F2(
	function (attributes, nodes) {
		return A2(
			$elm$html$Html$div,
			A2(
				$elm$core$List$cons,
				$elm$html$Html$Attributes$class('mdc-drawer__content'),
				attributes),
			nodes);
	});
var $author$project$Demo$CatalogPage$demoContent = _List_fromArray(
	[
		$elm$html$Html$Attributes$id('demo-content'),
		A2($elm$html$Html$Attributes$style, 'height', '100%'),
		A2($elm$html$Html$Attributes$style, '-webkit-box-sizing', 'border-box'),
		A2($elm$html$Html$Attributes$style, 'box-sizing', 'border-box'),
		A2($elm$html$Html$Attributes$style, 'max-width', '100%'),
		A2($elm$html$Html$Attributes$style, 'padding-left', '16px'),
		A2($elm$html$Html$Attributes$style, 'padding-right', '16px'),
		A2($elm$html$Html$Attributes$style, 'padding-bottom', '100px'),
		A2($elm$html$Html$Attributes$style, 'width', '100%'),
		A2($elm$html$Html$Attributes$style, 'overflow', 'auto'),
		A2($elm$html$Html$Attributes$style, 'display', '-ms-flexbox'),
		A2($elm$html$Html$Attributes$style, 'display', 'flex'),
		A2($elm$html$Html$Attributes$style, '-ms-flex-direction', 'column'),
		A2($elm$html$Html$Attributes$style, 'flex-direction', 'column'),
		A2($elm$html$Html$Attributes$style, '-ms-flex-align', 'center'),
		A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
		A2($elm$html$Html$Attributes$style, '-ms-flex-pack', 'start'),
		A2($elm$html$Html$Attributes$style, 'justify-content', 'flex-start')
	]);
var $author$project$Demo$CatalogPage$demoContentTransition = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'max-width', '900px'),
		A2($elm$html$Html$Attributes$style, 'width', '100%')
	]);
var $author$project$Demo$CatalogPage$demoPanel = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'display', '-ms-flexbox'),
		A2($elm$html$Html$Attributes$style, 'display', 'flex'),
		A2($elm$html$Html$Attributes$style, 'position', 'relative'),
		A2($elm$html$Html$Attributes$style, 'height', '100vh'),
		A2($elm$html$Html$Attributes$style, 'overflow', 'hidden')
	]);
var $author$project$Demo$CatalogPage$demoTitle = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'border-bottom', '1px solid rgba(0,0,0,.87)')
	]);
var $author$project$Material$Drawer$Dismissible$closeHandler = function (_v0) {
	var onClose = _v0.bT;
	return A2(
		$elm$core$Maybe$map,
		A2(
			$elm$core$Basics$composeL,
			$elm$html$Html$Events$on('MDCDrawer:close'),
			$elm$json$Json$Decode$succeed),
		onClose);
};
var $author$project$Material$Drawer$Dismissible$dismissibleCs = $elm$core$Maybe$Just(
	$elm$html$Html$Attributes$class('mdc-drawer--dismissible'));
var $author$project$Material$Drawer$Dismissible$openProp = function (_v0) {
	var open = _v0.u;
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$Attributes$property,
			'open',
			$elm$json$Json$Encode$bool(open)));
};
var $author$project$Material$Drawer$Dismissible$rootCs = $elm$core$Maybe$Just(
	$elm$html$Html$Attributes$class('mdc-drawer'));
var $author$project$Material$Drawer$Dismissible$drawer = F2(
	function (config_, nodes) {
		var additionalAttributes = config_.br;
		return A3(
			$elm$html$Html$node,
			'mdc-drawer',
			_Utils_ap(
				A2(
					$elm$core$List$filterMap,
					$elm$core$Basics$identity,
					_List_fromArray(
						[
							$author$project$Material$Drawer$Dismissible$rootCs,
							$author$project$Material$Drawer$Dismissible$dismissibleCs,
							$author$project$Material$Drawer$Dismissible$openProp(config_),
							$author$project$Material$Drawer$Dismissible$closeHandler(config_)
						])),
				additionalAttributes),
			nodes);
	});
var $author$project$Material$TopAppBar$fixedAdjust = $elm$html$Html$Attributes$class('mdc-top-app-bar--fixed-adjust');
var $author$project$Material$Typography$headline5 = $elm$html$Html$Attributes$class('mdc-typography--headline5');
var $author$project$Demo$CatalogPage$hero = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'display', '-ms-flexbox'),
		A2($elm$html$Html$Attributes$style, 'display', 'flex'),
		A2($elm$html$Html$Attributes$style, '-ms-flex-flow', 'row nowrap'),
		A2($elm$html$Html$Attributes$style, 'flex-flow', 'row nowrap'),
		A2($elm$html$Html$Attributes$style, '-ms-flex-align', 'center'),
		A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
		A2($elm$html$Html$Attributes$style, '-ms-flex-pack', 'center'),
		A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
		A2($elm$html$Html$Attributes$style, 'min-height', '360px'),
		A2($elm$html$Html$Attributes$style, 'padding', '24px'),
		A2($elm$html$Html$Attributes$style, 'background-color', '#f2f2f2')
	]);
var $author$project$Material$List$avatarListCs = function (_v0) {
	var avatarList = _v0.bu;
	return avatarList ? $elm$core$Maybe$Just(
		$elm$html$Html$Attributes$class('mdc-list--avatar-list')) : $elm$core$Maybe$Nothing;
};
var $elm$json$Json$Decode$andThen = _Json_andThen;
var $elm$core$Maybe$andThen = F2(
	function (callback, maybeValue) {
		if (!maybeValue.$) {
			var value = maybeValue.a;
			return callback(value);
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $elm$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (n <= 0) {
				return list;
			} else {
				if (!list.b) {
					return list;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs;
					n = $temp$n;
					list = $temp$list;
					continue drop;
				}
			}
		}
	});
var $elm$json$Json$Decode$fail = _Json_fail;
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$json$Json$Decode$int = _Json_decodeInt;
var $author$project$Material$List$clickHandler = function (listItems) {
	var getOnClick = function (listItem_) {
		switch (listItem_.$) {
			case 0:
				var onClick = listItem_.a.bc;
				return $elm$core$Maybe$Just(onClick);
			case 1:
				return $elm$core$Maybe$Nothing;
			default:
				return $elm$core$Maybe$Nothing;
		}
	};
	var nthOnClick = function (index) {
		return A2(
			$elm$core$Maybe$andThen,
			$elm$core$Basics$identity,
			$elm$core$List$head(
				A2(
					$elm$core$List$drop,
					index,
					A2(
						$elm$core$List$filterMap,
						$elm$core$Basics$identity,
						A2($elm$core$List$map, getOnClick, listItems)))));
	};
	var mergedClickHandler = A2(
		$elm$json$Json$Decode$andThen,
		function (index) {
			var _v0 = nthOnClick(index);
			if (!_v0.$) {
				var msg_ = _v0.a;
				return $elm$json$Json$Decode$succeed(msg_);
			} else {
				return $elm$json$Json$Decode$fail('');
			}
		},
		A2(
			$elm$json$Json$Decode$at,
			_List_fromArray(
				['detail', 'index']),
			$elm$json$Json$Decode$int));
	return $elm$core$Maybe$Just(
		A2($elm$html$Html$Events$on, 'MDCList:action', mergedClickHandler));
};
var $author$project$Material$List$denseCs = function (_v0) {
	var dense = _v0.bA;
	return dense ? $elm$core$Maybe$Just(
		$elm$html$Html$Attributes$class('mdc-list--dense')) : $elm$core$Maybe$Nothing;
};
var $author$project$Material$List$nonInteractiveCs = function (_v0) {
	var nonInteractive = _v0.bP;
	return nonInteractive ? $elm$core$Maybe$Just(
		$elm$html$Html$Attributes$class('mdc-list--non-interactive')) : $elm$core$Maybe$Nothing;
};
var $author$project$Material$List$rootCs = $elm$core$Maybe$Just(
	$elm$html$Html$Attributes$class('mdc-list'));
var $elm$json$Json$Encode$list = F2(
	function (func, entries) {
		return _Json_wrap(
			A3(
				$elm$core$List$foldl,
				_Json_addEntry(func),
				_Json_emptyArray(0),
				entries));
	});
var $author$project$Material$List$selectedIndexProp = function (listItems) {
	var selectedIndex = A2(
		$elm$core$List$filterMap,
		$elm$core$Basics$identity,
		A2(
			$elm$core$List$indexedMap,
			F2(
				function (index, listItem_) {
					switch (listItem_.$) {
						case 0:
							var selection = listItem_.a.de;
							return (!_Utils_eq(selection, $elm$core$Maybe$Nothing)) ? $elm$core$Maybe$Just(index) : $elm$core$Maybe$Nothing;
						case 1:
							return $elm$core$Maybe$Nothing;
						default:
							return $elm$core$Maybe$Nothing;
					}
				}),
			A2(
				$elm$core$List$filter,
				function (listItem_) {
					switch (listItem_.$) {
						case 0:
							return true;
						case 1:
							return false;
						default:
							return false;
					}
				},
				listItems)));
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$Attributes$property,
			'selectedIndex',
			A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$int, selectedIndex)));
};
var $author$project$Material$List$twoLineCs = function (_v0) {
	var twoLine = _v0.cb;
	return twoLine ? $elm$core$Maybe$Just(
		$elm$html$Html$Attributes$class('mdc-list--two-line')) : $elm$core$Maybe$Nothing;
};
var $author$project$Material$List$wrapFocusProp = function (_v0) {
	var wrapFocus = _v0.cg;
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$Attributes$property,
			'wrapFocus',
			$elm$json$Json$Encode$bool(wrapFocus)));
};
var $author$project$Material$List$list = F3(
	function (config_, firstListItem, remainingListItems) {
		var additionalAttributes = config_.br;
		var listItems = A2($elm$core$List$cons, firstListItem, remainingListItems);
		return A3(
			$elm$html$Html$node,
			'mdc-list',
			_Utils_ap(
				A2(
					$elm$core$List$filterMap,
					$elm$core$Basics$identity,
					_List_fromArray(
						[
							$author$project$Material$List$rootCs,
							$author$project$Material$List$nonInteractiveCs(config_),
							$author$project$Material$List$denseCs(config_),
							$author$project$Material$List$avatarListCs(config_),
							$author$project$Material$List$twoLineCs(config_),
							$author$project$Material$List$wrapFocusProp(config_),
							$author$project$Material$List$clickHandler(listItems),
							$author$project$Material$List$selectedIndexProp(listItems)
						])),
				additionalAttributes),
			A2(
				$elm$core$List$map,
				function (listItem_) {
					switch (listItem_.$) {
						case 0:
							var node = listItem_.a.a7;
							return node;
						case 1:
							var node = listItem_.a;
							return node;
						default:
							var node = listItem_.a;
							return node;
					}
				},
				listItems));
	});
var $author$project$Material$List$Item$Internal$ListItem = function (a) {
	return {$: 0, a: a};
};
var $author$project$Material$List$Item$activatedCs = function (_v0) {
	var selection = _v0.de;
	return _Utils_eq(
		selection,
		$elm$core$Maybe$Just(1)) ? $elm$core$Maybe$Just(
		$elm$html$Html$Attributes$class('mdc-list-item--activated')) : $elm$core$Maybe$Nothing;
};
var $author$project$Material$List$Item$ariaSelectedAttr = function (_v0) {
	var selection = _v0.de;
	return (!_Utils_eq(selection, $elm$core$Maybe$Nothing)) ? $elm$core$Maybe$Just(
		A2($elm$html$Html$Attributes$attribute, 'aria-selected', 'true')) : $elm$core$Maybe$Nothing;
};
var $author$project$Material$List$Item$disabledCs = function (_v0) {
	var disabled = _v0.ad;
	return disabled ? $elm$core$Maybe$Just(
		$elm$html$Html$Attributes$class('mdc-list-item--disabled')) : $elm$core$Maybe$Nothing;
};
var $author$project$Material$List$Item$hrefAttr = function (_v0) {
	var href = _v0.ak;
	return A2($elm$core$Maybe$map, $elm$html$Html$Attributes$href, href);
};
var $author$project$Material$List$Item$listItemCs = $elm$core$Maybe$Just(
	$elm$html$Html$Attributes$class('mdc-list-item'));
var $author$project$Material$List$Item$Internal$Selected = 0;
var $author$project$Material$List$Item$selectedCs = function (_v0) {
	var selection = _v0.de;
	return _Utils_eq(
		selection,
		$elm$core$Maybe$Just(0)) ? $elm$core$Maybe$Just(
		$elm$html$Html$Attributes$class('mdc-list-item--selected')) : $elm$core$Maybe$Nothing;
};
var $author$project$Material$List$Item$targetAttr = function (_v0) {
	var href = _v0.ak;
	var target = _v0.b8;
	return (!_Utils_eq(href, $elm$core$Maybe$Nothing)) ? A2($elm$core$Maybe$map, $elm$html$Html$Attributes$target, target) : $elm$core$Maybe$Nothing;
};
var $author$project$Material$List$Item$listItemView = F2(
	function (config_, nodes) {
		var additionalAttributes = config_.br;
		var href = config_.ak;
		return function (attributes) {
			return (!_Utils_eq(href, $elm$core$Maybe$Nothing)) ? A3(
				$elm$html$Html$node,
				'mdc-list-item',
				_List_Nil,
				_List_fromArray(
					[
						A2($elm$html$Html$a, attributes, nodes)
					])) : A3($elm$html$Html$node, 'mdc-list-item', attributes, nodes);
		}(
			_Utils_ap(
				A2(
					$elm$core$List$filterMap,
					$elm$core$Basics$identity,
					_List_fromArray(
						[
							$author$project$Material$List$Item$listItemCs,
							$author$project$Material$List$Item$hrefAttr(config_),
							$author$project$Material$List$Item$targetAttr(config_),
							$author$project$Material$List$Item$disabledCs(config_),
							$author$project$Material$List$Item$selectedCs(config_),
							$author$project$Material$List$Item$activatedCs(config_),
							$author$project$Material$List$Item$ariaSelectedAttr(config_)
						])),
				additionalAttributes));
	});
var $author$project$Material$List$Item$listItem = F2(
	function (_v0, nodes) {
		var config_ = _v0;
		var additionalAttributes = config_.br;
		var href = config_.ak;
		return $author$project$Material$List$Item$Internal$ListItem(
			_Utils_update(
				config_,
				{
					a7: A2($author$project$Material$List$Item$listItemView, config_, nodes)
				}));
	});
var $author$project$Material$TopAppBar$navigationIcon = $elm$html$Html$Attributes$class('mdc-top-app-bar__navigation-icon');
var $elm$html$Html$p = _VirtualDom_node('p');
var $author$project$Material$TopAppBar$Regular = 0;
var $author$project$Material$TopAppBar$denseCs = function (_v0) {
	var dense = _v0.bA;
	return dense ? $elm$core$Maybe$Just(
		$elm$html$Html$Attributes$class('mdc-top-app-bar--dense')) : $elm$core$Maybe$Nothing;
};
var $author$project$Material$TopAppBar$fixedCs = function (_v0) {
	var fixed = _v0.bF;
	return fixed ? $elm$core$Maybe$Just(
		$elm$html$Html$Attributes$class('mdc-top-app-bar--fixed')) : $elm$core$Maybe$Nothing;
};
var $author$project$Material$TopAppBar$rootCs = $elm$core$Maybe$Just(
	$elm$html$Html$Attributes$class('mdc-top-app-bar'));
var $author$project$Material$TopAppBar$variantCs = function (variant) {
	switch (variant) {
		case 0:
			return $elm$core$Maybe$Nothing;
		case 1:
			return $elm$core$Maybe$Just(
				$elm$html$Html$Attributes$class('mdc-top-app-bar--short'));
		case 2:
			return $elm$core$Maybe$Just(
				$elm$html$Html$Attributes$class('mdc-top-app-bar--short mdc-top-app-bar--short-collapsed'));
		default:
			return $elm$core$Maybe$Just(
				$elm$html$Html$Attributes$class('mdc-top-app-bar--prominent'));
	}
};
var $author$project$Material$TopAppBar$genericTopAppBar = F3(
	function (variant, config_, nodes) {
		var additionalAttributes = config_.br;
		return A3(
			$elm$html$Html$node,
			'mdc-top-app-bar',
			_Utils_ap(
				A2(
					$elm$core$List$filterMap,
					$elm$core$Basics$identity,
					_List_fromArray(
						[
							$author$project$Material$TopAppBar$rootCs,
							$author$project$Material$TopAppBar$variantCs(variant),
							$author$project$Material$TopAppBar$denseCs(config_),
							$author$project$Material$TopAppBar$fixedCs(config_)
						])),
				additionalAttributes),
			nodes);
	});
var $author$project$Material$TopAppBar$regular = F2(
	function (config_, nodes) {
		return A3($author$project$Material$TopAppBar$genericTopAppBar, 0, config_, nodes);
	});
var $author$project$Material$List$Item$graphic = F2(
	function (additionalAttributes, nodes) {
		return A2(
			$elm$html$Html$div,
			A2(
				$elm$core$List$cons,
				$elm$html$Html$Attributes$class('mdc-list-item__graphic'),
				additionalAttributes),
			nodes);
	});
var $elm$html$Html$img = _VirtualDom_node('img');
var $author$project$Demo$CatalogPage$resourcesGraphic = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'width', '30px'),
		A2($elm$html$Html$Attributes$style, 'height', '30px')
	]);
var $author$project$Material$List$Item$setHref = F2(
	function (href, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{ak: href});
	});
var $author$project$Material$List$Item$setTarget = F2(
	function (target, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{b8: target});
	});
var $elm$html$Html$Attributes$src = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'src',
		_VirtualDom_noJavaScriptOrHtmlUri(url));
};
var $author$project$Demo$CatalogPage$resourcesList = function (_v0) {
	var materialDesignGuidelines = _v0.c3;
	var documentation = _v0.cT;
	var sourceCode = _v0.df;
	return A3(
		$author$project$Material$List$list,
		$author$project$Material$List$config,
		A2(
			$author$project$Material$List$Item$listItem,
			A2(
				$author$project$Material$List$Item$setTarget,
				$elm$core$Maybe$Just('_blank'),
				A2($author$project$Material$List$Item$setHref, materialDesignGuidelines, $author$project$Material$List$Item$config)),
			_List_fromArray(
				[
					A2(
					$author$project$Material$List$Item$graphic,
					$author$project$Demo$CatalogPage$resourcesGraphic,
					_List_fromArray(
						[
							A2(
							$elm$html$Html$img,
							A2(
								$elm$core$List$cons,
								$elm$html$Html$Attributes$src('images/ic_material_design_24px.svg'),
								$author$project$Demo$CatalogPage$resourcesGraphic),
							_List_Nil)
						])),
					$elm$html$Html$text('Material Design Guidelines')
				])),
		_List_fromArray(
			[
				A2(
				$author$project$Material$List$Item$listItem,
				A2(
					$author$project$Material$List$Item$setTarget,
					$elm$core$Maybe$Just('_blank'),
					A2($author$project$Material$List$Item$setHref, documentation, $author$project$Material$List$Item$config)),
				_List_fromArray(
					[
						A2(
						$author$project$Material$List$Item$graphic,
						$author$project$Demo$CatalogPage$resourcesGraphic,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$img,
								A2(
									$elm$core$List$cons,
									$elm$html$Html$Attributes$src('images/ic_drive_document_24px.svg'),
									$author$project$Demo$CatalogPage$resourcesGraphic),
								_List_Nil)
							])),
						$elm$html$Html$text('Documentation')
					])),
				A2(
				$author$project$Material$List$Item$listItem,
				A2(
					$author$project$Material$List$Item$setTarget,
					$elm$core$Maybe$Just('_blank'),
					A2($author$project$Material$List$Item$setHref, sourceCode, $author$project$Material$List$Item$config)),
				_List_fromArray(
					[
						A2(
						$author$project$Material$List$Item$graphic,
						$author$project$Demo$CatalogPage$resourcesGraphic,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$img,
								A2(
									$elm$core$List$cons,
									$elm$html$Html$Attributes$src('images/ic_code_24px.svg'),
									$author$project$Demo$CatalogPage$resourcesGraphic),
								_List_Nil)
							])),
						$elm$html$Html$text('Source Code')
					]))
			]));
};
var $elm$html$Html$section = _VirtualDom_node('section');
var $author$project$Material$TopAppBar$row = F2(
	function (attributes, nodes) {
		return A2(
			$elm$html$Html$section,
			_Utils_ap(
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('mdc-top-app-bar__row')
					]),
				attributes),
			nodes);
	});
var $author$project$Material$TopAppBar$section = F2(
	function (attributes, nodes) {
		return A2(
			$elm$html$Html$section,
			_Utils_ap(
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('mdc-top-app-bar__section')
					]),
				attributes),
			nodes);
	});
var $author$project$Material$Drawer$Dismissible$setAttributes = F2(
	function (additionalAttributes, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{br: additionalAttributes});
	});
var $author$project$Material$IconButton$setAttributes = F2(
	function (additionalAttributes, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{br: additionalAttributes});
	});
var $author$project$Material$IconButton$setOnClick = F2(
	function (onClick, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{
				bc: $elm$core$Maybe$Just(onClick)
			});
	});
var $author$project$Material$Drawer$Dismissible$setOpen = F2(
	function (open, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{u: open});
	});
var $author$project$Material$List$Item$setSelected = F2(
	function (selection, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{de: selection});
	});
var $author$project$Material$TopAppBar$title = $elm$html$Html$Attributes$class('mdc-top-app-bar__title');
var $author$project$Demo$CatalogPage$view = F3(
	function (lift, catalogPageConfig, catalogPage) {
		var toggleCatalogDrawer = catalogPageConfig.bC ? catalogPageConfig.cl : catalogPageConfig.cw;
		return A2(
			$elm$html$Html$div,
			$author$project$Demo$CatalogPage$catalogPageContainer,
			_List_fromArray(
				[
					A2(
					$author$project$Material$TopAppBar$regular,
					$author$project$Material$TopAppBar$config,
					_List_fromArray(
						[
							A2(
							$author$project$Material$TopAppBar$row,
							_List_Nil,
							_List_fromArray(
								[
									A2(
									$author$project$Material$TopAppBar$section,
									_List_fromArray(
										[$author$project$Material$TopAppBar$alignStart]),
									_List_fromArray(
										[
											A2(
											$author$project$Material$IconButton$iconButton,
											A2(
												$author$project$Material$IconButton$setOnClick,
												toggleCatalogDrawer,
												A2(
													$author$project$Material$IconButton$setAttributes,
													_List_fromArray(
														[$author$project$Material$TopAppBar$navigationIcon]),
													$author$project$Material$IconButton$config)),
											$author$project$Material$IconButton$icon('menu')),
											A2(
											$elm$html$Html$span,
											_List_fromArray(
												[
													$author$project$Material$TopAppBar$title,
													A2($elm$html$Html$Attributes$style, 'text-transform', 'uppercase'),
													A2($elm$html$Html$Attributes$style, 'font-weight', '400')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Material Components for Elm')
												]))
										]))
								]))
						])),
					A2(
					$elm$html$Html$div,
					$author$project$Demo$CatalogPage$demoPanel,
					_List_fromArray(
						[
							A2(
							$author$project$Material$Drawer$Dismissible$drawer,
							A2(
								$author$project$Material$Drawer$Dismissible$setAttributes,
								_List_fromArray(
									[
										$author$project$Material$TopAppBar$fixedAdjust,
										A2($elm$html$Html$Attributes$style, 'z-index', '1')
									]),
								A2($author$project$Material$Drawer$Dismissible$setOpen, catalogPageConfig.bC, $author$project$Material$Drawer$Dismissible$config)),
							_List_fromArray(
								[
									A2(
									$author$project$Material$Drawer$Dismissible$content,
									_List_Nil,
									_List_fromArray(
										[
											function () {
											var _v0 = A2(
												$elm$core$List$map,
												function (_v1) {
													var url = _v1.a;
													var label = _v1.b;
													return A2(
														$author$project$Material$List$Item$listItem,
														A2(
															$author$project$Material$List$Item$setHref,
															$elm$core$Maybe$Just(
																$author$project$Demo$Url$toString(url)),
															A2(
																$author$project$Material$List$Item$setSelected,
																_Utils_eq(catalogPageConfig.a, url) ? $elm$core$Maybe$Just($author$project$Material$List$Item$activated) : $elm$core$Maybe$Nothing,
																$author$project$Material$List$Item$config)),
														_List_fromArray(
															[
																$elm$html$Html$text(label)
															]));
												},
												$author$project$Demo$CatalogPage$catalogDrawerItems);
											if (_v0.b) {
												var listItem = _v0.a;
												var listItems = _v0.b;
												return A3($author$project$Material$List$list, $author$project$Material$List$config, listItem, listItems);
											} else {
												return $elm$html$Html$text('');
											}
										}()
										]))
								])),
							A2(
							$elm$html$Html$map,
							lift,
							A2(
								$elm$html$Html$div,
								A2(
									$elm$core$List$cons,
									$author$project$Material$TopAppBar$fixedAdjust,
									A2($elm$core$List$cons, $author$project$Material$Drawer$Dismissible$appContent, $author$project$Demo$CatalogPage$demoContent)),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$div,
										$author$project$Demo$CatalogPage$demoContentTransition,
										A2(
											$elm$core$List$cons,
											A2(
												$elm$html$Html$h1,
												_List_fromArray(
													[$author$project$Material$Typography$headline5]),
												_List_fromArray(
													[
														$elm$html$Html$text(catalogPage.dh)
													])),
											A2(
												$elm$core$List$cons,
												A2(
													$elm$html$Html$p,
													_List_fromArray(
														[$author$project$Material$Typography$body1]),
													_List_fromArray(
														[
															$elm$html$Html$text(catalogPage.c9)
														])),
												A2(
													$elm$core$List$cons,
													A2($elm$html$Html$div, $author$project$Demo$CatalogPage$hero, catalogPage.cZ),
													A2(
														$elm$core$List$cons,
														A2(
															$elm$html$Html$h2,
															A2($elm$core$List$cons, $author$project$Material$Typography$headline6, $author$project$Demo$CatalogPage$demoTitle),
															_List_fromArray(
																[
																	$elm$html$Html$text('Resources')
																])),
														A2(
															$elm$core$List$cons,
															$author$project$Demo$CatalogPage$resourcesList(catalogPage.db),
															A2(
																$elm$core$List$cons,
																A2(
																	$elm$html$Html$h2,
																	A2($elm$core$List$cons, $author$project$Material$Typography$headline6, $author$project$Demo$CatalogPage$demoTitle),
																	_List_fromArray(
																		[
																			$elm$html$Html$text('Demos')
																		])),
																catalogPage.cS)))))))
									])))
						]))
				]));
	});
var $author$project$Demo$Checkbox$Changed = function (a) {
	return {$: 0, a: a};
};
var $elm$svg$Svg$Attributes$d = _VirtualDom_attribute('d');
var $elm$svg$Svg$path = $elm$svg$Svg$trustedNode('path');
var $author$project$Material$Checkbox$backgroundElt = A2(
	$elm$html$Html$div,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('mdc-checkbox__background')
		]),
	_List_fromArray(
		[
			A2(
			$elm$svg$Svg$svg,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$class('mdc-checkbox__checkmark'),
					$elm$svg$Svg$Attributes$viewBox('0 0 24 24')
				]),
			_List_fromArray(
				[
					A2(
					$elm$svg$Svg$path,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$class('mdc-checkbox__checkmark-path'),
							$elm$svg$Svg$Attributes$fill('none'),
							$elm$svg$Svg$Attributes$d('M1.73,12.91 8.1,19.28 22.79,4.59')
						]),
					_List_Nil)
				])),
			A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('mdc-checkbox__mixedmark')
				]),
			_List_Nil)
		]));
var $author$project$Material$Checkbox$checkedProp = function (_v0) {
	var state = _v0.cH;
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$Attributes$property,
			'checked',
			$elm$json$Json$Encode$bool(
				_Utils_eq(
					state,
					$elm$core$Maybe$Just(1)))));
};
var $author$project$Material$Checkbox$disabledProp = function (_v0) {
	var disabled = _v0.ad;
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$Attributes$property,
			'disabled',
			$elm$json$Json$Encode$bool(disabled)));
};
var $author$project$Material$Checkbox$Internal$Indeterminate = 2;
var $author$project$Material$Checkbox$indeterminateProp = function (_v0) {
	var state = _v0.cH;
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$Attributes$property,
			'indeterminate',
			$elm$json$Json$Encode$bool(
				_Utils_eq(
					state,
					$elm$core$Maybe$Just(2)))));
};
var $author$project$Material$Checkbox$changeHandler = function (_v0) {
	var onChange = _v0.bb;
	return A2(
		$elm$core$Maybe$map,
		function (msg) {
			return A2(
				$elm$html$Html$Events$on,
				'change',
				$elm$json$Json$Decode$succeed(msg));
		},
		onChange);
};
var $elm$html$Html$input = _VirtualDom_node('input');
var $elm$html$Html$Attributes$type_ = $elm$html$Html$Attributes$stringProperty('type');
var $author$project$Material$Checkbox$nativeControlElt = function (config_) {
	return A2(
		$elm$html$Html$input,
		A2(
			$elm$core$List$filterMap,
			$elm$core$Basics$identity,
			_List_fromArray(
				[
					$elm$core$Maybe$Just(
					$elm$html$Html$Attributes$type_('checkbox')),
					$elm$core$Maybe$Just(
					$elm$html$Html$Attributes$class('mdc-checkbox__native-control')),
					$author$project$Material$Checkbox$checkedProp(config_),
					$author$project$Material$Checkbox$indeterminateProp(config_),
					$author$project$Material$Checkbox$changeHandler(config_)
				])),
		_List_Nil);
};
var $author$project$Material$Checkbox$rippleElt = A2(
	$elm$html$Html$div,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('mdc-checkbox__ripple')
		]),
	_List_Nil);
var $author$project$Material$Checkbox$rootCs = $elm$core$Maybe$Just(
	$elm$html$Html$Attributes$class('mdc-checkbox'));
var $author$project$Material$Checkbox$touchCs = function (_v0) {
	var touch = _v0.aN;
	return touch ? $elm$core$Maybe$Just(
		$elm$html$Html$Attributes$class('mdc-checkbox--touch')) : $elm$core$Maybe$Nothing;
};
var $author$project$Material$Checkbox$checkbox = function (config_) {
	var touch = config_.aN;
	var additionalAttributes = config_.br;
	var wrapTouch = function (node) {
		return touch ? A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('mdc-touch-target-wrapper')
				]),
			_List_fromArray(
				[node])) : node;
	};
	return wrapTouch(
		A3(
			$elm$html$Html$node,
			'mdc-checkbox',
			_Utils_ap(
				A2(
					$elm$core$List$filterMap,
					$elm$core$Basics$identity,
					_List_fromArray(
						[
							$author$project$Material$Checkbox$rootCs,
							$author$project$Material$Checkbox$touchCs(config_),
							$author$project$Material$Checkbox$checkedProp(config_),
							$author$project$Material$Checkbox$indeterminateProp(config_),
							$author$project$Material$Checkbox$disabledProp(config_)
						])),
				additionalAttributes),
			_List_fromArray(
				[
					$author$project$Material$Checkbox$nativeControlElt(config_),
					$author$project$Material$Checkbox$backgroundElt,
					$author$project$Material$Checkbox$rippleElt
				])));
};
var $author$project$Material$Checkbox$Internal$Config = $elm$core$Basics$identity;
var $author$project$Material$Checkbox$config = {br: _List_Nil, ad: false, bb: $elm$core$Maybe$Nothing, cH: $elm$core$Maybe$Nothing, aN: true};
var $author$project$Material$Checkbox$indeterminate = 2;
var $author$project$Material$Checkbox$setAttributes = F2(
	function (additionalAttributes, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{br: additionalAttributes});
	});
var $author$project$Material$Checkbox$setOnChange = F2(
	function (onChange, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{
				bb: $elm$core$Maybe$Just(onChange)
			});
	});
var $author$project$Material$Checkbox$setState = F2(
	function (state, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{cH: state});
	});
var $author$project$Demo$Checkbox$checkbox = F3(
	function (index, model, attributes) {
		var state = A2(
			$elm$core$Maybe$withDefault,
			$author$project$Material$Checkbox$indeterminate,
			A2($elm$core$Dict$get, index, model.Y));
		return $author$project$Material$Checkbox$checkbox(
			A2(
				$author$project$Material$Checkbox$setAttributes,
				attributes,
				A2(
					$author$project$Material$Checkbox$setOnChange,
					$author$project$Demo$Checkbox$Changed(index),
					A2(
						$author$project$Material$Checkbox$setState,
						$elm$core$Maybe$Just(state),
						$author$project$Material$Checkbox$config))));
	});
var $author$project$Demo$Checkbox$Focus = function (a) {
	return {$: 1, a: a};
};
var $author$project$Demo$Checkbox$focusCheckbox = A2(
	$elm$html$Html$div,
	_List_Nil,
	_List_fromArray(
		[
			$author$project$Material$Checkbox$checkbox(
			A2(
				$author$project$Material$Checkbox$setAttributes,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$id('my-checkbox')
					]),
				$author$project$Material$Checkbox$config)),
			$elm$html$Html$text('\u00A0'),
			A2(
			$author$project$Material$Button$raised,
			A2(
				$author$project$Material$Button$setOnClick,
				$author$project$Demo$Checkbox$Focus('my-checkbox'),
				$author$project$Material$Button$config),
			'Focus')
		]));
var $author$project$Demo$Checkbox$heroMargin = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'margin', '8px 16px')
	]);
var $author$project$Demo$Checkbox$heroCheckboxes = function (model) {
	return _List_fromArray(
		[
			A3($author$project$Demo$Checkbox$checkbox, 'checked-hero-checkbox', model, $author$project$Demo$Checkbox$heroMargin),
			A3($author$project$Demo$Checkbox$checkbox, 'unchecked-hero-checkbox', model, $author$project$Demo$Checkbox$heroMargin)
		]);
};
var $author$project$Demo$Checkbox$view = function (model) {
	return {
		cS: _List_fromArray(
			[
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Unchecked')
					])),
				A3($author$project$Demo$Checkbox$checkbox, 'unchecked-checkbox', model, _List_Nil),
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Indeterminate')
					])),
				A3($author$project$Demo$Checkbox$checkbox, 'indeterminate-checkbox', model, _List_Nil),
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Checked')
					])),
				A3($author$project$Demo$Checkbox$checkbox, 'checked-checkbox', model, _List_Nil),
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Focus Checkbox')
					])),
				$author$project$Demo$Checkbox$focusCheckbox
			]),
		cZ: $author$project$Demo$Checkbox$heroCheckboxes(model),
		c9: 'Checkboxes allow the user to select multiple options from a set.',
		db: {
			cT: $elm$core$Maybe$Just('https://package.elm-lang.org/packages/aforemny/material-components-web-elm/latest/Material-Checkbox'),
			c3: $elm$core$Maybe$Just('https://material.io/go/design-checkboxes'),
			df: $elm$core$Maybe$Just('https://github.com/material-components/material-components-web/tree/master/packages/mdc-checkbox')
		},
		dh: 'Checkbox'
	};
};
var $author$project$Material$Chip$Action$Internal$Chip = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $author$project$Material$Chip$Action$chip = $author$project$Material$Chip$Action$Internal$Chip;
var $author$project$Material$ChipSet$Action$chipCs = $elm$core$Maybe$Just(
	$elm$html$Html$Attributes$class('mdc-chip'));
var $author$project$Material$ChipSet$Action$chipTouchCs = $elm$core$Maybe$Just(
	$elm$html$Html$Attributes$class('mdc-chip--touch'));
var $author$project$Material$ChipSet$Action$interactionHandler = function (_v0) {
	var onClick = _v0.bc;
	return A2(
		$elm$core$Maybe$map,
		A2(
			$elm$core$Basics$composeL,
			$elm$html$Html$Events$on('MDCChip:interaction'),
			$elm$json$Json$Decode$succeed),
		onClick);
};
var $author$project$Material$ChipSet$Action$leadingIconElt = function (_v0) {
	var icon = _v0.c;
	return A2(
		$elm$core$Maybe$map,
		$elm$html$Html$map($elm$core$Basics$never),
		function () {
			if (!icon.$) {
				if (!icon.a.$) {
					var node = icon.a.a.a7;
					var attributes = icon.a.a.aW;
					var nodes = icon.a.a.a8;
					return $elm$core$Maybe$Just(
						A2(
							node,
							A2(
								$elm$core$List$cons,
								$elm$html$Html$Attributes$class('mdc-chip__icon mdc-chip__icon--leading'),
								attributes),
							nodes));
				} else {
					var node = icon.a.a.a7;
					var attributes = icon.a.a.aW;
					var nodes = icon.a.a.a8;
					return $elm$core$Maybe$Just(
						A2(
							node,
							A2(
								$elm$core$List$cons,
								$elm$svg$Svg$Attributes$class('mdc-chip__icon mdc-chip__icon--leading'),
								attributes),
							nodes));
				}
			} else {
				return $elm$core$Maybe$Nothing;
			}
		}());
};
var $author$project$Material$ChipSet$Action$chipPrimaryActionCs = $elm$html$Html$Attributes$class('mdc-chip__primary-action');
var $author$project$Material$ChipSet$Action$gridcellRole = A2($elm$html$Html$Attributes$attribute, 'role', 'gridcell');
var $author$project$Material$ChipSet$Action$buttonRole = A2($elm$html$Html$Attributes$attribute, 'role', 'button');
var $author$project$Material$ChipSet$Action$chipTextCs = $elm$html$Html$Attributes$class('mdc-chip__text');
var $author$project$Material$ChipSet$Action$textElt = function (label) {
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$span,
			_List_fromArray(
				[$author$project$Material$ChipSet$Action$chipTextCs, $author$project$Material$ChipSet$Action$buttonRole]),
			_List_fromArray(
				[
					$elm$html$Html$text(label)
				])));
};
var $author$project$Material$ChipSet$Action$touchElt = $elm$core$Maybe$Just(
	A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('mdc-chip__touch')
			]),
		_List_Nil));
var $author$project$Material$ChipSet$Action$primaryActionElt = function (label) {
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$span,
			_List_fromArray(
				[$author$project$Material$ChipSet$Action$chipPrimaryActionCs, $author$project$Material$ChipSet$Action$gridcellRole]),
			A2(
				$elm$core$List$filterMap,
				$elm$core$Basics$identity,
				_List_fromArray(
					[
						$author$project$Material$ChipSet$Action$textElt(label),
						$author$project$Material$ChipSet$Action$touchElt
					]))));
};
var $author$project$Material$ChipSet$Action$rippleElt = $elm$core$Maybe$Just(
	A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('mdc-chip__ripple')
			]),
		_List_Nil));
var $author$project$Material$ChipSet$Action$rowRole = $elm$core$Maybe$Just(
	A2($elm$html$Html$Attributes$attribute, 'role', 'row'));
var $author$project$Material$ChipSet$Action$chip = function (_v0) {
	var config_ = _v0.a;
	var additionalAttributes = config_.br;
	var label = _v0.b;
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('mdc-touch-target-wrapper')
			]),
		_List_fromArray(
			[
				A3(
				$elm$html$Html$node,
				'mdc-chip',
				_Utils_ap(
					A2(
						$elm$core$List$filterMap,
						$elm$core$Basics$identity,
						_List_fromArray(
							[
								$author$project$Material$ChipSet$Action$chipCs,
								$author$project$Material$ChipSet$Action$chipTouchCs,
								$author$project$Material$ChipSet$Action$rowRole,
								$author$project$Material$ChipSet$Action$interactionHandler(config_)
							])),
					additionalAttributes),
				A2(
					$elm$core$List$filterMap,
					$elm$core$Basics$identity,
					_List_fromArray(
						[
							$author$project$Material$ChipSet$Action$rippleElt,
							$author$project$Material$ChipSet$Action$leadingIconElt(config_),
							$author$project$Material$ChipSet$Action$primaryActionElt(label)
						])))
			]));
};
var $author$project$Material$ChipSet$Action$chipSetCs = $elm$html$Html$Attributes$class('mdc-chip-set');
var $author$project$Material$ChipSet$Action$gridRole = A2($elm$html$Html$Attributes$attribute, 'role', 'grid');
var $author$project$Material$ChipSet$Action$chipSet = F3(
	function (additionalAttributes, firstChip, otherChips) {
		return A3(
			$elm$html$Html$node,
			'mdc-chip-set',
			A2(
				$elm$core$List$cons,
				$author$project$Material$ChipSet$Action$chipSetCs,
				A2($elm$core$List$cons, $author$project$Material$ChipSet$Action$gridRole, additionalAttributes)),
			A2(
				$elm$core$List$map,
				$author$project$Material$ChipSet$Action$chip,
				A2($elm$core$List$cons, firstChip, otherChips)));
	});
var $author$project$Material$Chip$Action$Internal$Config = $elm$core$Basics$identity;
var $author$project$Material$Chip$Action$config = {br: _List_Nil, c: $elm$core$Maybe$Nothing, bc: $elm$core$Maybe$Nothing};
var $author$project$Material$Chip$Action$Internal$Icon = function (a) {
	return {$: 0, a: a};
};
var $author$project$Material$Chip$Action$customIcon = F3(
	function (node, attributes, nodes) {
		return $author$project$Material$Chip$Action$Internal$Icon(
			{aW: attributes, a7: node, a8: nodes});
	});
var $author$project$Material$Chip$Action$icon = function (iconName) {
	return A3(
		$author$project$Material$Chip$Action$customIcon,
		$elm$html$Html$i,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('material-icons')
			]),
		_List_fromArray(
			[
				$elm$html$Html$text(iconName)
			]));
};
var $author$project$Material$Chip$Action$setIcon = F2(
	function (icon_, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{c: icon_});
	});
var $author$project$Demo$Chips$actionChips = function (model) {
	var chip = function (_v0) {
		var iconName = _v0.a;
		var label = _v0.b;
		return A2(
			$author$project$Material$Chip$Action$chip,
			A2(
				$author$project$Material$Chip$Action$setIcon,
				$elm$core$Maybe$Just(
					$author$project$Material$Chip$Action$icon(iconName)),
				$author$project$Material$Chip$Action$config),
			label);
	};
	return A3(
		$author$project$Material$ChipSet$Action$chipSet,
		_List_Nil,
		chip(
			_Utils_Tuple2('event', 'Add to calendar')),
		A2(
			$elm$core$List$map,
			chip,
			_List_fromArray(
				[
					_Utils_Tuple2('bookmark', 'Bookmark'),
					_Utils_Tuple2('alarm', 'Set alarm'),
					_Utils_Tuple2('directions', 'Get directions')
				])));
};
var $author$project$Material$Chip$Action$Internal$SvgIcon = function (a) {
	return {$: 1, a: a};
};
var $author$project$Material$Chip$Action$svgIcon = F2(
	function (attributes, nodes) {
		return $author$project$Material$Chip$Action$Internal$SvgIcon(
			{aW: attributes, a7: $elm$svg$Svg$svg, a8: nodes});
	});
var $author$project$Demo$Chips$actionChipsWithCustomIcons = function (model) {
	return A3(
		$author$project$Material$ChipSet$Action$chipSet,
		_List_Nil,
		A2(
			$author$project$Material$Chip$Action$chip,
			A2(
				$author$project$Material$Chip$Action$setIcon,
				$elm$core$Maybe$Just(
					$author$project$Material$Chip$Action$icon('favorite')),
				$author$project$Material$Chip$Action$config),
			'Material Icons'),
		_List_fromArray(
			[
				A2(
				$author$project$Material$Chip$Action$chip,
				A2(
					$author$project$Material$Chip$Action$setIcon,
					$elm$core$Maybe$Just(
						A3(
							$author$project$Material$Chip$Action$customIcon,
							$elm$html$Html$i,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('fab fa-font-awesome')
								]),
							_List_Nil)),
					$author$project$Material$Chip$Action$config),
				'Font Awesome'),
				A2(
				$author$project$Material$Chip$Action$chip,
				A2(
					$author$project$Material$Chip$Action$setIcon,
					$elm$core$Maybe$Just(
						A2(
							$author$project$Material$Chip$Action$svgIcon,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$viewBox('0 0 100 100')
								]),
							$author$project$Demo$ElmLogo$elmLogo)),
					$author$project$Material$Chip$Action$config),
				'Font Awesome')
			]));
};
var $author$project$Demo$Chips$ExtraLarge = 4;
var $author$project$Demo$Chips$ExtraSmall = 0;
var $author$project$Demo$Chips$Large = 3;
var $author$project$Demo$Chips$Medium = 2;
var $author$project$Demo$Chips$SizeChanged = function (a) {
	return {$: 1, a: a};
};
var $author$project$Material$Chip$Choice$Internal$Chip = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $author$project$Material$Chip$Choice$chip = $author$project$Material$Chip$Choice$Internal$Chip;
var $author$project$Material$ChipSet$Choice$chipCs = $elm$core$Maybe$Just(
	$elm$html$Html$Attributes$class('mdc-chip'));
var $author$project$Material$ChipSet$Choice$chipTouchCs = $elm$core$Maybe$Just(
	$elm$html$Html$Attributes$class('mdc-chip--touch'));
var $author$project$Material$ChipSet$Choice$interactionHandler = function (msg) {
	return A2(
		$elm$core$Maybe$map,
		A2(
			$elm$core$Basics$composeL,
			$elm$html$Html$Events$on('MDCChip:interaction'),
			$elm$json$Json$Decode$succeed),
		msg);
};
var $author$project$Material$ChipSet$Choice$leadingIconElt = function (_v0) {
	var icon = _v0.c;
	return A2(
		$elm$core$Maybe$map,
		$elm$html$Html$map($elm$core$Basics$never),
		function () {
			if (!icon.$) {
				if (!icon.a.$) {
					var node = icon.a.a.a7;
					var attributes = icon.a.a.aW;
					var nodes = icon.a.a.a8;
					return $elm$core$Maybe$Just(
						A2(
							node,
							A2(
								$elm$core$List$cons,
								$elm$html$Html$Attributes$class('mdc-chip__icon mdc-chip__icon--leading'),
								attributes),
							nodes));
				} else {
					var node = icon.a.a.a7;
					var attributes = icon.a.a.aW;
					var nodes = icon.a.a.a8;
					return $elm$core$Maybe$Just(
						A2(
							node,
							A2(
								$elm$core$List$cons,
								$elm$svg$Svg$Attributes$class('mdc-chip__icon mdc-chip__icon--leading'),
								attributes),
							nodes));
				}
			} else {
				return $elm$core$Maybe$Nothing;
			}
		}());
};
var $author$project$Material$ChipSet$Choice$chipPrimaryActionCs = $elm$html$Html$Attributes$class('mdc-chip__primary-action');
var $author$project$Material$ChipSet$Choice$gridcellRole = A2($elm$html$Html$Attributes$attribute, 'role', 'gridcell');
var $author$project$Material$ChipSet$Choice$buttonRole = A2($elm$html$Html$Attributes$attribute, 'role', 'button');
var $author$project$Material$ChipSet$Choice$chipTextCs = $elm$html$Html$Attributes$class('mdc-chip__text');
var $author$project$Material$ChipSet$Choice$textElt = function (label) {
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$span,
			_List_fromArray(
				[$author$project$Material$ChipSet$Choice$chipTextCs, $author$project$Material$ChipSet$Choice$buttonRole]),
			_List_fromArray(
				[
					$elm$html$Html$text(label)
				])));
};
var $author$project$Material$ChipSet$Choice$touchElt = $elm$core$Maybe$Just(
	A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('mdc-chip__touch')
			]),
		_List_Nil));
var $author$project$Material$ChipSet$Choice$primaryActionElt = function (label) {
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$span,
			_List_fromArray(
				[$author$project$Material$ChipSet$Choice$chipPrimaryActionCs, $author$project$Material$ChipSet$Choice$gridcellRole]),
			A2(
				$elm$core$List$filterMap,
				$elm$core$Basics$identity,
				_List_fromArray(
					[
						$author$project$Material$ChipSet$Choice$textElt(label),
						$author$project$Material$ChipSet$Choice$touchElt
					]))));
};
var $author$project$Material$ChipSet$Choice$rippleElt = $elm$core$Maybe$Just(
	A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('mdc-chip__ripple')
			]),
		_List_Nil));
var $author$project$Material$ChipSet$Choice$rowRole = $elm$core$Maybe$Just(
	A2($elm$html$Html$Attributes$attribute, 'role', 'row'));
var $author$project$Material$ChipSet$Choice$selectedProp = function (selected) {
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$Attributes$property,
			'selected',
			$elm$json$Json$Encode$bool(selected)));
};
var $author$project$Material$ChipSet$Choice$chip = F4(
	function (selected, onChange, toLabel, _v0) {
		var config_ = _v0.a;
		var additionalAttributes = config_.br;
		var value = _v0.b;
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('mdc-touch-target-wrapper')
				]),
			_List_fromArray(
				[
					A3(
					$elm$html$Html$node,
					'mdc-chip',
					_Utils_ap(
						A2(
							$elm$core$List$filterMap,
							$elm$core$Basics$identity,
							_List_fromArray(
								[
									$author$project$Material$ChipSet$Choice$chipCs,
									$author$project$Material$ChipSet$Choice$chipTouchCs,
									$author$project$Material$ChipSet$Choice$rowRole,
									$author$project$Material$ChipSet$Choice$selectedProp(
									_Utils_eq(
										$elm$core$Maybe$Just(value),
										selected)),
									$author$project$Material$ChipSet$Choice$interactionHandler(
									A2(
										$elm$core$Maybe$map,
										$elm$core$Basics$apR(value),
										onChange))
								])),
						additionalAttributes),
					A2(
						$elm$core$List$filterMap,
						$elm$core$Basics$identity,
						_List_fromArray(
							[
								$author$project$Material$ChipSet$Choice$rippleElt,
								$author$project$Material$ChipSet$Choice$leadingIconElt(config_),
								$author$project$Material$ChipSet$Choice$primaryActionElt(
								toLabel(value))
							])))
				]));
	});
var $author$project$Material$ChipSet$Choice$chipSetChoiceCs = $elm$html$Html$Attributes$class('mdc-chip-set--choice');
var $author$project$Material$ChipSet$Choice$chipSetCs = $elm$html$Html$Attributes$class('mdc-chip-set');
var $author$project$Material$ChipSet$Choice$gridRole = A2($elm$html$Html$Attributes$attribute, 'role', 'grid');
var $author$project$Material$ChipSet$Choice$chipSet = F3(
	function (config_, firstChip, otherChips) {
		var selected = config_.i;
		var onChange = config_.bb;
		var toLabel = config_.ca;
		var additionalAttributes = config_.br;
		return A3(
			$elm$html$Html$node,
			'mdc-chip-set',
			A2(
				$elm$core$List$cons,
				$author$project$Material$ChipSet$Choice$chipSetCs,
				A2(
					$elm$core$List$cons,
					$author$project$Material$ChipSet$Choice$chipSetChoiceCs,
					A2($elm$core$List$cons, $author$project$Material$ChipSet$Choice$gridRole, additionalAttributes))),
			A2(
				$elm$core$List$map,
				A3($author$project$Material$ChipSet$Choice$chip, selected, onChange, toLabel),
				A2($elm$core$List$cons, firstChip, otherChips)));
	});
var $author$project$Material$Chip$Choice$Internal$Config = $elm$core$Basics$identity;
var $author$project$Material$Chip$Choice$config = {br: _List_Nil, c: $elm$core$Maybe$Nothing};
var $author$project$Material$ChipSet$Choice$Config = $elm$core$Basics$identity;
var $author$project$Material$ChipSet$Choice$config = function (_v0) {
	var toLabel = _v0.ca;
	return {br: _List_Nil, bb: $elm$core$Maybe$Nothing, i: $elm$core$Maybe$Nothing, ca: toLabel};
};
var $author$project$Material$ChipSet$Choice$setOnChange = F2(
	function (onChange, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{
				bb: $elm$core$Maybe$Just(onChange)
			});
	});
var $author$project$Material$ChipSet$Choice$setSelected = F2(
	function (selected, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{i: selected});
	});
var $author$project$Demo$Chips$choiceChips = function (model) {
	var toLabel = function (size) {
		switch (size) {
			case 0:
				return 'Extra Small';
			case 1:
				return 'Small';
			case 2:
				return 'Medium';
			case 3:
				return 'Large';
			default:
				return 'Extra Large';
		}
	};
	return A3(
		$author$project$Material$ChipSet$Choice$chipSet,
		A2(
			$author$project$Material$ChipSet$Choice$setOnChange,
			$author$project$Demo$Chips$SizeChanged,
			A2(
				$author$project$Material$ChipSet$Choice$setSelected,
				$elm$core$Maybe$Just(model.bk),
				$author$project$Material$ChipSet$Choice$config(
					{ca: toLabel}))),
		A2($author$project$Material$Chip$Choice$chip, $author$project$Material$Chip$Choice$config, 0),
		_List_fromArray(
			[
				A2($author$project$Material$Chip$Choice$chip, $author$project$Material$Chip$Choice$config, 1),
				A2($author$project$Material$Chip$Choice$chip, $author$project$Material$Chip$Choice$config, 2),
				A2($author$project$Material$Chip$Choice$chip, $author$project$Material$Chip$Choice$config, 3),
				A2($author$project$Material$Chip$Choice$chip, $author$project$Material$Chip$Choice$config, 4)
			]));
};
var $author$project$Demo$Chips$AccessoriesChanged = function (a) {
	return {$: 2, a: a};
};
var $author$project$Material$Chip$Filter$Internal$Chip = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $author$project$Material$Chip$Filter$chip = $author$project$Material$Chip$Filter$Internal$Chip;
var $elm$svg$Svg$Attributes$stroke = _VirtualDom_attribute('stroke');
var $author$project$Material$ChipSet$Filter$checkmarkElt = $elm$core$Maybe$Just(
	A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('mdc-chip__checkmark')
			]),
		_List_fromArray(
			[
				A2(
				$elm$svg$Svg$svg,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$class('mdc-chip__checkmark-svg'),
						$elm$svg$Svg$Attributes$viewBox('-2 -3 30 30')
					]),
				_List_fromArray(
					[
						A2(
						$elm$svg$Svg$path,
						_List_fromArray(
							[
								$elm$svg$Svg$Attributes$class('mdc-chip__checkmark-path'),
								$elm$svg$Svg$Attributes$fill('none'),
								$elm$svg$Svg$Attributes$stroke('black'),
								$elm$svg$Svg$Attributes$d('M1.73,12.91 8.1,19.28 22.79,4.59')
							]),
						_List_Nil)
					]))
			])));
var $author$project$Material$ChipSet$Filter$chipCs = $elm$core$Maybe$Just(
	$elm$html$Html$Attributes$class('mdc-chip'));
var $author$project$Material$ChipSet$Filter$chipTouchCs = $elm$core$Maybe$Just(
	$elm$html$Html$Attributes$class('mdc-chip--touch'));
var $author$project$Material$ChipSet$Filter$interactionHandler = function (_v0) {
	var onChange = _v0.bb;
	return A2(
		$elm$core$Maybe$map,
		A2(
			$elm$core$Basics$composeL,
			$elm$html$Html$Events$on('MDCChip:interaction'),
			$elm$json$Json$Decode$succeed),
		onChange);
};
var $author$project$Material$ChipSet$Filter$leadingIconElt = function (_v0) {
	var icon = _v0.c;
	var selected = _v0.i;
	return A2(
		$elm$core$Maybe$map,
		$elm$html$Html$map($elm$core$Basics$never),
		function () {
			if (!icon.$) {
				if (!icon.a.$) {
					var node = icon.a.a.a7;
					var attributes = icon.a.a.aW;
					var nodes = icon.a.a.a8;
					return $elm$core$Maybe$Just(
						A2(
							node,
							A2(
								$elm$core$List$cons,
								$elm$html$Html$Attributes$class('mdc-chip__icon mdc-chip__icon--leading'),
								attributes),
							nodes));
				} else {
					var node = icon.a.a.a7;
					var attributes = icon.a.a.aW;
					var nodes = icon.a.a.a8;
					return $elm$core$Maybe$Just(
						A2(
							node,
							A2(
								$elm$core$List$cons,
								$elm$svg$Svg$Attributes$class('mdc-chip__icon mdc-chip__icon--leading'),
								attributes),
							nodes));
				}
			} else {
				return $elm$core$Maybe$Nothing;
			}
		}());
};
var $author$project$Material$ChipSet$Filter$chipPrimaryActionCs = $elm$html$Html$Attributes$class('mdc-chip__primary-action');
var $author$project$Material$ChipSet$Filter$gridcellRole = A2($elm$html$Html$Attributes$attribute, 'role', 'gridcell');
var $author$project$Material$ChipSet$Filter$buttonRole = A2($elm$html$Html$Attributes$attribute, 'role', 'button');
var $author$project$Material$ChipSet$Filter$chipTextCs = $elm$html$Html$Attributes$class('mdc-chip__text');
var $author$project$Material$ChipSet$Filter$textElt = function (label) {
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$span,
			_List_fromArray(
				[$author$project$Material$ChipSet$Filter$chipTextCs, $author$project$Material$ChipSet$Filter$buttonRole]),
			_List_fromArray(
				[
					$elm$html$Html$text(label)
				])));
};
var $author$project$Material$ChipSet$Filter$touchElt = $elm$core$Maybe$Just(
	A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('mdc-chip__touch')
			]),
		_List_Nil));
var $author$project$Material$ChipSet$Filter$primaryActionElt = function (label) {
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$span,
			_List_fromArray(
				[$author$project$Material$ChipSet$Filter$chipPrimaryActionCs, $author$project$Material$ChipSet$Filter$gridcellRole]),
			A2(
				$elm$core$List$filterMap,
				$elm$core$Basics$identity,
				_List_fromArray(
					[
						$author$project$Material$ChipSet$Filter$textElt(label),
						$author$project$Material$ChipSet$Filter$touchElt
					]))));
};
var $author$project$Material$ChipSet$Filter$rippleElt = $elm$core$Maybe$Just(
	A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('mdc-chip__ripple')
			]),
		_List_Nil));
var $author$project$Material$ChipSet$Filter$rowRole = $elm$core$Maybe$Just(
	A2($elm$html$Html$Attributes$attribute, 'role', 'row'));
var $author$project$Material$ChipSet$Filter$selectedProp = function (_v0) {
	var selected = _v0.i;
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$Attributes$property,
			'selected',
			$elm$json$Json$Encode$bool(selected)));
};
var $author$project$Material$ChipSet$Filter$chip = function (_v0) {
	var config_ = _v0.a;
	var additionalAttributes = config_.br;
	var label = _v0.b;
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('mdc-touch-target-wrapper')
			]),
		_List_fromArray(
			[
				A3(
				$elm$html$Html$node,
				'mdc-chip',
				_Utils_ap(
					A2(
						$elm$core$List$filterMap,
						$elm$core$Basics$identity,
						_List_fromArray(
							[
								$author$project$Material$ChipSet$Filter$chipCs,
								$author$project$Material$ChipSet$Filter$chipTouchCs,
								$author$project$Material$ChipSet$Filter$rowRole,
								$author$project$Material$ChipSet$Filter$selectedProp(config_),
								$author$project$Material$ChipSet$Filter$interactionHandler(config_)
							])),
					additionalAttributes),
				A2(
					$elm$core$List$filterMap,
					$elm$core$Basics$identity,
					_List_fromArray(
						[
							$author$project$Material$ChipSet$Filter$rippleElt,
							$author$project$Material$ChipSet$Filter$leadingIconElt(config_),
							$author$project$Material$ChipSet$Filter$checkmarkElt,
							$author$project$Material$ChipSet$Filter$primaryActionElt(label)
						])))
			]));
};
var $author$project$Material$ChipSet$Filter$chipSetCs = $elm$html$Html$Attributes$class('mdc-chip-set');
var $author$project$Material$ChipSet$Filter$chipSetFilterCs = $elm$html$Html$Attributes$class('mdc-chip-set--filter');
var $author$project$Material$ChipSet$Filter$gridRole = A2($elm$html$Html$Attributes$attribute, 'role', 'grid');
var $author$project$Material$ChipSet$Filter$chipSet = F3(
	function (additionalAttributes, firstChip, otherChips) {
		return A3(
			$elm$html$Html$node,
			'mdc-chip-set',
			A2(
				$elm$core$List$cons,
				$author$project$Material$ChipSet$Filter$chipSetCs,
				A2(
					$elm$core$List$cons,
					$author$project$Material$ChipSet$Filter$chipSetFilterCs,
					A2($elm$core$List$cons, $author$project$Material$ChipSet$Filter$gridRole, additionalAttributes))),
			A2(
				$elm$core$List$map,
				$author$project$Material$ChipSet$Filter$chip,
				A2($elm$core$List$cons, firstChip, otherChips)));
	});
var $author$project$Material$Chip$Filter$Internal$Config = $elm$core$Basics$identity;
var $author$project$Material$Chip$Filter$config = {br: _List_Nil, c: $elm$core$Maybe$Nothing, bb: $elm$core$Maybe$Nothing, i: false};
var $author$project$Material$Chip$Filter$setOnChange = F2(
	function (onChange, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{
				bb: $elm$core$Maybe$Just(onChange)
			});
	});
var $author$project$Material$Chip$Filter$setSelected = F2(
	function (selected, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{i: selected});
	});
var $author$project$Demo$Chips$filterChips1 = function (model) {
	var chip = function (accessory) {
		return A2(
			$author$project$Material$Chip$Filter$chip,
			A2(
				$author$project$Material$Chip$Filter$setOnChange,
				$author$project$Demo$Chips$AccessoriesChanged(accessory),
				A2(
					$author$project$Material$Chip$Filter$setSelected,
					A2($elm$core$Set$member, accessory, model.I),
					$author$project$Material$Chip$Filter$config)),
			accessory);
	};
	return A3(
		$author$project$Material$ChipSet$Filter$chipSet,
		_List_Nil,
		chip('Tops'),
		A2(
			$elm$core$List$map,
			chip,
			_List_fromArray(
				['Bottoms', 'Shoes', 'Accessories'])));
};
var $author$project$Demo$Chips$ContactChanged = function (a) {
	return {$: 3, a: a};
};
var $author$project$Material$Chip$Filter$Internal$Icon = function (a) {
	return {$: 0, a: a};
};
var $author$project$Material$Chip$Filter$customIcon = F3(
	function (node, attributes, nodes) {
		return $author$project$Material$Chip$Filter$Internal$Icon(
			{aW: attributes, a7: node, a8: nodes});
	});
var $author$project$Material$Chip$Filter$icon = function (iconName) {
	return A3(
		$author$project$Material$Chip$Filter$customIcon,
		$elm$html$Html$i,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('material-icons')
			]),
		_List_fromArray(
			[
				$elm$html$Html$text(iconName)
			]));
};
var $author$project$Material$Chip$Filter$setIcon = F2(
	function (icon_, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{c: icon_});
	});
var $author$project$Demo$Chips$filterChips2 = function (model) {
	var chip = function (label) {
		return A2(
			$author$project$Material$Chip$Filter$chip,
			A2(
				$author$project$Material$Chip$Filter$setOnChange,
				$author$project$Demo$Chips$ContactChanged(label),
				A2(
					$author$project$Material$Chip$Filter$setIcon,
					$elm$core$Maybe$Just(
						$author$project$Material$Chip$Filter$icon('face')),
					A2(
						$author$project$Material$Chip$Filter$setSelected,
						A2($elm$core$Set$member, label, model.J),
						$author$project$Material$Chip$Filter$config))),
			label);
	};
	return A3(
		$author$project$Material$ChipSet$Filter$chipSet,
		_List_Nil,
		chip('Alice'),
		A2(
			$elm$core$List$map,
			chip,
			_List_fromArray(
				['Bob', 'Charlie', 'Danielle'])));
};
var $author$project$Demo$Chips$Focus = function (a) {
	return {$: 8, a: a};
};
var $author$project$Demo$Chips$FocusChanged = function (a) {
	return {$: 7, a: a};
};
var $author$project$Material$ChipSet$Choice$setAttributes = F2(
	function (additionalAttributes, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{br: additionalAttributes});
	});
var $author$project$Demo$Chips$focusChips = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				A3(
				$author$project$Material$ChipSet$Choice$chipSet,
				A2(
					$author$project$Material$ChipSet$Choice$setAttributes,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$id('my-chips')
						]),
					A2(
						$author$project$Material$ChipSet$Choice$setOnChange,
						$author$project$Demo$Chips$FocusChanged,
						A2(
							$author$project$Material$ChipSet$Choice$setSelected,
							$elm$core$Maybe$Just(model.a$),
							$author$project$Material$ChipSet$Choice$config(
								{ca: $elm$core$Basics$identity})))),
				A2($author$project$Material$Chip$Choice$chip, $author$project$Material$Chip$Choice$config, 'One'),
				_List_fromArray(
					[
						A2($author$project$Material$Chip$Choice$chip, $author$project$Material$Chip$Choice$config, 'Two')
					])),
				$elm$html$Html$text('\u00A0'),
				A2(
				$author$project$Material$Button$raised,
				A2(
					$author$project$Material$Button$setOnClick,
					$author$project$Demo$Chips$Focus('my-chips'),
					$author$project$Material$Button$config),
				'Focus')
			]));
};
var $author$project$Demo$Chips$ChipChanged = function (a) {
	return {$: 0, a: a};
};
var $author$project$Demo$Chips$heroChips = function (model) {
	return _List_fromArray(
		[
			A3(
			$author$project$Material$ChipSet$Choice$chipSet,
			A2(
				$author$project$Material$ChipSet$Choice$setOnChange,
				$author$project$Demo$Chips$ChipChanged,
				A2(
					$author$project$Material$ChipSet$Choice$setSelected,
					model.aY,
					$author$project$Material$ChipSet$Choice$config(
						{ca: $elm$core$Basics$identity}))),
			A2($author$project$Material$Chip$Choice$chip, $author$project$Material$Chip$Choice$config, 'Chip One'),
			_List_fromArray(
				[
					A2($author$project$Material$Chip$Choice$chip, $author$project$Material$Chip$Choice$config, 'Chip Two'),
					A2($author$project$Material$Chip$Choice$chip, $author$project$Material$Chip$Choice$config, 'Chip Three'),
					A2($author$project$Material$Chip$Choice$chip, $author$project$Material$Chip$Choice$config, 'Chip Four')
				]))
		]);
};
var $author$project$Demo$Chips$InputChanged = function (a) {
	return {$: 4, a: a};
};
var $author$project$Demo$Chips$InputChipDeleted = function (a) {
	return {$: 5, a: a};
};
var $author$project$Demo$Chips$KeyPressed = function (a) {
	return {$: 6, a: a};
};
var $author$project$Material$Chip$Input$Internal$Chip = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $author$project$Material$Chip$Input$chip = $author$project$Material$Chip$Input$Internal$Chip;
var $author$project$Material$ChipSet$Input$chipCs = $elm$core$Maybe$Just(
	$elm$html$Html$Attributes$class('mdc-chip'));
var $author$project$Material$ChipSet$Input$chipTouchCs = $elm$core$Maybe$Just(
	$elm$html$Html$Attributes$class('mdc-chip--touch'));
var $author$project$Material$ChipSet$Input$buttonRole = A2($elm$html$Html$Attributes$attribute, 'role', 'button');
var $author$project$Material$ChipSet$Input$tabIndexProp = function (tabIndex) {
	return A2(
		$elm$html$Html$Attributes$property,
		'tabIndex',
		$elm$json$Json$Encode$int(tabIndex));
};
var $author$project$Material$ChipSet$Input$leadingIconElt = function (_v0) {
	var leadingIcon = _v0.cr;
	return A2(
		$elm$core$Maybe$map,
		$elm$html$Html$map($elm$core$Basics$never),
		function () {
			if (!leadingIcon.$) {
				if (!leadingIcon.a.$) {
					var node = leadingIcon.a.a.a7;
					var attributes = leadingIcon.a.a.aW;
					var nodes = leadingIcon.a.a.a8;
					return $elm$core$Maybe$Just(
						A2(
							node,
							A2(
								$elm$core$List$cons,
								$elm$html$Html$Attributes$class('mdc-chip__icon'),
								A2(
									$elm$core$List$cons,
									$elm$html$Html$Attributes$class('mdc-chip__icon--leading'),
									A2(
										$elm$core$List$cons,
										$author$project$Material$ChipSet$Input$tabIndexProp(-1),
										A2($elm$core$List$cons, $author$project$Material$ChipSet$Input$buttonRole, attributes)))),
							nodes));
				} else {
					var node = leadingIcon.a.a.a7;
					var attributes = leadingIcon.a.a.aW;
					var nodes = leadingIcon.a.a.a8;
					return $elm$core$Maybe$Just(
						A2(
							node,
							A2(
								$elm$core$List$cons,
								$elm$svg$Svg$Attributes$class('mdc-chip__icon'),
								A2(
									$elm$core$List$cons,
									$elm$svg$Svg$Attributes$class('mdc-chip__icon--leading'),
									A2(
										$elm$core$List$cons,
										$author$project$Material$ChipSet$Input$tabIndexProp(-1),
										A2($elm$core$List$cons, $author$project$Material$ChipSet$Input$buttonRole, attributes)))),
							nodes));
				}
			} else {
				return $elm$core$Maybe$Nothing;
			}
		}());
};
var $author$project$Material$ChipSet$Input$chipPrimaryActionCs = $elm$html$Html$Attributes$class('mdc-chip__primary-action');
var $author$project$Material$ChipSet$Input$gridcellRole = A2($elm$html$Html$Attributes$attribute, 'role', 'gridcell');
var $author$project$Material$ChipSet$Input$chipTextCs = $elm$html$Html$Attributes$class('mdc-chip__text');
var $author$project$Material$ChipSet$Input$textElt = function (label) {
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$span,
			_List_fromArray(
				[$author$project$Material$ChipSet$Input$chipTextCs, $author$project$Material$ChipSet$Input$buttonRole]),
			_List_fromArray(
				[
					$elm$html$Html$text(label)
				])));
};
var $author$project$Material$ChipSet$Input$touchElt = $elm$core$Maybe$Just(
	A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('mdc-chip__touch')
			]),
		_List_Nil));
var $author$project$Material$ChipSet$Input$primaryActionElt = function (label) {
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$span,
			_List_fromArray(
				[
					$author$project$Material$ChipSet$Input$chipPrimaryActionCs,
					$author$project$Material$ChipSet$Input$gridcellRole,
					$author$project$Material$ChipSet$Input$tabIndexProp(-1)
				]),
			A2(
				$elm$core$List$filterMap,
				$elm$core$Basics$identity,
				_List_fromArray(
					[
						$author$project$Material$ChipSet$Input$textElt(label),
						$author$project$Material$ChipSet$Input$touchElt
					]))));
};
var $author$project$Material$ChipSet$Input$removalHandler = function (_v0) {
	var onDelete = _v0.cu;
	return A2(
		$elm$core$Maybe$map,
		A2(
			$elm$core$Basics$composeL,
			$elm$html$Html$Events$on('MDCChip:removal'),
			$elm$json$Json$Decode$succeed),
		onDelete);
};
var $author$project$Material$ChipSet$Input$rippleElt = $elm$core$Maybe$Just(
	A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('mdc-chip__ripple')
			]),
		_List_Nil));
var $author$project$Material$ChipSet$Input$rowRole = $elm$core$Maybe$Just(
	A2($elm$html$Html$Attributes$attribute, 'role', 'row'));
var $author$project$Material$ChipSet$Input$trailingIconElt = function (_v0) {
	var trailingIcon = _v0.bl;
	var onDelete = _v0.cu;
	return A2(
		$elm$core$Maybe$map,
		function (_v1) {
			return A2(
				$elm$html$Html$map,
				$elm$core$Basics$never,
				function () {
					if (!trailingIcon.$) {
						if (!trailingIcon.a.$) {
							var node = trailingIcon.a.a.a7;
							var attributes = trailingIcon.a.a.aW;
							var nodes = trailingIcon.a.a.a8;
							return A2(
								node,
								A2(
									$elm$core$List$cons,
									$elm$html$Html$Attributes$class('mdc-chip__icon'),
									A2(
										$elm$core$List$cons,
										$elm$html$Html$Attributes$class('mdc-chip__icon--trailing'),
										A2(
											$elm$core$List$cons,
											$author$project$Material$ChipSet$Input$tabIndexProp(-1),
											A2($elm$core$List$cons, $author$project$Material$ChipSet$Input$buttonRole, attributes)))),
								nodes);
						} else {
							var node = trailingIcon.a.a.a7;
							var attributes = trailingIcon.a.a.aW;
							var nodes = trailingIcon.a.a.a8;
							return A2(
								node,
								A2(
									$elm$core$List$cons,
									$elm$svg$Svg$Attributes$class('mdc-chip__icon'),
									A2(
										$elm$core$List$cons,
										$elm$svg$Svg$Attributes$class('mdc-chip__icon--trailing'),
										A2(
											$elm$core$List$cons,
											$author$project$Material$ChipSet$Input$tabIndexProp(-1),
											A2($elm$core$List$cons, $author$project$Material$ChipSet$Input$buttonRole, attributes)))),
								nodes);
						}
					} else {
						return A2(
							$elm$html$Html$i,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('material-icons'),
									$elm$html$Html$Attributes$class('mdc-chip__icon'),
									$elm$html$Html$Attributes$class('mdc-chip__icon--trailing'),
									$author$project$Material$ChipSet$Input$tabIndexProp(-1),
									$author$project$Material$ChipSet$Input$buttonRole
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('cancel')
								]));
					}
				}());
		},
		onDelete);
};
var $author$project$Material$ChipSet$Input$chip = function (_v0) {
	var config_ = _v0.a;
	var additionalAttributes = config_.br;
	var label = _v0.b;
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('mdc-touch-target-wrapper')
			]),
		_List_fromArray(
			[
				A3(
				$elm$html$Html$node,
				'mdc-chip',
				_Utils_ap(
					A2(
						$elm$core$List$filterMap,
						$elm$core$Basics$identity,
						_List_fromArray(
							[
								$author$project$Material$ChipSet$Input$chipCs,
								$author$project$Material$ChipSet$Input$chipTouchCs,
								$author$project$Material$ChipSet$Input$rowRole,
								$author$project$Material$ChipSet$Input$removalHandler(config_)
							])),
					additionalAttributes),
				A2(
					$elm$core$List$filterMap,
					$elm$core$Basics$identity,
					_List_fromArray(
						[
							$author$project$Material$ChipSet$Input$rippleElt,
							$author$project$Material$ChipSet$Input$leadingIconElt(config_),
							$author$project$Material$ChipSet$Input$primaryActionElt(label),
							$author$project$Material$ChipSet$Input$trailingIconElt(config_)
						])))
			]));
};
var $author$project$Material$ChipSet$Input$chipSetCs = $elm$html$Html$Attributes$class('mdc-chip-set');
var $author$project$Material$ChipSet$Input$chipSetInputCs = $elm$html$Html$Attributes$class('mdc-chip-set--input');
var $author$project$Material$ChipSet$Input$gridRole = A2($elm$html$Html$Attributes$attribute, 'role', 'grid');
var $elm$virtual_dom$VirtualDom$keyedNode = function (tag) {
	return _VirtualDom_keyedNode(
		_VirtualDom_noScript(tag));
};
var $elm$html$Html$Keyed$node = $elm$virtual_dom$VirtualDom$keyedNode;
var $author$project$Material$ChipSet$Input$chipSet = F3(
	function (additionalAttributes, firstChip, otherChips) {
		return A3(
			$elm$html$Html$Keyed$node,
			'mdc-chip-set',
			A2(
				$elm$core$List$cons,
				$author$project$Material$ChipSet$Input$chipSetCs,
				A2(
					$elm$core$List$cons,
					$author$project$Material$ChipSet$Input$chipSetInputCs,
					A2($elm$core$List$cons, $author$project$Material$ChipSet$Input$gridRole, additionalAttributes))),
			A2(
				$elm$core$List$map,
				$elm$core$Tuple$mapSecond($author$project$Material$ChipSet$Input$chip),
				A2($elm$core$List$cons, firstChip, otherChips)));
	});
var $author$project$Material$Chip$Input$Internal$Config = $elm$core$Basics$identity;
var $author$project$Material$Chip$Input$config = {br: _List_Nil, cr: $elm$core$Maybe$Nothing, bc: $elm$core$Maybe$Nothing, cu: $elm$core$Maybe$Nothing, bl: $elm$core$Maybe$Nothing};
var $elm$html$Html$Events$keyCode = A2($elm$json$Json$Decode$field, 'keyCode', $elm$json$Json$Decode$int);
var $elm$html$Html$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var $elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 1, a: a};
};
var $elm$html$Html$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var $elm$json$Json$Decode$string = _Json_decodeString;
var $elm$html$Html$Events$targetValue = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	$elm$json$Json$Decode$string);
var $elm$html$Html$Events$onInput = function (tagger) {
	return A2(
		$elm$html$Html$Events$stopPropagationOn,
		'input',
		A2(
			$elm$json$Json$Decode$map,
			$elm$html$Html$Events$alwaysStop,
			A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetValue)));
};
var $author$project$Material$Chip$Input$setOnDelete = F2(
	function (onDelete, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{
				cu: $elm$core$Maybe$Just(onDelete)
			});
	});
var $elm$html$Html$Attributes$value = $elm$html$Html$Attributes$stringProperty('value');
var $author$project$Demo$Chips$inputChips = function (model) {
	var chip = function (label) {
		return _Utils_Tuple2(
			label,
			A2(
				$author$project$Material$Chip$Input$chip,
				A2(
					$author$project$Material$Chip$Input$setOnDelete,
					$author$project$Demo$Chips$InputChipDeleted(label),
					$author$project$Material$Chip$Input$config),
				label));
	};
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'position', 'relative'),
				A2($elm$html$Html$Attributes$style, 'display', 'flex')
			]),
		_List_fromArray(
			[
				function () {
				var _v0 = model.k;
				if (!_v0.b) {
					return $elm$html$Html$text('');
				} else {
					var firstInputChip = _v0.a;
					var otherInputChips = _v0.b;
					return A3(
						$author$project$Material$ChipSet$Input$chipSet,
						_List_Nil,
						chip(firstInputChip),
						A2($elm$core$List$map, chip, otherInputChips));
				}
			}(),
				A2(
				$elm$html$Html$input,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$value(model.A),
						$elm$html$Html$Events$onInput($author$project$Demo$Chips$InputChanged),
						A2(
						$elm$html$Html$Events$on,
						'keydown',
						A2($elm$json$Json$Decode$map, $author$project$Demo$Chips$KeyPressed, $elm$html$Html$Events$keyCode))
					]),
				_List_Nil)
			]));
};
var $author$project$Material$Chip$Action$setAttributes = F2(
	function (additionalAttributes, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{br: additionalAttributes});
	});
var $author$project$Demo$Chips$shapedChips = function (model) {
	var chip = function (label) {
		return A2(
			$author$project$Material$Chip$Action$chip,
			A2(
				$author$project$Material$Chip$Action$setAttributes,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'border-radius', '4px')
					]),
				$author$project$Material$Chip$Action$config),
			label);
	};
	return A3(
		$author$project$Material$ChipSet$Action$chipSet,
		_List_Nil,
		chip('Bookcase'),
		A2(
			$elm$core$List$map,
			chip,
			_List_fromArray(
				['TV Stand', 'Sofas', 'Office chairs'])));
};
var $author$project$Demo$Chips$view = function (model) {
	return {
		cS: _List_fromArray(
			[
				A2(
				$elm$html$Html$h2,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Choice Chips')
					])),
				$author$project$Demo$Chips$choiceChips(model),
				A2(
				$elm$html$Html$h2,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Filter Chips')
					])),
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$body2]),
				_List_fromArray(
					[
						$elm$html$Html$text('No leading icon')
					])),
				$author$project$Demo$Chips$filterChips1(model),
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$body2]),
				_List_fromArray(
					[
						$elm$html$Html$text('With leading icon')
					])),
				$author$project$Demo$Chips$filterChips2(model),
				A2(
				$elm$html$Html$h2,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Action Chips')
					])),
				$author$project$Demo$Chips$actionChips(model),
				A2(
				$elm$html$Html$h2,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Shaped Chips')
					])),
				$author$project$Demo$Chips$shapedChips(model),
				A2(
				$elm$html$Html$h2,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Input Chips')
					])),
				$author$project$Demo$Chips$inputChips(model),
				A2(
				$elm$html$Html$h2,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Chips with Custom Icons')
					])),
				$author$project$Demo$Chips$actionChipsWithCustomIcons(model),
				A2(
				$elm$html$Html$h2,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Focus Chips')
					])),
				$author$project$Demo$Chips$focusChips(model)
			]),
		cZ: $author$project$Demo$Chips$heroChips(model),
		c9: 'Chips are compact elements that allow users to enter information, select a choice, filter content, or trigger an action.',
		db: {
			cT: $elm$core$Maybe$Just('https://package.elm-lang.org/packages/aforemny/material-components-web-elm/latest/Material-Chips'),
			c3: $elm$core$Maybe$Just('https://material.io/go/design-chips'),
			df: $elm$core$Maybe$Just('https://github.com/material-components/material-components-web/tree/master/packages/mdc-chips')
		},
		dh: 'Chips'
	};
};
var $author$project$Material$CircularProgress$Config = $elm$core$Basics$identity;
var $author$project$Material$CircularProgress$Large = 0;
var $author$project$Material$CircularProgress$config = {br: _List_Nil, bw: false, bH: false, b: $elm$core$Maybe$Nothing, bk: 0};
var $author$project$Material$CircularProgress$ariaLabelAttr = function (_v0) {
	var label = _v0.b;
	return A2(
		$elm$core$Maybe$map,
		$elm$html$Html$Attributes$attribute('aria-label'),
		label);
};
var $author$project$Material$CircularProgress$ariaValueMaxAttr = $elm$core$Maybe$Just(
	A2($elm$html$Html$Attributes$attribute, 'aria-value-max', '1'));
var $author$project$Material$CircularProgress$ariaValueMinAttr = $elm$core$Maybe$Just(
	A2($elm$html$Html$Attributes$attribute, 'aria-value-min', '0'));
var $elm$core$String$fromFloat = _String_fromNumber;
var $author$project$Material$CircularProgress$ariaValueNowAttr = function (progress) {
	return A2(
		$elm$core$Maybe$map,
		A2(
			$elm$core$Basics$composeL,
			A2(
				$elm$core$Basics$composeL,
				$elm$html$Html$Attributes$attribute('aria-value-now'),
				$elm$core$String$fromFloat),
			function ($) {
				return $.da;
			}),
		progress);
};
var $author$project$Material$CircularProgress$closedProp = function (_v0) {
	var closed = _v0.bw;
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$Attributes$property,
			'closed',
			$elm$json$Json$Encode$bool(closed)));
};
var $elm$svg$Svg$circle = $elm$svg$Svg$trustedNode('circle');
var $author$project$Material$CircularProgress$circleCs = function (progress) {
	return $elm$svg$Svg$Attributes$class(
		(!_Utils_eq(progress, $elm$core$Maybe$Nothing)) ? 'mdc-circular-progress__determinate-circle' : 'mdc-circular-progress__indeterminate-circle');
};
var $elm$svg$Svg$Attributes$cx = _VirtualDom_attribute('cx');
var $elm$svg$Svg$Attributes$cy = _VirtualDom_attribute('cy');
var $elm$svg$Svg$Attributes$r = _VirtualDom_attribute('r');
var $elm$svg$Svg$Attributes$strokeDasharray = _VirtualDom_attribute('stroke-dasharray');
var $author$project$Material$CircularProgress$strokeDasharrayAttr = function (_v0) {
	var size = _v0.bk;
	return A3(
		$elm$core$Basics$composeL,
		$elm$svg$Svg$Attributes$strokeDasharray,
		$elm$core$String$fromFloat,
		function () {
			switch (size) {
				case 0:
					return 113.097;
				case 1:
					return 78.54;
				default:
					return 54.978;
			}
		}());
};
var $elm$svg$Svg$Attributes$strokeDashoffset = _VirtualDom_attribute('stroke-dashoffset');
var $author$project$Material$CircularProgress$strokeDashoffsetAttr = F2(
	function (progress, _v0) {
		var size = _v0.bk;
		return A3(
			$elm$core$Basics$composeL,
			$elm$svg$Svg$Attributes$strokeDashoffset,
			$elm$core$String$fromFloat,
			function () {
				var _v1 = _Utils_Tuple2(progress, size);
				if (!_v1.a.$) {
					switch (_v1.b) {
						case 0:
							var _v2 = _v1.b;
							return 113.097;
						case 1:
							var _v5 = _v1.b;
							return 78.54;
						default:
							var _v8 = _v1.b;
							return 54.978;
					}
				} else {
					switch (_v1.b) {
						case 0:
							var _v3 = _v1.a;
							var _v4 = _v1.b;
							return 56.549;
						case 1:
							var _v6 = _v1.a;
							var _v7 = _v1.b;
							return 39.27;
						default:
							var _v9 = _v1.a;
							var _v10 = _v1.b;
							return 27.489;
					}
				}
			}());
	});
var $author$project$Material$CircularProgress$circleElt = F2(
	function (progress, config_) {
		return A2(
			$elm$svg$Svg$circle,
			_List_fromArray(
				[
					$author$project$Material$CircularProgress$circleCs(progress),
					$elm$svg$Svg$Attributes$cx('24'),
					$elm$svg$Svg$Attributes$cy('24'),
					$elm$svg$Svg$Attributes$r('18'),
					$author$project$Material$CircularProgress$strokeDasharrayAttr(config_),
					A2($author$project$Material$CircularProgress$strokeDashoffsetAttr, progress, config_)
				]),
			_List_Nil);
	});
var $author$project$Material$CircularProgress$determinateCircleGraphicElt = F2(
	function (progress, config_) {
		return A2(
			$elm$svg$Svg$svg,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$class('mdc-circular-progress__determinate-circle-graphic'),
					$elm$svg$Svg$Attributes$viewBox('0 0 48 48')
				]),
			_List_fromArray(
				[
					A2($author$project$Material$CircularProgress$circleElt, progress, config_)
				]));
	});
var $author$project$Material$CircularProgress$determinateContainerElt = F2(
	function (progress, config_) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('mdc-circular-progress__determinate-container')
				]),
			_List_fromArray(
				[
					A2($author$project$Material$CircularProgress$determinateCircleGraphicElt, progress, config_)
				]));
	});
var $author$project$Material$CircularProgress$determinateProp = function (progress) {
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$Attributes$property,
			'determinate',
			$elm$json$Json$Encode$bool(
				!_Utils_eq(progress, $elm$core$Maybe$Nothing))));
};
var $author$project$Material$CircularProgress$indeterminateCircleGraphicElt = function (config_) {
	return A2(
		$elm$svg$Svg$svg,
		_List_fromArray(
			[
				$elm$svg$Svg$Attributes$class('mdc-circular-progress__indeterminate-circle-graphic'),
				$elm$svg$Svg$Attributes$viewBox('0 0 48 48')
			]),
		_List_fromArray(
			[
				A2($author$project$Material$CircularProgress$circleElt, $elm$core$Maybe$Nothing, config_)
			]));
};
var $author$project$Material$CircularProgress$spinnerLayerElt = F2(
	function (config_, additionalAttributes) {
		return A2(
			$elm$html$Html$div,
			A2(
				$elm$core$List$cons,
				$elm$html$Html$Attributes$class('mdc-circular-progress__spinner-layer'),
				additionalAttributes),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('mdc-circular-progress__circle-clipper'),
							$elm$html$Html$Attributes$class('mdc-circular-progress__circle-left')
						]),
					_List_fromArray(
						[
							$author$project$Material$CircularProgress$indeterminateCircleGraphicElt(config_)
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('mdc-circular-progress__gap-patch')
						]),
					_List_fromArray(
						[
							$author$project$Material$CircularProgress$indeterminateCircleGraphicElt(config_)
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('mdc-circular-progress__circle-clipper'),
							$elm$html$Html$Attributes$class('mdc-circular-progress__circle-right')
						]),
					_List_fromArray(
						[
							$author$project$Material$CircularProgress$indeterminateCircleGraphicElt(config_)
						]))
				]));
	});
var $author$project$Material$CircularProgress$indeterminateContainerElt = function (config_) {
	var fourColored = config_.bH;
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('mdc-circular-progress__indeterminate-container')
			]),
		fourColored ? _List_fromArray(
			[
				A2(
				$author$project$Material$CircularProgress$spinnerLayerElt,
				config_,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('mdc-circular-progress__color-1')
					])),
				A2(
				$author$project$Material$CircularProgress$spinnerLayerElt,
				config_,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('mdc-circular-progress__color-2')
					])),
				A2(
				$author$project$Material$CircularProgress$spinnerLayerElt,
				config_,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('mdc-circular-progress__color-3')
					])),
				A2(
				$author$project$Material$CircularProgress$spinnerLayerElt,
				config_,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('mdc-circular-progress__color-4')
					]))
			]) : _List_fromArray(
			[
				A2($author$project$Material$CircularProgress$spinnerLayerElt, config_, _List_Nil)
			]));
};
var $author$project$Material$CircularProgress$indeterminateCs = function (progress) {
	return (!_Utils_eq(progress, $elm$core$Maybe$Nothing)) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(
		$elm$html$Html$Attributes$class('mdc-circular-progress--indeterminate'));
};
var $elm$json$Json$Encode$float = _Json_wrap;
var $author$project$Material$CircularProgress$progressProp = function (progress) {
	return A2(
		$elm$core$Maybe$map,
		A2(
			$elm$core$Basics$composeL,
			A2(
				$elm$core$Basics$composeL,
				$elm$html$Html$Attributes$property('progress'),
				$elm$json$Json$Encode$float),
			function ($) {
				return $.da;
			}),
		progress);
};
var $author$project$Material$CircularProgress$progressbarRole = $elm$core$Maybe$Just(
	A2($elm$html$Html$Attributes$attribute, 'role', 'progressbar'));
var $author$project$Material$CircularProgress$rootCs = $elm$core$Maybe$Just(
	$elm$html$Html$Attributes$class('mdc-circular-progress'));
var $author$project$Material$CircularProgress$sizeCs = function (_v0) {
	var size = _v0.bk;
	return A3(
		$elm$core$Basics$composeL,
		$elm$core$Maybe$Just,
		$elm$html$Html$Attributes$class,
		function () {
			switch (size) {
				case 0:
					return 'mdc-circular-progress--large';
				case 1:
					return 'mdc-circular-progress--medium';
				default:
					return 'mdc-circular-progress--small';
			}
		}());
};
var $author$project$Material$CircularProgress$circularProgress = F2(
	function (progress, config_) {
		var additionalAttributes = config_.br;
		return A3(
			$elm$html$Html$node,
			'mdc-circular-progress',
			_Utils_ap(
				A2(
					$elm$core$List$filterMap,
					$elm$core$Basics$identity,
					_List_fromArray(
						[
							$author$project$Material$CircularProgress$rootCs,
							$author$project$Material$CircularProgress$indeterminateCs(progress),
							$author$project$Material$CircularProgress$sizeCs(config_),
							$author$project$Material$CircularProgress$progressbarRole,
							$author$project$Material$CircularProgress$ariaLabelAttr(config_),
							$author$project$Material$CircularProgress$ariaValueMinAttr,
							$author$project$Material$CircularProgress$ariaValueMaxAttr,
							$author$project$Material$CircularProgress$ariaValueNowAttr(progress),
							$author$project$Material$CircularProgress$determinateProp(progress),
							$author$project$Material$CircularProgress$progressProp(progress),
							$author$project$Material$CircularProgress$closedProp(config_)
						])),
				additionalAttributes),
			_List_fromArray(
				[
					A2(
					$author$project$Material$CircularProgress$determinateContainerElt,
					A2(
						$elm$core$Maybe$withDefault,
						$elm$core$Maybe$Just(
							{da: 0}),
						A2($elm$core$Maybe$map, $elm$core$Maybe$Just, progress)),
					config_),
					$author$project$Material$CircularProgress$indeterminateContainerElt(config_)
				]));
	});
var $author$project$Material$CircularProgress$determinate = F2(
	function (config_, progress) {
		return A2(
			$author$project$Material$CircularProgress$circularProgress,
			$elm$core$Maybe$Just(progress),
			config_);
	});
var $author$project$Material$CircularProgress$indeterminate = function (config_) {
	return A2($author$project$Material$CircularProgress$circularProgress, $elm$core$Maybe$Nothing, config_);
};
var $author$project$Material$CircularProgress$large = 0;
var $author$project$Material$CircularProgress$Medium = 1;
var $author$project$Material$CircularProgress$medium = 1;
var $author$project$Material$CircularProgress$setFourColored = F2(
	function (fourColored, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{bH: fourColored});
	});
var $author$project$Material$CircularProgress$setSize = F2(
	function (size, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{bk: size});
	});
var $author$project$Material$CircularProgress$Small = 2;
var $author$project$Material$CircularProgress$small = 2;
var $author$project$Demo$CircularProgress$view = function (model) {
	return {
		cS: _List_fromArray(
			[
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Large')
					])),
				$author$project$Material$CircularProgress$indeterminate(
				A2($author$project$Material$CircularProgress$setSize, $author$project$Material$CircularProgress$large, $author$project$Material$CircularProgress$config)),
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Medium')
					])),
				$author$project$Material$CircularProgress$indeterminate(
				A2($author$project$Material$CircularProgress$setSize, $author$project$Material$CircularProgress$medium, $author$project$Material$CircularProgress$config)),
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Small')
					])),
				$author$project$Material$CircularProgress$indeterminate(
				A2($author$project$Material$CircularProgress$setSize, $author$project$Material$CircularProgress$small, $author$project$Material$CircularProgress$config)),
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Four Colored')
					])),
				$author$project$Material$CircularProgress$indeterminate(
				A2($author$project$Material$CircularProgress$setFourColored, true, $author$project$Material$CircularProgress$config)),
				A3(
				$elm$html$Html$node,
				'style',
				_List_fromArray(
					[
						$elm$html$Html$Attributes$type_('text/css')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('\n                .mdc-circular-progress__color-1\n                .mdc-circular-progress__indeterminate-circle-graphic {\n                  stroke: #000; }\n                .mdc-circular-progress__color-2\n                .mdc-circular-progress__indeterminate-circle-graphic {\n                  stroke: #f00; }\n                .mdc-circular-progress__color-3\n                .mdc-circular-progress__indeterminate-circle-graphic {\n                  stroke: #0f0; }\n                .mdc-circular-progress__color-4\n                .mdc-circular-progress__indeterminate-circle-graphic {\n                  stroke: #00f; }\n                ')
					]))
			]),
		cZ: _List_fromArray(
			[
				A2(
				$author$project$Material$CircularProgress$determinate,
				$author$project$Material$CircularProgress$config,
				{da: 0.67})
			]),
		c9: 'Progress indicators display the length of a process or express an unspecified wait time.',
		db: {
			cT: $elm$core$Maybe$Just('https://package.elm-lang.org/packages/aforemny/material-components-web-elm/latest/Material-CircularProgress'),
			c3: $elm$core$Maybe$Just('https://material.io/go/design-progress-indicators'),
			df: $elm$core$Maybe$Just('https://github.com/material-components/material-components-web/tree/master/packages/mdc-circular-progress')
		},
		dh: 'Circular Progress Indicator'
	};
};
var $author$project$Demo$DataTable$AllSelected = {$: 2};
var $author$project$Demo$DataTable$AllUnselected = {$: 3};
var $author$project$Demo$DataTable$ItemSelected = function (a) {
	return {$: 1, a: a};
};
var $author$project$Material$DataTable$Cell = function (a) {
	return {$: 0, a: a};
};
var $author$project$Material$DataTable$cell = F2(
	function (attributes, nodes) {
		return $author$project$Material$DataTable$Cell(
			{aW: attributes, a8: nodes, a9: false});
	});
var $author$project$Material$DataTable$CheckboxCell = function (a) {
	return {$: 1, a: a};
};
var $author$project$Material$DataTable$checkboxCell = F2(
	function (attributes, config_) {
		return $author$project$Material$DataTable$CheckboxCell(
			{aW: attributes, bz: config_});
	});
var $author$project$Material$DataTable$Config = $elm$core$Basics$identity;
var $author$project$Material$DataTable$config = {br: _List_Nil, b: $elm$core$Maybe$Nothing};
var $author$project$Demo$DataTable$data = _List_fromArray(
	[
		{w: '24', y: 'Super tasty', r: 'Frozen yogurt', F: '4.0'},
		{w: '37', y: 'I like ice cream more', r: 'Ice cream sandwich', F: '4.33333333333'},
		{w: '24', y: 'New filing flavor', r: 'Eclair', F: '6.0'}
	]);
var $author$project$Material$DataTable$ariaLabelAttr = function (_v0) {
	var label = _v0.b;
	return A2(
		$elm$core$Maybe$map,
		$elm$html$Html$Attributes$attribute('aria-label'),
		label);
};
var $author$project$Material$DataTable$dataTableCellCheckboxCs = $elm$core$Maybe$Just(
	$elm$html$Html$Attributes$class('mdc-data-table__cell--checkbox'));
var $author$project$Material$DataTable$dataTableCellCs = $elm$core$Maybe$Just(
	$elm$html$Html$Attributes$class('mdc-data-table__cell'));
var $author$project$Material$DataTable$dataTableCellNumericCs = function (numeric) {
	return numeric ? $elm$core$Maybe$Just(
		$elm$html$Html$Attributes$class('mdc-data-table__cell--numeric')) : $elm$core$Maybe$Nothing;
};
var $elm$html$Html$td = _VirtualDom_node('td');
var $author$project$Material$DataTable$bodyCell = function (cell_) {
	if (!cell_.$) {
		var numeric = cell_.a.a9;
		var attributes = cell_.a.aW;
		var nodes = cell_.a.a8;
		return A2(
			$elm$html$Html$td,
			_Utils_ap(
				A2(
					$elm$core$List$filterMap,
					$elm$core$Basics$identity,
					_List_fromArray(
						[
							$author$project$Material$DataTable$dataTableCellCs,
							$author$project$Material$DataTable$dataTableCellNumericCs(numeric)
						])),
				attributes),
			nodes);
	} else {
		var attributes = cell_.a.aW;
		var config_ = cell_.a.bz;
		return A2(
			$elm$html$Html$td,
			_Utils_ap(
				A2(
					$elm$core$List$filterMap,
					$elm$core$Basics$identity,
					_List_fromArray(
						[$author$project$Material$DataTable$dataTableCellCs, $author$project$Material$DataTable$dataTableCellCheckboxCs])),
				attributes),
			_List_fromArray(
				[
					$author$project$Material$Checkbox$checkbox(
					function () {
						var config__ = config_;
						return _Utils_update(
							config__,
							{
								br: A2(
									$elm$core$List$cons,
									$elm$html$Html$Attributes$class('mdc-data-table__row-checkbox'),
									config__.br)
							});
					}())
				]));
	}
};
var $author$project$Material$DataTable$dataTableRowCs = $elm$html$Html$Attributes$class('mdc-data-table__row');
var $elm$html$Html$tr = _VirtualDom_node('tr');
var $author$project$Material$DataTable$bodyRow = function (_v0) {
	var attributes = _v0.aW;
	var nodes = _v0.a8;
	return A2(
		$elm$html$Html$tr,
		A2($elm$core$List$cons, $author$project$Material$DataTable$dataTableRowCs, attributes),
		A2($elm$core$List$map, $author$project$Material$DataTable$bodyCell, nodes));
};
var $author$project$Material$DataTable$dataTableContentCs = $elm$html$Html$Attributes$class('mdc-data-table__content');
var $author$project$Material$DataTable$dataTableCs = $elm$html$Html$Attributes$class('mdc-data-table');
var $author$project$Material$DataTable$dataTableTableCs = $elm$core$Maybe$Just(
	$elm$html$Html$Attributes$class('mdc-data-table__table'));
var $author$project$Material$DataTable$dataTableHeaderRowCs = $elm$html$Html$Attributes$class('mdc-data-table__header-row');
var $author$project$Material$DataTable$colScopeAttr = $elm$core$Maybe$Just(
	A2($elm$html$Html$Attributes$attribute, 'scope', 'col'));
var $author$project$Material$DataTable$columnHeaderRoleAttr = $elm$core$Maybe$Just(
	A2($elm$html$Html$Attributes$attribute, 'role', 'columnheader'));
var $author$project$Material$DataTable$dataTableHeaderCellCheckboxCs = $elm$core$Maybe$Just(
	$elm$html$Html$Attributes$class('mdc-data-table__header-cell--checkbox'));
var $author$project$Material$DataTable$dataTableHeaderCellCs = $elm$core$Maybe$Just(
	$elm$html$Html$Attributes$class('mdc-data-table__header-cell'));
var $author$project$Material$DataTable$dataTableHeaderCellNumericCs = function (numeric) {
	return numeric ? $elm$core$Maybe$Just(
		$elm$html$Html$Attributes$class('mdc-data-table__header-cell--numeric')) : $elm$core$Maybe$Nothing;
};
var $elm$html$Html$th = _VirtualDom_node('th');
var $author$project$Material$DataTable$headerCell = function (cell_) {
	if (!cell_.$) {
		var numeric = cell_.a.a9;
		var attributes = cell_.a.aW;
		var nodes = cell_.a.a8;
		return A2(
			$elm$html$Html$th,
			_Utils_ap(
				A2(
					$elm$core$List$filterMap,
					$elm$core$Basics$identity,
					_List_fromArray(
						[
							$author$project$Material$DataTable$dataTableHeaderCellCs,
							$author$project$Material$DataTable$columnHeaderRoleAttr,
							$author$project$Material$DataTable$colScopeAttr,
							$author$project$Material$DataTable$dataTableHeaderCellNumericCs(numeric)
						])),
				attributes),
			nodes);
	} else {
		var attributes = cell_.a.aW;
		var config_ = cell_.a.bz;
		return A2(
			$elm$html$Html$th,
			_Utils_ap(
				A2(
					$elm$core$List$filterMap,
					$elm$core$Basics$identity,
					_List_fromArray(
						[$author$project$Material$DataTable$dataTableHeaderCellCs, $author$project$Material$DataTable$columnHeaderRoleAttr, $author$project$Material$DataTable$colScopeAttr, $author$project$Material$DataTable$dataTableHeaderCellCheckboxCs])),
				attributes),
			_List_fromArray(
				[
					$author$project$Material$Checkbox$checkbox(
					function () {
						var config__ = config_;
						return _Utils_update(
							config__,
							{
								br: A2(
									$elm$core$List$cons,
									$elm$html$Html$Attributes$class('mdc-data-table__row-checkbox'),
									config__.br)
							});
					}())
				]));
	}
};
var $author$project$Material$DataTable$headerRow = function (_v0) {
	var attributes = _v0.aW;
	var nodes = _v0.a8;
	return A2(
		$elm$html$Html$tr,
		A2($elm$core$List$cons, $author$project$Material$DataTable$dataTableHeaderRowCs, attributes),
		A2($elm$core$List$map, $author$project$Material$DataTable$headerCell, nodes));
};
var $elm$html$Html$table = _VirtualDom_node('table');
var $elm$html$Html$tbody = _VirtualDom_node('tbody');
var $elm$html$Html$thead = _VirtualDom_node('thead');
var $author$project$Material$DataTable$dataTable = F2(
	function (config_, _v0) {
		var additionalAttributes = config_.br;
		var thead = _v0.cL;
		var tbody = _v0.cK;
		return A3(
			$elm$html$Html$node,
			'mdc-data-table',
			A2($elm$core$List$cons, $author$project$Material$DataTable$dataTableCs, additionalAttributes),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$table,
					A2(
						$elm$core$List$filterMap,
						$elm$core$Basics$identity,
						_List_fromArray(
							[
								$author$project$Material$DataTable$dataTableTableCs,
								$author$project$Material$DataTable$ariaLabelAttr(config_)
							])),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$thead,
							_List_Nil,
							A2($elm$core$List$map, $author$project$Material$DataTable$headerRow, thead)),
							A2(
							$elm$html$Html$tbody,
							_List_fromArray(
								[$author$project$Material$DataTable$dataTableContentCs]),
							A2($elm$core$List$map, $author$project$Material$DataTable$bodyRow, tbody))
						]))
				]));
	});
var $author$project$Demo$DataTable$label = {w: 'Carbs (g)', y: 'Comments', r: 'Desert', F: 'Protein (g)'};
var $author$project$Material$DataTable$numericCell = F2(
	function (attributes, nodes) {
		return $author$project$Material$DataTable$Cell(
			{aW: attributes, a8: nodes, a9: true});
	});
var $author$project$Material$DataTable$Row = $elm$core$Basics$identity;
var $author$project$Material$DataTable$row = F2(
	function (attributes, nodes) {
		return {aW: attributes, a8: nodes};
	});
var $author$project$Material$DataTable$dataTableRowSelectedCs = $elm$html$Html$Attributes$class('mdc-data-table__row--selected');
var $author$project$Material$DataTable$selected = _List_fromArray(
	[
		$author$project$Material$DataTable$dataTableRowSelectedCs,
		A2($elm$html$Html$Attributes$attribute, 'aria-selected', 'true')
	]);
var $elm$core$Dict$sizeHelp = F2(
	function (n, dict) {
		sizeHelp:
		while (true) {
			if (dict.$ === -2) {
				return n;
			} else {
				var left = dict.d;
				var right = dict.e;
				var $temp$n = A2($elm$core$Dict$sizeHelp, n + 1, right),
					$temp$dict = left;
				n = $temp$n;
				dict = $temp$dict;
				continue sizeHelp;
			}
		}
	});
var $elm$core$Dict$size = function (dict) {
	return A2($elm$core$Dict$sizeHelp, 0, dict);
};
var $elm$core$Set$size = function (_v0) {
	var dict = _v0;
	return $elm$core$Dict$size(dict);
};
var $author$project$Demo$DataTable$dataTableWithRowSelection = function (model) {
	var row = F2(
		function (_v2, _v3) {
			var onChange = _v2.bb;
			var selected = _v2.i;
			var desert = _v3.r;
			var carbs = _v3.w;
			var protein = _v3.F;
			var comments = _v3.y;
			return A2(
				$author$project$Material$DataTable$row,
				selected ? $author$project$Material$DataTable$selected : _List_Nil,
				_List_fromArray(
					[
						A2(
						$author$project$Material$DataTable$checkboxCell,
						_List_Nil,
						A2(
							$author$project$Material$Checkbox$setOnChange,
							onChange,
							A2(
								$author$project$Material$Checkbox$setState,
								$elm$core$Maybe$Just(
									selected ? $author$project$Material$Checkbox$checked : $author$project$Material$Checkbox$unchecked),
								$author$project$Material$Checkbox$config))),
						A2(
						$author$project$Material$DataTable$cell,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text(desert)
							])),
						A2(
						$author$project$Material$DataTable$numericCell,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text(carbs)
							])),
						A2(
						$author$project$Material$DataTable$numericCell,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text(protein)
							])),
						A2(
						$author$project$Material$DataTable$cell,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text(comments)
							]))
					]));
		});
	var headerRow = F2(
		function (_v0, _v1) {
			var onChange = _v0.bb;
			var state = _v0.cH;
			var desert = _v1.r;
			var carbs = _v1.w;
			var protein = _v1.F;
			var comments = _v1.y;
			return _List_fromArray(
				[
					A2(
					$author$project$Material$DataTable$row,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$author$project$Material$DataTable$checkboxCell,
							_List_Nil,
							A2(
								$author$project$Material$Checkbox$setOnChange,
								onChange,
								A2(
									$author$project$Material$Checkbox$setState,
									$elm$core$Maybe$Just(state),
									$author$project$Material$Checkbox$config))),
							A2(
							$author$project$Material$DataTable$cell,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text(desert)
								])),
							A2(
							$author$project$Material$DataTable$numericCell,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text(carbs)
								])),
							A2(
							$author$project$Material$DataTable$numericCell,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text(protein)
								])),
							A2(
							$author$project$Material$DataTable$cell,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text(comments)
								]))
						]))
				]);
		});
	var allUnselected = !$elm$core$Set$size(model.i);
	var allSelected = $elm$core$Set$size(model.i) === 3;
	return A2(
		$author$project$Material$DataTable$dataTable,
		$author$project$Material$DataTable$config,
		{
			cK: A2(
				$elm$core$List$map,
				function (data_) {
					var desert = data_.r;
					return A2(
						row,
						{
							bb: $author$project$Demo$DataTable$ItemSelected(desert),
							i: A2($elm$core$Set$member, desert, model.i)
						},
						data_);
				},
				$author$project$Demo$DataTable$data),
			cL: A2(
				headerRow,
				{
					bb: allSelected ? $author$project$Demo$DataTable$AllUnselected : $author$project$Demo$DataTable$AllSelected,
					cH: allSelected ? $author$project$Material$Checkbox$checked : (allUnselected ? $author$project$Material$Checkbox$unchecked : $author$project$Material$Checkbox$indeterminate)
				},
				$author$project$Demo$DataTable$label)
		});
};
var $author$project$Demo$DataTable$standardDataTable = function () {
	var row = function (_v0) {
		var desert = _v0.r;
		var carbs = _v0.w;
		var protein = _v0.F;
		var comments = _v0.y;
		return A2(
			$author$project$Material$DataTable$row,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$author$project$Material$DataTable$cell,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text(desert)
						])),
					A2(
					$author$project$Material$DataTable$numericCell,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text(carbs)
						])),
					A2(
					$author$project$Material$DataTable$numericCell,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text(protein)
						])),
					A2(
					$author$project$Material$DataTable$cell,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text(comments)
						]))
				]));
	};
	return A2(
		$author$project$Material$DataTable$dataTable,
		$author$project$Material$DataTable$config,
		{
			cK: A2($elm$core$List$map, row, $author$project$Demo$DataTable$data),
			cL: _List_fromArray(
				[
					row($author$project$Demo$DataTable$label)
				])
		});
}();
var $author$project$Demo$DataTable$heroDataTable = _List_fromArray(
	[$author$project$Demo$DataTable$standardDataTable]);
var $author$project$Demo$DataTable$view = function (model) {
	return {
		cS: _List_fromArray(
			[
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Data Table Standard')
					])),
				$author$project$Demo$DataTable$standardDataTable,
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Data Table with Row Selection')
					])),
				$author$project$Demo$DataTable$dataTableWithRowSelection(model)
			]),
		cZ: $author$project$Demo$DataTable$heroDataTable,
		c9: 'Data tables display information in a way that’s easy to scan, so that users can look for patterns and insights.',
		db: {
			cT: $elm$core$Maybe$Just('https://material.io/components/web/catalog/data-tables/'),
			c3: $elm$core$Maybe$Just('https://material.io/go/design-data-tables'),
			df: $elm$core$Maybe$Just('https://github.com/material-components/material-components-web/tree/master/packages/mdc-data-table')
		},
		dh: 'Data Table'
	};
};
var $author$project$Material$TopAppBar$actionItem = $elm$html$Html$Attributes$class('mdc-top-app-bar__action-item');
var $author$project$Material$TopAppBar$alignEnd = $elm$html$Html$Attributes$class('mdc-top-app-bar__section--align-end');
var $author$project$Material$TopAppBar$denseFixedAdjust = $elm$html$Html$Attributes$class('mdc-top-app-bar--dense-fixed-adjust');
var $author$project$Material$TopAppBar$setDense = F2(
	function (dense, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{bA: dense});
	});
var $author$project$Demo$DenseTopAppBar$view = function (model) {
	return {
		cX: $author$project$Material$TopAppBar$denseFixedAdjust,
		di: A2(
			$author$project$Material$TopAppBar$regular,
			A2($author$project$Material$TopAppBar$setDense, true, $author$project$Material$TopAppBar$config),
			_List_fromArray(
				[
					A2(
					$author$project$Material$TopAppBar$row,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$author$project$Material$TopAppBar$section,
							_List_fromArray(
								[$author$project$Material$TopAppBar$alignStart]),
							_List_fromArray(
								[
									A2(
									$author$project$Material$IconButton$iconButton,
									A2(
										$author$project$Material$IconButton$setAttributes,
										_List_fromArray(
											[$author$project$Material$TopAppBar$navigationIcon]),
										$author$project$Material$IconButton$config),
									$author$project$Material$IconButton$icon('menu')),
									A2(
									$elm$html$Html$span,
									_List_fromArray(
										[$author$project$Material$TopAppBar$title]),
									_List_fromArray(
										[
											$elm$html$Html$text('Dense')
										]))
								])),
							A2(
							$author$project$Material$TopAppBar$section,
							_List_fromArray(
								[$author$project$Material$TopAppBar$alignEnd]),
							_List_fromArray(
								[
									A2(
									$author$project$Material$IconButton$iconButton,
									A2(
										$author$project$Material$IconButton$setAttributes,
										_List_fromArray(
											[$author$project$Material$TopAppBar$actionItem]),
										$author$project$Material$IconButton$config),
									$author$project$Material$IconButton$icon('file_download')),
									A2(
									$author$project$Material$IconButton$iconButton,
									A2(
										$author$project$Material$IconButton$setAttributes,
										_List_fromArray(
											[$author$project$Material$TopAppBar$actionItem]),
										$author$project$Material$IconButton$config),
									$author$project$Material$IconButton$icon('print')),
									A2(
									$author$project$Material$IconButton$iconButton,
									A2(
										$author$project$Material$IconButton$setAttributes,
										_List_fromArray(
											[$author$project$Material$TopAppBar$actionItem]),
										$author$project$Material$IconButton$config),
									$author$project$Material$IconButton$icon('bookmark'))
								]))
						]))
				]))
	};
};
var $author$project$Demo$Dialog$AlertDialog = 0;
var $author$project$Demo$Dialog$ConfirmationDialog = 1;
var $author$project$Demo$Dialog$ScrollableDialog = 2;
var $author$project$Demo$Dialog$Show = function (a) {
	return {$: 1, a: a};
};
var $author$project$Demo$Dialog$SimpleDialog = 3;
var $author$project$Demo$Dialog$Close = {$: 0};
var $author$project$Material$Dialog$Config = $elm$core$Basics$identity;
var $author$project$Material$Dialog$config = {br: _List_Nil, bT: $elm$core$Maybe$Nothing, u: false};
var $author$project$Material$Dialog$closeHandler = function (_v0) {
	var onClose = _v0.bT;
	return A2(
		$elm$core$Maybe$map,
		A2(
			$elm$core$Basics$composeL,
			$elm$html$Html$Events$on('MDCDialog:close'),
			$elm$json$Json$Decode$succeed),
		onClose);
};
var $author$project$Material$Dialog$actionsElt = function (_v0) {
	var actions = _v0.T;
	return $elm$core$List$isEmpty(actions) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('mdc-dialog__actions')
				]),
			actions));
};
var $author$project$Material$Dialog$alertDialogRoleAttr = A2($elm$html$Html$Attributes$attribute, 'role', 'alertdialog');
var $author$project$Material$Dialog$ariaModalAttr = A2($elm$html$Html$Attributes$attribute, 'aria-modal', 'true');
var $author$project$Material$Dialog$contentElt = function (_v0) {
	var content = _v0.cS;
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('mdc-dialog__content')
				]),
			content));
};
var $author$project$Material$Dialog$dialogSurfaceCs = $elm$html$Html$Attributes$class('mdc-dialog__surface');
var $author$project$Material$Dialog$titleElt = function (_v0) {
	var title = _v0.dh;
	if (!title.$) {
		var title_ = title.a;
		return $elm$core$Maybe$Just(
			A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('mdc-dialog__title')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(title_)
					])));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Material$Dialog$surfaceElt = function (content) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[$author$project$Material$Dialog$dialogSurfaceCs, $author$project$Material$Dialog$alertDialogRoleAttr, $author$project$Material$Dialog$ariaModalAttr]),
		A2(
			$elm$core$List$filterMap,
			$elm$core$Basics$identity,
			_List_fromArray(
				[
					$author$project$Material$Dialog$titleElt(content),
					$author$project$Material$Dialog$contentElt(content),
					$author$project$Material$Dialog$actionsElt(content)
				])));
};
var $author$project$Material$Dialog$containerElt = function (content) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('mdc-dialog__container')
			]),
		_List_fromArray(
			[
				$author$project$Material$Dialog$surfaceElt(content)
			]));
};
var $author$project$Material$Dialog$openProp = function (_v0) {
	var open = _v0.u;
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$Attributes$property,
			'open',
			$elm$json$Json$Encode$bool(open)));
};
var $author$project$Material$Dialog$rootCs = $elm$core$Maybe$Just(
	$elm$html$Html$Attributes$class('mdc-dialog'));
var $author$project$Material$Dialog$scrimElt = A2(
	$elm$html$Html$div,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('mdc-dialog__scrim')
		]),
	_List_Nil);
var $author$project$Material$Dialog$dialog = F2(
	function (config_, content) {
		var additionalAttributes = config_.br;
		return A3(
			$elm$html$Html$node,
			'mdc-dialog',
			_Utils_ap(
				A2(
					$elm$core$List$filterMap,
					$elm$core$Basics$identity,
					_List_fromArray(
						[
							$author$project$Material$Dialog$rootCs,
							$author$project$Material$Dialog$openProp(config_),
							$author$project$Material$Dialog$closeHandler(config_)
						])),
				additionalAttributes),
			_List_fromArray(
				[
					$author$project$Material$Dialog$containerElt(content),
					$author$project$Material$Dialog$scrimElt
				]));
	});
var $author$project$Material$Dialog$setOnClose = F2(
	function (onClose, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{
				bT: $elm$core$Maybe$Just(onClose)
			});
	});
var $author$project$Material$Dialog$setOpen = F2(
	function (open, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{u: open});
	});
var $author$project$Demo$Dialog$alertDialog = function (model) {
	return A2(
		$author$project$Material$Dialog$dialog,
		A2(
			$author$project$Material$Dialog$setOnClose,
			$author$project$Demo$Dialog$Close,
			A2(
				$author$project$Material$Dialog$setOpen,
				_Utils_eq(
					model.u,
					$elm$core$Maybe$Just(0)),
				$author$project$Material$Dialog$config)),
		{
			T: _List_fromArray(
				[
					A2(
					$author$project$Material$Button$text,
					A2($author$project$Material$Button$setOnClick, $author$project$Demo$Dialog$Close, $author$project$Material$Button$config),
					'Cancel'),
					A2(
					$author$project$Material$Button$text,
					A2($author$project$Material$Button$setOnClick, $author$project$Demo$Dialog$Close, $author$project$Material$Button$config),
					'Discard')
				]),
			cS: _List_fromArray(
				[
					$elm$html$Html$text('Discard draft?')
				]),
			dh: $elm$core$Maybe$Nothing
		});
};
var $author$project$Material$Radio$Config = $elm$core$Basics$identity;
var $author$project$Material$Radio$config = {br: _List_Nil, aX: false, ad: false, bb: $elm$core$Maybe$Nothing, aN: true};
var $author$project$Material$Radio$innerCircleElt = A2(
	$elm$html$Html$div,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('mdc-radio__inner-circle')
		]),
	_List_Nil);
var $author$project$Material$Radio$outerCircleElt = A2(
	$elm$html$Html$div,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('mdc-radio__outer-circle')
		]),
	_List_Nil);
var $author$project$Material$Radio$backgroundElt = A2(
	$elm$html$Html$div,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('mdc-radio__background')
		]),
	_List_fromArray(
		[$author$project$Material$Radio$outerCircleElt, $author$project$Material$Radio$innerCircleElt]));
var $author$project$Material$Radio$checkedProp = function (_v0) {
	var checked = _v0.aX;
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$Attributes$property,
			'checked',
			$elm$json$Json$Encode$bool(checked)));
};
var $author$project$Material$Radio$disabledProp = function (_v0) {
	var disabled = _v0.ad;
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$Attributes$property,
			'disabled',
			$elm$json$Json$Encode$bool(disabled)));
};
var $author$project$Material$Radio$changeHandler = function (_v0) {
	var checked = _v0.aX;
	var onChange = _v0.bb;
	return A2(
		$elm$core$Maybe$map,
		function (msg) {
			return A2(
				$elm$html$Html$Events$on,
				'change',
				$elm$json$Json$Decode$succeed(msg));
		},
		onChange);
};
var $author$project$Material$Radio$nativeControlCs = $elm$core$Maybe$Just(
	$elm$html$Html$Attributes$class('mdc-radio__native-control'));
var $author$project$Material$Radio$radioTypeAttr = $elm$core$Maybe$Just(
	$elm$html$Html$Attributes$type_('radio'));
var $author$project$Material$Radio$nativeControlElt = function (config_) {
	return A2(
		$elm$html$Html$input,
		A2(
			$elm$core$List$filterMap,
			$elm$core$Basics$identity,
			_List_fromArray(
				[
					$author$project$Material$Radio$nativeControlCs,
					$author$project$Material$Radio$radioTypeAttr,
					$author$project$Material$Radio$checkedProp(config_),
					$author$project$Material$Radio$changeHandler(config_)
				])),
		_List_Nil);
};
var $author$project$Material$Radio$rippleElt = A2(
	$elm$html$Html$div,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('mdc-radio__ripple')
		]),
	_List_Nil);
var $author$project$Material$Radio$rootCs = $elm$core$Maybe$Just(
	$elm$html$Html$Attributes$class('mdc-radio'));
var $author$project$Material$Radio$touchCs = function (_v0) {
	var touch = _v0.aN;
	return touch ? $elm$core$Maybe$Just(
		$elm$html$Html$Attributes$class('mdc-radio--touch')) : $elm$core$Maybe$Nothing;
};
var $author$project$Material$Radio$radio = function (config_) {
	var touch = config_.aN;
	var additionalAttributes = config_.br;
	var wrapTouch = function (node) {
		return touch ? A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('mdc-touch-target-wrapper')
				]),
			_List_fromArray(
				[node])) : node;
	};
	return wrapTouch(
		A3(
			$elm$html$Html$node,
			'mdc-radio',
			_Utils_ap(
				A2(
					$elm$core$List$filterMap,
					$elm$core$Basics$identity,
					_List_fromArray(
						[
							$author$project$Material$Radio$rootCs,
							$author$project$Material$Radio$touchCs(config_),
							$author$project$Material$Radio$checkedProp(config_),
							$author$project$Material$Radio$disabledProp(config_)
						])),
				additionalAttributes),
			_List_fromArray(
				[
					$author$project$Material$Radio$nativeControlElt(config_),
					$author$project$Material$Radio$backgroundElt,
					$author$project$Material$Radio$rippleElt
				])));
};
var $author$project$Material$List$setAvatarList = F2(
	function (avatarList, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{bu: avatarList});
	});
var $author$project$Material$Radio$setChecked = F2(
	function (checked, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{aX: checked});
	});
var $author$project$Demo$Dialog$confirmationDialog = function (model) {
	var listItem = function (_v0) {
		var checked = _v0.a;
		var label = _v0.b;
		return A2(
			$author$project$Material$List$Item$listItem,
			$author$project$Material$List$Item$config,
			_List_fromArray(
				[
					A2(
					$author$project$Material$List$Item$graphic,
					_List_Nil,
					_List_fromArray(
						[
							$author$project$Material$Radio$radio(
							A2($author$project$Material$Radio$setChecked, checked, $author$project$Material$Radio$config))
						])),
					$elm$html$Html$text(label)
				]));
	};
	return A2(
		$author$project$Material$Dialog$dialog,
		A2(
			$author$project$Material$Dialog$setOnClose,
			$author$project$Demo$Dialog$Close,
			A2(
				$author$project$Material$Dialog$setOpen,
				_Utils_eq(
					model.u,
					$elm$core$Maybe$Just(1)),
				$author$project$Material$Dialog$config)),
		{
			T: _List_fromArray(
				[
					A2(
					$author$project$Material$Button$text,
					A2($author$project$Material$Button$setOnClick, $author$project$Demo$Dialog$Close, $author$project$Material$Button$config),
					'Cancel'),
					A2(
					$author$project$Material$Button$text,
					A2($author$project$Material$Button$setOnClick, $author$project$Demo$Dialog$Close, $author$project$Material$Button$config),
					'OK')
				]),
			cS: _List_fromArray(
				[
					A3(
					$author$project$Material$List$list,
					A2($author$project$Material$List$setAvatarList, true, $author$project$Material$List$config),
					listItem(
						_Utils_Tuple2(true, 'Never Gonna Give You Up')),
					A2(
						$elm$core$List$map,
						listItem,
						_List_fromArray(
							[
								_Utils_Tuple2(false, 'Hot Cross Buns'),
								_Utils_Tuple2(false, 'None')
							])))
				]),
			dh: $elm$core$Maybe$Just('Phone ringtone')
		});
};
var $author$project$Demo$Dialog$heroDialog = _List_fromArray(
	[
		A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('mdc-dialog mdc-dialog--open'),
				A2($elm$html$Html$Attributes$style, 'position', 'relative')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('mdc-dialog__surface')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('mdc-dialog__title')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Get this party started?')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('mdc-dialog__content')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Turn up the jams and have a good time.')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('mdc-dialog__actions')
							]),
						_List_fromArray(
							[
								A2($author$project$Material$Button$text, $author$project$Material$Button$config, 'Decline'),
								A2($author$project$Material$Button$text, $author$project$Material$Button$config, 'Accept')
							]))
					]))
			]))
	]);
var $author$project$Demo$Dialog$scrollableDialog = function (model) {
	return A2(
		$author$project$Material$Dialog$dialog,
		A2(
			$author$project$Material$Dialog$setOnClose,
			$author$project$Demo$Dialog$Close,
			A2(
				$author$project$Material$Dialog$setOpen,
				_Utils_eq(
					model.u,
					$elm$core$Maybe$Just(2)),
				$author$project$Material$Dialog$config)),
		{
			T: _List_fromArray(
				[
					A2(
					$author$project$Material$Button$text,
					A2($author$project$Material$Button$setOnClick, $author$project$Demo$Dialog$Close, $author$project$Material$Button$config),
					'Decline'),
					A2(
					$author$project$Material$Button$text,
					A2($author$project$Material$Button$setOnClick, $author$project$Demo$Dialog$Close, $author$project$Material$Button$config),
					'Continue')
				]),
			cS: _List_fromArray(
				[
					A2(
					$elm$html$Html$p,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text('\n                    Dorothy lived in the midst of the great Kansas prairies,\n                    with Uncle Henry, who was a farmer, and Aunt Em, who was\n                    the farmer\'s wife. Their house was small, for the lumber to\n                    build it had to be carried by wagon many miles. There were\n                    four walls, a floor and a roof, which made one room; and\n                    this room contained a rusty looking cookstove, a cupboard\n                    for the dishes, a table, three or four chairs, and the\n                    beds. Uncle Henry and Aunt Em had a big bed in one corner,\n                    and Dorothy a little bed in another corner. There was no\n                    garret at all, and no cellar--except a small hole dug in\n                    the ground, called a cyclone cellar, where the family could\n                    go in case one of those great whirlwinds arose, mighty\n                    enough to crush any building in its path. It was reached by\n                    a trap door in the middle of the floor, from which a ladder\n                    led down into the small, dark hole.\n                  ')
						])),
					A2(
					$elm$html$Html$p,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text('\n                    When Dorothy stood in the doorway and looked around, she\n                    could see nothing but the great gray prairie on every side.\n                    Not a tree nor a house broke the broad sweep of flat\n                    country that reached to the edge of the sky in all\n                    directions.  The sun had baked the plowed land into a gray\n                    mass, with little cracks running through it. Even the grass\n                    was not green, for the sun had burned the tops of the long\n                    blades until they were the same gray color to be seen\n                    everywhere.  Once the house had been painted, but the sun\n                    blistered the paint and the rains washed it away, and now\n                    the house was as dull and gray as everything else.\n                  ')
						])),
					A2(
					$elm$html$Html$p,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text('\n                    When Aunt Em came there to live she was a young, pretty\n                    wife. The sun and wind had changed her, too. They had taken\n                    the sparkle from her eyes and left them a sober gray; they\n                    had taken the red from her cheeks and lips, and they were\n                    gray also. She was thin and gaunt, and never smiled now.\n                    When Dorothy, who was an orphan, first came to her, Aunt Em\n                    had been so startled by the child\'s laughter that she would\n                    scream and press her hand upon her heart whenever Dorothy\'s\n                    merry voice reached her ears; and she still looked at the\n                    little girl with wonder that she could find anything to\n                    laugh at.\n                  ')
						])),
					A2(
					$elm$html$Html$p,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text('\n                    Uncle Henry never laughed. He worked hard from morning till\n                    night and did not know what joy was. He was gray also, from\n                    his long beard to his rough boots, and he looked stern and\n                    solemn, and rarely spoke.\n                  ')
						])),
					A2(
					$elm$html$Html$p,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text('\n                    It was Toto that made Dorothy laugh, and saved her from\n                    growing as gray as her other surroundings. Toto was not\n                    gray; he was a little black dog, with long silky hair and\n                    small black eyes that twinkled merrily on either side of\n                    his funny, wee nose. Toto played all day long, and Dorothy\n                    played with him, and loved him dearly.\n                  ')
						])),
					A2(
					$elm$html$Html$p,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text('\n                    Today, however, they were not playing. Uncle Henry sat upon\n                    the doorstep and looked anxiously at the sky, which was\n                    even grayer than usual. Dorothy stood in the door with Toto\n                    in her arms, and looked at the sky too. Aunt Em was washing\n                    the dishes.\n                  ')
						])),
					A2(
					$elm$html$Html$p,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text('\n                    From the far north they heard a low wail of the wind, and\n                    Uncle Henry and Dorothy could see where the long grass\n                    bowed in waves before the coming storm.  There now came a\n                    sharp whistling in the air from the south, and as they\n                    turned their eyes that way they saw ripples in the grass\n                    coming from that direction also.\n                  ')
						]))
				]),
			dh: $elm$core$Maybe$Just('The Wonderful Wizard of Oz')
		});
};
var $author$project$Material$Icon$icon = F2(
	function (additionalAttributes, iconName) {
		return A2(
			$elm$html$Html$i,
			A2(
				$elm$core$List$cons,
				$elm$html$Html$Attributes$class('material-icons'),
				additionalAttributes),
			_List_fromArray(
				[
					$elm$html$Html$text(iconName)
				]));
	});
var $author$project$Material$List$Item$setOnClick = F2(
	function (onClick, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{
				bc: $elm$core$Maybe$Just(onClick)
			});
	});
var $author$project$Demo$Dialog$simpleDialog = function (model) {
	var listItem = function (_v0) {
		var icon = _v0.a;
		var label = _v0.b;
		return A2(
			$author$project$Material$List$Item$listItem,
			A2($author$project$Material$List$Item$setOnClick, $author$project$Demo$Dialog$Close, $author$project$Material$List$Item$config),
			_List_fromArray(
				[
					A2(
					$author$project$Material$List$Item$graphic,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'background-color', 'rgba(0,0,0,.3)'),
							A2($elm$html$Html$Attributes$style, 'color', '#fff')
						]),
					_List_fromArray(
						[
							A2($author$project$Material$Icon$icon, _List_Nil, icon)
						])),
					$elm$html$Html$text(label)
				]));
	};
	return A2(
		$author$project$Material$Dialog$dialog,
		A2(
			$author$project$Material$Dialog$setOnClose,
			$author$project$Demo$Dialog$Close,
			A2(
				$author$project$Material$Dialog$setOpen,
				_Utils_eq(
					model.u,
					$elm$core$Maybe$Just(3)),
				$author$project$Material$Dialog$config)),
		{
			T: _List_Nil,
			cS: _List_fromArray(
				[
					A3(
					$author$project$Material$List$list,
					A2($author$project$Material$List$setAvatarList, true, $author$project$Material$List$config),
					listItem(
						_Utils_Tuple2('person', 'user1@example.com')),
					A2(
						$elm$core$List$map,
						listItem,
						_List_fromArray(
							[
								_Utils_Tuple2('person', 'user2@example.com'),
								_Utils_Tuple2('add', 'Add account')
							])))
				]),
			dh: $elm$core$Maybe$Just('Select an account')
		});
};
var $author$project$Demo$Dialog$view = function (model) {
	return {
		cS: _List_fromArray(
			[
				A2(
				$author$project$Material$Button$text,
				A2(
					$author$project$Material$Button$setOnClick,
					$author$project$Demo$Dialog$Show(0),
					$author$project$Material$Button$config),
				'Alert'),
				$elm$html$Html$text(' '),
				A2(
				$author$project$Material$Button$text,
				A2(
					$author$project$Material$Button$setOnClick,
					$author$project$Demo$Dialog$Show(3),
					$author$project$Material$Button$config),
				'Simple'),
				$elm$html$Html$text(' '),
				A2(
				$author$project$Material$Button$text,
				A2(
					$author$project$Material$Button$setOnClick,
					$author$project$Demo$Dialog$Show(1),
					$author$project$Material$Button$config),
				'Confirmation'),
				$elm$html$Html$text(' '),
				A2(
				$author$project$Material$Button$text,
				A2(
					$author$project$Material$Button$setOnClick,
					$author$project$Demo$Dialog$Show(2),
					$author$project$Material$Button$config),
				'Scrollable'),
				$elm$html$Html$text(' '),
				$author$project$Demo$Dialog$alertDialog(model),
				$author$project$Demo$Dialog$simpleDialog(model),
				$author$project$Demo$Dialog$confirmationDialog(model),
				$author$project$Demo$Dialog$scrollableDialog(model)
			]),
		cZ: $author$project$Demo$Dialog$heroDialog,
		c9: 'Dialogs inform users about a specific task and may contain critical information, require decisions, or involve multiple tasks.',
		db: {
			cT: $elm$core$Maybe$Just('https://package.elm-lang.org/packages/aforemny/material-components-web-elm/latest/Material-Dialog'),
			c3: $elm$core$Maybe$Just('https://material.io/go/design-dialogs'),
			df: $elm$core$Maybe$Just('https://github.com/material-components/material-components-web/tree/master/packages/mdc-dialog')
		},
		dh: 'Dialog'
	};
};
var $author$project$Demo$DismissibleDrawer$CloseDrawer = {$: 1};
var $author$project$Demo$DismissibleDrawer$SetSelectedIndex = function (a) {
	return {$: 2, a: a};
};
var $author$project$Demo$DismissibleDrawer$ToggleDrawer = {$: 0};
var $author$project$Material$List$Divider$Config = $elm$core$Basics$identity;
var $author$project$Material$List$Divider$config = {br: _List_Nil, bJ: false, bV: false};
var $author$project$Material$Drawer$Permanent$content = F2(
	function (attributes, nodes) {
		return A2(
			$elm$html$Html$div,
			A2(
				$elm$core$List$cons,
				$elm$html$Html$Attributes$class('mdc-drawer__content'),
				attributes),
			nodes);
	});
var $author$project$Material$List$listGroupCs = $elm$html$Html$Attributes$class('mdc-list-group');
var $author$project$Material$List$group = F2(
	function (additionalAttributes, nodes) {
		return A2(
			$elm$html$Html$div,
			A2($elm$core$List$cons, $author$project$Material$List$listGroupCs, additionalAttributes),
			nodes);
	});
var $elm$html$Html$hr = _VirtualDom_node('hr');
var $author$project$Material$List$Divider$listDividerCs = $elm$core$Maybe$Just(
	$elm$html$Html$Attributes$class('mdc-list-divider'));
var $author$project$Material$List$Divider$group = function (additionalAttributes) {
	return A2(
		$elm$html$Html$hr,
		_Utils_ap(
			A2(
				$elm$core$List$filterMap,
				$elm$core$Basics$identity,
				_List_fromArray(
					[$author$project$Material$List$Divider$listDividerCs])),
			additionalAttributes),
		_List_Nil);
};
var $elm$html$Html$h6 = _VirtualDom_node('h6');
var $author$project$Material$Drawer$Permanent$header = F2(
	function (additionalAttributes, nodes) {
		return A2(
			$elm$html$Html$div,
			A2(
				$elm$core$List$cons,
				$elm$html$Html$Attributes$class('mdc-drawer__header'),
				additionalAttributes),
			nodes);
	});
var $author$project$Material$List$Item$Internal$ListItemDivider = function (a) {
	return {$: 1, a: a};
};
var $author$project$Material$List$Divider$insetCs = function (_v0) {
	var inset = _v0.bJ;
	return inset ? $elm$core$Maybe$Just(
		$elm$html$Html$Attributes$class('mdc-list-divider--inset')) : $elm$core$Maybe$Nothing;
};
var $elm$html$Html$li = _VirtualDom_node('li');
var $author$project$Material$List$Divider$paddedCs = function (_v0) {
	var padded = _v0.bV;
	return padded ? $elm$core$Maybe$Just(
		$elm$html$Html$Attributes$class('mdc-list-divider--padded')) : $elm$core$Maybe$Nothing;
};
var $author$project$Material$List$Divider$separatorRoleAttr = $elm$core$Maybe$Just(
	A2($elm$html$Html$Attributes$attribute, 'role', 'separator'));
var $author$project$Material$List$Divider$listItem = function (config_) {
	var additionalAttributes = config_.br;
	return $author$project$Material$List$Item$Internal$ListItemDivider(
		A2(
			$elm$html$Html$li,
			_Utils_ap(
				A2(
					$elm$core$List$filterMap,
					$elm$core$Basics$identity,
					_List_fromArray(
						[
							$author$project$Material$List$Divider$listDividerCs,
							$author$project$Material$List$Divider$separatorRoleAttr,
							$author$project$Material$List$Divider$insetCs(config_),
							$author$project$Material$List$Divider$paddedCs(config_)
						])),
				additionalAttributes),
			_List_Nil));
};
var $author$project$Material$List$listGroupSubheaderCs = $elm$html$Html$Attributes$class('mdc-list-group__subheader');
var $author$project$Material$List$subheader = F2(
	function (additionalAttributes, nodes) {
		return A2(
			$elm$html$Html$span,
			A2($elm$core$List$cons, $author$project$Material$List$listGroupSubheaderCs, additionalAttributes),
			nodes);
	});
var $author$project$Material$Drawer$Permanent$subtitle = $elm$html$Html$Attributes$class('mdc-drawer__subtitle');
var $author$project$Material$Drawer$Permanent$title = $elm$html$Html$Attributes$class('mdc-drawer__title');
var $author$project$Demo$DrawerPage$drawerBody = F2(
	function (setSelectedIndex, selectedIndex) {
		var listItemConfig = function (index) {
			return A2(
				$author$project$Material$List$Item$setOnClick,
				setSelectedIndex(index),
				A2(
					$author$project$Material$List$Item$setSelected,
					_Utils_eq(selectedIndex, index) ? $elm$core$Maybe$Just($author$project$Material$List$Item$activated) : $elm$core$Maybe$Nothing,
					$author$project$Material$List$Item$config));
		};
		return _List_fromArray(
			[
				A2(
				$author$project$Material$Drawer$Permanent$header,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$h3,
						_List_fromArray(
							[$author$project$Material$Drawer$Permanent$title]),
						_List_fromArray(
							[
								$elm$html$Html$text('Mail')
							])),
						A2(
						$elm$html$Html$h6,
						_List_fromArray(
							[$author$project$Material$Drawer$Permanent$subtitle]),
						_List_fromArray(
							[
								$elm$html$Html$text('email@material.io')
							]))
					])),
				A2(
				$author$project$Material$Drawer$Permanent$content,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$author$project$Material$List$group,
						_List_Nil,
						_List_fromArray(
							[
								A3(
								$author$project$Material$List$list,
								$author$project$Material$List$config,
								A2(
									$author$project$Material$List$Item$listItem,
									listItemConfig(0),
									_List_fromArray(
										[
											A2(
											$author$project$Material$List$Item$graphic,
											_List_Nil,
											_List_fromArray(
												[
													A2($author$project$Material$Icon$icon, _List_Nil, 'inbox')
												])),
											$elm$html$Html$text('Inbox')
										])),
								_List_fromArray(
									[
										A2(
										$author$project$Material$List$Item$listItem,
										listItemConfig(1),
										_List_fromArray(
											[
												A2(
												$author$project$Material$List$Item$graphic,
												_List_Nil,
												_List_fromArray(
													[
														A2($author$project$Material$Icon$icon, _List_Nil, 'star')
													])),
												$elm$html$Html$text('Star')
											])),
										A2(
										$author$project$Material$List$Item$listItem,
										listItemConfig(2),
										_List_fromArray(
											[
												A2(
												$author$project$Material$List$Item$graphic,
												_List_Nil,
												_List_fromArray(
													[
														A2($author$project$Material$Icon$icon, _List_Nil, 'send')
													])),
												$elm$html$Html$text('Sent Mail')
											])),
										A2(
										$author$project$Material$List$Item$listItem,
										listItemConfig(3),
										_List_fromArray(
											[
												A2(
												$author$project$Material$List$Item$graphic,
												_List_Nil,
												_List_fromArray(
													[
														A2($author$project$Material$Icon$icon, _List_Nil, 'drafts')
													])),
												$elm$html$Html$text('Drafts')
											]))
									])),
								$author$project$Material$List$Divider$group(_List_Nil),
								A2(
								$author$project$Material$List$subheader,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Labels')
									])),
								A3(
								$author$project$Material$List$list,
								$author$project$Material$List$config,
								A2(
									$author$project$Material$List$Item$listItem,
									listItemConfig(4),
									_List_fromArray(
										[
											A2(
											$author$project$Material$List$Item$graphic,
											_List_Nil,
											_List_fromArray(
												[
													A2($author$project$Material$Icon$icon, _List_Nil, 'bookmark')
												])),
											$elm$html$Html$text('Family')
										])),
								_List_fromArray(
									[
										A2(
										$author$project$Material$List$Item$listItem,
										listItemConfig(5),
										_List_fromArray(
											[
												A2(
												$author$project$Material$List$Item$graphic,
												_List_Nil,
												_List_fromArray(
													[
														A2($author$project$Material$Icon$icon, _List_Nil, 'bookmark')
													])),
												$elm$html$Html$text('Friends')
											])),
										A2(
										$author$project$Material$List$Item$listItem,
										listItemConfig(6),
										_List_fromArray(
											[
												A2(
												$author$project$Material$List$Item$graphic,
												_List_Nil,
												_List_fromArray(
													[
														A2($author$project$Material$Icon$icon, _List_Nil, 'bookmark')
													])),
												$elm$html$Html$text('Work')
											])),
										$author$project$Material$List$Divider$listItem($author$project$Material$List$Divider$config),
										A2(
										$author$project$Material$List$Item$listItem,
										listItemConfig(7),
										_List_fromArray(
											[
												A2(
												$author$project$Material$List$Item$graphic,
												_List_Nil,
												_List_fromArray(
													[
														A2($author$project$Material$Icon$icon, _List_Nil, 'settings')
													])),
												$elm$html$Html$text('Settings')
											])),
										A2(
										$author$project$Material$List$Item$listItem,
										listItemConfig(8),
										_List_fromArray(
											[
												A2(
												$author$project$Material$List$Item$graphic,
												_List_Nil,
												_List_fromArray(
													[
														A2($author$project$Material$Icon$icon, _List_Nil, 'announcement')
													])),
												$elm$html$Html$text('Help & feedback')
											]))
									]))
							]))
					]))
			]);
	});
var $author$project$Material$Drawer$Dismissible$setOnClose = F2(
	function (onClose, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{
				bT: $elm$core$Maybe$Just(onClose)
			});
	});
var $author$project$Demo$DismissibleDrawer$view = function (model) {
	return {
		cU: A2(
			$author$project$Material$Drawer$Dismissible$drawer,
			A2(
				$author$project$Material$Drawer$Dismissible$setOnClose,
				$author$project$Demo$DismissibleDrawer$CloseDrawer,
				A2($author$project$Material$Drawer$Dismissible$setOpen, model.u, $author$project$Material$Drawer$Dismissible$config)),
			A2($author$project$Demo$DrawerPage$drawerBody, $author$project$Demo$DismissibleDrawer$SetSelectedIndex, model.bi)),
		c6: $elm$core$Maybe$Just($author$project$Demo$DismissibleDrawer$ToggleDrawer),
		dd: $elm$core$Maybe$Nothing,
		dh: 'Dismissible Drawer'
	};
};
var $author$project$Material$Drawer$Permanent$Config = $elm$core$Basics$identity;
var $author$project$Material$Drawer$Permanent$config = {br: _List_Nil};
var $author$project$Material$Drawer$Permanent$rootCs = $elm$core$Maybe$Just(
	$elm$html$Html$Attributes$class('mdc-drawer'));
var $author$project$Material$Drawer$Permanent$drawer = F2(
	function (_v0, nodes) {
		var additionalAttributes = _v0.br;
		return A2(
			$elm$html$Html$div,
			_Utils_ap(
				A2(
					$elm$core$List$filterMap,
					$elm$core$Basics$identity,
					_List_fromArray(
						[$author$project$Material$Drawer$Permanent$rootCs])),
				additionalAttributes),
			nodes);
	});
var $author$project$Material$List$Item$setAttributes = F2(
	function (additionalAttributes, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{br: additionalAttributes});
	});
var $author$project$Demo$Drawer$heroDrawer = function () {
	var listItem = function (_v0) {
		var activated = _v0.a;
		var icon = _v0.b;
		var label = _v0.c;
		return A2(
			$author$project$Material$List$Item$listItem,
			A2(
				$author$project$Material$List$Item$setAttributes,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$href('#drawer')
					]),
				A2(
					$author$project$Material$List$Item$setSelected,
					activated ? $elm$core$Maybe$Just($author$project$Material$List$Item$activated) : $elm$core$Maybe$Nothing,
					$author$project$Material$List$Item$config)),
			_List_fromArray(
				[
					A2(
					$author$project$Material$List$Item$graphic,
					_List_Nil,
					_List_fromArray(
						[
							A2($author$project$Material$Icon$icon, _List_Nil, icon)
						])),
					$elm$html$Html$text(label)
				]));
	};
	return _List_fromArray(
		[
			A2(
			$author$project$Material$Drawer$Permanent$drawer,
			$author$project$Material$Drawer$Permanent$config,
			_List_fromArray(
				[
					A2(
					$author$project$Material$Drawer$Permanent$header,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$elm$html$Html$h3,
							_List_fromArray(
								[$author$project$Material$Drawer$Permanent$title]),
							_List_fromArray(
								[
									$elm$html$Html$text('Title')
								])),
							A2(
							$elm$html$Html$h6,
							_List_fromArray(
								[$author$project$Material$Drawer$Permanent$subtitle]),
							_List_fromArray(
								[
									$elm$html$Html$text('Subtitle')
								]))
						])),
					A2(
					$author$project$Material$Drawer$Permanent$content,
					_List_Nil,
					_List_fromArray(
						[
							A3(
							$author$project$Material$List$list,
							$author$project$Material$List$config,
							listItem(
								_Utils_Tuple3(true, 'inbox', 'Inbox')),
							A2(
								$elm$core$List$map,
								listItem,
								_List_fromArray(
									[
										_Utils_Tuple3(false, 'star', 'Star'),
										_Utils_Tuple3(false, 'send', 'Sent Mail'),
										_Utils_Tuple3(false, 'drafts', 'Drafts')
									])))
						]))
				]))
		]);
}();
var $elm$html$Html$iframe = _VirtualDom_node('iframe');
var $author$project$Demo$Drawer$iframe = F2(
	function (label, url) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'display', 'inline-block'),
					A2($elm$html$Html$Attributes$style, '-ms-flex', '1 1 80%'),
					A2($elm$html$Html$Attributes$style, 'flex', '1 1 80%'),
					A2($elm$html$Html$Attributes$style, '-ms-flex-pack', 'distribute'),
					A2($elm$html$Html$Attributes$style, 'justify-content', 'space-around'),
					A2($elm$html$Html$Attributes$style, 'min-height', '400px'),
					A2($elm$html$Html$Attributes$style, 'min-width', '400px'),
					A2($elm$html$Html$Attributes$style, 'padding', '15px')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$elm$html$Html$a,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$href(url),
									$elm$html$Html$Attributes$target('_blank')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$h3,
									_List_fromArray(
										[$author$project$Material$Typography$subtitle1]),
									_List_fromArray(
										[
											$elm$html$Html$text(label)
										]))
								]))
						])),
					A2(
					$elm$html$Html$iframe,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$src(url),
							A2($elm$html$Html$Attributes$style, 'height', '400px'),
							A2($elm$html$Html$Attributes$style, 'width', '100vw'),
							A2($elm$html$Html$Attributes$style, 'max-width', '780px')
						]),
					_List_Nil)
				]));
	});
var $author$project$Demo$Drawer$view = function (model) {
	return {
		cS: _List_fromArray(
			[
				A2($author$project$Demo$Drawer$iframe, 'Permanent', '#permanent-drawer'),
				A2($author$project$Demo$Drawer$iframe, 'Dismissible', '#dismissible-drawer'),
				A2($author$project$Demo$Drawer$iframe, 'Modal', '#modal-drawer')
			]),
		cZ: $author$project$Demo$Drawer$heroDrawer,
		c9: 'The navigation drawer slides in from the left and contains the navigation destinations for your app.',
		db: {
			cT: $elm$core$Maybe$Just('https://package.elm-lang.org/packages/aforemny/material-components-web-elm/latest/Material-Drawer'),
			c3: $elm$core$Maybe$Just('https://material.io/go/design-navigation-drawer'),
			df: $elm$core$Maybe$Just('https://github.com/material-components/material-components-web/tree/master/packages/mdc-drawer')
		},
		dh: 'Drawer'
	};
};
var $author$project$Demo$DrawerPage$drawerFrameRoot = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'display', '-ms-flexbox'),
		A2($elm$html$Html$Attributes$style, 'display', 'flex'),
		A2($elm$html$Html$Attributes$style, 'height', '100vh')
	]);
var $author$project$Demo$DrawerPage$loremIpsum = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
var $elm$core$List$repeatHelp = F3(
	function (result, n, value) {
		repeatHelp:
		while (true) {
			if (n <= 0) {
				return result;
			} else {
				var $temp$result = A2($elm$core$List$cons, value, result),
					$temp$n = n - 1,
					$temp$value = value;
				result = $temp$result;
				n = $temp$n;
				value = $temp$value;
				continue repeatHelp;
			}
		}
	});
var $elm$core$List$repeat = F2(
	function (n, value) {
		return A3($elm$core$List$repeatHelp, _List_Nil, n, value);
	});
var $author$project$Demo$DrawerPage$mainContent = A2(
	$elm$html$Html$div,
	_List_fromArray(
		[
			A2($elm$html$Html$Attributes$style, 'padding-left', '18px'),
			A2($elm$html$Html$Attributes$style, 'padding-right', '18px'),
			A2($elm$html$Html$Attributes$style, 'overflow', 'auto'),
			A2($elm$html$Html$Attributes$style, 'height', '100%'),
			A2($elm$html$Html$Attributes$style, 'box-sizing', 'border-box'),
			$author$project$Material$TopAppBar$fixedAdjust,
			$author$project$Material$Drawer$Dismissible$appContent
		]),
	A2(
		$elm$core$List$repeat,
		4,
		A2(
			$elm$html$Html$p,
			_List_Nil,
			_List_fromArray(
				[
					$elm$html$Html$text($author$project$Demo$DrawerPage$loremIpsum)
				]))));
var $author$project$Demo$DrawerPage$view = F2(
	function (lift, _v0) {
		var title = _v0.dh;
		var drawer = _v0.cU;
		var scrim = _v0.dd;
		var onMenuClick = _v0.c6;
		return A2(
			$elm$html$Html$map,
			lift,
			A2(
				$elm$html$Html$div,
				$author$project$Demo$DrawerPage$drawerFrameRoot,
				_List_fromArray(
					[
						drawer,
						A2(
						$elm$core$Maybe$withDefault,
						$elm$html$Html$text(''),
						scrim),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[$author$project$Material$Drawer$Dismissible$appContent]),
						_List_fromArray(
							[
								A2(
								$author$project$Material$TopAppBar$regular,
								$author$project$Material$TopAppBar$config,
								_List_fromArray(
									[
										A2(
										$author$project$Material$TopAppBar$row,
										_List_Nil,
										_List_fromArray(
											[
												A2(
												$author$project$Material$TopAppBar$section,
												_List_fromArray(
													[$author$project$Material$TopAppBar$alignStart]),
												_List_fromArray(
													[
														function () {
														if (!onMenuClick.$) {
															var handleClick = onMenuClick.a;
															return A2(
																$author$project$Material$Icon$icon,
																_List_fromArray(
																	[
																		$author$project$Material$TopAppBar$navigationIcon,
																		$elm$html$Html$Events$onClick(handleClick)
																	]),
																'menu');
														} else {
															return $elm$html$Html$text('');
														}
													}(),
														A2(
														$elm$html$Html$span,
														_List_fromArray(
															[$author$project$Material$TopAppBar$title]),
														_List_fromArray(
															[
																$elm$html$Html$text(title)
															]))
													]))
											]))
									])),
								$author$project$Demo$DrawerPage$mainContent
							]))
					])));
	});
var $author$project$Demo$Elevation$demoContainer = _List_fromArray(
	[
		$elm$html$Html$Attributes$class('elevation-demo-container'),
		A2($elm$html$Html$Attributes$style, 'display', 'flex'),
		A2($elm$html$Html$Attributes$style, 'flex-flow', 'row wrap'),
		A2($elm$html$Html$Attributes$style, 'justify-content', 'space-between')
	]);
var $author$project$Demo$Elevation$demoSurface = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'display', '-ms-inline-flexbox'),
		A2($elm$html$Html$Attributes$style, 'display', 'inline-flex'),
		A2($elm$html$Html$Attributes$style, '-ms-flex-pack', 'distribute'),
		A2($elm$html$Html$Attributes$style, 'justify-content', 'space-around'),
		A2($elm$html$Html$Attributes$style, 'min-height', '100px'),
		A2($elm$html$Html$Attributes$style, 'min-width', '200px'),
		A2($elm$html$Html$Attributes$style, 'margin', '15px'),
		A2($elm$html$Html$Attributes$style, '-ms-flex-align', 'center'),
		A2($elm$html$Html$Attributes$style, 'align-items', 'center')
	]);
var $author$project$Demo$Elevation$heroSurface = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'display', '-ms-inline-flexbox'),
		A2($elm$html$Html$Attributes$style, 'display', 'inline-flex'),
		A2($elm$html$Html$Attributes$style, '-ms-flex-pack', 'distribute'),
		A2($elm$html$Html$Attributes$style, 'justify-content', 'space-around'),
		A2($elm$html$Html$Attributes$style, 'min-height', '100px'),
		A2($elm$html$Html$Attributes$style, 'min-width', '200px'),
		A2($elm$html$Html$Attributes$style, '-ms-flex-align', 'center'),
		A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
		A2($elm$html$Html$Attributes$style, 'width', '120px'),
		A2($elm$html$Html$Attributes$style, 'height', '48px'),
		A2($elm$html$Html$Attributes$style, 'margin', '24px'),
		A2($elm$html$Html$Attributes$style, 'background-color', '#212121'),
		A2($elm$html$Html$Attributes$style, 'color', '#f0f0f0')
	]);
var $author$project$Material$Elevation$z = function (n) {
	return $elm$html$Html$Attributes$class(
		'mdc-elevation--z' + $elm$core$String$fromInt(n));
};
var $author$project$Material$Elevation$z0 = $author$project$Material$Elevation$z(0);
var $author$project$Material$Elevation$z16 = $author$project$Material$Elevation$z(16);
var $author$project$Material$Elevation$z8 = $author$project$Material$Elevation$z(8);
var $author$project$Demo$Elevation$heroElevation = _List_fromArray(
	[
		A2(
		$elm$html$Html$div,
		A2($elm$core$List$cons, $author$project$Material$Elevation$z0, $author$project$Demo$Elevation$heroSurface),
		_List_fromArray(
			[
				$elm$html$Html$text('Flat 0dp')
			])),
		A2(
		$elm$html$Html$div,
		A2($elm$core$List$cons, $author$project$Material$Elevation$z8, $author$project$Demo$Elevation$heroSurface),
		_List_fromArray(
			[
				$elm$html$Html$text('Raised 8dp')
			])),
		A2(
		$elm$html$Html$div,
		A2($elm$core$List$cons, $author$project$Material$Elevation$z16, $author$project$Demo$Elevation$heroSurface),
		_List_fromArray(
			[
				$elm$html$Html$text('Raised 16dp')
			]))
	]);
var $author$project$Material$Elevation$z1 = $author$project$Material$Elevation$z(1);
var $author$project$Material$Elevation$z10 = $author$project$Material$Elevation$z(10);
var $author$project$Material$Elevation$z11 = $author$project$Material$Elevation$z(11);
var $author$project$Material$Elevation$z12 = $author$project$Material$Elevation$z(12);
var $author$project$Material$Elevation$z13 = $author$project$Material$Elevation$z(13);
var $author$project$Material$Elevation$z14 = $author$project$Material$Elevation$z(14);
var $author$project$Material$Elevation$z15 = $author$project$Material$Elevation$z(15);
var $author$project$Material$Elevation$z17 = $author$project$Material$Elevation$z(17);
var $author$project$Material$Elevation$z18 = $author$project$Material$Elevation$z(18);
var $author$project$Material$Elevation$z19 = $author$project$Material$Elevation$z(19);
var $author$project$Material$Elevation$z2 = $author$project$Material$Elevation$z(2);
var $author$project$Material$Elevation$z20 = $author$project$Material$Elevation$z(20);
var $author$project$Material$Elevation$z21 = $author$project$Material$Elevation$z(21);
var $author$project$Material$Elevation$z22 = $author$project$Material$Elevation$z(22);
var $author$project$Material$Elevation$z23 = $author$project$Material$Elevation$z(23);
var $author$project$Material$Elevation$z24 = $author$project$Material$Elevation$z(24);
var $author$project$Material$Elevation$z3 = $author$project$Material$Elevation$z(3);
var $author$project$Material$Elevation$z4 = $author$project$Material$Elevation$z(4);
var $author$project$Material$Elevation$z5 = $author$project$Material$Elevation$z(5);
var $author$project$Material$Elevation$z6 = $author$project$Material$Elevation$z(6);
var $author$project$Material$Elevation$z7 = $author$project$Material$Elevation$z(7);
var $author$project$Material$Elevation$z9 = $author$project$Material$Elevation$z(9);
var $author$project$Demo$Elevation$view = function (model) {
	return {
		cS: _List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				$author$project$Demo$Elevation$demoContainer,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						A2($elm$core$List$cons, $author$project$Material$Elevation$z0, $author$project$Demo$Elevation$demoSurface),
						_List_fromArray(
							[
								$elm$html$Html$text('0dp')
							])),
						A2(
						$elm$html$Html$div,
						A2($elm$core$List$cons, $author$project$Material$Elevation$z1, $author$project$Demo$Elevation$demoSurface),
						_List_fromArray(
							[
								$elm$html$Html$text('1dp')
							])),
						A2(
						$elm$html$Html$div,
						A2($elm$core$List$cons, $author$project$Material$Elevation$z2, $author$project$Demo$Elevation$demoSurface),
						_List_fromArray(
							[
								$elm$html$Html$text('2dp')
							])),
						A2(
						$elm$html$Html$div,
						A2($elm$core$List$cons, $author$project$Material$Elevation$z3, $author$project$Demo$Elevation$demoSurface),
						_List_fromArray(
							[
								$elm$html$Html$text('3dp')
							])),
						A2(
						$elm$html$Html$div,
						A2($elm$core$List$cons, $author$project$Material$Elevation$z4, $author$project$Demo$Elevation$demoSurface),
						_List_fromArray(
							[
								$elm$html$Html$text('4dp')
							])),
						A2(
						$elm$html$Html$div,
						A2($elm$core$List$cons, $author$project$Material$Elevation$z5, $author$project$Demo$Elevation$demoSurface),
						_List_fromArray(
							[
								$elm$html$Html$text('5dp')
							])),
						A2(
						$elm$html$Html$div,
						A2($elm$core$List$cons, $author$project$Material$Elevation$z6, $author$project$Demo$Elevation$demoSurface),
						_List_fromArray(
							[
								$elm$html$Html$text('6dp')
							])),
						A2(
						$elm$html$Html$div,
						A2($elm$core$List$cons, $author$project$Material$Elevation$z7, $author$project$Demo$Elevation$demoSurface),
						_List_fromArray(
							[
								$elm$html$Html$text('7dp')
							])),
						A2(
						$elm$html$Html$div,
						A2($elm$core$List$cons, $author$project$Material$Elevation$z8, $author$project$Demo$Elevation$demoSurface),
						_List_fromArray(
							[
								$elm$html$Html$text('8dp')
							])),
						A2(
						$elm$html$Html$div,
						A2($elm$core$List$cons, $author$project$Material$Elevation$z9, $author$project$Demo$Elevation$demoSurface),
						_List_fromArray(
							[
								$elm$html$Html$text('9dp')
							])),
						A2(
						$elm$html$Html$div,
						A2($elm$core$List$cons, $author$project$Material$Elevation$z10, $author$project$Demo$Elevation$demoSurface),
						_List_fromArray(
							[
								$elm$html$Html$text('10dp')
							])),
						A2(
						$elm$html$Html$div,
						A2($elm$core$List$cons, $author$project$Material$Elevation$z11, $author$project$Demo$Elevation$demoSurface),
						_List_fromArray(
							[
								$elm$html$Html$text('11dp')
							])),
						A2(
						$elm$html$Html$div,
						A2($elm$core$List$cons, $author$project$Material$Elevation$z12, $author$project$Demo$Elevation$demoSurface),
						_List_fromArray(
							[
								$elm$html$Html$text('12dp')
							])),
						A2(
						$elm$html$Html$div,
						A2($elm$core$List$cons, $author$project$Material$Elevation$z13, $author$project$Demo$Elevation$demoSurface),
						_List_fromArray(
							[
								$elm$html$Html$text('13dp')
							])),
						A2(
						$elm$html$Html$div,
						A2($elm$core$List$cons, $author$project$Material$Elevation$z14, $author$project$Demo$Elevation$demoSurface),
						_List_fromArray(
							[
								$elm$html$Html$text('14dp')
							])),
						A2(
						$elm$html$Html$div,
						A2($elm$core$List$cons, $author$project$Material$Elevation$z15, $author$project$Demo$Elevation$demoSurface),
						_List_fromArray(
							[
								$elm$html$Html$text('15dp')
							])),
						A2(
						$elm$html$Html$div,
						A2($elm$core$List$cons, $author$project$Material$Elevation$z16, $author$project$Demo$Elevation$demoSurface),
						_List_fromArray(
							[
								$elm$html$Html$text('16dp')
							])),
						A2(
						$elm$html$Html$div,
						A2($elm$core$List$cons, $author$project$Material$Elevation$z17, $author$project$Demo$Elevation$demoSurface),
						_List_fromArray(
							[
								$elm$html$Html$text('17dp')
							])),
						A2(
						$elm$html$Html$div,
						A2($elm$core$List$cons, $author$project$Material$Elevation$z18, $author$project$Demo$Elevation$demoSurface),
						_List_fromArray(
							[
								$elm$html$Html$text('18dp')
							])),
						A2(
						$elm$html$Html$div,
						A2($elm$core$List$cons, $author$project$Material$Elevation$z19, $author$project$Demo$Elevation$demoSurface),
						_List_fromArray(
							[
								$elm$html$Html$text('19dp')
							])),
						A2(
						$elm$html$Html$div,
						A2($elm$core$List$cons, $author$project$Material$Elevation$z20, $author$project$Demo$Elevation$demoSurface),
						_List_fromArray(
							[
								$elm$html$Html$text('20dp')
							])),
						A2(
						$elm$html$Html$div,
						A2($elm$core$List$cons, $author$project$Material$Elevation$z21, $author$project$Demo$Elevation$demoSurface),
						_List_fromArray(
							[
								$elm$html$Html$text('21dp')
							])),
						A2(
						$elm$html$Html$div,
						A2($elm$core$List$cons, $author$project$Material$Elevation$z22, $author$project$Demo$Elevation$demoSurface),
						_List_fromArray(
							[
								$elm$html$Html$text('22dp')
							])),
						A2(
						$elm$html$Html$div,
						A2($elm$core$List$cons, $author$project$Material$Elevation$z23, $author$project$Demo$Elevation$demoSurface),
						_List_fromArray(
							[
								$elm$html$Html$text('23dp')
							])),
						A2(
						$elm$html$Html$div,
						A2($elm$core$List$cons, $author$project$Material$Elevation$z24, $author$project$Demo$Elevation$demoSurface),
						_List_fromArray(
							[
								$elm$html$Html$text('24dp')
							]))
					]))
			]),
		cZ: $author$project$Demo$Elevation$heroElevation,
		c9: 'Elevation is the relative depth, or distance, between two surfaces along the z-axis.',
		db: {
			cT: $elm$core$Maybe$Just('https://package.elm-lang.org/packages/aforemny/material-components-web-elm/latest/Material-Elevation'),
			c3: $elm$core$Maybe$Just('https://material.io/go/design-elevation'),
			df: $elm$core$Maybe$Just('https://github.com/material-components/material-components-web/tree/master/packages/mdc-elevation')
		},
		dh: 'Elevation'
	};
};
var $author$project$Demo$Fabs$Focus = function (a) {
	return {$: 0, a: a};
};
var $author$project$Material$Fab$Config = $elm$core$Basics$identity;
var $author$project$Material$Fab$config = {br: _List_Nil, bE: false, bO: false, bc: $elm$core$Maybe$Nothing, aN: true};
var $author$project$Material$Fab$Extended$Config = $elm$core$Basics$identity;
var $author$project$Material$Fab$Extended$config = {br: _List_Nil, bE: false, c: $elm$core$Maybe$Nothing, bc: $elm$core$Maybe$Nothing, bl: false};
var $author$project$Material$Fab$Icon = function (a) {
	return {$: 0, a: a};
};
var $author$project$Material$Fab$customIcon = F3(
	function (node, attributes, nodes) {
		return $author$project$Material$Fab$Icon(
			{aW: attributes, a7: node, a8: nodes});
	});
var $author$project$Material$Fab$Extended$Icon = function (a) {
	return {$: 0, a: a};
};
var $author$project$Material$Fab$Extended$customIcon = F3(
	function (node, attributes, nodes) {
		return $author$project$Material$Fab$Extended$Icon(
			{aW: attributes, a7: node, a8: nodes});
	});
var $author$project$Material$Fab$clickHandler = function (_v0) {
	var onClick = _v0.bc;
	return A2($elm$core$Maybe$map, $elm$html$Html$Events$onClick, onClick);
};
var $author$project$Material$Fab$exitedCs = function (_v0) {
	var exited = _v0.bE;
	return exited ? $elm$core$Maybe$Just(
		$elm$html$Html$Attributes$class('mdc-fab--exited')) : $elm$core$Maybe$Nothing;
};
var $author$project$Material$Fab$iconElt = function (icon_) {
	if (!icon_.$) {
		var node = icon_.a.a7;
		var attributes = icon_.a.aW;
		var nodes = icon_.a.a8;
		return A2(
			$elm$html$Html$map,
			$elm$core$Basics$never,
			A2(
				node,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$class('mdc-fab__icon'),
					attributes),
				nodes));
	} else {
		var node = icon_.a.a7;
		var attributes = icon_.a.aW;
		var nodes = icon_.a.a8;
		return A2(
			$elm$html$Html$map,
			$elm$core$Basics$never,
			A2(
				node,
				A2(
					$elm$core$List$cons,
					$elm$svg$Svg$Attributes$class('mdc-fab__icon'),
					attributes),
				nodes));
	}
};
var $author$project$Material$Fab$miniCs = function (_v0) {
	var mini = _v0.bO;
	return mini ? $elm$core$Maybe$Just(
		$elm$html$Html$Attributes$class('mdc-fab--mini')) : $elm$core$Maybe$Nothing;
};
var $author$project$Material$Fab$rippleElt = A2(
	$elm$html$Html$div,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('mdc-fab__ripple')
		]),
	_List_Nil);
var $author$project$Material$Fab$rootCs = $elm$core$Maybe$Just(
	$elm$html$Html$Attributes$class('mdc-fab'));
var $author$project$Material$Fab$tabIndexProp = function (tabIndex) {
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$Attributes$property,
			'tabIndex',
			$elm$json$Json$Encode$int(tabIndex)));
};
var $author$project$Material$Fab$touchCs = function (_v0) {
	var touch = _v0.aN;
	return touch ? $elm$core$Maybe$Just(
		$elm$html$Html$Attributes$class('mdc-fab--touch')) : $elm$core$Maybe$Nothing;
};
var $author$project$Material$Fab$fab = F2(
	function (config_, icon_) {
		var additionalAttributes = config_.br;
		var touch = config_.aN;
		var wrapTouch = function (node) {
			return touch ? A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('mdc-touch-target-wrapper')
					]),
				_List_fromArray(
					[node])) : node;
		};
		return wrapTouch(
			A3(
				$elm$html$Html$node,
				'mdc-fab',
				_Utils_ap(
					A2(
						$elm$core$List$filterMap,
						$elm$core$Basics$identity,
						_List_fromArray(
							[
								$author$project$Material$Fab$rootCs,
								$author$project$Material$Fab$miniCs(config_),
								$author$project$Material$Fab$touchCs(config_),
								$author$project$Material$Fab$exitedCs(config_),
								$author$project$Material$Fab$clickHandler(config_),
								$author$project$Material$Fab$tabIndexProp(0)
							])),
					additionalAttributes),
				_List_fromArray(
					[
						$author$project$Material$Fab$rippleElt,
						$author$project$Material$Fab$iconElt(icon_)
					])));
	});
var $author$project$Material$Fab$Extended$clickHandler = function (_v0) {
	var onClick = _v0.bc;
	return A2($elm$core$Maybe$map, $elm$html$Html$Events$onClick, onClick);
};
var $author$project$Material$Fab$Extended$exitedCs = function (_v0) {
	var exited = _v0.bE;
	return exited ? $elm$core$Maybe$Just(
		$elm$html$Html$Attributes$class('mdc-fab--exited')) : $elm$core$Maybe$Nothing;
};
var $author$project$Material$Fab$Extended$extendedFabCs = $elm$core$Maybe$Just(
	$elm$html$Html$Attributes$class('mdc-fab mdc-fab--extended'));
var $author$project$Material$Fab$Extended$labelElt = function (label) {
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$span,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('mdc-fab__label')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(label)
				])));
};
var $author$project$Material$Fab$Extended$iconElt = function (_v0) {
	var config_ = _v0;
	return A2(
		$elm$core$Maybe$map,
		$elm$html$Html$map($elm$core$Basics$never),
		function () {
			var _v1 = config_.c;
			if (!_v1.$) {
				if (!_v1.a.$) {
					var node = _v1.a.a.a7;
					var attributes = _v1.a.a.aW;
					var nodes = _v1.a.a.a8;
					return $elm$core$Maybe$Just(
						A2(
							node,
							A2(
								$elm$core$List$cons,
								$elm$html$Html$Attributes$class('mdc-fab__icon'),
								attributes),
							nodes));
				} else {
					var node = _v1.a.a.a7;
					var attributes = _v1.a.a.aW;
					var nodes = _v1.a.a.a8;
					return $elm$core$Maybe$Just(
						A2(
							node,
							A2(
								$elm$core$List$cons,
								$elm$svg$Svg$Attributes$class('mdc-fab__icon'),
								attributes),
							nodes));
				}
			} else {
				return $elm$core$Maybe$Nothing;
			}
		}());
};
var $author$project$Material$Fab$Extended$leadingIconElt = function (config_) {
	var trailingIcon = config_.bl;
	return (!trailingIcon) ? $author$project$Material$Fab$Extended$iconElt(config_) : $elm$core$Maybe$Nothing;
};
var $author$project$Material$Fab$Extended$rippleElt = $elm$core$Maybe$Just(
	A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('mdc-fab__ripple')
			]),
		_List_Nil));
var $author$project$Material$Fab$Extended$rootCs = $elm$core$Maybe$Just(
	$elm$html$Html$Attributes$class('mdc-fab'));
var $author$project$Material$Fab$Extended$tabIndexProp = function (tabIndex) {
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$Attributes$property,
			'tabIndex',
			$elm$json$Json$Encode$int(tabIndex)));
};
var $author$project$Material$Fab$Extended$trailingIconElt = function (config_) {
	var trailingIcon = config_.bl;
	return trailingIcon ? $author$project$Material$Fab$Extended$iconElt(config_) : $elm$core$Maybe$Nothing;
};
var $author$project$Material$Fab$Extended$fab = F2(
	function (config_, label) {
		var additionalAttributes = config_.br;
		return A3(
			$elm$html$Html$node,
			'mdc-fab',
			_Utils_ap(
				A2(
					$elm$core$List$filterMap,
					$elm$core$Basics$identity,
					_List_fromArray(
						[
							$author$project$Material$Fab$Extended$rootCs,
							$author$project$Material$Fab$Extended$extendedFabCs,
							$author$project$Material$Fab$Extended$exitedCs(config_),
							$author$project$Material$Fab$Extended$clickHandler(config_),
							$author$project$Material$Fab$Extended$tabIndexProp(0)
						])),
				additionalAttributes),
			A2(
				$elm$core$List$filterMap,
				$elm$core$Basics$identity,
				_List_fromArray(
					[
						$author$project$Material$Fab$Extended$rippleElt,
						$author$project$Material$Fab$Extended$leadingIconElt(config_),
						$author$project$Material$Fab$Extended$labelElt(label),
						$author$project$Material$Fab$Extended$trailingIconElt(config_)
					])));
	});
var $author$project$Material$Fab$icon = function (iconName) {
	return A3(
		$author$project$Material$Fab$customIcon,
		$elm$html$Html$i,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('material-icons')
			]),
		_List_fromArray(
			[
				$elm$html$Html$text(iconName)
			]));
};
var $author$project$Material$Fab$Extended$icon = function (iconName) {
	return A3(
		$author$project$Material$Fab$Extended$customIcon,
		$elm$html$Html$i,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('material-icons')
			]),
		_List_fromArray(
			[
				$elm$html$Html$text(iconName)
			]));
};
var $author$project$Material$Fab$setAttributes = F2(
	function (additionalAttributes, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{br: additionalAttributes});
	});
var $author$project$Material$Fab$Extended$setIcon = F2(
	function (icon_, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{c: icon_});
	});
var $author$project$Material$Fab$setMini = F2(
	function (mini, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{bO: mini});
	});
var $author$project$Material$Fab$Extended$setTrailingIcon = F2(
	function (trailingIcon, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{bl: trailingIcon});
	});
var $author$project$Material$Fab$SvgIcon = function (a) {
	return {$: 1, a: a};
};
var $author$project$Material$Fab$svgIcon = F2(
	function (attributes, nodes) {
		return $author$project$Material$Fab$SvgIcon(
			{aW: attributes, a7: $elm$svg$Svg$svg, a8: nodes});
	});
var $author$project$Material$Fab$Extended$SvgIcon = function (a) {
	return {$: 1, a: a};
};
var $author$project$Material$Fab$Extended$svgIcon = F2(
	function (attributes, nodes) {
		return $author$project$Material$Fab$Extended$SvgIcon(
			{aW: attributes, a7: $elm$svg$Svg$svg, a8: nodes});
	});
var $author$project$Demo$Fabs$view = function (model) {
	return {
		cS: _List_fromArray(
			[
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Standard Floating Action Button')
					])),
				A2(
				$author$project$Material$Fab$fab,
				$author$project$Material$Fab$config,
				$author$project$Material$Fab$icon('favorite_border')),
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Mini Floating Action Button')
					])),
				A2(
				$author$project$Material$Fab$fab,
				A2($author$project$Material$Fab$setMini, true, $author$project$Material$Fab$config),
				$author$project$Material$Fab$icon('favorite_border')),
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Extended FAB')
					])),
				A2(
				$author$project$Material$Fab$Extended$fab,
				A2(
					$author$project$Material$Fab$Extended$setIcon,
					$elm$core$Maybe$Just(
						$author$project$Material$Fab$Extended$icon('add')),
					$author$project$Material$Fab$Extended$config),
				'Create'),
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Extended FAB (Text label followed by icon)')
					])),
				A2(
				$author$project$Material$Fab$Extended$fab,
				A2(
					$author$project$Material$Fab$Extended$setTrailingIcon,
					true,
					A2(
						$author$project$Material$Fab$Extended$setIcon,
						$elm$core$Maybe$Just(
							$author$project$Material$Fab$Extended$icon('add')),
						$author$project$Material$Fab$Extended$config)),
				'Create'),
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Extended FAB (without icon)')
					])),
				A2($author$project$Material$Fab$Extended$fab, $author$project$Material$Fab$Extended$config, 'Create'),
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('FAB (Shaped)')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'display', 'flex')
					]),
				_List_fromArray(
					[
						A2(
						$author$project$Material$Fab$fab,
						A2(
							$author$project$Material$Fab$setAttributes,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'border-radius', '50% 0'),
									A2($elm$html$Html$Attributes$style, 'margin-right', '24px')
								]),
							$author$project$Material$Fab$config),
						$author$project$Material$Fab$icon('favorite_border')),
						A2(
						$author$project$Material$Fab$fab,
						A2(
							$author$project$Material$Fab$setAttributes,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'border-radius', '8px'),
									A2($elm$html$Html$Attributes$style, 'margin-right', '24px')
								]),
							A2($author$project$Material$Fab$setMini, true, $author$project$Material$Fab$config)),
						$author$project$Material$Fab$icon('favorite_border')),
						A2(
						$author$project$Material$Fab$Extended$fab,
						A2(
							$author$project$Material$Fab$Extended$setIcon,
							$elm$core$Maybe$Just(
								$author$project$Material$Fab$Extended$icon('add')),
							$author$project$Material$Fab$Extended$config),
						'Create')
					])),
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('FAB with Custom Icon')
					])),
				A2(
				$author$project$Material$Fab$fab,
				$author$project$Material$Fab$config,
				$author$project$Material$Fab$icon('favorite_border')),
				$elm$html$Html$text('\u00A0'),
				A2(
				$author$project$Material$Fab$fab,
				$author$project$Material$Fab$config,
				A3(
					$author$project$Material$Fab$customIcon,
					$elm$html$Html$i,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('fab fa-font-awesome')
						]),
					_List_Nil)),
				$elm$html$Html$text('\u00A0'),
				A2(
				$author$project$Material$Fab$fab,
				$author$project$Material$Fab$config,
				A2(
					$author$project$Material$Fab$svgIcon,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$viewBox('0 0 100 100')
						]),
					$author$project$Demo$ElmLogo$elmLogo)),
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Extended FAB with Custom Icon')
					])),
				A2(
				$author$project$Material$Fab$Extended$fab,
				A2(
					$author$project$Material$Fab$Extended$setIcon,
					$elm$core$Maybe$Just(
						$author$project$Material$Fab$Extended$icon('favorite_border')),
					$author$project$Material$Fab$Extended$config),
				'Material Icons'),
				$elm$html$Html$text('\u00A0'),
				A2(
				$author$project$Material$Fab$Extended$fab,
				A2(
					$author$project$Material$Fab$Extended$setIcon,
					$elm$core$Maybe$Just(
						A3(
							$author$project$Material$Fab$Extended$customIcon,
							$elm$html$Html$i,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('fab fa-font-awesome')
								]),
							_List_Nil)),
					$author$project$Material$Fab$Extended$config),
				'Font Awesome'),
				$elm$html$Html$text('\u00A0'),
				A2(
				$author$project$Material$Fab$Extended$fab,
				A2(
					$author$project$Material$Fab$Extended$setIcon,
					$elm$core$Maybe$Just(
						A2(
							$author$project$Material$Fab$Extended$svgIcon,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$viewBox('0 0 100 100')
								]),
							$author$project$Demo$ElmLogo$elmLogo)),
					$author$project$Material$Fab$Extended$config),
				'SVG'),
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Focus FAB')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'display', 'flex')
					]),
				_List_fromArray(
					[
						A2(
						$author$project$Material$Fab$fab,
						A2(
							$author$project$Material$Fab$setAttributes,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$id('my-fab')
								]),
							$author$project$Material$Fab$config),
						$author$project$Material$Fab$icon('favorite_border')),
						$elm$html$Html$text('\u00A0'),
						A2(
						$author$project$Material$Button$raised,
						A2(
							$author$project$Material$Button$setOnClick,
							$author$project$Demo$Fabs$Focus('my-fab'),
							$author$project$Material$Button$config),
						'Focus')
					]))
			]),
		cZ: _List_fromArray(
			[
				A2(
				$author$project$Material$Fab$fab,
				$author$project$Material$Fab$config,
				$author$project$Material$Fab$icon('favorite_border'))
			]),
		c9: 'Floating action buttons represents the primary action in an application. Only one floating action button is recommended per screen to represent the most common action.',
		db: {
			cT: $elm$core$Maybe$Just('https://package.elm-lang.org/packages/aforemny/material-components-web-elm/latest/Material-Fab'),
			c3: $elm$core$Maybe$Just('https://material.io/go/design-fab'),
			df: $elm$core$Maybe$Just('https://github.com/material-components/material-components-web/blob/master/packages/mdc-fab/')
		},
		dh: 'Floating Action Button'
	};
};
var $author$project$Material$TopAppBar$setFixed = F2(
	function (fixed, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{bF: fixed});
	});
var $author$project$Demo$FixedTopAppBar$view = function (model) {
	return {
		cX: $author$project$Material$TopAppBar$fixedAdjust,
		di: A2(
			$author$project$Material$TopAppBar$regular,
			A2($author$project$Material$TopAppBar$setFixed, true, $author$project$Material$TopAppBar$config),
			_List_fromArray(
				[
					A2(
					$author$project$Material$TopAppBar$row,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$author$project$Material$TopAppBar$section,
							_List_fromArray(
								[$author$project$Material$TopAppBar$alignStart]),
							_List_fromArray(
								[
									A2(
									$author$project$Material$IconButton$iconButton,
									A2(
										$author$project$Material$IconButton$setAttributes,
										_List_fromArray(
											[$author$project$Material$TopAppBar$navigationIcon]),
										$author$project$Material$IconButton$config),
									$author$project$Material$IconButton$icon('menu')),
									A2(
									$elm$html$Html$span,
									_List_fromArray(
										[$author$project$Material$TopAppBar$title]),
									_List_fromArray(
										[
											$elm$html$Html$text('Fixed')
										]))
								])),
							A2(
							$author$project$Material$TopAppBar$section,
							_List_fromArray(
								[$author$project$Material$TopAppBar$alignEnd]),
							_List_fromArray(
								[
									A2(
									$author$project$Material$IconButton$iconButton,
									A2(
										$author$project$Material$IconButton$setAttributes,
										_List_fromArray(
											[$author$project$Material$TopAppBar$actionItem]),
										$author$project$Material$IconButton$config),
									$author$project$Material$IconButton$icon('file_download')),
									A2(
									$author$project$Material$IconButton$iconButton,
									A2(
										$author$project$Material$IconButton$setAttributes,
										_List_fromArray(
											[$author$project$Material$TopAppBar$actionItem]),
										$author$project$Material$IconButton$config),
									$author$project$Material$IconButton$icon('print')),
									A2(
									$author$project$Material$IconButton$iconButton,
									A2(
										$author$project$Material$IconButton$setAttributes,
										_List_fromArray(
											[$author$project$Material$TopAppBar$actionItem]),
										$author$project$Material$IconButton$config),
									$author$project$Material$IconButton$icon('bookmark'))
								]))
						]))
				]))
	};
};
var $author$project$Demo$IconButton$Focus = function (a) {
	return {$: 1, a: a};
};
var $author$project$Demo$IconButton$Toggle = function (a) {
	return {$: 0, a: a};
};
var $author$project$Material$IconToggle$Config = $elm$core$Basics$identity;
var $author$project$Material$IconToggle$config = {br: _List_Nil, ad: false, b: $elm$core$Maybe$Nothing, ba: false, bb: $elm$core$Maybe$Nothing};
var $author$project$Material$IconToggle$Icon = function (a) {
	return {$: 0, a: a};
};
var $author$project$Material$IconToggle$customIcon = F3(
	function (node, attributes, nodes) {
		return $author$project$Material$IconToggle$Icon(
			{aW: attributes, a7: node, a8: nodes});
	});
var $author$project$Material$IconToggle$icon = function (iconName) {
	return A3(
		$author$project$Material$IconToggle$customIcon,
		$elm$html$Html$i,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('material-icons')
			]),
		_List_fromArray(
			[
				$elm$html$Html$text(iconName)
			]));
};
var $author$project$Material$IconToggle$ariaHiddenAttr = $elm$core$Maybe$Just(
	A2($elm$html$Html$Attributes$attribute, 'aria-hidden', 'true'));
var $author$project$Material$IconToggle$ariaLabelAttr = function (_v0) {
	var label = _v0.b;
	return A2(
		$elm$core$Maybe$map,
		$elm$html$Html$Attributes$attribute('aria-label'),
		label);
};
var $author$project$Material$IconToggle$ariaPressedAttr = function (_v0) {
	var on = _v0.ba;
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$Attributes$attribute,
			'aria-pressed',
			on ? 'true' : 'false'));
};
var $author$project$Material$IconToggle$changeHandler = function (_v0) {
	var onChange = _v0.bb;
	return A2(
		$elm$core$Maybe$map,
		A2(
			$elm$core$Basics$composeL,
			$elm$html$Html$Events$on('MDCIconButtonToggle:change'),
			$elm$json$Json$Decode$succeed),
		onChange);
};
var $author$project$Material$IconToggle$disabledAttr = function (_v0) {
	var disabled = _v0.ad;
	return $elm$core$Maybe$Just(
		$elm$html$Html$Attributes$disabled(disabled));
};
var $author$project$Material$IconToggle$iconElt = F2(
	function (className, icon_) {
		return A2(
			$elm$html$Html$map,
			$elm$core$Basics$never,
			function () {
				if (!icon_.$) {
					var node = icon_.a.a7;
					var attributes = icon_.a.aW;
					var nodes = icon_.a.a8;
					return A2(
						node,
						A2(
							$elm$core$List$cons,
							$elm$html$Html$Attributes$class(className),
							attributes),
						nodes);
				} else {
					var node = icon_.a.a7;
					var attributes = icon_.a.aW;
					var nodes = icon_.a.a8;
					return A2(
						node,
						A2(
							$elm$core$List$cons,
							$elm$svg$Svg$Attributes$class(className),
							attributes),
						nodes);
				}
			}());
	});
var $author$project$Material$IconToggle$onProp = function (_v0) {
	var on = _v0.ba;
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$Attributes$property,
			'on',
			$elm$json$Json$Encode$bool(on)));
};
var $author$project$Material$IconToggle$rootCs = $elm$core$Maybe$Just(
	$elm$html$Html$Attributes$class('mdc-icon-button'));
var $author$project$Material$IconToggle$tabIndexProp = $elm$core$Maybe$Just(
	$elm$html$Html$Attributes$tabindex(0));
var $author$project$Material$IconToggle$iconToggle = F2(
	function (config_, _v0) {
		var additionalAttributes = config_.br;
		var onIcon = _v0.N;
		var offIcon = _v0.M;
		return A3(
			$elm$html$Html$node,
			'mdc-icon-button',
			_Utils_ap(
				A2(
					$elm$core$List$filterMap,
					$elm$core$Basics$identity,
					_List_fromArray(
						[
							$author$project$Material$IconToggle$rootCs,
							$author$project$Material$IconToggle$onProp(config_),
							$author$project$Material$IconToggle$tabIndexProp,
							$author$project$Material$IconToggle$ariaHiddenAttr,
							$author$project$Material$IconToggle$ariaPressedAttr(config_),
							$author$project$Material$IconToggle$ariaLabelAttr(config_),
							$author$project$Material$IconToggle$changeHandler(config_),
							$author$project$Material$IconToggle$disabledAttr(config_)
						])),
				additionalAttributes),
			_List_fromArray(
				[
					A2($author$project$Material$IconToggle$iconElt, 'mdc-icon-button__icon mdc-icon-button__icon--on', onIcon),
					A2($author$project$Material$IconToggle$iconElt, 'mdc-icon-button__icon', offIcon)
				]));
	});
var $author$project$Material$IconToggle$setAttributes = F2(
	function (additionalAttributes, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{br: additionalAttributes});
	});
var $author$project$Material$IconToggle$setOn = F2(
	function (on, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{ba: on});
	});
var $author$project$Material$IconToggle$setOnChange = F2(
	function (onChange, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{
				bb: $elm$core$Maybe$Just(onChange)
			});
	});
var $author$project$Material$IconButton$Internal$SvgIcon = function (a) {
	return {$: 1, a: a};
};
var $author$project$Material$IconButton$svgIcon = F2(
	function (attributes, nodes) {
		return $author$project$Material$IconButton$Internal$SvgIcon(
			{aW: attributes, a7: $elm$svg$Svg$svg, a8: nodes});
	});
var $author$project$Material$IconToggle$SvgIcon = function (a) {
	return {$: 1, a: a};
};
var $author$project$Material$IconToggle$svgIcon = F2(
	function (attributes, nodes) {
		return $author$project$Material$IconToggle$SvgIcon(
			{aW: attributes, a7: $elm$svg$Svg$svg, a8: nodes});
	});
var $author$project$Demo$IconButton$view = function (model) {
	return {
		cS: _List_fromArray(
			[
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Icon Button')
					])),
				A2(
				$author$project$Material$IconButton$iconButton,
				$author$project$Material$IconButton$config,
				$author$project$Material$IconButton$icon('wifi')),
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Icon Toggle')
					])),
				A2(
				$author$project$Material$IconToggle$iconToggle,
				A2(
					$author$project$Material$IconToggle$setOnChange,
					$author$project$Demo$IconButton$Toggle('icon-button-toggle'),
					A2(
						$author$project$Material$IconToggle$setOn,
						A2($elm$core$Set$member, 'icon-button-toggle', model.l),
						$author$project$Material$IconToggle$config)),
				{
					M: $author$project$Material$IconToggle$icon('favorite_border'),
					N: $author$project$Material$IconToggle$icon('favorite')
				}),
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Icon Button with Custom Icon')
					])),
				A2(
				$author$project$Material$IconButton$iconButton,
				$author$project$Material$IconButton$config,
				$author$project$Material$IconButton$icon('favorite')),
				A2(
				$author$project$Material$IconButton$iconButton,
				$author$project$Material$IconButton$config,
				A3(
					$author$project$Material$IconButton$customIcon,
					$elm$html$Html$i,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('fab fa-font-awesome'),
							A2($elm$html$Html$Attributes$style, 'width', '24px'),
							A2($elm$html$Html$Attributes$style, 'text-align', 'center')
						]),
					_List_Nil)),
				A2(
				$author$project$Material$IconButton$iconButton,
				$author$project$Material$IconButton$config,
				A2(
					$author$project$Material$IconButton$svgIcon,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$viewBox('0 0 100 100')
						]),
					$author$project$Demo$ElmLogo$elmLogo)),
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Icon Toggle with Custom Icon')
					])),
				A2(
				$author$project$Material$IconToggle$iconToggle,
				A2(
					$author$project$Material$IconToggle$setOnChange,
					$author$project$Demo$IconButton$Toggle('custom-icon-toggle-1'),
					A2(
						$author$project$Material$IconToggle$setOn,
						A2($elm$core$Set$member, 'custom-icon-toggle-1', model.l),
						$author$project$Material$IconToggle$config)),
				{
					M: $author$project$Material$IconToggle$icon('favorite_border'),
					N: $author$project$Material$IconToggle$icon('favorite')
				}),
				A2(
				$author$project$Material$IconToggle$iconToggle,
				A2(
					$author$project$Material$IconToggle$setOnChange,
					$author$project$Demo$IconButton$Toggle('custom-icon-toggle-2'),
					A2(
						$author$project$Material$IconToggle$setOn,
						A2($elm$core$Set$member, 'custom-icon-toggle-2', model.l),
						$author$project$Material$IconToggle$config)),
				{
					M: A3(
						$author$project$Material$IconToggle$customIcon,
						$elm$html$Html$i,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('fab fa-font-awesome-alt'),
								A2($elm$html$Html$Attributes$style, 'width', '24px'),
								A2($elm$html$Html$Attributes$style, 'text-align', 'center')
							]),
						_List_Nil),
					N: A3(
						$author$project$Material$IconToggle$customIcon,
						$elm$html$Html$i,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('fab fa-font-awesome'),
								A2($elm$html$Html$Attributes$style, 'width', '24px'),
								A2($elm$html$Html$Attributes$style, 'text-align', 'center')
							]),
						_List_Nil)
				}),
				A2(
				$author$project$Material$IconToggle$iconToggle,
				A2(
					$author$project$Material$IconToggle$setOnChange,
					$author$project$Demo$IconButton$Toggle('custom-icon-toggle-3'),
					A2(
						$author$project$Material$IconToggle$setOn,
						A2($elm$core$Set$member, 'custom-icon-toggle-3', model.l),
						$author$project$Material$IconToggle$config)),
				{
					M: A2(
						$author$project$Material$IconToggle$svgIcon,
						_List_fromArray(
							[
								$elm$svg$Svg$Attributes$viewBox('0 0 100 100')
							]),
						$author$project$Demo$ElmLogo$elmLogo),
					N: A2(
						$author$project$Material$IconToggle$svgIcon,
						_List_fromArray(
							[
								$elm$svg$Svg$Attributes$viewBox('0 0 100 100')
							]),
						$author$project$Demo$ElmLogo$elmLogo)
				}),
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Focus Icon Button')
					])),
				A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$author$project$Material$IconButton$iconButton,
						A2(
							$author$project$Material$IconButton$setAttributes,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$id('my-icon-button')
								]),
							$author$project$Material$IconButton$config),
						$author$project$Material$IconButton$icon('wifi')),
						$elm$html$Html$text('\u00A0'),
						A2(
						$author$project$Material$Button$raised,
						A2(
							$author$project$Material$Button$setOnClick,
							$author$project$Demo$IconButton$Focus('my-icon-button'),
							$author$project$Material$Button$config),
						'Focus')
					])),
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Focus Icon Toggle')
					])),
				A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$author$project$Material$IconToggle$iconToggle,
						A2(
							$author$project$Material$IconToggle$setAttributes,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$id('my-icon-toggle')
								]),
							A2(
								$author$project$Material$IconToggle$setOnChange,
								$author$project$Demo$IconButton$Toggle('my-icon-toggle'),
								A2(
									$author$project$Material$IconToggle$setOn,
									A2($elm$core$Set$member, 'my-icon-toggle', model.l),
									$author$project$Material$IconToggle$config))),
						{
							M: $author$project$Material$IconToggle$icon('favorite_border'),
							N: $author$project$Material$IconToggle$icon('favorite')
						}),
						$elm$html$Html$text('\u00A0'),
						A2(
						$author$project$Material$Button$raised,
						A2(
							$author$project$Material$Button$setOnClick,
							$author$project$Demo$IconButton$Focus('my-icon-toggle'),
							$author$project$Material$Button$config),
						'Focus')
					]))
			]),
		cZ: _List_fromArray(
			[
				A2(
				$author$project$Material$IconToggle$iconToggle,
				A2(
					$author$project$Material$IconToggle$setOnChange,
					$author$project$Demo$IconButton$Toggle('icon-button-hero'),
					A2(
						$author$project$Material$IconToggle$setOn,
						A2($elm$core$Set$member, 'icon-button-hero', model.l),
						$author$project$Material$IconToggle$config)),
				{
					M: $author$project$Material$IconToggle$icon('favorite_border'),
					N: $author$project$Material$IconToggle$icon('favorite')
				})
			]),
		c9: 'Icons are appropriate for buttons that allow a user to take actions or make a selection, such as adding or removing a star to an item.',
		db: {
			cT: $elm$core$Maybe$Just('https://package.elm-lang.org/packages/aforemny/material-components-web-elm/latest/Material-IconButton'),
			c3: $elm$core$Maybe$Just('https://material.io/design/components/buttons.html#toggle-button'),
			df: $elm$core$Maybe$Just('https://github.com/material-components/material-components-web/tree/master/packages/mdc-icon-button')
		},
		dh: 'Icon Button'
	};
};
var $author$project$Material$ImageList$Config = $elm$core$Basics$identity;
var $author$project$Material$ImageList$config = {br: _List_Nil, a2: false, cf: false};
var $author$project$Material$ImageList$imageElt = F2(
	function (masonry, _v0) {
		var href = _v0.ak;
		var image = _v0.c0;
		var img = A2(
			$elm$html$Html$img,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('mdc-image-list__image'),
					$elm$html$Html$Attributes$src(image)
				]),
			_List_Nil);
		return masonry ? ((!_Utils_eq(href, $elm$core$Maybe$Nothing)) ? A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('mdc-ripple-surface')
				]),
			_List_fromArray(
				[img])) : img) : A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('mdc-image-list__image'),
					A2($elm$html$Html$Attributes$style, 'background-image', 'url(\'' + (image + '\')'))
				]),
			_List_Nil);
	});
var $author$project$Material$ImageList$imageAspectContainerElt = F2(
	function (masonry, listItem) {
		var href = listItem.ak;
		return A2(
			$elm$html$Html$div,
			A2(
				$elm$core$List$filterMap,
				$elm$core$Basics$identity,
				_List_fromArray(
					[
						$elm$core$Maybe$Just(
						$elm$html$Html$Attributes$class('mdc-image-list__image-aspect-container')),
						A2(
						$elm$core$Maybe$map,
						function (_v0) {
							return $elm$html$Html$Attributes$class('mdc-ripple-surface');
						},
						href)
					])),
			_List_fromArray(
				[
					A2($author$project$Material$ImageList$imageElt, masonry, listItem)
				]));
	});
var $author$project$Material$ImageList$supportingElt = function (_v0) {
	var label = _v0.b;
	if (!label.$) {
		var string = label.a;
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('mdc-image-list__supporting')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('mdc-image-list__label')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(string)
						]))
				]));
	} else {
		return $elm$html$Html$text('');
	}
};
var $author$project$Material$ImageList$listItemElt = F2(
	function (config_, listItem) {
		var masonry = config_.a2;
		var href = listItem.ak;
		var additionalAttributes = listItem.br;
		var inner = _List_fromArray(
			[
				masonry ? A2($author$project$Material$ImageList$imageElt, masonry, listItem) : A2($author$project$Material$ImageList$imageAspectContainerElt, masonry, listItem),
				$author$project$Material$ImageList$supportingElt(listItem)
			]);
		return A3(
			$elm$html$Html$node,
			'mdc-image-list-item',
			A2(
				$elm$core$List$cons,
				$elm$html$Html$Attributes$class('mdc-image-list__item'),
				additionalAttributes),
			A2(
				$elm$core$Maybe$withDefault,
				inner,
				A2(
					$elm$core$Maybe$map,
					function (href_) {
						return _List_fromArray(
							[
								A2(
								$elm$html$Html$a,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$href(href_)
									]),
								inner)
							]);
					},
					href)));
	});
var $author$project$Material$ImageList$masonryCs = function (_v0) {
	var masonry = _v0.a2;
	return masonry ? $elm$core$Maybe$Just(
		$elm$html$Html$Attributes$class('mdc-image-list--masonry')) : $elm$core$Maybe$Nothing;
};
var $author$project$Material$ImageList$rootCs = $elm$core$Maybe$Just(
	$elm$html$Html$Attributes$class('mdc-image-list'));
var $author$project$Material$ImageList$withTextProtectionCs = function (_v0) {
	var withTextProtection = _v0.cf;
	return withTextProtection ? $elm$core$Maybe$Just(
		$elm$html$Html$Attributes$class('mdc-image-list--with-text-protection')) : $elm$core$Maybe$Nothing;
};
var $author$project$Material$ImageList$imageList = F2(
	function (config_, listItems) {
		var additionalAttributes = config_.br;
		return A3(
			$elm$html$Html$node,
			'mdc-image-list',
			_Utils_ap(
				A2(
					$elm$core$List$filterMap,
					$elm$core$Basics$identity,
					_List_fromArray(
						[
							$author$project$Material$ImageList$rootCs,
							$author$project$Material$ImageList$masonryCs(config_),
							$author$project$Material$ImageList$withTextProtectionCs(config_)
						])),
				additionalAttributes),
			A2(
				$elm$core$List$map,
				$author$project$Material$ImageList$listItemElt(config_),
				listItems));
	});
var $author$project$Material$ImageList$Item$Internal$Config = $elm$core$Basics$identity;
var $author$project$Material$ImageList$Item$config = {br: _List_Nil, ak: $elm$core$Maybe$Nothing, c0: '', b: $elm$core$Maybe$Nothing};
var $author$project$Material$ImageList$Item$Internal$ImageListItem = $elm$core$Basics$identity;
var $author$project$Material$ImageList$Item$imageListItem = F2(
	function (_v0, image) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{c0: image});
	});
var $author$project$Material$ImageList$Item$setAttributes = F2(
	function (additionalAttributes, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{br: additionalAttributes});
	});
var $author$project$Demo$ImageList$imageListHeroItem = A2(
	$author$project$Material$ImageList$Item$imageListItem,
	A2(
		$author$project$Material$ImageList$Item$setAttributes,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'width', 'calc(100% / 5 - 4.2px)'),
				A2($elm$html$Html$Attributes$style, 'margin', '2px')
			]),
		$author$project$Material$ImageList$Item$config),
	'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAAXNSR0IArs4c6QAAAAlwSFlzAAAWJQAAFiUBSVIk8AAAABNJREFUCB1jZGBg+A/EDEwgAgQADigBA//q6GsAAAAASUVORK5CYII%3D');
var $author$project$Demo$ImageList$masonryImages = _List_fromArray(
	['images/photos/3x2/16.jpg', 'images/photos/2x3/1.jpg', 'images/photos/3x2/1.jpg', 'images/photos/2x3/2.jpg', 'images/photos/2x3/3.jpg', 'images/photos/3x2/2.jpg', 'images/photos/2x3/4.jpg', 'images/photos/3x2/3.jpg', 'images/photos/2x3/5.jpg', 'images/photos/3x2/4.jpg', 'images/photos/2x3/6.jpg', 'images/photos/3x2/5.jpg', 'images/photos/2x3/7.jpg', 'images/photos/3x2/6.jpg', 'images/photos/3x2/7.jpg']);
var $author$project$Material$ImageList$Item$setLabel = F2(
	function (label, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{b: label});
	});
var $author$project$Demo$ImageList$masonryItem = function (url) {
	return A2(
		$author$project$Material$ImageList$Item$imageListItem,
		A2(
			$author$project$Material$ImageList$Item$setAttributes,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'margin-bottom', '16px')
				]),
			A2(
				$author$project$Material$ImageList$Item$setLabel,
				$elm$core$Maybe$Just('Text label'),
				$author$project$Material$ImageList$Item$config)),
		url);
};
var $author$project$Material$ImageList$setAttributes = F2(
	function (additionalAttributes, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{br: additionalAttributes});
	});
var $author$project$Material$ImageList$setMasonry = F2(
	function (masonry, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{a2: masonry});
	});
var $author$project$Demo$ImageList$masonryImageList = A2(
	$author$project$Material$ImageList$imageList,
	A2(
		$author$project$Material$ImageList$setAttributes,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'max-width', '900px'),
				A2($elm$html$Html$Attributes$style, 'column-count', '5'),
				A2($elm$html$Html$Attributes$style, 'column-gap', '16px')
			]),
		A2($author$project$Material$ImageList$setMasonry, true, $author$project$Material$ImageList$config)),
	A2($elm$core$List$map, $author$project$Demo$ImageList$masonryItem, $author$project$Demo$ImageList$masonryImages));
var $author$project$Material$ImageList$setWithTextProtection = F2(
	function (withTextProtection, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{cf: withTextProtection});
	});
var $author$project$Demo$ImageList$standardImages = _List_fromArray(
	['images/photos/3x2/1.jpg', 'images/photos/3x2/2.jpg', 'images/photos/3x2/3.jpg', 'images/photos/3x2/4.jpg', 'images/photos/3x2/5.jpg', 'images/photos/3x2/6.jpg', 'images/photos/3x2/7.jpg', 'images/photos/3x2/8.jpg', 'images/photos/3x2/9.jpg', 'images/photos/3x2/10.jpg', 'images/photos/3x2/11.jpg', 'images/photos/3x2/12.jpg', 'images/photos/3x2/13.jpg', 'images/photos/3x2/14.jpg', 'images/photos/3x2/15.jpg']);
var $author$project$Demo$ImageList$standardItem = function (url) {
	return A2(
		$author$project$Material$ImageList$Item$imageListItem,
		A2(
			$author$project$Material$ImageList$Item$setAttributes,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'width', 'calc(100% / 5 - 4.2px)'),
					A2($elm$html$Html$Attributes$style, 'margin', '2px')
				]),
			A2(
				$author$project$Material$ImageList$Item$setLabel,
				$elm$core$Maybe$Just('Text label'),
				$author$project$Material$ImageList$Item$config)),
		url);
};
var $author$project$Demo$ImageList$standardImageList = A2(
	$author$project$Material$ImageList$imageList,
	A2(
		$author$project$Material$ImageList$setAttributes,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'max-width', '900px')
			]),
		A2($author$project$Material$ImageList$setWithTextProtection, true, $author$project$Material$ImageList$config)),
	A2($elm$core$List$map, $author$project$Demo$ImageList$standardItem, $author$project$Demo$ImageList$standardImages));
var $author$project$Demo$ImageList$view = function (model) {
	return {
		cS: _List_fromArray(
			[
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Standard Image List with Text Protection')
					])),
				$author$project$Demo$ImageList$standardImageList,
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Masonry Image List')
					])),
				$author$project$Demo$ImageList$masonryImageList
			]),
		cZ: _List_fromArray(
			[
				A2(
				$author$project$Material$ImageList$imageList,
				A2(
					$author$project$Material$ImageList$setAttributes,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'width', '300px')
						]),
					$author$project$Material$ImageList$config),
				A2($elm$core$List$repeat, 15, $author$project$Demo$ImageList$imageListHeroItem))
			]),
		c9: 'Image lists display a collection of images in an organized grid.',
		db: {
			cT: $elm$core$Maybe$Just('https://package.elm-lang.org/packages/aforemny/material-components-web-elm/latest/Material-ImageList'),
			c3: $elm$core$Maybe$Just('https://material.io/go/design-image-list'),
			df: $elm$core$Maybe$Just('https://github.com/material-components/material-components-web/tree/master/packages/mdc-image-list')
		},
		dh: 'Image List'
	};
};
var $author$project$Material$LayoutGrid$alignBottom = $elm$html$Html$Attributes$class('mdc-layout-grid__cell--align-bottom');
var $author$project$Material$LayoutGrid$alignMiddle = $elm$html$Html$Attributes$class('mdc-layout-grid__cell--align-middle');
var $author$project$Material$LayoutGrid$alignTop = $elm$html$Html$Attributes$class('mdc-layout-grid__cell--align-top');
var $author$project$Material$LayoutGrid$cell = F2(
	function (attributes, nodes) {
		return A2(
			$elm$html$Html$div,
			A2(
				$elm$core$List$cons,
				$elm$html$Html$Attributes$class('mdc-layout-grid__cell'),
				attributes),
			nodes);
	});
var $author$project$Demo$LayoutGrid$demoCell = function (options) {
	return A2(
		$author$project$Material$LayoutGrid$cell,
		A2(
			$elm$core$List$cons,
			A2($elm$html$Html$Attributes$style, 'background', 'rgba(0,0,0,.2)'),
			A2(
				$elm$core$List$cons,
				A2($elm$html$Html$Attributes$style, 'height', '100px'),
				options)),
		_List_Nil);
};
var $author$project$Material$LayoutGrid$layoutGrid = F2(
	function (attributes, nodes) {
		return A3(
			$elm$html$Html$node,
			'mdc-layout-grid',
			A2(
				$elm$core$List$cons,
				$elm$html$Html$Attributes$class('mdc-layout-grid'),
				A2(
					$elm$core$List$cons,
					A2($elm$html$Html$Attributes$style, 'display', 'block'),
					attributes)),
			nodes);
	});
var $author$project$Demo$LayoutGrid$demoGrid = function (options) {
	return $author$project$Material$LayoutGrid$layoutGrid(
		A2(
			$elm$core$List$cons,
			A2($elm$html$Html$Attributes$style, 'background', 'rgba(0,0,0,.2)'),
			A2(
				$elm$core$List$cons,
				A2($elm$html$Html$Attributes$style, 'min-width', '360px'),
				options)));
};
var $author$project$Material$LayoutGrid$inner = F2(
	function (attributes, nodes) {
		return A2(
			$elm$html$Html$div,
			A2(
				$elm$core$List$cons,
				$elm$html$Html$Attributes$class('mdc-layout-grid__inner'),
				attributes),
			nodes);
	});
var $author$project$Demo$LayoutGrid$cellAlignmentGrid = function () {
	var innerHeight = _List_fromArray(
		[
			A2($elm$html$Html$Attributes$style, 'min-height', '200px')
		]);
	var cellHeight = A2($elm$html$Html$Attributes$style, 'max-height', '50px');
	return A2(
		$author$project$Demo$LayoutGrid$demoGrid,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'min-height', '200px')
			]),
		_List_fromArray(
			[
				A2(
				$author$project$Material$LayoutGrid$inner,
				innerHeight,
				_List_fromArray(
					[
						$author$project$Demo$LayoutGrid$demoCell(
						_List_fromArray(
							[$author$project$Material$LayoutGrid$alignTop, cellHeight])),
						$author$project$Demo$LayoutGrid$demoCell(
						_List_fromArray(
							[$author$project$Material$LayoutGrid$alignMiddle, cellHeight])),
						$author$project$Demo$LayoutGrid$demoCell(
						_List_fromArray(
							[$author$project$Material$LayoutGrid$alignBottom, cellHeight]))
					]))
			]));
}();
var $author$project$Material$LayoutGrid$span = function (n) {
	return $elm$html$Html$Attributes$class(
		'mdc-layout-grid__cell--span-' + $elm$core$String$fromInt(n));
};
var $author$project$Material$LayoutGrid$span1 = $author$project$Material$LayoutGrid$span(1);
var $author$project$Material$LayoutGrid$span2 = $author$project$Material$LayoutGrid$span(2);
var $author$project$Material$LayoutGrid$span3 = $author$project$Material$LayoutGrid$span(3);
var $author$project$Material$LayoutGrid$span6 = $author$project$Material$LayoutGrid$span(6);
var $author$project$Material$LayoutGrid$span8 = $author$project$Material$LayoutGrid$span(8);
var $author$project$Demo$LayoutGrid$columnsGrid = A2(
	$author$project$Demo$LayoutGrid$demoGrid,
	_List_Nil,
	_List_fromArray(
		[
			A2(
			$author$project$Material$LayoutGrid$inner,
			_List_Nil,
			_List_fromArray(
				[
					$author$project$Demo$LayoutGrid$demoCell(
					_List_fromArray(
						[$author$project$Material$LayoutGrid$span6])),
					$author$project$Demo$LayoutGrid$demoCell(
					_List_fromArray(
						[$author$project$Material$LayoutGrid$span3])),
					$author$project$Demo$LayoutGrid$demoCell(
					_List_fromArray(
						[$author$project$Material$LayoutGrid$span2])),
					$author$project$Demo$LayoutGrid$demoCell(
					_List_fromArray(
						[$author$project$Material$LayoutGrid$span1])),
					$author$project$Demo$LayoutGrid$demoCell(
					_List_fromArray(
						[$author$project$Material$LayoutGrid$span3])),
					$author$project$Demo$LayoutGrid$demoCell(
					_List_fromArray(
						[$author$project$Material$LayoutGrid$span1])),
					$author$project$Demo$LayoutGrid$demoCell(
					_List_fromArray(
						[$author$project$Material$LayoutGrid$span8]))
				]))
		]));
var $author$project$Demo$LayoutGrid$heroGrid = _List_fromArray(
	[
		A2(
		$author$project$Demo$LayoutGrid$demoGrid,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$author$project$Material$LayoutGrid$inner,
				_List_Nil,
				A2(
					$elm$core$List$repeat,
					3,
					$author$project$Demo$LayoutGrid$demoCell(_List_Nil)))
			]))
	]);
var $author$project$Material$LayoutGrid$alignLeft = $elm$html$Html$Attributes$class('mdc-layout-grid--align-left');
var $author$project$Demo$LayoutGrid$leftAlignedGrid = A2(
	$author$project$Demo$LayoutGrid$demoGrid,
	_List_fromArray(
		[
			$author$project$Material$LayoutGrid$alignLeft,
			A2($elm$html$Html$Attributes$style, 'max-width', '800px')
		]),
	_List_fromArray(
		[
			A2(
			$author$project$Material$LayoutGrid$inner,
			_List_Nil,
			_List_fromArray(
				[
					$author$project$Demo$LayoutGrid$demoCell(_List_Nil),
					$author$project$Demo$LayoutGrid$demoCell(_List_Nil),
					$author$project$Demo$LayoutGrid$demoCell(_List_Nil)
				]))
		]));
var $author$project$Material$LayoutGrid$alignRight = $elm$html$Html$Attributes$class('mdc-layout-grid--align-right');
var $author$project$Demo$LayoutGrid$rightAlignedGrid = A2(
	$author$project$Demo$LayoutGrid$demoGrid,
	_List_fromArray(
		[
			$author$project$Material$LayoutGrid$alignRight,
			A2($elm$html$Html$Attributes$style, 'max-width', '800px')
		]),
	_List_fromArray(
		[
			A2(
			$author$project$Material$LayoutGrid$inner,
			_List_Nil,
			A2(
				$elm$core$List$repeat,
				3,
				$author$project$Demo$LayoutGrid$demoCell(_List_Nil)))
		]));
var $author$project$Demo$LayoutGrid$view = function (model) {
	return {
		cS: _List_fromArray(
			[
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Columns')
					])),
				$author$project$Demo$LayoutGrid$columnsGrid,
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Grid Left Alignment')
					])),
				A2(
				$elm$html$Html$p,
				_List_fromArray(
					[$author$project$Material$Typography$body1]),
				_List_fromArray(
					[
						$elm$html$Html$text('This requires a max-width on the top-level grid element.')
					])),
				$author$project$Demo$LayoutGrid$leftAlignedGrid,
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Grid Right Alignment')
					])),
				A2(
				$elm$html$Html$p,
				_List_fromArray(
					[$author$project$Material$Typography$body1]),
				_List_fromArray(
					[
						$elm$html$Html$text('This requires a max-width on the top-level grid element.')
					])),
				$author$project$Demo$LayoutGrid$rightAlignedGrid,
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Cell Alignment')
					])),
				A2(
				$elm$html$Html$p,
				_List_fromArray(
					[$author$project$Material$Typography$body1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Cell alignment requires a cell height smaller than the inner height of the grid.')
					])),
				$author$project$Demo$LayoutGrid$cellAlignmentGrid
			]),
		cZ: $author$project$Demo$LayoutGrid$heroGrid,
		c9: 'Material design’s responsive UI is based on a 12-column grid layout.',
		db: {
			cT: $elm$core$Maybe$Just('https://package.elm-lang.org/packages/aforemny/material-components-web-elm/latest/Material-LayoutGrid'),
			c3: $elm$core$Maybe$Nothing,
			df: $elm$core$Maybe$Just('https://github.com/material-components/material-components-web/tree/master/packages/mdc-layout-grid')
		},
		dh: 'Layout Grid'
	};
};
var $author$project$Material$LinearProgress$Buffered = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var $author$project$Material$LinearProgress$bufferBarElt = A2(
	$elm$html$Html$div,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('mdc-linear-progress__buffer-bar')
		]),
	_List_Nil);
var $author$project$Material$LinearProgress$bufferDotsElt = A2(
	$elm$html$Html$div,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('mdc-linear-progress__buffer-dots')
		]),
	_List_Nil);
var $author$project$Material$LinearProgress$bufferElt = A2(
	$elm$html$Html$div,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('mdc-linear-progress__buffer')
		]),
	_List_fromArray(
		[$author$project$Material$LinearProgress$bufferBarElt, $author$project$Material$LinearProgress$bufferDotsElt]));
var $author$project$Material$LinearProgress$bufferProp = function (variant) {
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$Attributes$property,
			'buffer',
			$elm$json$Json$Encode$float(
				function () {
					if (variant.$ === 2) {
						var buffer = variant.b;
						return buffer;
					} else {
						return 0;
					}
				}())));
};
var $author$project$Material$LinearProgress$closedProp = function (_v0) {
	var closed = _v0.bw;
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$Attributes$property,
			'closed',
			$elm$json$Json$Encode$bool(closed)));
};
var $author$project$Material$LinearProgress$Indeterminate = {$: 0};
var $author$project$Material$LinearProgress$determinateProp = function (variant) {
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$Attributes$property,
			'determinate',
			$elm$json$Json$Encode$bool(
				!_Utils_eq(variant, $author$project$Material$LinearProgress$Indeterminate))));
};
var $author$project$Material$LinearProgress$displayCss = $elm$core$Maybe$Just(
	A2($elm$html$Html$Attributes$style, 'display', 'block'));
var $author$project$Material$LinearProgress$barInnerElt = A2(
	$elm$html$Html$div,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('mdc-linear-progress__bar-inner')
		]),
	_List_Nil);
var $author$project$Material$LinearProgress$primaryBarElt = A2(
	$elm$html$Html$div,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('mdc-linear-progress__bar mdc-linear-progress__primary-bar')
		]),
	_List_fromArray(
		[$author$project$Material$LinearProgress$barInnerElt]));
var $author$project$Material$LinearProgress$progressProp = function (variant) {
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$Attributes$property,
			'progress',
			$elm$json$Json$Encode$float(
				function () {
					switch (variant.$) {
						case 1:
							var progress = variant.a;
							return progress;
						case 2:
							var progress = variant.a;
							return progress;
						default:
							return 0;
					}
				}())));
};
var $author$project$Material$LinearProgress$reverseProp = function (_v0) {
	var reverse = _v0.b0;
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$Attributes$property,
			'reverse',
			$elm$json$Json$Encode$bool(reverse)));
};
var $author$project$Material$LinearProgress$roleAttr = $elm$core$Maybe$Just(
	A2($elm$html$Html$Attributes$attribute, 'role', 'progressbar'));
var $author$project$Material$LinearProgress$rootCs = $elm$core$Maybe$Just(
	$elm$html$Html$Attributes$class('mdc-linear-progress'));
var $author$project$Material$LinearProgress$secondaryBarElt = A2(
	$elm$html$Html$div,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('mdc-linear-progress__bar mdc-linear-progress__secondary-bar')
		]),
	_List_fromArray(
		[$author$project$Material$LinearProgress$barInnerElt]));
var $author$project$Material$LinearProgress$variantCs = function (variant) {
	if (!variant.$) {
		return $elm$core$Maybe$Just(
			$elm$html$Html$Attributes$class('mdc-linear-progress--indeterminate'));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Material$LinearProgress$linearProgress = F2(
	function (variant, config_) {
		var additionalAttributes = config_.br;
		return A3(
			$elm$html$Html$node,
			'mdc-linear-progress',
			_Utils_ap(
				A2(
					$elm$core$List$filterMap,
					$elm$core$Basics$identity,
					_List_fromArray(
						[
							$author$project$Material$LinearProgress$rootCs,
							$author$project$Material$LinearProgress$displayCss,
							$author$project$Material$LinearProgress$roleAttr,
							$author$project$Material$LinearProgress$variantCs(variant),
							$author$project$Material$LinearProgress$determinateProp(variant),
							$author$project$Material$LinearProgress$progressProp(variant),
							$author$project$Material$LinearProgress$bufferProp(variant),
							$author$project$Material$LinearProgress$reverseProp(config_),
							$author$project$Material$LinearProgress$closedProp(config_)
						])),
				additionalAttributes),
			_List_fromArray(
				[$author$project$Material$LinearProgress$bufferElt, $author$project$Material$LinearProgress$primaryBarElt, $author$project$Material$LinearProgress$secondaryBarElt]));
	});
var $author$project$Material$LinearProgress$buffered = F2(
	function (config_, data) {
		return A2(
			$author$project$Material$LinearProgress$linearProgress,
			A2($author$project$Material$LinearProgress$Buffered, data.da, data.cj),
			config_);
	});
var $author$project$Material$LinearProgress$Config = $elm$core$Basics$identity;
var $author$project$Material$LinearProgress$config = {br: _List_Nil, bw: false, b0: false};
var $author$project$Material$LinearProgress$Determinate = function (a) {
	return {$: 1, a: a};
};
var $author$project$Material$LinearProgress$determinate = F2(
	function (config_, _v0) {
		var progress = _v0.da;
		return A2(
			$author$project$Material$LinearProgress$linearProgress,
			$author$project$Material$LinearProgress$Determinate(progress),
			config_);
	});
var $author$project$Material$LinearProgress$indeterminate = function (config_) {
	return A2($author$project$Material$LinearProgress$linearProgress, $author$project$Material$LinearProgress$Indeterminate, config_);
};
var $author$project$Material$LinearProgress$setReverse = F2(
	function (reverse, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{b0: reverse});
	});
var $author$project$Demo$LinearProgress$view = function (model) {
	return {
		cS: _List_fromArray(
			[
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Buffered')
					])),
				A2(
				$author$project$Material$LinearProgress$buffered,
				$author$project$Material$LinearProgress$config,
				{cj: 0.75, da: 0.5}),
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Indeterminate')
					])),
				$author$project$Material$LinearProgress$indeterminate($author$project$Material$LinearProgress$config),
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Reversed')
					])),
				A2(
				$author$project$Material$LinearProgress$determinate,
				A2($author$project$Material$LinearProgress$setReverse, true, $author$project$Material$LinearProgress$config),
				{da: 0.5}),
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Reversed Buffered')
					])),
				A2(
				$author$project$Material$LinearProgress$buffered,
				A2($author$project$Material$LinearProgress$setReverse, true, $author$project$Material$LinearProgress$config),
				{cj: 0.75, da: 0.5})
			]),
		cZ: _List_fromArray(
			[
				A2(
				$author$project$Material$LinearProgress$determinate,
				$author$project$Material$LinearProgress$config,
				{da: 0.5})
			]),
		c9: 'Progress indicators display the length of a process or express an unspecified wait time.',
		db: {
			cT: $elm$core$Maybe$Just('https://package.elm-lang.org/packages/aforemny/material-components-web-elm/latest/Material-LinearProgress'),
			c3: $elm$core$Maybe$Just('https://material.io/go/design-progress-indicators'),
			df: $elm$core$Maybe$Just('https://github.com/material-components/material-components-web/tree/master/packages/mdc-linear-progress')
		},
		dh: 'Linear Progress Indicator'
	};
};
var $author$project$Demo$Lists$SetActivated = function (a) {
	return {$: 2, a: a};
};
var $author$project$Demo$Lists$demoList = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'max-width', '600px'),
		A2($elm$html$Html$Attributes$style, 'border', '1px solid rgba(0,0,0,.1)')
	]);
var $author$project$Material$List$setAttributes = F2(
	function (additionalAttributes, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{br: additionalAttributes});
	});
var $author$project$Demo$Lists$activatedItemList = function (model) {
	var listItem = function (_v0) {
		var icon = _v0.a;
		var label = _v0.b;
		return A2(
			$author$project$Material$List$Item$listItem,
			A2(
				$author$project$Material$List$Item$setOnClick,
				$author$project$Demo$Lists$SetActivated(label),
				A2(
					$author$project$Material$List$Item$setSelected,
					_Utils_eq(model.aR, label) ? $elm$core$Maybe$Just($author$project$Material$List$Item$activated) : $elm$core$Maybe$Nothing,
					$author$project$Material$List$Item$config)),
			_List_fromArray(
				[
					A2(
					$author$project$Material$List$Item$graphic,
					_List_Nil,
					_List_fromArray(
						[
							A2($author$project$Material$Icon$icon, _List_Nil, icon)
						])),
					$elm$html$Html$text(label)
				]));
	};
	return A3(
		$author$project$Material$List$list,
		A2($author$project$Material$List$setAttributes, $author$project$Demo$Lists$demoList, $author$project$Material$List$config),
		listItem(
			_Utils_Tuple2('inbox', 'Inbox')),
		A2(
			$elm$core$List$map,
			listItem,
			_List_fromArray(
				[
					_Utils_Tuple2('star', 'Star'),
					_Utils_Tuple2('send', 'Sent'),
					_Utils_Tuple2('drafts', 'Drafts')
				])));
};
var $author$project$Demo$Lists$Focus = function (a) {
	return {$: 4, a: a};
};
var $author$project$Demo$Lists$focusList = A2(
	$elm$html$Html$div,
	_List_Nil,
	_List_fromArray(
		[
			A3(
			$author$project$Material$List$list,
			A2(
				$author$project$Material$List$setAttributes,
				_Utils_ap(
					$author$project$Demo$Lists$demoList,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$id('my-list')
						])),
				$author$project$Material$List$config),
			A2(
				$author$project$Material$List$Item$listItem,
				$author$project$Material$List$Item$config,
				_List_fromArray(
					[
						$elm$html$Html$text('Line item')
					])),
			A2(
				$elm$core$List$repeat,
				2,
				A2(
					$author$project$Material$List$Item$listItem,
					$author$project$Material$List$Item$config,
					_List_fromArray(
						[
							$elm$html$Html$text('Line item')
						])))),
			$elm$html$Html$text('\u00A0'),
			A2(
			$author$project$Material$Button$raised,
			A2(
				$author$project$Material$Button$setOnClick,
				$author$project$Demo$Lists$Focus('my-list'),
				$author$project$Material$Button$config),
			'Focus')
		]));
var $author$project$Demo$Lists$demoIcon = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'background', 'rgba(0,0,0,.3)'),
		A2($elm$html$Html$Attributes$style, 'border-radius', '50%'),
		A2($elm$html$Html$Attributes$style, 'color', '#fff')
	]);
var $author$project$Material$List$Item$meta = F2(
	function (additionalAttributes, nodes) {
		return A2(
			$elm$html$Html$div,
			A2(
				$elm$core$List$cons,
				$elm$html$Html$Attributes$class('mdc-list-item__meta'),
				additionalAttributes),
			nodes);
	});
var $author$project$Material$List$setTwoLine = F2(
	function (twoLine, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{cb: twoLine});
	});
var $author$project$Material$List$Item$primaryText = F2(
	function (additionalAttributes, nodes) {
		return A2(
			$elm$html$Html$div,
			A2(
				$elm$core$List$cons,
				$elm$html$Html$Attributes$class('mdc-list-item__primary-text'),
				additionalAttributes),
			nodes);
	});
var $author$project$Material$List$Item$secondaryText = F2(
	function (additionalAttributes, nodes) {
		return A2(
			$elm$html$Html$div,
			A2(
				$elm$core$List$cons,
				$elm$html$Html$Attributes$class('mdc-list-item__secondary-text'),
				additionalAttributes),
			nodes);
	});
var $author$project$Material$List$Item$text = F2(
	function (additionalAttributes, _v0) {
		var primary = _v0.E;
		var secondary = _v0.G;
		return A2(
			$elm$html$Html$div,
			A2(
				$elm$core$List$cons,
				$elm$html$Html$Attributes$class('mdc-list-item__text'),
				additionalAttributes),
			_List_fromArray(
				[
					A2($author$project$Material$List$Item$primaryText, _List_Nil, primary),
					A2($author$project$Material$List$Item$secondaryText, _List_Nil, secondary)
				]));
	});
var $author$project$Demo$Lists$folderList = function () {
	var listItem = function (_v0) {
		var primary = _v0.E;
		var secondary = _v0.G;
		return A2(
			$author$project$Material$List$Item$listItem,
			$author$project$Material$List$Item$config,
			_List_fromArray(
				[
					A2(
					$author$project$Material$List$Item$graphic,
					$author$project$Demo$Lists$demoIcon,
					_List_fromArray(
						[
							A2($author$project$Material$Icon$icon, _List_Nil, 'folder')
						])),
					A2(
					$author$project$Material$List$Item$text,
					_List_Nil,
					{
						E: _List_fromArray(
							[
								$elm$html$Html$text(primary)
							]),
						G: _List_fromArray(
							[
								$elm$html$Html$text(secondary)
							])
					}),
					A2(
					$author$project$Material$List$Item$meta,
					_List_Nil,
					_List_fromArray(
						[
							A2($author$project$Material$Icon$icon, _List_Nil, 'info')
						]))
				]));
	};
	return A3(
		$author$project$Material$List$list,
		A2(
			$author$project$Material$List$setAttributes,
			$author$project$Demo$Lists$demoList,
			A2(
				$author$project$Material$List$setTwoLine,
				true,
				A2($author$project$Material$List$setAvatarList, true, $author$project$Material$List$config))),
		listItem(
			{E: 'Dog Photos', G: '9 Jan 2018'}),
		A2(
			$elm$core$List$map,
			listItem,
			_List_fromArray(
				[
					{E: 'Cat Photos', G: '22 Dec 2017'},
					{E: 'Potatoes', G: '30 Noc 2017'},
					{E: 'Carrots', G: '17 Oct 2017'}
				])));
}();
var $author$project$Demo$Lists$heroList = function () {
	var listItem = A2(
		$author$project$Material$List$Item$listItem,
		$author$project$Material$List$Item$config,
		_List_fromArray(
			[
				$elm$html$Html$text('Line item')
			]));
	return _List_fromArray(
		[
			A3(
			$author$project$Material$List$list,
			A2(
				$author$project$Material$List$setAttributes,
				A2(
					$elm$core$List$cons,
					A2($elm$html$Html$Attributes$style, 'background', '#fff'),
					$author$project$Demo$Lists$demoList),
				$author$project$Material$List$config),
			listItem,
			A2($elm$core$List$repeat, 2, listItem))
		]);
}();
var $author$project$Demo$Lists$leadingIconList = function () {
	var listItem = function (icon) {
		return A2(
			$author$project$Material$List$Item$listItem,
			$author$project$Material$List$Item$config,
			_List_fromArray(
				[
					A2(
					$author$project$Material$List$Item$graphic,
					_List_Nil,
					_List_fromArray(
						[
							A2($author$project$Material$Icon$icon, _List_Nil, icon)
						])),
					$elm$html$Html$text('Line item')
				]));
	};
	return A3(
		$author$project$Material$List$list,
		A2($author$project$Material$List$setAttributes, $author$project$Demo$Lists$demoList, $author$project$Material$List$config),
		listItem('wifi'),
		A2(
			$elm$core$List$map,
			listItem,
			_List_fromArray(
				['bluetooth', 'data_usage'])));
}();
var $author$project$Demo$Lists$ToggleCheckbox = function (a) {
	return {$: 0, a: a};
};
var $author$project$Material$List$Item$selected = 0;
var $author$project$Demo$Lists$listWithTrailingCheckbox = function (model) {
	var listItem = function (label) {
		return A2(
			$author$project$Material$List$Item$listItem,
			A2(
				$author$project$Material$List$Item$setSelected,
				A2($elm$core$Set$member, label, model.Y) ? $elm$core$Maybe$Just($author$project$Material$List$Item$selected) : $elm$core$Maybe$Nothing,
				$author$project$Material$List$Item$config),
			_List_fromArray(
				[
					$elm$html$Html$text('Dog Photos'),
					A2(
					$author$project$Material$List$Item$meta,
					_List_Nil,
					_List_fromArray(
						[
							$author$project$Material$Checkbox$checkbox(
							A2(
								$author$project$Material$Checkbox$setState,
								$elm$core$Maybe$Just(
									A2($elm$core$Set$member, label, model.Y) ? $author$project$Material$Checkbox$checked : $author$project$Material$Checkbox$unchecked),
								A2(
									$author$project$Material$Checkbox$setOnChange,
									$author$project$Demo$Lists$ToggleCheckbox(label),
									$author$project$Material$Checkbox$config)))
						]))
				]));
	};
	return A3(
		$author$project$Material$List$list,
		A2(
			$author$project$Material$List$setAttributes,
			A2(
				$elm$core$List$cons,
				A2($elm$html$Html$Attributes$attribute, 'role', 'group'),
				$author$project$Demo$Lists$demoList),
			$author$project$Material$List$config),
		listItem('Dog Photos'),
		A2(
			$elm$core$List$map,
			listItem,
			_List_fromArray(
				['Cat Photos', 'Potatoes', 'Carrots'])));
};
var $author$project$Demo$Lists$SetRadio = function (a) {
	return {$: 1, a: a};
};
var $author$project$Material$Radio$setOnChange = F2(
	function (onChange, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{
				bb: $elm$core$Maybe$Just(onChange)
			});
	});
var $author$project$Demo$Lists$listWithTrailingRadioButton = function (model) {
	var listItem = function (label) {
		return A2(
			$author$project$Material$List$Item$listItem,
			A2(
				$author$project$Material$List$Item$setSelected,
				_Utils_eq(
					model.ax,
					$elm$core$Maybe$Just(label)) ? $elm$core$Maybe$Just($author$project$Material$List$Item$selected) : $elm$core$Maybe$Nothing,
				$author$project$Material$List$Item$config),
			_List_fromArray(
				[
					$elm$html$Html$text(label),
					A2(
					$author$project$Material$List$Item$meta,
					_List_Nil,
					_List_fromArray(
						[
							$author$project$Material$Radio$radio(
							A2(
								$author$project$Material$Radio$setOnChange,
								$author$project$Demo$Lists$SetRadio(label),
								A2(
									$author$project$Material$Radio$setChecked,
									_Utils_eq(
										model.ax,
										$elm$core$Maybe$Just(label)),
									$author$project$Material$Radio$config)))
						]))
				]));
	};
	return A3(
		$author$project$Material$List$list,
		A2($author$project$Material$List$setAttributes, $author$project$Demo$Lists$demoList, $author$project$Material$List$config),
		listItem('Dog Photos'),
		A2(
			$elm$core$List$map,
			listItem,
			_List_fromArray(
				['Cat Photos', 'Potatoes', 'Carrots'])));
};
var $author$project$Demo$Lists$SetShapedActivated = function (a) {
	return {$: 3, a: a};
};
var $author$project$Demo$Lists$shapedActivatedItemList = function (model) {
	var listItem = function (_v0) {
		var icon = _v0.a;
		var label = _v0.b;
		return A2(
			$author$project$Material$List$Item$listItem,
			A2(
				$author$project$Material$List$Item$setAttributes,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'border-radius', '0 32px 32px 0')
					]),
				A2(
					$author$project$Material$List$Item$setOnClick,
					$author$project$Demo$Lists$SetShapedActivated(label),
					A2(
						$author$project$Material$List$Item$setSelected,
						_Utils_eq(model.bj, label) ? $elm$core$Maybe$Just($author$project$Material$List$Item$activated) : $elm$core$Maybe$Nothing,
						$author$project$Material$List$Item$config))),
			_List_fromArray(
				[
					A2(
					$author$project$Material$List$Item$graphic,
					_List_Nil,
					_List_fromArray(
						[
							A2($author$project$Material$Icon$icon, _List_Nil, icon)
						])),
					$elm$html$Html$text(label)
				]));
	};
	return A3(
		$author$project$Material$List$list,
		A2($author$project$Material$List$setAttributes, $author$project$Demo$Lists$demoList, $author$project$Material$List$config),
		listItem(
			_Utils_Tuple2('inbox', 'Inbox')),
		A2(
			$elm$core$List$map,
			listItem,
			_List_fromArray(
				[
					_Utils_Tuple2('star', 'Star'),
					_Utils_Tuple2('send', 'Sent'),
					_Utils_Tuple2('drafts', 'Drafts')
				])));
};
var $author$project$Demo$Lists$singleLineList = function () {
	var listItem = A2(
		$author$project$Material$List$Item$listItem,
		$author$project$Material$List$Item$config,
		_List_fromArray(
			[
				$elm$html$Html$text('Line item')
			]));
	return A3(
		$author$project$Material$List$list,
		A2($author$project$Material$List$setAttributes, $author$project$Demo$Lists$demoList, $author$project$Material$List$config),
		listItem,
		A2($elm$core$List$repeat, 2, listItem));
}();
var $author$project$Demo$Lists$trailingIconList = function () {
	var listItem = A2(
		$author$project$Material$List$Item$listItem,
		$author$project$Material$List$Item$config,
		_List_fromArray(
			[
				$elm$html$Html$text('Line item'),
				A2(
				$author$project$Material$List$Item$meta,
				_List_Nil,
				_List_fromArray(
					[
						A2($author$project$Material$Icon$icon, _List_Nil, 'info')
					]))
			]));
	return A3(
		$author$project$Material$List$list,
		A2($author$project$Material$List$setAttributes, $author$project$Demo$Lists$demoList, $author$project$Material$List$config),
		listItem,
		A2($elm$core$List$repeat, 2, listItem));
}();
var $author$project$Demo$Lists$twoLineList = function () {
	var listItem = A2(
		$author$project$Material$List$Item$listItem,
		$author$project$Material$List$Item$config,
		_List_fromArray(
			[
				A2(
				$author$project$Material$List$Item$text,
				_List_Nil,
				{
					E: _List_fromArray(
						[
							$elm$html$Html$text('Line item')
						]),
					G: _List_fromArray(
						[
							$elm$html$Html$text('Secondary text')
						])
				})
			]));
	return A3(
		$author$project$Material$List$list,
		A2(
			$author$project$Material$List$setAttributes,
			$author$project$Demo$Lists$demoList,
			A2($author$project$Material$List$setTwoLine, true, $author$project$Material$List$config)),
		listItem,
		A2($elm$core$List$repeat, 2, listItem));
}();
var $author$project$Demo$Lists$view = function (model) {
	return {
		cS: _List_fromArray(
			[
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Single-Line')
					])),
				$author$project$Demo$Lists$singleLineList,
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Two-Line')
					])),
				$author$project$Demo$Lists$twoLineList,
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Leading Icon')
					])),
				$author$project$Demo$Lists$leadingIconList,
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('List with activated item')
					])),
				$author$project$Demo$Lists$activatedItemList(model),
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('List with shaped activated item')
					])),
				$author$project$Demo$Lists$shapedActivatedItemList(model),
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Trailing Icon')
					])),
				$author$project$Demo$Lists$trailingIconList,
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Two-Line with Leading and Trailing Icon and Divider')
					])),
				$author$project$Demo$Lists$folderList,
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('List with Trailing Checkbox')
					])),
				$author$project$Demo$Lists$listWithTrailingCheckbox(model),
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('List with Trailing Radio Buttons')
					])),
				$author$project$Demo$Lists$listWithTrailingRadioButton(model),
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Focus List')
					])),
				$author$project$Demo$Lists$focusList
			]),
		cZ: $author$project$Demo$Lists$heroList,
		c9: 'Lists present multiple line items vertically as a single continuous element.',
		db: {
			cT: $elm$core$Maybe$Just('https://package.elm-lang.org/packages/aforemny/material-components-web-elm/latest/Material-List'),
			c3: $elm$core$Maybe$Just('https://material.io/go/design-lists'),
			df: $elm$core$Maybe$Just('https://github.com/material-components/material-components-web/tree/master/packages/mdc-list')
		},
		dh: 'List'
	};
};
var $author$project$Demo$Menus$Close = {$: 1};
var $author$project$Demo$Menus$Open = {$: 0};
var $author$project$Material$Menu$Config = $elm$core$Basics$identity;
var $author$project$Material$Menu$config = {br: _List_Nil, bT: $elm$core$Maybe$Nothing, u: false, b_: false};
var $author$project$Material$Button$Internal$Menu = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $author$project$Material$Button$menu = F2(
	function (config_, nodes) {
		return A2($author$project$Material$Button$Internal$Menu, config_, nodes);
	});
var $author$project$Demo$Menus$listItem = F2(
	function (_v0, label) {
		var onClick = _v0.bc;
		return A2(
			$author$project$Material$List$Item$listItem,
			A2($author$project$Material$List$Item$setOnClick, onClick, $author$project$Material$List$Item$config),
			_List_fromArray(
				[
					$elm$html$Html$text(label)
				]));
	});
var $author$project$Material$List$setWrapFocus = F2(
	function (wrapFocus, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{cg: wrapFocus});
	});
var $author$project$Demo$Menus$menuItems = function (onClick) {
	return _List_fromArray(
		[
			A3(
			$author$project$Material$List$list,
			A2($author$project$Material$List$setWrapFocus, true, $author$project$Material$List$config),
			A2($author$project$Demo$Menus$listItem, onClick, 'Passionfruit'),
			$elm$core$List$concat(
				_List_fromArray(
					[
						A2(
						$elm$core$List$map,
						$author$project$Demo$Menus$listItem(onClick),
						_List_fromArray(
							['Orange', 'Guava', 'Pitaya'])),
						_List_fromArray(
						[
							$author$project$Material$List$Divider$listItem($author$project$Material$List$Divider$config)
						]),
						A2(
						$elm$core$List$map,
						$author$project$Demo$Menus$listItem(onClick),
						_List_fromArray(
							['Pineapple', 'Mango', 'Papaya', 'Lychee']))
					])))
		]);
};
var $author$project$Material$Button$setMenu = F2(
	function (menu_, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{bL: menu_});
	});
var $author$project$Material$Menu$setOnClose = F2(
	function (onClose, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{
				bT: $elm$core$Maybe$Just(onClose)
			});
	});
var $author$project$Material$Menu$setOpen = F2(
	function (open, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{u: open});
	});
var $author$project$Demo$Menus$buttonExample = function (model) {
	return A2(
		$author$project$Material$Button$text,
		A2(
			$author$project$Material$Button$setMenu,
			$elm$core$Maybe$Just(
				A2(
					$author$project$Material$Button$menu,
					A2(
						$author$project$Material$Menu$setOnClose,
						$author$project$Demo$Menus$Close,
						A2($author$project$Material$Menu$setOpen, model.au, $author$project$Material$Menu$config)),
					$author$project$Demo$Menus$menuItems(
						{bc: $author$project$Demo$Menus$Close}))),
			A2($author$project$Material$Button$setOnClick, $author$project$Demo$Menus$Open, $author$project$Material$Button$config)),
		'Open menu');
};
var $author$project$Demo$Menus$heroMenu = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('mdc-menu-surface mdc-menu-surface--open'),
				A2($elm$html$Html$Attributes$style, 'position', 'relative'),
				A2($elm$html$Html$Attributes$style, 'transform-origin', 'left top 0px'),
				A2($elm$html$Html$Attributes$style, 'left', '0px'),
				A2($elm$html$Html$Attributes$style, 'top', '0px'),
				A2($elm$html$Html$Attributes$style, 'z-index', '0')
			]),
		_List_fromArray(
			[
				A3(
				$author$project$Material$List$list,
				$author$project$Material$List$config,
				A2(
					$author$project$Material$List$Item$listItem,
					$author$project$Material$List$Item$config,
					_List_fromArray(
						[
							$elm$html$Html$text('A Menu Item')
						])),
				_List_fromArray(
					[
						A2(
						$author$project$Material$List$Item$listItem,
						$author$project$Material$List$Item$config,
						_List_fromArray(
							[
								$elm$html$Html$text('Another Menu Item')
							]))
					]))
			]));
};
var $author$project$Demo$Menus$OpenChanged = function (a) {
	return {$: 2, a: a};
};
var $author$project$Material$IconButton$Internal$Menu = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $author$project$Material$IconButton$menu = F2(
	function (config_, nodes) {
		return A2($author$project$Material$IconButton$Internal$Menu, config_, nodes);
	});
var $author$project$Material$IconButton$setMenu = F2(
	function (menu_, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{bL: menu_});
	});
var $author$project$Demo$Menus$iconButtonExample = function (model) {
	return A2(
		$author$project$Material$IconButton$iconButton,
		A2(
			$author$project$Material$IconButton$setMenu,
			$elm$core$Maybe$Just(
				A2(
					$author$project$Material$IconButton$menu,
					A2(
						$author$project$Material$Menu$setOnClose,
						$author$project$Demo$Menus$OpenChanged(false),
						A2($author$project$Material$Menu$setOpen, model.bd, $author$project$Material$Menu$config)),
					$author$project$Demo$Menus$menuItems(
						{
							bc: $author$project$Demo$Menus$OpenChanged(false)
						}))),
			A2(
				$author$project$Material$IconButton$setOnClick,
				$author$project$Demo$Menus$OpenChanged(true),
				$author$project$Material$IconButton$config)),
		$author$project$Material$IconButton$icon('menu_vert'));
};
var $author$project$Demo$Menus$iconButtonWithinCardExample = function (model) {
	return A2(
		$author$project$Material$Card$card,
		A2(
			$author$project$Material$Card$setAttributes,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'width', '350px')
				]),
			$author$project$Material$Card$config),
		{
			T: $elm$core$Maybe$Just(
				$author$project$Material$Card$actions(
					{
						cQ: _List_fromArray(
							[
								A2($author$project$Material$Card$button, $author$project$Material$Button$config, 'Read'),
								A2($author$project$Material$Card$button, $author$project$Material$Button$config, 'Bookmark')
							]),
						c$: _List_fromArray(
							[
								A2(
								$author$project$Material$Card$icon,
								$author$project$Material$IconButton$config,
								$author$project$Material$IconButton$icon('favorite_border')),
								A2(
								$author$project$Material$Card$icon,
								$author$project$Material$IconButton$config,
								$author$project$Material$IconButton$icon('share')),
								A2(
								$author$project$Material$Card$icon,
								A2(
									$author$project$Material$IconButton$setMenu,
									$elm$core$Maybe$Just(
										A2(
											$author$project$Material$IconButton$menu,
											A2(
												$author$project$Material$Menu$setOnClose,
												$author$project$Demo$Menus$OpenChanged(false),
												A2($author$project$Material$Menu$setOpen, model.be, $author$project$Material$Menu$config)),
											$author$project$Demo$Menus$menuItems(
												{
													bc: $author$project$Demo$Menus$OpenChanged(false)
												}))),
									A2(
										$author$project$Material$IconButton$setOnClick,
										$author$project$Demo$Menus$OpenChanged(true),
										$author$project$Material$IconButton$config)),
								$author$project$Material$IconButton$icon('more_vert'))
							])
					})),
			V: A2(
				$author$project$Material$Card$primaryAction,
				_List_Nil,
				_List_fromArray(
					[
						$author$project$Material$Card$block(
						A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'padding', '1rem')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$h2,
									_List_fromArray(
										[
											$author$project$Material$Typography$headline6,
											A2($elm$html$Html$Attributes$style, 'margin', '0')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Our Changing Planet')
										])),
									A2(
									$elm$html$Html$h3,
									_List_fromArray(
										[
											$author$project$Material$Typography$subtitle2,
											$author$project$Material$Theme$textSecondaryOnBackground,
											A2($elm$html$Html$Attributes$style, 'margin', '0')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('by Kurt Wagner')
										]))
								]))),
						$author$project$Material$Card$block(
						A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$author$project$Material$Typography$body2,
									$author$project$Material$Theme$textSecondaryOnBackground,
									A2($elm$html$Html$Attributes$style, 'padding', '0 1rem 0.5rem 1rem')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('\n                Visit ten places on our planet that are undergoing the biggest\n                changes today.\n                ')
								])))
					]))
		});
};
var $author$project$Demo$Menus$view = function (model) {
	return {
		cS: _List_fromArray(
			[
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Button Menu')
					])),
				$author$project$Demo$Menus$buttonExample(model),
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Icon Button Menu')
					])),
				$author$project$Demo$Menus$iconButtonExample(model),
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Icon Button Menu within Card')
					])),
				$author$project$Demo$Menus$iconButtonWithinCardExample(model)
			]),
		cZ: _List_fromArray(
			[
				$author$project$Demo$Menus$heroMenu(model)
			]),
		c9: 'Menus display a list of choices on a transient sheet of material.',
		db: {
			cT: $elm$core$Maybe$Just('https://package.elm-lang.org/packages/aforemny/material-components-web-elm/latest/Material-Menu'),
			c3: $elm$core$Maybe$Just('https://material.io/go/design-menus'),
			df: $elm$core$Maybe$Just('https://github.com/material-components/material-components-web/tree/master/packages/mdc-menu')
		},
		dh: 'Menu'
	};
};
var $author$project$Demo$ModalDrawer$CloseDrawer = {$: 1};
var $author$project$Demo$ModalDrawer$OpenDrawer = {$: 0};
var $author$project$Demo$ModalDrawer$SetSelectedIndex = function (a) {
	return {$: 2, a: a};
};
var $author$project$Material$Drawer$Modal$Config = $elm$core$Basics$identity;
var $author$project$Material$Drawer$Modal$config = {br: _List_Nil, bT: $elm$core$Maybe$Nothing, u: false};
var $author$project$Material$Drawer$Modal$closeHandler = function (_v0) {
	var onClose = _v0.bT;
	return A2(
		$elm$core$Maybe$map,
		A2(
			$elm$core$Basics$composeL,
			$elm$html$Html$Events$on('MDCDrawer:close'),
			$elm$json$Json$Decode$succeed),
		onClose);
};
var $author$project$Material$Drawer$Modal$modalCs = $elm$core$Maybe$Just(
	$elm$html$Html$Attributes$class('mdc-drawer--modal'));
var $author$project$Material$Drawer$Modal$openProp = function (_v0) {
	var open = _v0.u;
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$Attributes$property,
			'open',
			$elm$json$Json$Encode$bool(open)));
};
var $author$project$Material$Drawer$Modal$rootCs = $elm$core$Maybe$Just(
	$elm$html$Html$Attributes$class('mdc-drawer'));
var $author$project$Material$Drawer$Modal$drawer = F2(
	function (config_, nodes) {
		var additionalAttributes = config_.br;
		return A3(
			$elm$html$Html$node,
			'mdc-drawer',
			_Utils_ap(
				A2(
					$elm$core$List$filterMap,
					$elm$core$Basics$identity,
					_List_fromArray(
						[
							$author$project$Material$Drawer$Modal$rootCs,
							$author$project$Material$Drawer$Modal$modalCs,
							$author$project$Material$Drawer$Modal$openProp(config_),
							$author$project$Material$Drawer$Modal$closeHandler(config_)
						])),
				additionalAttributes),
			nodes);
	});
var $author$project$Material$Drawer$Modal$scrim = F2(
	function (additionalAttributes, nodes) {
		return A2(
			$elm$html$Html$div,
			A2(
				$elm$core$List$cons,
				$elm$html$Html$Attributes$class('mdc-drawer-scrim'),
				additionalAttributes),
			nodes);
	});
var $author$project$Material$Drawer$Modal$setOnClose = F2(
	function (onClose, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{
				bT: $elm$core$Maybe$Just(onClose)
			});
	});
var $author$project$Material$Drawer$Modal$setOpen = F2(
	function (open, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{u: open});
	});
var $author$project$Demo$ModalDrawer$view = function (model) {
	return {
		cU: A2(
			$author$project$Material$Drawer$Modal$drawer,
			A2(
				$author$project$Material$Drawer$Modal$setOnClose,
				$author$project$Demo$ModalDrawer$CloseDrawer,
				A2($author$project$Material$Drawer$Modal$setOpen, model.u, $author$project$Material$Drawer$Modal$config)),
			A2($author$project$Demo$DrawerPage$drawerBody, $author$project$Demo$ModalDrawer$SetSelectedIndex, model.bi)),
		c6: $elm$core$Maybe$Just($author$project$Demo$ModalDrawer$OpenDrawer),
		dd: $elm$core$Maybe$Just(
			A2($author$project$Material$Drawer$Modal$scrim, _List_Nil, _List_Nil)),
		dh: 'Modal Drawer'
	};
};
var $author$project$Demo$PermanentDrawer$SetSelectedIndex = $elm$core$Basics$identity;
var $author$project$Demo$PermanentDrawer$view = function (model) {
	return {
		cU: A2(
			$author$project$Material$Drawer$Permanent$drawer,
			$author$project$Material$Drawer$Permanent$config,
			A2($author$project$Demo$DrawerPage$drawerBody, $elm$core$Basics$identity, model.bi)),
		c6: $elm$core$Maybe$Nothing,
		dd: $elm$core$Maybe$Nothing,
		dh: 'Permanent Drawer'
	};
};
var $author$project$Material$TopAppBar$Prominent = 3;
var $author$project$Material$TopAppBar$prominent = F2(
	function (config_, nodes) {
		return A3($author$project$Material$TopAppBar$genericTopAppBar, 3, config_, nodes);
	});
var $author$project$Material$TopAppBar$prominentFixedAdjust = $elm$html$Html$Attributes$class('mdc-top-app-bar--prominent-fixed-adjust');
var $author$project$Demo$ProminentTopAppBar$view = function (model) {
	return {
		cX: $author$project$Material$TopAppBar$prominentFixedAdjust,
		di: A2(
			$author$project$Material$TopAppBar$prominent,
			$author$project$Material$TopAppBar$config,
			_List_fromArray(
				[
					A2(
					$author$project$Material$TopAppBar$row,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$author$project$Material$TopAppBar$section,
							_List_fromArray(
								[$author$project$Material$TopAppBar$alignStart]),
							_List_fromArray(
								[
									A2(
									$author$project$Material$IconButton$iconButton,
									A2(
										$author$project$Material$IconButton$setAttributes,
										_List_fromArray(
											[$author$project$Material$TopAppBar$navigationIcon]),
										$author$project$Material$IconButton$config),
									$author$project$Material$IconButton$icon('menu')),
									A2(
									$elm$html$Html$span,
									_List_fromArray(
										[$author$project$Material$TopAppBar$title]),
									_List_fromArray(
										[
											$elm$html$Html$text('Prominent')
										]))
								])),
							A2(
							$author$project$Material$TopAppBar$section,
							_List_fromArray(
								[$author$project$Material$TopAppBar$alignEnd]),
							_List_fromArray(
								[
									A2(
									$author$project$Material$IconButton$iconButton,
									A2(
										$author$project$Material$IconButton$setAttributes,
										_List_fromArray(
											[$author$project$Material$TopAppBar$actionItem]),
										$author$project$Material$IconButton$config),
									$author$project$Material$IconButton$icon('file_download')),
									A2(
									$author$project$Material$IconButton$iconButton,
									A2(
										$author$project$Material$IconButton$setAttributes,
										_List_fromArray(
											[$author$project$Material$TopAppBar$actionItem]),
										$author$project$Material$IconButton$config),
									$author$project$Material$IconButton$icon('print')),
									A2(
									$author$project$Material$IconButton$iconButton,
									A2(
										$author$project$Material$IconButton$setAttributes,
										_List_fromArray(
											[$author$project$Material$TopAppBar$actionItem]),
										$author$project$Material$IconButton$config),
									$author$project$Material$IconButton$icon('bookmark'))
								]))
						]))
				]))
	};
};
var $author$project$Demo$RadioButtons$Set = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $author$project$Material$FormField$Config = $elm$core$Basics$identity;
var $author$project$Material$FormField$config = {br: _List_Nil, bt: false, bG: $elm$core$Maybe$Nothing, b: $elm$core$Maybe$Nothing, bc: $elm$core$Maybe$Nothing};
var $author$project$Material$FormField$alignEndCs = function (_v0) {
	var alignEnd = _v0.bt;
	return alignEnd ? $elm$core$Maybe$Just(
		$elm$html$Html$Attributes$class('mdc-form-field--align-end')) : $elm$core$Maybe$Nothing;
};
var $author$project$Material$FormField$clickHandler = function (_v0) {
	var onClick = _v0.bc;
	return A2($elm$core$Maybe$map, $elm$html$Html$Events$onClick, onClick);
};
var $elm$html$Html$Attributes$for = $elm$html$Html$Attributes$stringProperty('htmlFor');
var $author$project$Material$FormField$forAttr = function (_v0) {
	var _for = _v0.bG;
	return A2($elm$core$Maybe$map, $elm$html$Html$Attributes$for, _for);
};
var $elm$html$Html$label = _VirtualDom_node('label');
var $author$project$Material$FormField$labelElt = function (config_) {
	var label = config_.b;
	return A2(
		$elm$html$Html$label,
		A2(
			$elm$core$List$filterMap,
			$elm$core$Basics$identity,
			_List_fromArray(
				[
					$author$project$Material$FormField$forAttr(config_),
					$author$project$Material$FormField$clickHandler(config_)
				])),
		_List_fromArray(
			[
				$elm$html$Html$text(
				A2($elm$core$Maybe$withDefault, '', label))
			]));
};
var $author$project$Material$FormField$rootCs = $elm$core$Maybe$Just(
	$elm$html$Html$Attributes$class('mdc-form-field'));
var $author$project$Material$FormField$formField = F2(
	function (config_, nodes) {
		var additionalAttributes = config_.br;
		return A3(
			$elm$html$Html$node,
			'mdc-form-field',
			_Utils_ap(
				A2(
					$elm$core$List$filterMap,
					$elm$core$Basics$identity,
					_List_fromArray(
						[
							$author$project$Material$FormField$rootCs,
							$author$project$Material$FormField$alignEndCs(config_)
						])),
				additionalAttributes),
			_Utils_ap(
				nodes,
				_List_fromArray(
					[
						$author$project$Material$FormField$labelElt(config_)
					])));
	});
var $author$project$Demo$RadioButtons$isSelected = F3(
	function (group, index, model) {
		return A2(
			$elm$core$Maybe$withDefault,
			false,
			A2(
				$elm$core$Maybe$map,
				$elm$core$Basics$eq(index),
				A2($elm$core$Dict$get, group, model.ay)));
	});
var $author$project$Material$FormField$setAttributes = F2(
	function (additionalAttributes, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{br: additionalAttributes});
	});
var $author$project$Material$FormField$setFor = F2(
	function (_for, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{bG: _for});
	});
var $author$project$Material$FormField$setLabel = F2(
	function (label, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{b: label});
	});
var $author$project$Material$FormField$setOnClick = F2(
	function (onClick, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{
				bc: $elm$core$Maybe$Just(onClick)
			});
	});
var $author$project$Demo$RadioButtons$radio = F4(
	function (model, group, index, label) {
		return A2(
			$author$project$Material$FormField$formField,
			A2(
				$author$project$Material$FormField$setAttributes,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'margin', '0 10px')
					]),
				A2(
					$author$project$Material$FormField$setOnClick,
					A2($author$project$Demo$RadioButtons$Set, group, index),
					A2(
						$author$project$Material$FormField$setFor,
						$elm$core$Maybe$Just(index),
						A2(
							$author$project$Material$FormField$setLabel,
							$elm$core$Maybe$Just(label),
							$author$project$Material$FormField$config)))),
			_List_fromArray(
				[
					$author$project$Material$Radio$radio(
					A2(
						$author$project$Material$Radio$setOnChange,
						A2($author$project$Demo$RadioButtons$Set, group, index),
						A2(
							$author$project$Material$Radio$setChecked,
							A3($author$project$Demo$RadioButtons$isSelected, group, index, model),
							$author$project$Material$Radio$config)))
				]));
	});
var $author$project$Demo$RadioButtons$exampleRadioGroup = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				A4($author$project$Demo$RadioButtons$radio, model, 'example', 'radio-buttons-example-radio-1', 'Radio 1'),
				A4($author$project$Demo$RadioButtons$radio, model, 'example', 'radio-buttons-example-radio-2', 'Radio 2')
			]));
};
var $author$project$Demo$RadioButtons$Focus = function (a) {
	return {$: 1, a: a};
};
var $author$project$Material$Radio$setAttributes = F2(
	function (additionalAttributes, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{br: additionalAttributes});
	});
var $author$project$Demo$RadioButtons$focusRadio = A2(
	$elm$html$Html$div,
	_List_Nil,
	_List_fromArray(
		[
			$author$project$Material$Radio$radio(
			A2(
				$author$project$Material$Radio$setAttributes,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$id('my-radio')
					]),
				$author$project$Material$Radio$config)),
			$elm$html$Html$text('\u00A0'),
			A2(
			$author$project$Material$Button$raised,
			A2(
				$author$project$Material$Button$setOnClick,
				$author$project$Demo$RadioButtons$Focus('my-radio'),
				$author$project$Material$Button$config),
			'Focus')
		]));
var $author$project$Demo$RadioButtons$heroRadio = F3(
	function (model, group, index) {
		return $author$project$Material$Radio$radio(
			A2(
				$author$project$Material$Radio$setAttributes,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'margin', '0 10px')
					]),
				A2(
					$author$project$Material$Radio$setOnChange,
					A2($author$project$Demo$RadioButtons$Set, group, index),
					A2(
						$author$project$Material$Radio$setChecked,
						A3($author$project$Demo$RadioButtons$isSelected, group, index, model),
						$author$project$Material$Radio$config))));
	});
var $author$project$Demo$RadioButtons$heroRadioGroup = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				A3($author$project$Demo$RadioButtons$heroRadio, model, 'hero', 'radio-buttons-hero-radio-1'),
				A3($author$project$Demo$RadioButtons$heroRadio, model, 'hero', 'radio-buttons-hero-radio-2')
			]));
};
var $author$project$Demo$RadioButtons$view = function (model) {
	return {
		cS: _List_fromArray(
			[
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Radio Buttons')
					])),
				$author$project$Demo$RadioButtons$exampleRadioGroup(model),
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Focus Radio Button')
					])),
				$author$project$Demo$RadioButtons$focusRadio
			]),
		cZ: _List_fromArray(
			[
				$author$project$Demo$RadioButtons$heroRadioGroup(model)
			]),
		c9: 'Buttons communicate an action a user can take. They are typically placed throughout your UI, in places like dialogs, forms, cards, and toolbars.',
		db: {
			cT: $elm$core$Maybe$Just('https://package.elm-lang.org/packages/aforemny/material-components-web-elm/latest/Material-Radio'),
			c3: $elm$core$Maybe$Just('https://material.io/go/design-radio-buttons'),
			df: $elm$core$Maybe$Just('https://github.com/material-components/material-components-web/tree/master/packages/mdc-radio')
		},
		dh: 'Radio Button'
	};
};
var $author$project$Material$Ripple$Accent = 1;
var $author$project$Material$Ripple$accent = 1;
var $author$project$Material$Ripple$colorCs = function (_v0) {
	var color = _v0.bx;
	if (!color.$) {
		if (!color.a) {
			var _v2 = color.a;
			return $elm$core$Maybe$Just(
				$elm$html$Html$Attributes$class('mdc-ripple-surface--primary'));
		} else {
			var _v3 = color.a;
			return $elm$core$Maybe$Just(
				$elm$html$Html$Attributes$class('mdc-ripple-surface--accent'));
		}
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Material$Ripple$rippleSurface = $elm$core$Maybe$Just(
	$elm$html$Html$Attributes$class('mdc-ripple-surface'));
var $author$project$Material$Ripple$unboundedData = function (isUnbounded) {
	return isUnbounded ? $elm$core$Maybe$Just(
		A2($elm$html$Html$Attributes$attribute, 'data-mdc-ripple-is-unbounded', '')) : $elm$core$Maybe$Nothing;
};
var $author$project$Material$Ripple$unboundedProp = function (isUnbounded) {
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$Attributes$property,
			'unbounded',
			$elm$json$Json$Encode$bool(isUnbounded)));
};
var $author$project$Material$Ripple$ripple = F2(
	function (isUnbounded, config_) {
		var additionalAttributes = config_.br;
		return A3(
			$elm$html$Html$node,
			'mdc-ripple',
			_Utils_ap(
				A2(
					$elm$core$List$filterMap,
					$elm$core$Basics$identity,
					_List_fromArray(
						[
							$author$project$Material$Ripple$unboundedProp(isUnbounded),
							$author$project$Material$Ripple$unboundedData(isUnbounded),
							$author$project$Material$Ripple$colorCs(config_),
							$author$project$Material$Ripple$rippleSurface,
							$elm$core$Maybe$Just(
							A2($elm$html$Html$Attributes$style, 'position', 'absolute')),
							$elm$core$Maybe$Just(
							A2($elm$html$Html$Attributes$style, 'top', '0')),
							$elm$core$Maybe$Just(
							A2($elm$html$Html$Attributes$style, 'left', '0')),
							$elm$core$Maybe$Just(
							A2($elm$html$Html$Attributes$style, 'right', '0')),
							$elm$core$Maybe$Just(
							A2($elm$html$Html$Attributes$style, 'bottom', '0'))
						])),
				additionalAttributes),
			_List_Nil);
	});
var $author$project$Material$Ripple$bounded = $author$project$Material$Ripple$ripple(false);
var $author$project$Material$Ripple$Config = $elm$core$Basics$identity;
var $author$project$Material$Ripple$config = {br: _List_Nil, bx: $elm$core$Maybe$Nothing};
var $author$project$Demo$Ripple$demoBox = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'display', 'flex'),
		A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
		A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
		A2($elm$html$Html$Attributes$style, 'width', '200px'),
		A2($elm$html$Html$Attributes$style, 'height', '100px'),
		A2($elm$html$Html$Attributes$style, 'padding', '1rem'),
		A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
		A2($elm$html$Html$Attributes$style, 'user-select', 'none'),
		A2($elm$html$Html$Attributes$style, 'background-color', '#fff'),
		A2($elm$html$Html$Attributes$style, 'overflow', 'hidden'),
		A2($elm$html$Html$Attributes$style, 'position', 'relative'),
		$author$project$Material$Elevation$z2,
		$elm$html$Html$Attributes$tabindex(0)
	]);
var $author$project$Demo$Ripple$demoIcon = _List_fromArray(
	[
		$elm$html$Html$Attributes$class('material-icons'),
		A2($elm$html$Html$Attributes$style, 'width', '24px'),
		A2($elm$html$Html$Attributes$style, 'height', '24px'),
		A2($elm$html$Html$Attributes$style, 'padding', '12px'),
		A2($elm$html$Html$Attributes$style, 'border-radius', '50%'),
		A2($elm$html$Html$Attributes$style, 'position', 'relative')
	]);
var $author$project$Material$Ripple$Primary = 0;
var $author$project$Material$Ripple$primary = 0;
var $author$project$Material$Ripple$setColor = F2(
	function (color, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{bx: color});
	});
var $author$project$Material$Ripple$unbounded = $author$project$Material$Ripple$ripple(true);
var $author$project$Demo$Ripple$view = function (model) {
	return {
		cS: _List_fromArray(
			[
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Bounded Ripple')
					])),
				A2(
				$elm$html$Html$div,
				$author$project$Demo$Ripple$demoBox,
				_List_fromArray(
					[
						$elm$html$Html$text('Interact with me!'),
						$author$project$Material$Ripple$bounded($author$project$Material$Ripple$config)
					])),
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Unbounded Ripple')
					])),
				A2(
				$elm$html$Html$div,
				$author$project$Demo$Ripple$demoIcon,
				_List_fromArray(
					[
						$elm$html$Html$text('favorite'),
						$author$project$Material$Ripple$unbounded($author$project$Material$Ripple$config)
					])),
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Theme Color: Primary')
					])),
				A2(
				$elm$html$Html$div,
				$author$project$Demo$Ripple$demoBox,
				_List_fromArray(
					[
						$elm$html$Html$text('Primary'),
						$author$project$Material$Ripple$bounded(
						A2(
							$author$project$Material$Ripple$setColor,
							$elm$core$Maybe$Just($author$project$Material$Ripple$primary),
							$author$project$Material$Ripple$config))
					])),
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Theme Color: Secondary')
					])),
				A2(
				$elm$html$Html$div,
				$author$project$Demo$Ripple$demoBox,
				_List_fromArray(
					[
						$elm$html$Html$text('Secondary'),
						$author$project$Material$Ripple$bounded(
						A2(
							$author$project$Material$Ripple$setColor,
							$elm$core$Maybe$Just($author$project$Material$Ripple$accent),
							$author$project$Material$Ripple$config))
					]))
			]),
		cZ: _List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				$author$project$Demo$Ripple$demoBox,
				_List_fromArray(
					[
						$elm$html$Html$text('Click here!'),
						$author$project$Material$Ripple$bounded($author$project$Material$Ripple$config)
					]))
			]),
		c9: 'Ripples are visual representations used to communicate the status of a component or interactive element.',
		db: {
			cT: $elm$core$Maybe$Just('https://package.elm-lang.org/packages/aforemny/material-components-web-elm/latest/Material-Ripple'),
			c3: $elm$core$Maybe$Just('https://material.io/go/design-states'),
			df: $elm$core$Maybe$Just('https://github.com/material-components/material-components-web/tree/master/packages/mdc-ripple')
		},
		dh: 'Ripple'
	};
};
var $author$project$Demo$Selects$FilledChanged = function (a) {
	return {$: 1, a: a};
};
var $author$project$Material$Select$Config = $elm$core$Basics$identity;
var $author$project$Material$Select$config = {br: _List_Nil, ad: false, b: $elm$core$Maybe$Nothing, cr: $elm$core$Maybe$Nothing, bb: $elm$core$Maybe$Nothing, b$: false, i: $elm$core$Maybe$Nothing, cd: true};
var $author$project$Material$Select$Filled = 0;
var $author$project$Material$Select$Outlined = 1;
var $author$project$Material$Select$anchorElt = F2(
	function (additionalAttributes, nodes) {
		return A2(
			$elm$html$Html$div,
			A2(
				$elm$core$List$cons,
				$elm$html$Html$Attributes$class('mdc-select__anchor'),
				additionalAttributes),
			nodes);
	});
var $author$project$Material$Select$disabledProp = function (_v0) {
	var disabled = _v0.ad;
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$Attributes$property,
			'disabled',
			$elm$json$Json$Encode$bool(disabled)));
};
var $author$project$Material$Select$dropdownIconElt = A2(
	$elm$html$Html$i,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('mdc-select__dropdown-icon')
		]),
	_List_Nil);
var $author$project$Material$Select$floatingLabelElt = function (_v0) {
	var label = _v0.b;
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('mdc-floating-label')
			]),
		_List_fromArray(
			[
				$elm$html$Html$text(
				A2($elm$core$Maybe$withDefault, '', label))
			]));
};
var $author$project$Material$Select$leadingIconCs = function (_v0) {
	var leadingIcon = _v0.cr;
	return A2(
		$elm$core$Maybe$map,
		function (_v1) {
			return $elm$html$Html$Attributes$class('mdc-select--with-leading-icon');
		},
		leadingIcon);
};
var $author$project$Material$Select$leadingIconElt = function (_v0) {
	var leadingIcon = _v0.cr;
	if (leadingIcon.$ === 1) {
		return $elm$html$Html$text('');
	} else {
		if (!leadingIcon.a.$) {
			var node = leadingIcon.a.a.a7;
			var attributes = leadingIcon.a.a.aW;
			var nodes = leadingIcon.a.a.a8;
			var onInteraction = leadingIcon.a.a.cv;
			var disabled = leadingIcon.a.a.ad;
			return A2(
				node,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$class('mdc-select__icon'),
					function () {
						if (!onInteraction.$) {
							var msg = onInteraction.a;
							return (!disabled) ? A2(
								$elm$core$List$cons,
								$elm$html$Html$Attributes$tabindex(0),
								A2(
									$elm$core$List$cons,
									A2($elm$html$Html$Attributes$attribute, 'role', 'button'),
									A2(
										$elm$core$List$cons,
										$elm$html$Html$Events$onClick(msg),
										A2(
											$elm$core$List$cons,
											A2(
												$elm$html$Html$Events$on,
												'keydown',
												A2(
													$elm$json$Json$Decode$andThen,
													function (keyCode) {
														return (keyCode === 13) ? $elm$json$Json$Decode$succeed(msg) : $elm$json$Json$Decode$fail('');
													},
													$elm$html$Html$Events$keyCode)),
											attributes)))) : A2(
								$elm$core$List$cons,
								$elm$html$Html$Attributes$tabindex(-1),
								A2(
									$elm$core$List$cons,
									A2($elm$html$Html$Attributes$attribute, 'role', 'button'),
									attributes));
						} else {
							return attributes;
						}
					}()),
				nodes);
		} else {
			var node = leadingIcon.a.a.a7;
			var attributes = leadingIcon.a.a.aW;
			var nodes = leadingIcon.a.a.a8;
			var onInteraction = leadingIcon.a.a.cv;
			var disabled = leadingIcon.a.a.ad;
			return A2(
				node,
				A2(
					$elm$core$List$cons,
					$elm$svg$Svg$Attributes$class('mdc-select__icon'),
					function () {
						if (!onInteraction.$) {
							var msg = onInteraction.a;
							return (!disabled) ? A2(
								$elm$core$List$cons,
								$elm$html$Html$Attributes$tabindex(0),
								A2(
									$elm$core$List$cons,
									A2($elm$html$Html$Attributes$attribute, 'role', 'button'),
									A2(
										$elm$core$List$cons,
										$elm$html$Html$Events$onClick(msg),
										A2(
											$elm$core$List$cons,
											A2(
												$elm$html$Html$Events$on,
												'keydown',
												A2(
													$elm$json$Json$Decode$andThen,
													function (keyCode) {
														return (keyCode === 13) ? $elm$json$Json$Decode$succeed(msg) : $elm$json$Json$Decode$fail('');
													},
													$elm$html$Html$Events$keyCode)),
											attributes)))) : A2(
								$elm$core$List$cons,
								$elm$html$Html$Attributes$tabindex(-1),
								A2(
									$elm$core$List$cons,
									A2($elm$html$Html$Attributes$attribute, 'role', 'button'),
									attributes));
						} else {
							return attributes;
						}
					}()),
				nodes);
		}
	}
};
var $author$project$Material$Select$lineRippleElt = A2(
	$elm$html$Html$label,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('mdc-line-ripple')
		]),
	_List_Nil);
var $author$project$Material$List$Item$setDisabled = F2(
	function (disabled, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{ad: disabled});
	});
var $author$project$Material$Select$listItemConfig = F3(
	function (selectedValue, onChange, _v0) {
		var value = _v0.bm;
		var disabled = _v0.ad;
		var additionalAttributes = _v0.br;
		return function () {
			if (!onChange.$) {
				var onChange_ = onChange.a;
				return $author$project$Material$List$Item$setOnClick(
					onChange_(value));
			} else {
				return $elm$core$Basics$identity;
			}
		}()(
			A2(
				$author$project$Material$List$Item$setAttributes,
				additionalAttributes,
				A2($author$project$Material$List$Item$setDisabled, disabled, $author$project$Material$List$Item$config)));
	});
var $author$project$Material$Select$listItem = F4(
	function (leadingIcon, selected, onChange, _v0) {
		var config_ = _v0.a;
		var nodes = _v0.b;
		return A2(
			$author$project$Material$List$Item$listItem,
			A3($author$project$Material$Select$listItemConfig, selected, onChange, config_),
			(!_Utils_eq(leadingIcon, $elm$core$Maybe$Nothing)) ? A2(
				$elm$core$List$cons,
				A2($author$project$Material$List$Item$graphic, _List_Nil, _List_Nil),
				nodes) : nodes);
	});
var $author$project$Material$Menu$setAttributes = F2(
	function (additionalAttributes, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{br: additionalAttributes});
	});
var $author$project$Material$Select$menuElt = F5(
	function (leadingIcon, selected, onChange, firstSelectItem, remainingSelectItems) {
		return A2(
			$author$project$Material$Menu$menu,
			A2(
				$author$project$Material$Menu$setAttributes,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('mdc-select__menu'),
						A2($elm$html$Html$Attributes$style, 'width', '100%')
					]),
				$author$project$Material$Menu$config),
			_List_fromArray(
				[
					A3(
					$author$project$Material$List$list,
					A2($author$project$Material$List$setWrapFocus, true, $author$project$Material$List$config),
					A4($author$project$Material$Select$listItem, leadingIcon, selected, onChange, firstSelectItem),
					A2(
						$elm$core$List$map,
						A3($author$project$Material$Select$listItem, leadingIcon, selected, onChange),
						remainingSelectItems))
				]));
	});
var $author$project$Material$Select$notchedOutlineElt = function (_v0) {
	var label = _v0.b;
	return A2(
		$elm$html$Html$span,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('mdc-notched-outline')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$span,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('mdc-notched-outline__leading')
					]),
				_List_Nil),
				A2(
				$elm$html$Html$span,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('mdc-notched-outline__notch')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$label,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('mdc-floating-label')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								A2($elm$core$Maybe$withDefault, '', label))
							]))
					])),
				A2(
				$elm$html$Html$span,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('mdc-notched-outline__trailing')
					]),
				_List_Nil)
			]));
};
var $author$project$Material$Select$outlinedCs = function (variant) {
	return (variant === 1) ? $elm$core$Maybe$Just(
		$elm$html$Html$Attributes$class('mdc-select--outlined')) : $elm$core$Maybe$Nothing;
};
var $author$project$Material$Select$requiredProp = function (_v0) {
	var required = _v0.b$;
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$Attributes$property,
			'required',
			$elm$json$Json$Encode$bool(required)));
};
var $author$project$Material$Select$rippleElt = A2(
	$elm$html$Html$span,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('mdc-text-field__ripple')
		]),
	_List_Nil);
var $author$project$Material$Select$rootCs = $elm$core$Maybe$Just(
	$elm$html$Html$Attributes$class('mdc-select'));
var $author$project$Material$Select$selectedIndexProp = function (selectedIndex) {
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$Attributes$property,
			'selectedIndex',
			$elm$json$Json$Encode$int(
				A2($elm$core$Maybe$withDefault, -1, selectedIndex))));
};
var $elm$html$Html$Attributes$readonly = $elm$html$Html$Attributes$boolProperty('readOnly');
var $author$project$Material$Select$selectedTextElt = A2(
	$elm$html$Html$input,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('mdc-select__selected-text'),
			$elm$html$Html$Attributes$disabled(true),
			$elm$html$Html$Attributes$readonly(true)
		]),
	_List_Nil);
var $author$project$Material$Select$validProp = function (_v0) {
	var valid = _v0.cd;
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$Attributes$property,
			'valid',
			$elm$json$Json$Encode$bool(valid)));
};
var $author$project$Material$Select$select = F4(
	function (variant, config_, firstSelectItem, remainingSelectItems) {
		var leadingIcon = config_.cr;
		var selected = config_.i;
		var additionalAttributes = config_.br;
		var onChange = config_.bb;
		var selectedIndex = $elm$core$List$head(
			A2(
				$elm$core$List$filterMap,
				$elm$core$Basics$identity,
				A2(
					$elm$core$List$indexedMap,
					F2(
						function (index, _v0) {
							var value = _v0.a.bm;
							return _Utils_eq(
								$elm$core$Maybe$Just(value),
								selected) ? $elm$core$Maybe$Just(index) : $elm$core$Maybe$Nothing;
						}),
					A2($elm$core$List$cons, firstSelectItem, remainingSelectItems))));
		return A3(
			$elm$html$Html$node,
			'mdc-select',
			_Utils_ap(
				A2(
					$elm$core$List$filterMap,
					$elm$core$Basics$identity,
					_List_fromArray(
						[
							$author$project$Material$Select$rootCs,
							$author$project$Material$Select$outlinedCs(variant),
							$author$project$Material$Select$leadingIconCs(config_),
							$author$project$Material$Select$disabledProp(config_),
							$author$project$Material$Select$selectedIndexProp(selectedIndex),
							$author$project$Material$Select$validProp(config_),
							$author$project$Material$Select$requiredProp(config_)
						])),
				additionalAttributes),
			_List_fromArray(
				[
					A2(
					$author$project$Material$Select$anchorElt,
					_List_Nil,
					$elm$core$List$concat(
						_List_fromArray(
							[
								_List_fromArray(
								[
									$author$project$Material$Select$rippleElt,
									$author$project$Material$Select$leadingIconElt(config_),
									$author$project$Material$Select$selectedTextElt,
									$author$project$Material$Select$dropdownIconElt
								]),
								(variant === 1) ? _List_fromArray(
								[
									$author$project$Material$Select$notchedOutlineElt(config_)
								]) : _List_fromArray(
								[
									$author$project$Material$Select$floatingLabelElt(config_),
									$author$project$Material$Select$lineRippleElt
								])
							]))),
					A5($author$project$Material$Select$menuElt, leadingIcon, selected, onChange, firstSelectItem, remainingSelectItems)
				]));
	});
var $author$project$Material$Select$filled = F3(
	function (config_, firstSelectItem, remainingSelectItems) {
		return A4($author$project$Material$Select$select, 0, config_, firstSelectItem, remainingSelectItems);
	});
var $author$project$Material$Select$Item$Internal$Config = $elm$core$Basics$identity;
var $author$project$Material$Select$Item$config = function (_v0) {
	var value = _v0.bm;
	return {br: _List_Nil, ad: false, bm: value};
};
var $author$project$Material$Select$Item$Internal$SelectItem = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $author$project$Material$Select$Item$selectItem = $author$project$Material$Select$Item$Internal$SelectItem;
var $author$project$Demo$Selects$firstItem = A2(
	$author$project$Material$Select$Item$selectItem,
	$author$project$Material$Select$Item$config(
		{bm: $elm$core$Maybe$Nothing}),
	_List_fromArray(
		[
			$elm$html$Html$text('')
		]));
var $author$project$Demo$Selects$Apple = 0;
var $author$project$Demo$Selects$Banana = 2;
var $author$project$Demo$Selects$Orange = 1;
var $author$project$Demo$Selects$remainingItems = _List_fromArray(
	[
		A2(
		$author$project$Material$Select$Item$selectItem,
		$author$project$Material$Select$Item$config(
			{
				bm: $elm$core$Maybe$Just(0)
			}),
		_List_fromArray(
			[
				$elm$html$Html$text('Apple')
			])),
		A2(
		$author$project$Material$Select$Item$selectItem,
		$author$project$Material$Select$Item$config(
			{
				bm: $elm$core$Maybe$Just(1)
			}),
		_List_fromArray(
			[
				$elm$html$Html$text('Orange')
			])),
		A2(
		$author$project$Material$Select$Item$selectItem,
		$author$project$Material$Select$Item$config(
			{
				bm: $elm$core$Maybe$Just(2)
			}),
		_List_fromArray(
			[
				$elm$html$Html$text('Banana')
			]))
	]);
var $author$project$Material$Select$setLabel = F2(
	function (label, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{b: label});
	});
var $author$project$Material$Select$setOnChange = F2(
	function (onChange, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{
				bb: $elm$core$Maybe$Just(onChange)
			});
	});
var $author$project$Material$Select$setSelected = F2(
	function (selected, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{i: selected});
	});
var $author$project$Demo$Selects$filledSelect = function (model) {
	return A3(
		$author$project$Material$Select$filled,
		A2(
			$author$project$Material$Select$setOnChange,
			$author$project$Demo$Selects$FilledChanged,
			A2(
				$author$project$Material$Select$setSelected,
				$elm$core$Maybe$Just(model.aZ),
				A2(
					$author$project$Material$Select$setLabel,
					$elm$core$Maybe$Just('Fruit'),
					$author$project$Material$Select$config))),
		$author$project$Demo$Selects$firstItem,
		$author$project$Demo$Selects$remainingItems);
};
var $author$project$Demo$Selects$Interacted = {$: 8};
var $author$project$Material$Select$Icon$Internal$Icon = function (a) {
	return {$: 0, a: a};
};
var $author$project$Material$Select$Icon$customIcon = F3(
	function (node, attributes, nodes) {
		return $author$project$Material$Select$Icon$Internal$Icon(
			{aW: attributes, ad: false, a7: node, a8: nodes, cv: $elm$core$Maybe$Nothing});
	});
var $author$project$Material$Select$Icon$icon = function (iconName) {
	return A3(
		$author$project$Material$Select$Icon$customIcon,
		$elm$html$Html$i,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('material-icons')
			]),
		_List_fromArray(
			[
				$elm$html$Html$text(iconName)
			]));
};
var $author$project$Material$Select$setAttributes = F2(
	function (additionalAttributes, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{br: additionalAttributes});
	});
var $author$project$Material$Select$setLeadingIcon = F2(
	function (leadingIcon, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{cr: leadingIcon});
	});
var $author$project$Material$Select$Icon$Internal$SvgIcon = function (a) {
	return {$: 1, a: a};
};
var $author$project$Material$Select$Icon$setOnInteraction = F2(
	function (onInteraction, icon_) {
		if (!icon_.$) {
			var data = icon_.a;
			return $author$project$Material$Select$Icon$Internal$Icon(
				_Utils_update(
					data,
					{
						cv: $elm$core$Maybe$Just(onInteraction)
					}));
		} else {
			var data = icon_.a;
			return $author$project$Material$Select$Icon$Internal$SvgIcon(
				_Utils_update(
					data,
					{
						cv: $elm$core$Maybe$Just(onInteraction)
					}));
		}
	});
var $author$project$Material$Select$Icon$svgIcon = F2(
	function (attributes, nodes) {
		return $author$project$Material$Select$Icon$Internal$SvgIcon(
			{aW: attributes, ad: false, a7: $elm$svg$Svg$svg, a8: nodes, cv: $elm$core$Maybe$Nothing});
	});
var $author$project$Demo$Selects$filledWithCustomIcon = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				A3(
				$author$project$Material$Select$filled,
				A2(
					$author$project$Material$Select$setAttributes,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'margin-right', '24px')
						]),
					A2(
						$author$project$Material$Select$setLeadingIcon,
						$elm$core$Maybe$Just(
							A2(
								$author$project$Material$Select$Icon$setOnInteraction,
								$author$project$Demo$Selects$Interacted,
								$author$project$Material$Select$Icon$icon('favorite'))),
						A2(
							$author$project$Material$Select$setLabel,
							$elm$core$Maybe$Just('Material Icons'),
							$author$project$Material$Select$config))),
				$author$project$Demo$Selects$firstItem,
				$author$project$Demo$Selects$remainingItems),
				A3(
				$author$project$Material$Select$filled,
				A2(
					$author$project$Material$Select$setAttributes,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'margin-right', '24px')
						]),
					A2(
						$author$project$Material$Select$setLeadingIcon,
						$elm$core$Maybe$Just(
							A3(
								$author$project$Material$Select$Icon$customIcon,
								$elm$html$Html$i,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('fab fa-font-awesome'),
										A2($elm$html$Html$Attributes$style, 'font-size', '24px')
									]),
								_List_Nil)),
						A2(
							$author$project$Material$Select$setLabel,
							$elm$core$Maybe$Just('Font Awesome'),
							$author$project$Material$Select$config))),
				$author$project$Demo$Selects$firstItem,
				$author$project$Demo$Selects$remainingItems),
				A3(
				$author$project$Material$Select$filled,
				A2(
					$author$project$Material$Select$setLeadingIcon,
					$elm$core$Maybe$Just(
						A2(
							$author$project$Material$Select$Icon$svgIcon,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$viewBox('0 0 100 100')
								]),
							$author$project$Demo$ElmLogo$elmLogo)),
					A2(
						$author$project$Material$Select$setLabel,
						$elm$core$Maybe$Just('Font Awesome'),
						$author$project$Material$Select$config)),
				$author$project$Demo$Selects$firstItem,
				$author$project$Demo$Selects$remainingItems)
			]));
};
var $author$project$Demo$Selects$FilledWithIconChanged = function (a) {
	return {$: 3, a: a};
};
var $author$project$Demo$Selects$filledWithIconSelect = function (model) {
	return A3(
		$author$project$Material$Select$filled,
		A2(
			$author$project$Material$Select$setOnChange,
			$author$project$Demo$Selects$FilledWithIconChanged,
			A2(
				$author$project$Material$Select$setLeadingIcon,
				$elm$core$Maybe$Just(
					$author$project$Material$Select$Icon$icon('favorite')),
				A2(
					$author$project$Material$Select$setSelected,
					$elm$core$Maybe$Just(model.a_),
					A2(
						$author$project$Material$Select$setLabel,
						$elm$core$Maybe$Just('Fruit'),
						$author$project$Material$Select$config)))),
		$author$project$Demo$Selects$firstItem,
		$author$project$Demo$Selects$remainingItems);
};
var $author$project$Demo$Selects$Focus = function (a) {
	return {$: 6, a: a};
};
var $author$project$Demo$Selects$FocusedChanged = function (a) {
	return {$: 5, a: a};
};
var $author$project$Demo$Selects$focusSelect = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'display', 'flex'),
				A2($elm$html$Html$Attributes$style, 'align-items', 'center')
			]),
		_List_fromArray(
			[
				A3(
				$author$project$Material$Select$filled,
				A2(
					$author$project$Material$Select$setAttributes,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$id('my-select')
						]),
					A2(
						$author$project$Material$Select$setOnChange,
						$author$project$Demo$Selects$FocusedChanged,
						A2(
							$author$project$Material$Select$setSelected,
							$elm$core$Maybe$Just(model.a0),
							$author$project$Material$Select$config))),
				$author$project$Demo$Selects$firstItem,
				$author$project$Demo$Selects$remainingItems),
				$elm$html$Html$text('\u00A0'),
				A2(
				$author$project$Material$Button$raised,
				A2(
					$author$project$Material$Button$setOnClick,
					$author$project$Demo$Selects$Focus('my-select'),
					$author$project$Material$Button$config),
				'Focus')
			]));
};
var $author$project$Demo$Selects$HeroChanged = function (a) {
	return {$: 0, a: a};
};
var $author$project$Demo$Selects$heroSelect = function (model) {
	return A3(
		$author$project$Material$Select$filled,
		A2(
			$author$project$Material$Select$setOnChange,
			$author$project$Demo$Selects$HeroChanged,
			A2(
				$author$project$Material$Select$setSelected,
				$elm$core$Maybe$Just(model.cZ),
				A2(
					$author$project$Material$Select$setLabel,
					$elm$core$Maybe$Just('Fruit'),
					$author$project$Material$Select$config))),
		$author$project$Demo$Selects$firstItem,
		$author$project$Demo$Selects$remainingItems);
};
var $author$project$Demo$Selects$OutlinedChanged = function (a) {
	return {$: 2, a: a};
};
var $author$project$Material$Select$outlined = F3(
	function (config_, firstSelectItem, remainingSelectItems) {
		return A4($author$project$Material$Select$select, 1, config_, firstSelectItem, remainingSelectItems);
	});
var $author$project$Demo$Selects$outlinedSelect = function (model) {
	return A3(
		$author$project$Material$Select$outlined,
		A2(
			$author$project$Material$Select$setOnChange,
			$author$project$Demo$Selects$OutlinedChanged,
			A2(
				$author$project$Material$Select$setSelected,
				$elm$core$Maybe$Just(model.bf),
				A2(
					$author$project$Material$Select$setLabel,
					$elm$core$Maybe$Just('Fruit'),
					$author$project$Material$Select$config))),
		$author$project$Demo$Selects$firstItem,
		$author$project$Demo$Selects$remainingItems);
};
var $author$project$Demo$Selects$OutlinedWithIconChanged = function (a) {
	return {$: 4, a: a};
};
var $author$project$Demo$Selects$outlinedWithIconSelect = function (model) {
	return A3(
		$author$project$Material$Select$outlined,
		A2(
			$author$project$Material$Select$setOnChange,
			$author$project$Demo$Selects$OutlinedWithIconChanged,
			A2(
				$author$project$Material$Select$setLeadingIcon,
				$elm$core$Maybe$Just(
					$author$project$Material$Select$Icon$icon('favorite')),
				A2(
					$author$project$Material$Select$setSelected,
					$elm$core$Maybe$Just(model.bg),
					A2(
						$author$project$Material$Select$setLabel,
						$elm$core$Maybe$Just('Fruit'),
						$author$project$Material$Select$config)))),
		$author$project$Demo$Selects$firstItem,
		$author$project$Demo$Selects$remainingItems);
};
var $author$project$Demo$Selects$view = function (model) {
	return {
		cS: _List_fromArray(
			[
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Filled')
					])),
				$author$project$Demo$Selects$filledSelect(model),
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Outlined')
					])),
				$author$project$Demo$Selects$outlinedSelect(model),
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Filled with Icon')
					])),
				$author$project$Demo$Selects$filledWithIconSelect(model),
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Outlined with Icon')
					])),
				$author$project$Demo$Selects$outlinedWithIconSelect(model),
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Select with Custom Icon')
					])),
				$author$project$Demo$Selects$filledWithCustomIcon(model),
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Focus Select')
					])),
				$author$project$Demo$Selects$focusSelect(model)
			]),
		cZ: _List_fromArray(
			[
				$author$project$Demo$Selects$heroSelect(model)
			]),
		c9: 'Selects allow users to select from a single-option menu.',
		db: {
			cT: $elm$core$Maybe$Just('https://package.elm-lang.org/packages/aforemny/material-components-web-elm/latest/Material-Select'),
			c3: $elm$core$Maybe$Just('https://material.io/go/design-text-fields'),
			df: $elm$core$Maybe$Just('https://github.com/material-components/material-components-web/tree/master/packages/mdc-select')
		},
		dh: 'Select'
	};
};
var $author$project$Material$TopAppBar$ShortCollapsed = 2;
var $author$project$Material$TopAppBar$shortCollapsed = F2(
	function (config_, nodes) {
		return A3($author$project$Material$TopAppBar$genericTopAppBar, 2, config_, nodes);
	});
var $author$project$Material$TopAppBar$shortFixedAdjust = $elm$html$Html$Attributes$class('mdc-top-app-bar--short-fixed-adjust');
var $author$project$Demo$ShortCollapsedTopAppBar$view = function (model) {
	return {
		cX: $author$project$Material$TopAppBar$shortFixedAdjust,
		di: A2(
			$author$project$Material$TopAppBar$shortCollapsed,
			$author$project$Material$TopAppBar$config,
			_List_fromArray(
				[
					A2(
					$author$project$Material$TopAppBar$row,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$author$project$Material$TopAppBar$section,
							_List_fromArray(
								[$author$project$Material$TopAppBar$alignStart]),
							_List_fromArray(
								[
									A2(
									$author$project$Material$IconButton$iconButton,
									A2(
										$author$project$Material$IconButton$setAttributes,
										_List_fromArray(
											[$author$project$Material$TopAppBar$navigationIcon]),
										$author$project$Material$IconButton$config),
									$author$project$Material$IconButton$icon('menu'))
								])),
							A2(
							$author$project$Material$TopAppBar$section,
							_List_fromArray(
								[$author$project$Material$TopAppBar$alignEnd]),
							_List_fromArray(
								[
									A2(
									$author$project$Material$IconButton$iconButton,
									A2(
										$author$project$Material$IconButton$setAttributes,
										_List_fromArray(
											[$author$project$Material$TopAppBar$actionItem]),
										$author$project$Material$IconButton$config),
									$author$project$Material$IconButton$icon('file_download'))
								]))
						]))
				]))
	};
};
var $author$project$Material$TopAppBar$Short = 1;
var $author$project$Material$TopAppBar$short = F2(
	function (config_, nodes) {
		return A3($author$project$Material$TopAppBar$genericTopAppBar, 1, config_, nodes);
	});
var $author$project$Demo$ShortTopAppBar$view = function (model) {
	return {
		cX: $author$project$Material$TopAppBar$shortFixedAdjust,
		di: A2(
			$author$project$Material$TopAppBar$short,
			$author$project$Material$TopAppBar$config,
			_List_fromArray(
				[
					A2(
					$author$project$Material$TopAppBar$row,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$author$project$Material$TopAppBar$section,
							_List_fromArray(
								[$author$project$Material$TopAppBar$alignStart]),
							_List_fromArray(
								[
									A2(
									$author$project$Material$IconButton$iconButton,
									A2(
										$author$project$Material$IconButton$setAttributes,
										_List_fromArray(
											[$author$project$Material$TopAppBar$navigationIcon]),
										$author$project$Material$IconButton$config),
									$author$project$Material$IconButton$icon('menu')),
									A2(
									$elm$html$Html$span,
									_List_fromArray(
										[$author$project$Material$TopAppBar$title]),
									_List_fromArray(
										[
											$elm$html$Html$text('Short')
										]))
								])),
							A2(
							$author$project$Material$TopAppBar$section,
							_List_fromArray(
								[$author$project$Material$TopAppBar$alignEnd]),
							_List_fromArray(
								[
									A2(
									$author$project$Material$IconButton$iconButton,
									A2(
										$author$project$Material$IconButton$setAttributes,
										_List_fromArray(
											[$author$project$Material$TopAppBar$actionItem]),
										$author$project$Material$IconButton$config),
									$author$project$Material$IconButton$icon('file_download'))
								]))
						]))
				]))
	};
};
var $author$project$Demo$Slider$Changed = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $author$project$Material$Slider$Config = $elm$core$Basics$identity;
var $author$project$Material$Slider$config = {br: _List_Nil, ad: false, ae: false, bB: false, a3: $elm$core$Maybe$Nothing, a5: $elm$core$Maybe$Nothing, bU: $elm$core$Maybe$Nothing, b5: $elm$core$Maybe$Nothing, bm: $elm$core$Maybe$Nothing};
var $author$project$Material$Slider$setMax = F2(
	function (max, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{a3: max});
	});
var $author$project$Material$Slider$setMin = F2(
	function (min, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{a5: min});
	});
var $author$project$Material$Slider$setOnInput = F2(
	function (onInput, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{
				bU: $elm$core$Maybe$Just(onInput)
			});
	});
var $author$project$Material$Slider$setValue = F2(
	function (value, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{bm: value});
	});
var $author$project$Material$Slider$ariaValueMaxAttr = function (_v0) {
	var max = _v0.a3;
	return A2(
		$elm$core$Maybe$map,
		A2(
			$elm$core$Basics$composeL,
			$elm$html$Html$Attributes$attribute('aria-valuemax'),
			$elm$core$String$fromFloat),
		max);
};
var $author$project$Material$Slider$ariaValueMinAttr = function (_v0) {
	var min = _v0.a5;
	return A2(
		$elm$core$Maybe$map,
		A2(
			$elm$core$Basics$composeL,
			$elm$html$Html$Attributes$attribute('aria-valuemin'),
			$elm$core$String$fromFloat),
		min);
};
var $author$project$Material$Slider$ariaValuenowAttr = function (_v0) {
	var value = _v0.bm;
	return A2(
		$elm$core$Maybe$map,
		A2(
			$elm$core$Basics$composeL,
			$elm$html$Html$Attributes$attribute('aria-valuenow'),
			$elm$core$String$fromFloat),
		value);
};
var $elm$json$Json$Decode$float = _Json_decodeFloat;
var $author$project$Material$Slider$changeHandler = function (_v0) {
	var onInput = _v0.bU;
	return A2(
		$elm$core$Maybe$map,
		function (handler) {
			return A2(
				$elm$html$Html$Events$on,
				'MDCSlider:input',
				A2(
					$elm$json$Json$Decode$map,
					handler,
					A2(
						$elm$json$Json$Decode$at,
						_List_fromArray(
							['target', 'value']),
						$elm$json$Json$Decode$float)));
		},
		onInput);
};
var $author$project$Material$Slider$disabledProp = function (_v0) {
	var disabled = _v0.ad;
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$Attributes$property,
			'disabled',
			$elm$json$Json$Encode$bool(disabled)));
};
var $author$project$Material$Slider$discreteCs = function (_v0) {
	var discrete = _v0.ae;
	return discrete ? $elm$core$Maybe$Just(
		$elm$html$Html$Attributes$class('mdc-slider--discrete')) : $elm$core$Maybe$Nothing;
};
var $author$project$Material$Slider$displayCss = $elm$core$Maybe$Just(
	A2($elm$html$Html$Attributes$style, 'display', 'block'));
var $author$project$Material$Slider$displayMarkersCs = function (_v0) {
	var discrete = _v0.ae;
	var displayMarkers = _v0.bB;
	return (discrete && displayMarkers) ? $elm$core$Maybe$Just(
		$elm$html$Html$Attributes$class('mdc-slider--display-markers')) : $elm$core$Maybe$Nothing;
};
var $author$project$Material$Slider$maxProp = function (_v0) {
	var max = _v0.a3;
	return A2(
		$elm$core$Maybe$map,
		A2(
			$elm$core$Basics$composeL,
			$elm$html$Html$Attributes$property('max'),
			$elm$json$Json$Encode$float),
		max);
};
var $author$project$Material$Slider$minProp = function (_v0) {
	var min = _v0.a5;
	return A2(
		$elm$core$Maybe$map,
		A2(
			$elm$core$Basics$composeL,
			$elm$html$Html$Attributes$property('min'),
			$elm$json$Json$Encode$float),
		min);
};
var $author$project$Material$Slider$rootCs = $elm$core$Maybe$Just(
	$elm$html$Html$Attributes$class('mdc-slider'));
var $author$project$Material$Slider$sliderRoleAttr = $elm$core$Maybe$Just(
	A2($elm$html$Html$Attributes$attribute, 'role', 'slider'));
var $author$project$Material$Slider$stepProp = function (_v0) {
	var step = _v0.b5;
	return A2(
		$elm$core$Maybe$map,
		A2(
			$elm$core$Basics$composeL,
			$elm$html$Html$Attributes$property('step'),
			$elm$json$Json$Encode$float),
		step);
};
var $author$project$Material$Slider$tabIndexProp = $elm$core$Maybe$Just(
	$elm$html$Html$Attributes$tabindex(0));
var $author$project$Material$Slider$focusRingElt = A2(
	$elm$html$Html$div,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('mdc-slider__focus-ring')
		]),
	_List_Nil);
var $author$project$Material$Slider$pinValueMarkerElt = A2(
	$elm$html$Html$div,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('mdc-slider__pin-value-marker')
		]),
	_List_Nil);
var $author$project$Material$Slider$pinElt = A2(
	$elm$html$Html$div,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('mdc-slider__pin')
		]),
	_List_fromArray(
		[$author$project$Material$Slider$pinValueMarkerElt]));
var $elm$svg$Svg$Attributes$height = _VirtualDom_attribute('height');
var $elm$svg$Svg$Attributes$width = _VirtualDom_attribute('width');
var $author$project$Material$Slider$thumbElt = A2(
	$elm$svg$Svg$svg,
	_List_fromArray(
		[
			$elm$svg$Svg$Attributes$class('mdc-slider__thumb'),
			$elm$svg$Svg$Attributes$width('21'),
			$elm$svg$Svg$Attributes$height('21')
		]),
	_List_fromArray(
		[
			A2(
			$elm$svg$Svg$circle,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$cx('10.5'),
					$elm$svg$Svg$Attributes$cy('10.5'),
					$elm$svg$Svg$Attributes$r('7.875')
				]),
			_List_Nil)
		]));
var $author$project$Material$Slider$thumbContainerElt = function (_v0) {
	var discrete = _v0.ae;
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('mdc-slider__thumb-container')
			]),
		discrete ? _List_fromArray(
			[$author$project$Material$Slider$pinElt, $author$project$Material$Slider$thumbElt, $author$project$Material$Slider$focusRingElt]) : _List_fromArray(
			[$author$project$Material$Slider$thumbElt, $author$project$Material$Slider$focusRingElt]));
};
var $author$project$Material$Slider$trackElt = A2(
	$elm$html$Html$div,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('mdc-slider__track')
		]),
	_List_Nil);
var $author$project$Material$Slider$trackMarkerContainerElt = A2(
	$elm$html$Html$div,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('mdc-slider__track-marker-container')
		]),
	_List_Nil);
var $author$project$Material$Slider$trackContainerElt = A2(
	$elm$html$Html$div,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('mdc-slider__track-container')
		]),
	_List_fromArray(
		[$author$project$Material$Slider$trackElt, $author$project$Material$Slider$trackMarkerContainerElt]));
var $author$project$Material$Slider$valueProp = function (_v0) {
	var value = _v0.bm;
	return A2(
		$elm$core$Maybe$map,
		A2(
			$elm$core$Basics$composeL,
			$elm$html$Html$Attributes$property('value'),
			$elm$json$Json$Encode$float),
		value);
};
var $author$project$Material$Slider$slider = function (config_) {
	var additionalAttributes = config_.br;
	return A3(
		$elm$html$Html$node,
		'mdc-slider',
		_Utils_ap(
			A2(
				$elm$core$List$filterMap,
				$elm$core$Basics$identity,
				_List_fromArray(
					[
						$author$project$Material$Slider$rootCs,
						$author$project$Material$Slider$displayCss,
						$author$project$Material$Slider$discreteCs(config_),
						$author$project$Material$Slider$displayMarkersCs(config_),
						$author$project$Material$Slider$tabIndexProp,
						$author$project$Material$Slider$sliderRoleAttr,
						$author$project$Material$Slider$valueProp(config_),
						$author$project$Material$Slider$minProp(config_),
						$author$project$Material$Slider$maxProp(config_),
						$author$project$Material$Slider$stepProp(config_),
						$author$project$Material$Slider$disabledProp(config_),
						$author$project$Material$Slider$ariaValueMinAttr(config_),
						$author$project$Material$Slider$ariaValueMaxAttr(config_),
						$author$project$Material$Slider$ariaValuenowAttr(config_),
						$author$project$Material$Slider$changeHandler(config_)
					])),
			additionalAttributes),
		_List_fromArray(
			[
				$author$project$Material$Slider$trackContainerElt,
				$author$project$Material$Slider$thumbContainerElt(config_)
			]));
};
var $author$project$Demo$Slider$continuousSlider = function (model) {
	var id = 'continuous-slider';
	return $author$project$Material$Slider$slider(
		A2(
			$author$project$Material$Slider$setMax,
			$elm$core$Maybe$Just(50),
			A2(
				$author$project$Material$Slider$setMin,
				$elm$core$Maybe$Just(0),
				A2(
					$author$project$Material$Slider$setOnInput,
					$author$project$Demo$Slider$Changed(id),
					A2(
						$author$project$Material$Slider$setValue,
						A2($elm$core$Dict$get, id, model.p),
						$author$project$Material$Slider$config)))));
};
var $author$project$Material$Slider$setDiscrete = F2(
	function (discrete, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{ae: discrete});
	});
var $author$project$Material$Slider$setStep = F2(
	function (step, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{b5: step});
	});
var $author$project$Demo$Slider$discreteSlider = function (model) {
	var id = 'discrete-slider';
	return $author$project$Material$Slider$slider(
		A2(
			$author$project$Material$Slider$setStep,
			$elm$core$Maybe$Just(1),
			A2(
				$author$project$Material$Slider$setMax,
				$elm$core$Maybe$Just(50),
				A2(
					$author$project$Material$Slider$setMin,
					$elm$core$Maybe$Just(0),
					A2(
						$author$project$Material$Slider$setDiscrete,
						true,
						A2(
							$author$project$Material$Slider$setOnInput,
							$author$project$Demo$Slider$Changed(id),
							A2(
								$author$project$Material$Slider$setValue,
								A2($elm$core$Dict$get, id, model.p),
								$author$project$Material$Slider$config)))))));
};
var $author$project$Material$Slider$setDisplayMarkers = F2(
	function (displayMarkers, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{bB: displayMarkers});
	});
var $author$project$Demo$Slider$discreteSliderWithTickMarks = function (model) {
	var id = 'discrete-slider-with-tick-marks';
	return $author$project$Material$Slider$slider(
		A2(
			$author$project$Material$Slider$setDisplayMarkers,
			true,
			A2(
				$author$project$Material$Slider$setStep,
				$elm$core$Maybe$Just(1),
				A2(
					$author$project$Material$Slider$setMax,
					$elm$core$Maybe$Just(50),
					A2(
						$author$project$Material$Slider$setMin,
						$elm$core$Maybe$Just(0),
						A2(
							$author$project$Material$Slider$setDiscrete,
							true,
							A2(
								$author$project$Material$Slider$setOnInput,
								$author$project$Demo$Slider$Changed(id),
								A2(
									$author$project$Material$Slider$setValue,
									A2($elm$core$Dict$get, id, model.p),
									$author$project$Material$Slider$config))))))));
};
var $author$project$Demo$Slider$Focus = function (a) {
	return {$: 1, a: a};
};
var $author$project$Material$Slider$setAttributes = F2(
	function (additionalAttributes, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{br: additionalAttributes});
	});
var $author$project$Demo$Slider$focusSlider = function (model) {
	var id = 'my-slider';
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				$author$project$Material$Slider$slider(
				A2(
					$author$project$Material$Slider$setAttributes,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$id(id)
						]),
					A2(
						$author$project$Material$Slider$setOnInput,
						$author$project$Demo$Slider$Changed(id),
						A2(
							$author$project$Material$Slider$setValue,
							A2($elm$core$Dict$get, id, model.p),
							$author$project$Material$Slider$config)))),
				$elm$html$Html$text('\u00A0'),
				A2(
				$author$project$Material$Button$raised,
				A2(
					$author$project$Material$Button$setOnClick,
					$author$project$Demo$Slider$Focus(id),
					$author$project$Material$Button$config),
				'Focus')
			]));
};
var $author$project$Demo$Slider$heroSlider = function (model) {
	var id = 'hero-slider';
	return $author$project$Material$Slider$slider(
		A2(
			$author$project$Material$Slider$setOnInput,
			$author$project$Demo$Slider$Changed(id),
			A2(
				$author$project$Material$Slider$setValue,
				A2($elm$core$Dict$get, id, model.p),
				$author$project$Material$Slider$config)));
};
var $author$project$Demo$Slider$view = function (model) {
	return {
		cS: _List_fromArray(
			[
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Continuous')
					])),
				$author$project$Demo$Slider$continuousSlider(model),
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Discrete')
					])),
				$author$project$Demo$Slider$discreteSlider(model),
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Discrete with Tick Marks')
					])),
				$author$project$Demo$Slider$discreteSliderWithTickMarks(model),
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Focus Slider')
					])),
				$author$project$Demo$Slider$focusSlider(model)
			]),
		cZ: _List_fromArray(
			[
				$author$project$Demo$Slider$heroSlider(model)
			]),
		c9: 'Sliders let users select from a range of values by moving the slider thumb.',
		db: {
			cT: $elm$core$Maybe$Just('https://package.elm-lang.org/packages/aforemny/material-components-web-elm/latest/Material-Slider'),
			c3: $elm$core$Maybe$Just('https://material.io/go/design-sliders'),
			df: $elm$core$Maybe$Just('https://github.com/material-components/material-components-web/tree/master/packages/mdc-slider')
		},
		dh: 'Slider'
	};
};
var $author$project$Demo$Snackbar$ShowBaseline = {$: 0};
var $author$project$Demo$Snackbar$ShowLeading = {$: 1};
var $author$project$Demo$Snackbar$ShowStacked = {$: 2};
var $author$project$Demo$Snackbar$SnackbarClosed = function (a) {
	return {$: 3, a: a};
};
var $author$project$Demo$Snackbar$buttonMargin = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'margin', '14px')
	]);
var $author$project$Material$Snackbar$Config = $elm$core$Basics$identity;
var $author$project$Material$Snackbar$config = function (_v0) {
	var onClosed = _v0.c5;
	return {br: _List_Nil, bv: false, c5: onClosed};
};
var $author$project$Demo$Snackbar$heroMessage = A2(
	$elm$html$Html$div,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('mdc-snackbar mdc-snackbar--open'),
			A2($elm$html$Html$Attributes$style, 'position', 'relative'),
			A2($elm$html$Html$Attributes$style, 'left', '0'),
			A2($elm$html$Html$Attributes$style, 'transform', 'none')
		]),
	_List_fromArray(
		[
			A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('mdc-snackbar__surface')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('mdc-snackbar__label'),
							A2($elm$html$Html$Attributes$style, 'color', 'hsla(0,0%,100%,.87)'),
							A2($elm$html$Html$Attributes$attribute, 'role', 'status'),
							A2($elm$html$Html$Attributes$attribute, 'aria-live', 'polite')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Can\'t send photo. Retry in 5 seconds.')
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('mdc-snackbar__actions')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('mdc-button'),
									$elm$html$Html$Attributes$class('mdc-snackbar__action'),
									$elm$html$Html$Attributes$type_('button')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Retry')
								])),
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('mdc-icon-button'),
									$elm$html$Html$Attributes$class('mdc-snackbar__dismiss'),
									$elm$html$Html$Attributes$class('material-icons')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('close')
								]))
						]))
				]))
		]));
var $author$project$Material$Snackbar$setCloseOnEscape = F2(
	function (closeOnEscape, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{bv: closeOnEscape});
	});
var $author$project$Material$Snackbar$closeOnEscapeProp = function (_v0) {
	var closeOnEscape = _v0.bv;
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$Attributes$property,
			'closeOnEscape',
			$elm$json$Json$Encode$bool(closeOnEscape)));
};
var $author$project$Material$Snackbar$closedHandler = F2(
	function (messageId, _v0) {
		var onClosed = _v0.c5;
		return $elm$core$Maybe$Just(
			A2(
				$elm$html$Html$Events$on,
				'MDCSnackbar:closed',
				$elm$json$Json$Decode$succeed(
					onClosed(messageId))));
	});
var $author$project$Material$Snackbar$leadingCs = function (message_) {
	return A2(
		$elm$core$Maybe$andThen,
		function (_v0) {
			var leading = _v0.bK;
			return leading ? $elm$core$Maybe$Just(
				$elm$html$Html$Attributes$class('mdc-snackbar--leading')) : $elm$core$Maybe$Nothing;
		},
		message_);
};
var $author$project$Material$Snackbar$messageIdProp = function (_v0) {
	var messageId = _v0;
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$Attributes$property,
			'messageId',
			$elm$json$Json$Encode$int(messageId)));
};
var $author$project$Material$Snackbar$rootCs = $elm$core$Maybe$Just(
	$elm$html$Html$Attributes$class('mdc-snackbar'));
var $author$project$Material$Snackbar$stackedCs = function (message_) {
	return A2(
		$elm$core$Maybe$andThen,
		function (_v0) {
			var stacked = _v0.b3;
			return stacked ? $elm$core$Maybe$Just(
				$elm$html$Html$Attributes$class('mdc-snackbar--stacked')) : $elm$core$Maybe$Nothing;
		},
		message_);
};
var $author$project$Material$Snackbar$actionButtonClickHandler = F2(
	function (messageId, _v0) {
		var onActionButtonClick = _v0.bR;
		return A2(
			$elm$core$Maybe$map,
			A2(
				$elm$core$Basics$composeL,
				$elm$html$Html$Events$onClick,
				$elm$core$Basics$apR(messageId)),
			onActionButtonClick);
	});
var $author$project$Material$Snackbar$actionButtonCs = $elm$core$Maybe$Just(
	$elm$html$Html$Attributes$class('mdc-button mdc-snackbar__action'));
var $author$project$Material$Snackbar$actionButtonElt = F2(
	function (messageId, message_) {
		var actionButton = message_.bp;
		return A2(
			$elm$core$Maybe$map,
			function (actionButtonLabel) {
				return A2(
					$elm$html$Html$button,
					A2(
						$elm$core$List$filterMap,
						$elm$core$Basics$identity,
						_List_fromArray(
							[
								$author$project$Material$Snackbar$actionButtonCs,
								A2($author$project$Material$Snackbar$actionButtonClickHandler, messageId, message_)
							])),
					_List_fromArray(
						[
							$elm$html$Html$text(actionButtonLabel)
						]));
			},
			actionButton);
	});
var $author$project$Material$Snackbar$actionIconClickHandler = F2(
	function (messageId, _v0) {
		var onActionIconClick = _v0.bS;
		return A2(
			$elm$core$Maybe$map,
			A2(
				$elm$core$Basics$composeL,
				$elm$html$Html$Events$onClick,
				$elm$core$Basics$apR(messageId)),
			onActionIconClick);
	});
var $author$project$Material$Snackbar$actionIconElt = F2(
	function (messageId, message_) {
		var actionIcon = message_.bq;
		if (!actionIcon.$) {
			if (!actionIcon.a.$) {
				var node = actionIcon.a.a.a7;
				var attributes = actionIcon.a.a.aW;
				var nodes = actionIcon.a.a.a8;
				return $elm$core$Maybe$Just(
					A2(
						node,
						_Utils_ap(
							A2(
								$elm$core$List$filterMap,
								$elm$core$Basics$identity,
								_List_fromArray(
									[
										$elm$core$Maybe$Just(
										$elm$html$Html$Attributes$class('mdc-icon-button')),
										$elm$core$Maybe$Just(
										$elm$html$Html$Attributes$class('mdc-snackbar__dismiss')),
										A2($author$project$Material$Snackbar$actionIconClickHandler, messageId, message_)
									])),
							attributes),
						nodes));
			} else {
				var node = actionIcon.a.a.a7;
				var attributes = actionIcon.a.a.aW;
				var nodes = actionIcon.a.a.a8;
				return $elm$core$Maybe$Just(
					A2(
						node,
						_Utils_ap(
							A2(
								$elm$core$List$filterMap,
								$elm$core$Basics$identity,
								_List_fromArray(
									[
										$elm$core$Maybe$Just(
										$elm$svg$Svg$Attributes$class('mdc-icon-button')),
										$elm$core$Maybe$Just(
										$elm$svg$Svg$Attributes$class('mdc-snackbar__dismiss')),
										A2($author$project$Material$Snackbar$actionIconClickHandler, messageId, message_)
									])),
							attributes),
						nodes));
			}
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$Material$Snackbar$actionsElt = F2(
	function (messageId, message_) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('mdc-snackbar__actions')
				]),
			A2(
				$elm$core$List$filterMap,
				$elm$core$Basics$identity,
				_List_fromArray(
					[
						A2($author$project$Material$Snackbar$actionButtonElt, messageId, message_),
						A2($author$project$Material$Snackbar$actionIconElt, messageId, message_)
					])));
	});
var $author$project$Material$Snackbar$ariaPoliteLiveAttr = A2($elm$html$Html$Attributes$attribute, 'aria-live', 'polite');
var $author$project$Material$Snackbar$ariaStatusRoleAttr = A2($elm$html$Html$Attributes$attribute, 'aria-role', 'status');
var $author$project$Material$Snackbar$labelElt = function (_v0) {
	var label = _v0.b;
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('mdc-snackbar__label'),
				$author$project$Material$Snackbar$ariaStatusRoleAttr,
				$author$project$Material$Snackbar$ariaPoliteLiveAttr
			]),
		_List_fromArray(
			[
				$elm$html$Html$text(label)
			]));
};
var $author$project$Material$Snackbar$surfaceElt = F2(
	function (messageId, message_) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('mdc-snackbar__surface')
				]),
			_List_fromArray(
				[
					$author$project$Material$Snackbar$labelElt(message_),
					A2($author$project$Material$Snackbar$actionsElt, messageId, message_)
				]));
	});
var $elm$core$Basics$clamp = F3(
	function (low, high, number) {
		return (_Utils_cmp(number, low) < 0) ? low : ((_Utils_cmp(number, high) > 0) ? high : number);
	});
var $author$project$Material$Snackbar$timeoutMsProp = function (message_) {
	var indefiniteTimeout = -1;
	var normalizedTimeoutMs = A2(
		$elm$core$Maybe$withDefault,
		indefiniteTimeout,
		A2(
			$elm$core$Maybe$andThen,
			function (_v0) {
				var timeoutMs = _v0.b9;
				return A2(
					$elm$core$Maybe$map,
					A2($elm$core$Basics$clamp, 4000, 10000),
					timeoutMs);
			},
			message_));
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$Attributes$property,
			'timeoutMs',
			$elm$json$Json$Encode$int(normalizedTimeoutMs)));
};
var $author$project$Material$Snackbar$snackbar = F2(
	function (config_, queue) {
		var additionalAttributes = config_.br;
		var messages = queue.B;
		var nextMessageId = queue.at;
		var _v0 = A2(
			$elm$core$Maybe$withDefault,
			_Utils_Tuple2(-1, $elm$core$Maybe$Nothing),
			A2(
				$elm$core$Maybe$map,
				$elm$core$Tuple$mapSecond($elm$core$Maybe$Just),
				$elm$core$List$head(messages)));
		var currentMessageId = _v0.a;
		var currentMessage = _v0.b;
		return A3(
			$elm$html$Html$node,
			'mdc-snackbar',
			_Utils_ap(
				A2(
					$elm$core$List$filterMap,
					$elm$core$Basics$identity,
					_List_fromArray(
						[
							$author$project$Material$Snackbar$rootCs,
							$author$project$Material$Snackbar$closeOnEscapeProp(config_),
							$author$project$Material$Snackbar$leadingCs(currentMessage),
							$author$project$Material$Snackbar$stackedCs(currentMessage),
							$author$project$Material$Snackbar$messageIdProp(currentMessageId),
							$author$project$Material$Snackbar$timeoutMsProp(currentMessage),
							A2($author$project$Material$Snackbar$closedHandler, currentMessageId, config_)
						])),
				additionalAttributes),
			_List_fromArray(
				[
					A2(
					$author$project$Material$Snackbar$surfaceElt,
					currentMessageId,
					A2(
						$elm$core$Maybe$withDefault,
						$author$project$Material$Snackbar$message(''),
						currentMessage))
				]));
	});
var $author$project$Demo$Snackbar$view = function (model) {
	return {
		cS: _List_fromArray(
			[
				A2(
				$author$project$Material$Button$raised,
				A2(
					$author$project$Material$Button$setAttributes,
					$author$project$Demo$Snackbar$buttonMargin,
					A2($author$project$Material$Button$setOnClick, $author$project$Demo$Snackbar$ShowBaseline, $author$project$Material$Button$config)),
				'Baseline'),
				$elm$html$Html$text(' '),
				A2(
				$author$project$Material$Button$raised,
				A2(
					$author$project$Material$Button$setAttributes,
					$author$project$Demo$Snackbar$buttonMargin,
					A2($author$project$Material$Button$setOnClick, $author$project$Demo$Snackbar$ShowLeading, $author$project$Material$Button$config)),
				'Leading'),
				$elm$html$Html$text(' '),
				A2(
				$author$project$Material$Button$raised,
				A2(
					$author$project$Material$Button$setAttributes,
					$author$project$Demo$Snackbar$buttonMargin,
					A2($author$project$Material$Button$setOnClick, $author$project$Demo$Snackbar$ShowStacked, $author$project$Material$Button$config)),
				'Stacked'),
				A2(
				$author$project$Material$Snackbar$snackbar,
				A2(
					$author$project$Material$Snackbar$setCloseOnEscape,
					true,
					$author$project$Material$Snackbar$config(
						{c5: $author$project$Demo$Snackbar$SnackbarClosed})),
				model.m)
			]),
		cZ: _List_fromArray(
			[$author$project$Demo$Snackbar$heroMessage]),
		c9: 'Snackbars provide brief feedback about an operation through a message at the bottom of the screen.',
		db: {
			cT: $elm$core$Maybe$Just('https://package.elm-lang.org/packages/aforemny/material-components-web-elm/latest/Material-Snackbar'),
			c3: $elm$core$Maybe$Just('https://material.io/go/design-snackbar'),
			df: $elm$core$Maybe$Just('https://github.com/material-components/material-components-web/tree/master/packages/mdc-snackbar')
		},
		dh: 'Snackbar'
	};
};
var $author$project$Demo$StandardTopAppBar$view = function (model) {
	return {
		cX: $author$project$Material$TopAppBar$fixedAdjust,
		di: A2(
			$author$project$Material$TopAppBar$regular,
			$author$project$Material$TopAppBar$config,
			_List_fromArray(
				[
					A2(
					$author$project$Material$TopAppBar$row,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$author$project$Material$TopAppBar$section,
							_List_fromArray(
								[$author$project$Material$TopAppBar$alignStart]),
							_List_fromArray(
								[
									A2(
									$author$project$Material$IconButton$iconButton,
									A2(
										$author$project$Material$IconButton$setAttributes,
										_List_fromArray(
											[$author$project$Material$TopAppBar$navigationIcon]),
										$author$project$Material$IconButton$config),
									$author$project$Material$IconButton$icon('menu')),
									A2(
									$elm$html$Html$span,
									_List_fromArray(
										[$author$project$Material$TopAppBar$title]),
									_List_fromArray(
										[
											$elm$html$Html$text('Standard')
										]))
								])),
							A2(
							$author$project$Material$TopAppBar$section,
							_List_fromArray(
								[$author$project$Material$TopAppBar$alignEnd]),
							_List_fromArray(
								[
									A2(
									$author$project$Material$IconButton$iconButton,
									A2(
										$author$project$Material$IconButton$setAttributes,
										_List_fromArray(
											[$author$project$Material$TopAppBar$actionItem]),
										$author$project$Material$IconButton$config),
									$author$project$Material$IconButton$icon('file_download')),
									A2(
									$author$project$Material$IconButton$iconButton,
									A2(
										$author$project$Material$IconButton$setAttributes,
										_List_fromArray(
											[$author$project$Material$TopAppBar$actionItem]),
										$author$project$Material$IconButton$config),
									$author$project$Material$IconButton$icon('print')),
									A2(
									$author$project$Material$IconButton$iconButton,
									A2(
										$author$project$Material$IconButton$setAttributes,
										_List_fromArray(
											[$author$project$Material$TopAppBar$actionItem]),
										$author$project$Material$IconButton$config),
									$author$project$Material$IconButton$icon('bookmark'))
								]))
						]))
				]))
	};
};
var $author$project$Demo$Startpage$imageListItems = _List_fromArray(
	[
		{c: 'images/buttons_180px.svg', d: 'Raised and flat buttons', dh: 'Button', a: $author$project$Demo$Url$Button},
		{c: 'images/cards_180px.svg', d: 'Various card layout styles', dh: 'Card', a: $author$project$Demo$Url$Card},
		{c: 'images/checkbox_180px.svg', d: 'Multi-selection controls', dh: 'Checkbox', a: $author$project$Demo$Url$Checkbox},
		{c: 'images/chips_180px.svg', d: 'Chips', dh: 'Chips', a: $author$project$Demo$Url$Chips},
		{c: 'images/linear_progress_180px.svg', d: 'Fills from 0% to 100%, represented by bars', dh: 'Circular progress', a: $author$project$Demo$Url$CircularProgress},
		{c: 'images/data_table_180px.svg', d: 'Data Table', dh: 'Data Table', a: $author$project$Demo$Url$DataTable},
		{c: 'images/dialog_180px.svg', d: 'Secondary text', dh: 'Dialog', a: $author$project$Demo$Url$Dialog},
		{c: 'images/drawer_180px.svg', d: 'Various drawer styles', dh: 'Drawer', a: $author$project$Demo$Url$Drawer},
		{c: 'images/elevation_180px.svg', d: 'Shadow for different elevations', dh: 'Elevation', a: $author$project$Demo$Url$Elevation},
		{c: 'images/floating_action_button_180px.svg', d: 'The primary action in an application', dh: 'FAB', a: $author$project$Demo$Url$Fab},
		{c: 'images/icon_button_180px.svg', d: 'Toggling icon states', dh: 'Icon Button', a: $author$project$Demo$Url$IconButton},
		{c: 'images/image_list_180px.svg', d: 'An Image List consists of several items, each containing an image and optionally supporting content (i.e. a text label)', dh: 'Image List', a: $author$project$Demo$Url$ImageList},
		{c: 'images/layout_grid_180px.svg', d: 'Grid and gutter support', dh: 'Layout Grid', a: $author$project$Demo$Url$LayoutGrid},
		{c: 'images/list_180px.svg', d: 'Item layouts in lists', dh: 'List', a: $author$project$Demo$Url$List},
		{c: 'images/linear_progress_180px.svg', d: 'Fills from 0% to 100%, represented by bars', dh: 'Linear progress', a: $author$project$Demo$Url$LinearProgress},
		{c: 'images/menu_180px.svg', d: 'Pop over menus', dh: 'Menu', a: $author$project$Demo$Url$Menu},
		{c: 'images/radio_180px.svg', d: 'Single selection controls', dh: 'Radio', a: $author$project$Demo$Url$RadioButton},
		{c: 'images/ripple_180px.svg', d: 'Touch ripple', dh: 'Ripple', a: $author$project$Demo$Url$Ripple},
		{c: 'images/form_field_180px.svg', d: 'Popover selection menus', dh: 'Select', a: $author$project$Demo$Url$Select},
		{c: 'images/slider_180px.svg', d: 'Range Controls', dh: 'Slider', a: $author$project$Demo$Url$Slider},
		{c: 'images/snackbar_180px.svg', d: 'Transient messages', dh: 'Snackbar', a: $author$project$Demo$Url$Snackbar},
		{c: 'images/switch_180px.svg', d: 'On off switches', dh: 'Switch', a: $author$project$Demo$Url$Switch},
		{c: 'images/tabs_180px.svg', d: 'Tabs organize and allow navigation between groups of content that are related and at the same level of hierarchy', dh: 'Tab Bar', a: $author$project$Demo$Url$TabBar},
		{c: 'images/form_field_180px.svg', d: 'Single and multiline text fields', dh: 'Text field', a: $author$project$Demo$Url$TextField},
		{c: 'images/ic_theme_24px.svg', d: 'Using primary and accent colors', dh: 'Theme', a: $author$project$Demo$Url$Theme},
		{c: 'images/top_app_bar_180px.svg', d: 'Container for items such as application title, navigation icon, and action items.', dh: 'Top App Bar', a: $author$project$Demo$Url$TopAppBar},
		{c: 'images/fonts_180px.svg', d: 'Type hierarchy', dh: 'Typography', a: $author$project$Demo$Url$Typography}
	]);
var $author$project$Material$ImageList$Item$setHref = F2(
	function (href, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{ak: href});
	});
var $author$project$Demo$Startpage$view = A2(
	$elm$html$Html$div,
	_List_Nil,
	_List_fromArray(
		[
			A2(
			$author$project$Material$TopAppBar$regular,
			$author$project$Material$TopAppBar$config,
			_List_fromArray(
				[
					A2(
					$author$project$Material$TopAppBar$row,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$author$project$Material$TopAppBar$section,
							_List_fromArray(
								[$author$project$Material$TopAppBar$alignStart]),
							_List_fromArray(
								[
									A2(
									$author$project$Material$IconButton$iconButton,
									A2(
										$author$project$Material$IconButton$setAttributes,
										_List_fromArray(
											[$author$project$Material$TopAppBar$navigationIcon]),
										$author$project$Material$IconButton$config),
									A3(
										$author$project$Material$IconButton$customIcon,
										$elm$html$Html$img,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$src('images/ic_component_24px_white.svg')
											]),
										_List_Nil)),
									A2(
									$elm$html$Html$span,
									_List_fromArray(
										[
											$author$project$Material$TopAppBar$title,
											A2($elm$html$Html$Attributes$style, 'text-transform', 'uppercase'),
											A2($elm$html$Html$Attributes$style, 'font-weight', '400')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Material Components for Elm')
										]))
								]))
						]))
				])),
			A2(
			$author$project$Material$ImageList$imageList,
			A2(
				$author$project$Material$ImageList$setAttributes,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'max-width', '900px'),
						A2($elm$html$Html$Attributes$style, 'padding-top', '128px'),
						A2($elm$html$Html$Attributes$style, 'padding-bottom', '100px')
					]),
				$author$project$Material$ImageList$config),
			A2(
				$elm$core$List$map,
				function (_v0) {
					var url = _v0.a;
					var title = _v0.dh;
					var icon = _v0.c;
					return A2(
						$author$project$Material$ImageList$Item$imageListItem,
						A2(
							$author$project$Material$ImageList$Item$setAttributes,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'width', 'calc(100% / 4 - 8.25px)'),
									A2($elm$html$Html$Attributes$style, 'margin', '4px')
								]),
							A2(
								$author$project$Material$ImageList$Item$setHref,
								$elm$core$Maybe$Just(
									$author$project$Demo$Url$toString(url)),
								A2(
									$author$project$Material$ImageList$Item$setLabel,
									$elm$core$Maybe$Just(title),
									$author$project$Material$ImageList$Item$config))),
						icon);
				},
				$author$project$Demo$Startpage$imageListItems))
		]));
var $author$project$Demo$Switch$Toggle = function (a) {
	return {$: 0, a: a};
};
var $author$project$Material$Switch$Config = $elm$core$Basics$identity;
var $author$project$Material$Switch$config = {br: _List_Nil, aX: false, ad: false, bb: $elm$core$Maybe$Nothing};
var $author$project$Demo$Switch$isChecked = F2(
	function (id, model) {
		return A2(
			$elm$core$Maybe$withDefault,
			false,
			A2($elm$core$Dict$get, id, model.aH));
	});
var $author$project$Material$Switch$setChecked = F2(
	function (checked, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{aX: checked});
	});
var $author$project$Material$Switch$setOnChange = F2(
	function (onChange, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{
				bb: $elm$core$Maybe$Just(onChange)
			});
	});
var $author$project$Material$Switch$checkedProp = function (_v0) {
	var checked = _v0.aX;
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$Attributes$property,
			'checked',
			$elm$json$Json$Encode$bool(checked)));
};
var $author$project$Material$Switch$disabledProp = function (_v0) {
	var disabled = _v0.ad;
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$Attributes$property,
			'disabled',
			$elm$json$Json$Encode$bool(disabled)));
};
var $author$project$Material$Switch$rootCs = $elm$core$Maybe$Just(
	$elm$html$Html$Attributes$class('mdc-switch'));
var $author$project$Material$Switch$changeHandler = function (_v0) {
	var onChange = _v0.bb;
	return A2(
		$elm$core$Maybe$map,
		A2(
			$elm$core$Basics$composeL,
			$elm$html$Html$Events$on('change'),
			$elm$json$Json$Decode$succeed),
		onChange);
};
var $author$project$Material$Switch$checkboxTypeAttr = $elm$core$Maybe$Just(
	$elm$html$Html$Attributes$type_('checkbox'));
var $author$project$Material$Switch$nativeControlCs = $elm$core$Maybe$Just(
	$elm$html$Html$Attributes$class('mdc-switch__native-control'));
var $author$project$Material$Switch$switchRoleAttr = $elm$core$Maybe$Just(
	A2($elm$html$Html$Attributes$attribute, 'role', 'switch'));
var $author$project$Material$Switch$nativeControlElt = function (config_) {
	return A2(
		$elm$html$Html$input,
		A2(
			$elm$core$List$filterMap,
			$elm$core$Basics$identity,
			_List_fromArray(
				[
					$author$project$Material$Switch$nativeControlCs,
					$author$project$Material$Switch$checkboxTypeAttr,
					$author$project$Material$Switch$switchRoleAttr,
					$author$project$Material$Switch$checkedProp(config_),
					$author$project$Material$Switch$changeHandler(config_)
				])),
		_List_Nil);
};
var $author$project$Material$Switch$thumbElt = A2(
	$elm$html$Html$div,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('mdc-switch__thumb')
		]),
	_List_Nil);
var $author$project$Material$Switch$thumbUnderlayElt = function (config_) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('mdc-switch__thumb-underlay')
			]),
		_List_fromArray(
			[
				$author$project$Material$Switch$thumbElt,
				$author$project$Material$Switch$nativeControlElt(config_)
			]));
};
var $author$project$Material$Switch$trackElt = A2(
	$elm$html$Html$div,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('mdc-switch__track')
		]),
	_List_Nil);
var $author$project$Material$Switch$switch = function (config_) {
	var additionalAttributes = config_.br;
	return A3(
		$elm$html$Html$node,
		'mdc-switch',
		_Utils_ap(
			A2(
				$elm$core$List$filterMap,
				$elm$core$Basics$identity,
				_List_fromArray(
					[
						$author$project$Material$Switch$rootCs,
						$author$project$Material$Switch$checkedProp(config_),
						$author$project$Material$Switch$disabledProp(config_)
					])),
			additionalAttributes),
		_List_fromArray(
			[
				$author$project$Material$Switch$trackElt,
				$author$project$Material$Switch$thumbUnderlayElt(config_)
			]));
};
var $author$project$Demo$Switch$demoSwitch = function (model) {
	var id = 'demo-switch';
	return A2(
		$author$project$Material$FormField$formField,
		A2(
			$author$project$Material$FormField$setOnClick,
			$author$project$Demo$Switch$Toggle(id),
			A2(
				$author$project$Material$FormField$setFor,
				$elm$core$Maybe$Just(id),
				A2(
					$author$project$Material$FormField$setLabel,
					$elm$core$Maybe$Just('off/on'),
					$author$project$Material$FormField$config))),
		_List_fromArray(
			[
				$author$project$Material$Switch$switch(
				A2(
					$author$project$Material$Switch$setOnChange,
					$author$project$Demo$Switch$Toggle(id),
					A2(
						$author$project$Material$Switch$setChecked,
						A2($author$project$Demo$Switch$isChecked, id, model),
						$author$project$Material$Switch$config)))
			]));
};
var $author$project$Demo$Switch$Focus = function (a) {
	return {$: 1, a: a};
};
var $author$project$Material$Switch$setAttributes = F2(
	function (additionalAttributes, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{br: additionalAttributes});
	});
var $author$project$Demo$Switch$focusSwitch = function (model) {
	var id = 'my-switch';
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$author$project$Material$FormField$formField,
				A2(
					$author$project$Material$FormField$setAttributes,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$id('my-form-field')
						]),
					A2(
						$author$project$Material$FormField$setOnClick,
						$author$project$Demo$Switch$Toggle(id),
						A2(
							$author$project$Material$FormField$setFor,
							$elm$core$Maybe$Just(id),
							A2(
								$author$project$Material$FormField$setLabel,
								$elm$core$Maybe$Just('off/on'),
								$author$project$Material$FormField$config)))),
				_List_fromArray(
					[
						$author$project$Material$Switch$switch(
						A2(
							$author$project$Material$Switch$setAttributes,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$id(id)
								]),
							A2(
								$author$project$Material$Switch$setOnChange,
								$author$project$Demo$Switch$Toggle(id),
								A2(
									$author$project$Material$Switch$setChecked,
									A2($author$project$Demo$Switch$isChecked, id, model),
									$author$project$Material$Switch$config))))
					])),
				$elm$html$Html$text('\u00A0'),
				A2(
				$author$project$Material$Button$raised,
				A2(
					$author$project$Material$Button$setOnClick,
					$author$project$Demo$Switch$Focus('my-switch'),
					$author$project$Material$Button$config),
				'Focus switch'),
				A2(
				$author$project$Material$Button$raised,
				A2(
					$author$project$Material$Button$setOnClick,
					$author$project$Demo$Switch$Focus('my-form-field'),
					$author$project$Material$Button$config),
				'Focus form field')
			]));
};
var $author$project$Demo$Switch$heroSwitch = function (model) {
	var id = 'hero-switch';
	return _List_fromArray(
		[
			A2(
			$author$project$Material$FormField$formField,
			A2(
				$author$project$Material$FormField$setOnClick,
				$author$project$Demo$Switch$Toggle(id),
				A2(
					$author$project$Material$FormField$setFor,
					$elm$core$Maybe$Just(id),
					A2(
						$author$project$Material$FormField$setLabel,
						$elm$core$Maybe$Just('off/on'),
						$author$project$Material$FormField$config))),
			_List_fromArray(
				[
					$author$project$Material$Switch$switch(
					A2(
						$author$project$Material$Switch$setOnChange,
						$author$project$Demo$Switch$Toggle(id),
						A2(
							$author$project$Material$Switch$setChecked,
							A2($author$project$Demo$Switch$isChecked, id, model),
							$author$project$Material$Switch$config)))
				]))
		]);
};
var $author$project$Demo$Switch$view = function (model) {
	return {
		cS: _List_fromArray(
			[
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Switch')
					])),
				$author$project$Demo$Switch$demoSwitch(model),
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Focus Switch')
					])),
				$author$project$Demo$Switch$focusSwitch(model)
			]),
		cZ: $author$project$Demo$Switch$heroSwitch(model),
		c9: 'Switches communicate an action a user can take. They are typically placed throughout your UI, in places like dialogs, forms, cards, and toolbars.',
		db: {
			cT: $elm$core$Maybe$Just('https://package.elm-lang.org/packages/aforemny/material-components-web-elm/latest/Material-Switch'),
			c3: $elm$core$Maybe$Just('https://material.io/go/design-switches'),
			df: $elm$core$Maybe$Just('https://github.com/material-components/material-components-web/tree/master/packages/mdc-switch')
		},
		dh: 'Switch'
	};
};
var $author$project$Demo$TabBar$Focus = function (a) {
	return {$: 5, a: a};
};
var $author$project$Demo$TabBar$SetActiveHeroTab = function (a) {
	return {$: 0, a: a};
};
var $author$project$Material$Tab$Internal$Config = $elm$core$Basics$identity;
var $author$project$Material$Tab$config = {
	ch: false,
	br: _List_Nil,
	cS: {c: $elm$core$Maybe$Nothing, b: ''},
	bc: $elm$core$Maybe$Nothing
};
var $author$project$Material$TabBar$Config = $elm$core$Basics$identity;
var $author$project$Material$TabBar$config = {br: _List_Nil, bs: $elm$core$Maybe$Nothing, a1: false, bN: false, b3: false};
var $author$project$Material$Tab$setActive = F2(
	function (active, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{ch: active});
	});
var $author$project$Material$TabBar$setAttributes = F2(
	function (additionalAttributes, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{br: additionalAttributes});
	});
var $author$project$Material$Tab$setOnClick = F2(
	function (onClick, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{
				bc: $elm$core$Maybe$Just(onClick)
			});
	});
var $author$project$Material$Tab$Internal$Tab = $elm$core$Basics$identity;
var $author$project$Material$Tab$tab = F2(
	function (_v0, content) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{cS: content});
	});
var $elm$core$Tuple$pair = F2(
	function (a, b) {
		return _Utils_Tuple2(a, b);
	});
var $author$project$Material$TabBar$activeTabIndexProp = function (tabs) {
	var activeTabIndex = A2(
		$elm$core$Maybe$map,
		$elm$core$Tuple$first,
		$elm$core$List$head(
			A2(
				$elm$core$List$filter,
				function (_v0) {
					var active = _v0.b.ch;
					return active;
				},
				A2($elm$core$List$indexedMap, $elm$core$Tuple$pair, tabs))));
	return A2(
		$elm$core$Maybe$map,
		A2(
			$elm$core$Basics$composeL,
			$elm$html$Html$Attributes$property('activeTabIndex'),
			$elm$json$Json$Encode$int),
		activeTabIndex);
};
var $author$project$Material$TabBar$rootCs = $elm$core$Maybe$Just(
	$elm$html$Html$Attributes$class('mdc-tab-bar'));
var $author$project$Material$TabBar$tabScrollerAlignCs = function (align) {
	if (!align.$) {
		switch (align.a) {
			case 0:
				var _v1 = align.a;
				return $elm$core$Maybe$Just(
					$elm$html$Html$Attributes$class('mdc-tab-scroller--align-start'));
			case 1:
				var _v2 = align.a;
				return $elm$core$Maybe$Just(
					$elm$html$Html$Attributes$class('mdc-tab-scroller--align-end'));
			default:
				var _v3 = align.a;
				return $elm$core$Maybe$Just(
					$elm$html$Html$Attributes$class('mdc-tab-scroller--align-center'));
		}
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Material$TabBar$tabScrollerCs = $elm$core$Maybe$Just(
	$elm$html$Html$Attributes$class('mdc-tab-scroller'));
var $author$project$Material$TabBar$tabClickHandler = function (_v0) {
	var onClick = _v0.bc;
	return A2(
		$elm$core$Maybe$map,
		A2(
			$elm$core$Basics$composeL,
			$elm$html$Html$Events$on('MDCTab:interacted'),
			$elm$json$Json$Decode$succeed),
		onClick);
};
var $author$project$Material$TabBar$tabIconElt = function (_v0) {
	var icon = _v0.c;
	return A2(
		$elm$core$Maybe$map,
		$elm$html$Html$map($elm$core$Basics$never),
		function () {
			if (!icon.$) {
				if (!icon.a.$) {
					var node = icon.a.a.a7;
					var attributes = icon.a.a.aW;
					var nodes = icon.a.a.a8;
					return $elm$core$Maybe$Just(
						A2(
							node,
							A2(
								$elm$core$List$cons,
								$elm$html$Html$Attributes$class('mdc-tab__icon'),
								attributes),
							nodes));
				} else {
					var node = icon.a.a.a7;
					var attributes = icon.a.a.aW;
					var nodes = icon.a.a.a8;
					return $elm$core$Maybe$Just(
						A2(
							node,
							A2(
								$elm$core$List$cons,
								$elm$svg$Svg$Attributes$class('mdc-tab__icon'),
								attributes),
							nodes));
				}
			} else {
				return $elm$core$Maybe$Nothing;
			}
		}());
};
var $author$project$Material$TabBar$tabIndicatorContentElt = A2(
	$elm$html$Html$span,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('mdc-tab-indicator__content'),
			$elm$html$Html$Attributes$class('mdc-tab-indicator__content--underline')
		]),
	_List_Nil);
var $author$project$Material$TabBar$tabIndicatorElt = function (config_) {
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$span,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('mdc-tab-indicator')
				]),
			_List_fromArray(
				[$author$project$Material$TabBar$tabIndicatorContentElt])));
};
var $author$project$Material$TabBar$tabTextLabelElt = function (_v0) {
	var label = _v0.b;
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$span,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('mdc-tab__text-label')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(label)
				])));
};
var $author$project$Material$TabBar$tabContentElt = F3(
	function (barConfig, config_, content) {
		var indicatorSpansContent = barConfig.a1;
		return $elm$core$Maybe$Just(
			A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('mdc-tab__content')
					]),
				indicatorSpansContent ? A2(
					$elm$core$List$filterMap,
					$elm$core$Basics$identity,
					_List_fromArray(
						[
							$author$project$Material$TabBar$tabIconElt(content),
							$author$project$Material$TabBar$tabTextLabelElt(content),
							$author$project$Material$TabBar$tabIndicatorElt(config_)
						])) : A2(
					$elm$core$List$filterMap,
					$elm$core$Basics$identity,
					_List_fromArray(
						[
							$author$project$Material$TabBar$tabIconElt(content),
							$author$project$Material$TabBar$tabTextLabelElt(content)
						]))));
	});
var $author$project$Material$TabBar$tabCs = $elm$core$Maybe$Just(
	$elm$html$Html$Attributes$class('mdc-tab'));
var $author$project$Material$TabBar$tabMinWidthCs = function (_v0) {
	var minWidth = _v0.bN;
	return minWidth ? $elm$core$Maybe$Just(
		$elm$html$Html$Attributes$class('mdc-tab--min-width')) : $elm$core$Maybe$Nothing;
};
var $author$project$Material$TabBar$tabRippleElt = $elm$core$Maybe$Just(
	A2(
		$elm$html$Html$span,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('mdc-tab__ripple')
			]),
		_List_Nil));
var $author$project$Material$TabBar$tabRoleAttr = $elm$core$Maybe$Just(
	A2($elm$html$Html$Attributes$attribute, 'role', 'tab'));
var $author$project$Material$TabBar$tabStackedCs = function (_v0) {
	var stacked = _v0.b3;
	return stacked ? $elm$core$Maybe$Just(
		$elm$html$Html$Attributes$class('mdc-tab--stacked')) : $elm$core$Maybe$Nothing;
};
var $author$project$Material$TabBar$viewTab = F2(
	function (barConfig, tab) {
		var indicatorSpansContent = barConfig.a1;
		var tabConfig = tab;
		var additionalAttributes = tabConfig.br;
		var content = tabConfig.cS;
		return A2(
			$elm$html$Html$button,
			_Utils_ap(
				A2(
					$elm$core$List$filterMap,
					$elm$core$Basics$identity,
					_List_fromArray(
						[
							$author$project$Material$TabBar$tabCs,
							$author$project$Material$TabBar$tabRoleAttr,
							$author$project$Material$TabBar$tabStackedCs(barConfig),
							$author$project$Material$TabBar$tabMinWidthCs(barConfig),
							$author$project$Material$TabBar$tabClickHandler(tabConfig)
						])),
				additionalAttributes),
			A2(
				$elm$core$List$filterMap,
				$elm$core$Basics$identity,
				indicatorSpansContent ? _List_fromArray(
					[
						A3($author$project$Material$TabBar$tabContentElt, barConfig, tabConfig, content),
						$author$project$Material$TabBar$tabRippleElt
					]) : _List_fromArray(
					[
						A3($author$project$Material$TabBar$tabContentElt, barConfig, tabConfig, content),
						$author$project$Material$TabBar$tabIndicatorElt(tabConfig),
						$author$project$Material$TabBar$tabRippleElt
					])));
	});
var $author$project$Material$TabBar$tabScrollerScrollContentElt = F2(
	function (barConfig, tabs) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('mdc-tab-scroller__scroll-content')
				]),
			A2(
				$elm$core$List$map,
				$author$project$Material$TabBar$viewTab(barConfig),
				tabs));
	});
var $author$project$Material$TabBar$tabScrollerScrollAreaElt = F2(
	function (barConfig, tabs) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('mdc-tab-scroller__scroll-area')
				]),
			_List_fromArray(
				[
					A2($author$project$Material$TabBar$tabScrollerScrollContentElt, barConfig, tabs)
				]));
	});
var $author$project$Material$TabBar$tabScroller = F3(
	function (config_, align, tabs) {
		return A2(
			$elm$html$Html$div,
			A2(
				$elm$core$List$filterMap,
				$elm$core$Basics$identity,
				_List_fromArray(
					[
						$author$project$Material$TabBar$tabScrollerCs,
						$author$project$Material$TabBar$tabScrollerAlignCs(align)
					])),
			_List_fromArray(
				[
					A2($author$project$Material$TabBar$tabScrollerScrollAreaElt, config_, tabs)
				]));
	});
var $author$project$Material$TabBar$tablistRoleAttr = $elm$core$Maybe$Just(
	A2($elm$html$Html$Attributes$attribute, 'role', 'tablist'));
var $author$project$Material$TabBar$tabBar = F2(
	function (config_, tabs) {
		var additionalAttributes = config_.br;
		var align = config_.bs;
		return A3(
			$elm$html$Html$node,
			'mdc-tab-bar',
			_Utils_ap(
				A2(
					$elm$core$List$filterMap,
					$elm$core$Basics$identity,
					_List_fromArray(
						[
							$author$project$Material$TabBar$rootCs,
							$author$project$Material$TabBar$tablistRoleAttr,
							$author$project$Material$TabBar$activeTabIndexProp(tabs)
						])),
				additionalAttributes),
			_List_fromArray(
				[
					A3($author$project$Material$TabBar$tabScroller, config_, align, tabs)
				]));
	});
var $author$project$Demo$TabBar$focusTabs = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$author$project$Material$TabBar$tabBar,
				A2(
					$author$project$Material$TabBar$setAttributes,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$id('my-tabs')
						]),
					$author$project$Material$TabBar$config),
				_List_fromArray(
					[
						A2(
						$author$project$Material$Tab$tab,
						A2(
							$author$project$Material$Tab$setOnClick,
							$author$project$Demo$TabBar$SetActiveHeroTab(0),
							A2($author$project$Material$Tab$setActive, !model.o, $author$project$Material$Tab$config)),
						{c: $elm$core$Maybe$Nothing, b: 'Home'}),
						A2(
						$author$project$Material$Tab$tab,
						A2(
							$author$project$Material$Tab$setOnClick,
							$author$project$Demo$TabBar$SetActiveHeroTab(1),
							A2($author$project$Material$Tab$setActive, model.o === 1, $author$project$Material$Tab$config)),
						{c: $elm$core$Maybe$Nothing, b: 'Merchandise'}),
						A2(
						$author$project$Material$Tab$tab,
						A2(
							$author$project$Material$Tab$setOnClick,
							$author$project$Demo$TabBar$SetActiveHeroTab(2),
							A2($author$project$Material$Tab$setActive, model.o === 2, $author$project$Material$Tab$config)),
						{c: $elm$core$Maybe$Nothing, b: 'About Us'})
					])),
				$elm$html$Html$text('\u00A0'),
				A2(
				$author$project$Material$Button$raised,
				A2(
					$author$project$Material$Button$setOnClick,
					$author$project$Demo$TabBar$Focus('my-tabs'),
					$author$project$Material$Button$config),
				'Focus')
			]));
};
var $author$project$Demo$TabBar$heroTabs = F2(
	function (model, index) {
		return A2(
			$author$project$Material$TabBar$tabBar,
			$author$project$Material$TabBar$config,
			_List_fromArray(
				[
					A2(
					$author$project$Material$Tab$tab,
					A2(
						$author$project$Material$Tab$setOnClick,
						$author$project$Demo$TabBar$SetActiveHeroTab(0),
						A2($author$project$Material$Tab$setActive, !model.o, $author$project$Material$Tab$config)),
					{c: $elm$core$Maybe$Nothing, b: 'Home'}),
					A2(
					$author$project$Material$Tab$tab,
					A2(
						$author$project$Material$Tab$setOnClick,
						$author$project$Demo$TabBar$SetActiveHeroTab(1),
						A2($author$project$Material$Tab$setActive, model.o === 1, $author$project$Material$Tab$config)),
					{c: $elm$core$Maybe$Nothing, b: 'Merchandise'}),
					A2(
					$author$project$Material$Tab$tab,
					A2(
						$author$project$Material$Tab$setOnClick,
						$author$project$Demo$TabBar$SetActiveHeroTab(2),
						A2($author$project$Material$Tab$setActive, model.o === 2, $author$project$Material$Tab$config)),
					{c: $elm$core$Maybe$Nothing, b: 'About Us'})
				]));
	});
var $author$project$Demo$TabBar$SetActiveScrollingTab = function (a) {
	return {$: 3, a: a};
};
var $author$project$Demo$TabBar$scrollingTabs = function (model) {
	var config = function (index) {
		return A2(
			$author$project$Material$Tab$setOnClick,
			$author$project$Demo$TabBar$SetActiveScrollingTab(index),
			A2(
				$author$project$Material$Tab$setActive,
				_Utils_eq(model.aU, index),
				$author$project$Material$Tab$config));
	};
	return A2(
		$author$project$Material$TabBar$tabBar,
		$author$project$Material$TabBar$config,
		A2(
			$elm$core$List$indexedMap,
			F2(
				function (index, label) {
					return A2(
						$author$project$Material$Tab$tab,
						config(index),
						{c: $elm$core$Maybe$Nothing, b: 'Tab ' + label});
				}),
			_List_fromArray(
				['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight'])));
};
var $author$project$Demo$TabBar$SetActiveIconTab = function (a) {
	return {$: 1, a: a};
};
var $author$project$Material$Tab$Internal$Icon = function (a) {
	return {$: 0, a: a};
};
var $author$project$Material$Tab$customIcon = F3(
	function (node, attributes, nodes) {
		return $author$project$Material$Tab$Internal$Icon(
			{aW: attributes, a7: node, a8: nodes});
	});
var $author$project$Material$Tab$icon = function (iconName) {
	return A3(
		$author$project$Material$Tab$customIcon,
		$elm$html$Html$i,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('material-icons')
			]),
		_List_fromArray(
			[
				$elm$html$Html$text(iconName)
			]));
};
var $author$project$Material$Tab$Internal$SvgIcon = function (a) {
	return {$: 1, a: a};
};
var $author$project$Material$Tab$svgIcon = F2(
	function (attributes, nodes) {
		return $author$project$Material$Tab$Internal$SvgIcon(
			{aW: attributes, a7: $elm$svg$Svg$svg, a8: nodes});
	});
var $author$project$Demo$TabBar$tabsWithCustomIcons = function (model) {
	var config = function (index) {
		return A2(
			$author$project$Material$Tab$setOnClick,
			$author$project$Demo$TabBar$SetActiveIconTab(index),
			A2(
				$author$project$Material$Tab$setActive,
				_Utils_eq(model.aT, index),
				$author$project$Material$Tab$config));
	};
	return A2(
		$author$project$Material$TabBar$tabBar,
		$author$project$Material$TabBar$config,
		_List_fromArray(
			[
				A2(
				$author$project$Material$Tab$tab,
				config(0),
				{
					c: $elm$core$Maybe$Just(
						$author$project$Material$Tab$icon('access_time')),
					b: 'Material Design'
				}),
				A2(
				$author$project$Material$Tab$tab,
				config(1),
				{
					c: $elm$core$Maybe$Just(
						A3(
							$author$project$Material$Tab$customIcon,
							$elm$html$Html$i,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('fab fa-font-awesome')
								]),
							_List_Nil)),
					b: 'Font Awesome'
				}),
				A2(
				$author$project$Material$Tab$tab,
				config(2),
				{
					c: $elm$core$Maybe$Just(
						A2(
							$author$project$Material$Tab$svgIcon,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$viewBox('0 0 100 100')
								]),
							$author$project$Demo$ElmLogo$elmLogo)),
					b: 'SVG'
				})
			]));
};
var $author$project$Demo$TabBar$SetActiveCustomIconTab = function (a) {
	return {$: 4, a: a};
};
var $author$project$Demo$TabBar$tabsWithIcons = function (model) {
	var config = function (index) {
		return A2(
			$author$project$Material$Tab$setOnClick,
			$author$project$Demo$TabBar$SetActiveCustomIconTab(index),
			A2(
				$author$project$Material$Tab$setActive,
				_Utils_eq(model.aS, index),
				$author$project$Material$Tab$config));
	};
	return A2(
		$author$project$Material$TabBar$tabBar,
		$author$project$Material$TabBar$config,
		_List_fromArray(
			[
				A2(
				$author$project$Material$Tab$tab,
				config(0),
				{
					c: $elm$core$Maybe$Just(
						$author$project$Material$Tab$icon('access_time')),
					b: 'Recents'
				}),
				A2(
				$author$project$Material$Tab$tab,
				config(1),
				{
					c: $elm$core$Maybe$Just(
						$author$project$Material$Tab$icon('near_me')),
					b: 'Nearby'
				}),
				A2(
				$author$project$Material$Tab$tab,
				config(2),
				{
					c: $elm$core$Maybe$Just(
						$author$project$Material$Tab$icon('favorite')),
					b: 'Favorites'
				})
			]));
};
var $author$project$Demo$TabBar$SetActiveStackedTab = function (a) {
	return {$: 2, a: a};
};
var $author$project$Material$TabBar$setIndicatorSpansContent = F2(
	function (indicatorSpansContent, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{a1: indicatorSpansContent});
	});
var $author$project$Material$TabBar$setStacked = F2(
	function (stacked, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{b3: stacked});
	});
var $author$project$Demo$TabBar$tabsWithStackedIcons = function (model) {
	var config = function (index) {
		return A2(
			$author$project$Material$Tab$setOnClick,
			$author$project$Demo$TabBar$SetActiveStackedTab(index),
			A2(
				$author$project$Material$Tab$setActive,
				_Utils_eq(model.aV, index),
				$author$project$Material$Tab$config));
	};
	return A2(
		$author$project$Material$TabBar$tabBar,
		A2(
			$author$project$Material$TabBar$setIndicatorSpansContent,
			true,
			A2($author$project$Material$TabBar$setStacked, true, $author$project$Material$TabBar$config)),
		_List_fromArray(
			[
				A2(
				$author$project$Material$Tab$tab,
				config(0),
				{
					c: $elm$core$Maybe$Just(
						$author$project$Material$Tab$icon('access_time')),
					b: 'Recents'
				}),
				A2(
				$author$project$Material$Tab$tab,
				config(1),
				{
					c: $elm$core$Maybe$Just(
						$author$project$Material$Tab$icon('near_me')),
					b: 'Nearby'
				}),
				A2(
				$author$project$Material$Tab$tab,
				config(2),
				{
					c: $elm$core$Maybe$Just(
						$author$project$Material$Tab$icon('favorite')),
					b: 'Favorites'
				})
			]));
};
var $author$project$Demo$TabBar$view = function (model) {
	return {
		cS: _List_fromArray(
			[
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Tabs with Icons Next to Labels')
					])),
				$author$project$Demo$TabBar$tabsWithIcons(model),
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Tabs with Icons Above Labels and Indicators Restricted to Content')
					])),
				$author$project$Demo$TabBar$tabsWithStackedIcons(model),
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Scrolling Tabs')
					])),
				$author$project$Demo$TabBar$scrollingTabs(model),
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Tabs with Custom Icon')
					])),
				$author$project$Demo$TabBar$tabsWithCustomIcons(model),
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Focus Tabs')
					])),
				$author$project$Demo$TabBar$focusTabs(model)
			]),
		cZ: _List_fromArray(
			[
				A2($author$project$Demo$TabBar$heroTabs, model, 'tabs-hero-tabs')
			]),
		c9: 'Tabs organize and allow navigation between groups of content that are related and at the same level of hierarchy. The Tab Bar contains the Tab Scroller and Tab components.',
		db: {
			cT: $elm$core$Maybe$Just('https://package.elm-lang.org/packages/aforemny/material-components-web-elm/latest/Material-TabBar'),
			c3: $elm$core$Maybe$Just('https://material.io/go/design-tabs'),
			df: $elm$core$Maybe$Just('https://github.com/material-components/material-components-web/tree/master/packages/mdc-tab-bar')
		},
		dh: 'Tab Bar'
	};
};
var $author$project$Material$TextField$Config = $elm$core$Basics$identity;
var $author$project$Material$TextField$config = {br: _List_Nil, ad: false, bD: false, aj: false, b: $elm$core$Maybe$Nothing, cr: $elm$core$Maybe$Nothing, a3: $elm$core$Maybe$Nothing, a4: $elm$core$Maybe$Nothing, a5: $elm$core$Maybe$Nothing, a6: $elm$core$Maybe$Nothing, bb: $elm$core$Maybe$Nothing, bU: $elm$core$Maybe$Nothing, bW: $elm$core$Maybe$Nothing, bh: $elm$core$Maybe$Nothing, bY: $elm$core$Maybe$Nothing, b$: false, b5: $elm$core$Maybe$Nothing, b7: $elm$core$Maybe$Nothing, bl: $elm$core$Maybe$Nothing, cc: $elm$core$Maybe$Nothing, cd: true, bm: $elm$core$Maybe$Nothing};
var $author$project$Material$HelperText$Config = $elm$core$Basics$identity;
var $author$project$Material$HelperText$config = {br: _List_Nil, bX: false, ce: true};
var $author$project$Material$HelperText$helperLineCs = $elm$html$Html$Attributes$class('mdc-text-field-helper-line');
var $author$project$Material$HelperText$helperLine = F2(
	function (additionalAttributes, nodes) {
		return A2(
			$elm$html$Html$div,
			A2($elm$core$List$cons, $author$project$Material$HelperText$helperLineCs, additionalAttributes),
			nodes);
	});
var $author$project$Material$HelperText$ariaHiddenAttr = $elm$core$Maybe$Just(
	A2($elm$html$Html$Attributes$attribute, 'aria-hidden', 'true'));
var $author$project$Material$HelperText$helperTextCs = $elm$core$Maybe$Just(
	$elm$html$Html$Attributes$class('mdc-text-field-helper-text'));
var $author$project$Material$HelperText$persistentCs = function (_v0) {
	var config_ = _v0;
	return config_.bX ? $elm$core$Maybe$Just(
		$elm$html$Html$Attributes$class('mdc-text-field-helper-text--persistent')) : $elm$core$Maybe$Nothing;
};
var $author$project$Material$HelperText$validationCs = function (_v0) {
	var config_ = _v0;
	return config_.ce ? $elm$core$Maybe$Just(
		$elm$html$Html$Attributes$class('mdc-text-field-helper-text--validation-msg')) : $elm$core$Maybe$Nothing;
};
var $author$project$Material$HelperText$helperText = F2(
	function (config_, string) {
		var additionalAttributes = config_.br;
		return A2(
			$elm$html$Html$div,
			_Utils_ap(
				A2(
					$elm$core$List$filterMap,
					$elm$core$Basics$identity,
					_List_fromArray(
						[
							$author$project$Material$HelperText$helperTextCs,
							$author$project$Material$HelperText$persistentCs(config_),
							$author$project$Material$HelperText$validationCs(config_),
							$author$project$Material$HelperText$ariaHiddenAttr
						])),
				additionalAttributes),
			_List_fromArray(
				[
					$elm$html$Html$text(string)
				]));
	});
var $author$project$Material$HelperText$setPersistent = F2(
	function (persistent, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{bX: persistent});
	});
var $author$project$Demo$TextFields$demoHelperText = A2(
	$author$project$Material$HelperText$helperLine,
	_List_Nil,
	_List_fromArray(
		[
			A2(
			$author$project$Material$HelperText$helperText,
			A2($author$project$Material$HelperText$setPersistent, true, $author$project$Material$HelperText$config),
			'Helper Text')
		]));
var $author$project$Material$TextField$disabledCs = function (_v0) {
	var disabled = _v0.ad;
	return disabled ? $elm$core$Maybe$Just(
		$elm$html$Html$Attributes$class('mdc-text-field--disabled')) : $elm$core$Maybe$Nothing;
};
var $author$project$Material$TextField$disabledProp = function (_v0) {
	var disabled = _v0.ad;
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$Attributes$property,
			'disabled',
			$elm$json$Json$Encode$bool(disabled)));
};
var $author$project$Material$TextField$endAlignedCs = function (_v0) {
	var endAligned = _v0.bD;
	return endAligned ? $elm$core$Maybe$Just(
		$elm$html$Html$Attributes$class('mdc-text-field--end-aligned')) : $elm$core$Maybe$Nothing;
};
var $author$project$Material$TextField$filledCs = function (outlined_) {
	return (!outlined_) ? $elm$core$Maybe$Just(
		$elm$html$Html$Attributes$class('mdc-text-field--filled')) : $elm$core$Maybe$Nothing;
};
var $author$project$Material$TextField$foucClassNamesProp = $elm$core$Maybe$Just(
	A2(
		$elm$html$Html$Attributes$property,
		'foucClassNames',
		A2(
			$elm$json$Json$Encode$list,
			$elm$json$Json$Encode$string,
			_List_fromArray(
				['mdc-text-field--label-floating']))));
var $author$project$Material$TextField$fullwidthCs = function (_v0) {
	var fullwidth = _v0.aj;
	return fullwidth ? $elm$core$Maybe$Just(
		$elm$html$Html$Attributes$class('mdc-text-field--fullwidth')) : $elm$core$Maybe$Nothing;
};
var $author$project$Material$TextField$ariaLabelAttr = function (_v0) {
	var fullwidth = _v0.aj;
	var placeholder = _v0.bh;
	var label = _v0.b;
	return fullwidth ? A2(
		$elm$core$Maybe$map,
		$elm$html$Html$Attributes$attribute('aria-label'),
		label) : $elm$core$Maybe$Nothing;
};
var $author$project$Material$TextField$changeHandler = function (_v0) {
	var onChange = _v0.bb;
	return A2(
		$elm$core$Maybe$map,
		function (f) {
			return A2(
				$elm$html$Html$Events$on,
				'change',
				A2($elm$json$Json$Decode$map, f, $elm$html$Html$Events$targetValue));
		},
		onChange);
};
var $author$project$Material$TextField$inputCs = $elm$core$Maybe$Just(
	$elm$html$Html$Attributes$class('mdc-text-field__input'));
var $author$project$Material$TextField$inputHandler = function (_v0) {
	var onInput = _v0.bU;
	return A2($elm$core$Maybe$map, $elm$html$Html$Events$onInput, onInput);
};
var $author$project$Material$TextField$maxLengthAttr = function (_v0) {
	var maxLength = _v0.a4;
	return A2(
		$elm$core$Maybe$map,
		A2(
			$elm$core$Basics$composeL,
			$elm$html$Html$Attributes$attribute('maxLength'),
			$elm$core$String$fromInt),
		maxLength);
};
var $author$project$Material$TextField$minLengthAttr = function (_v0) {
	var minLength = _v0.a6;
	return A2(
		$elm$core$Maybe$map,
		A2(
			$elm$core$Basics$composeL,
			$elm$html$Html$Attributes$attribute('minLength'),
			$elm$core$String$fromInt),
		minLength);
};
var $elm$html$Html$Attributes$placeholder = $elm$html$Html$Attributes$stringProperty('placeholder');
var $author$project$Material$TextField$placeholderAttr = function (_v0) {
	var placeholder = _v0.bh;
	return A2($elm$core$Maybe$map, $elm$html$Html$Attributes$placeholder, placeholder);
};
var $author$project$Material$TextField$typeAttr = function (_v0) {
	var type_ = _v0.cc;
	return A2($elm$core$Maybe$map, $elm$html$Html$Attributes$type_, type_);
};
var $author$project$Material$TextField$inputElt = function (config_) {
	return A2(
		$elm$html$Html$input,
		A2(
			$elm$core$List$filterMap,
			$elm$core$Basics$identity,
			_List_fromArray(
				[
					$author$project$Material$TextField$inputCs,
					$author$project$Material$TextField$typeAttr(config_),
					$author$project$Material$TextField$ariaLabelAttr(config_),
					$author$project$Material$TextField$placeholderAttr(config_),
					$author$project$Material$TextField$inputHandler(config_),
					$author$project$Material$TextField$changeHandler(config_),
					$author$project$Material$TextField$minLengthAttr(config_),
					$author$project$Material$TextField$maxLengthAttr(config_)
				])),
		_List_Nil);
};
var $author$project$Material$TextField$labelElt = function (_v0) {
	var label = _v0.b;
	var value = _v0.bm;
	var fullwidth = _v0.aj;
	var floatingLabelFloatAboveCs = 'mdc-floating-label--float-above';
	var floatingLabelCs = 'mdc-floating-label';
	var _v1 = _Utils_Tuple2(fullwidth, label);
	if ((!_v1.a) && (!_v1.b.$)) {
		var str = _v1.b.a;
		return A2(
			$elm$html$Html$span,
			_List_fromArray(
				[
					(A2($elm$core$Maybe$withDefault, '', value) !== '') ? $elm$html$Html$Attributes$class(floatingLabelCs + (' ' + floatingLabelFloatAboveCs)) : $elm$html$Html$Attributes$class(floatingLabelCs),
					A2(
					$elm$html$Html$Attributes$property,
					'foucClassNames',
					A2(
						$elm$json$Json$Encode$list,
						$elm$json$Json$Encode$string,
						_List_fromArray(
							[floatingLabelFloatAboveCs])))
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(str)
				]));
	} else {
		return $elm$html$Html$text('');
	}
};
var $author$project$Material$TextField$labelFloatingCs = function (_v0) {
	var label = _v0.b;
	var value = _v0.bm;
	var fullwidth = _v0.aj;
	return ((!fullwidth) && ((!_Utils_eq(label, $elm$core$Maybe$Nothing)) && (A2($elm$core$Maybe$withDefault, '', value) !== ''))) ? $elm$core$Maybe$Just(
		$elm$html$Html$Attributes$class('mdc-text-field--label-floating')) : $elm$core$Maybe$Nothing;
};
var $author$project$Material$TextField$iconElt = F2(
	function (modifierCs, icon_) {
		if (icon_.$ === 1) {
			return $elm$html$Html$text('');
		} else {
			if (!icon_.a.$) {
				var node = icon_.a.a.a7;
				var attributes = icon_.a.a.aW;
				var nodes = icon_.a.a.a8;
				var onInteraction = icon_.a.a.cv;
				var disabled = icon_.a.a.ad;
				return A2(
					node,
					A2(
						$elm$core$List$cons,
						$elm$html$Html$Attributes$class('mdc-text-field__icon'),
						A2(
							$elm$core$List$cons,
							$elm$html$Html$Attributes$class(modifierCs),
							function () {
								if (!onInteraction.$) {
									var msg = onInteraction.a;
									return (!disabled) ? A2(
										$elm$core$List$cons,
										$elm$html$Html$Attributes$tabindex(0),
										A2(
											$elm$core$List$cons,
											A2($elm$html$Html$Attributes$attribute, 'role', 'button'),
											A2(
												$elm$core$List$cons,
												$elm$html$Html$Events$onClick(msg),
												A2(
													$elm$core$List$cons,
													A2(
														$elm$html$Html$Events$on,
														'keydown',
														A2(
															$elm$json$Json$Decode$andThen,
															function (keyCode) {
																return (keyCode === 13) ? $elm$json$Json$Decode$succeed(msg) : $elm$json$Json$Decode$fail('');
															},
															$elm$html$Html$Events$keyCode)),
													attributes)))) : A2(
										$elm$core$List$cons,
										$elm$html$Html$Attributes$tabindex(-1),
										A2(
											$elm$core$List$cons,
											A2($elm$html$Html$Attributes$attribute, 'role', 'button'),
											attributes));
								} else {
									return attributes;
								}
							}())),
					nodes);
			} else {
				var node = icon_.a.a.a7;
				var attributes = icon_.a.a.aW;
				var nodes = icon_.a.a.a8;
				var onInteraction = icon_.a.a.cv;
				var disabled = icon_.a.a.ad;
				return A2(
					node,
					A2(
						$elm$core$List$cons,
						$elm$svg$Svg$Attributes$class('mdc-text-field__icon'),
						A2(
							$elm$core$List$cons,
							$elm$svg$Svg$Attributes$class(modifierCs),
							function () {
								if (!onInteraction.$) {
									var msg = onInteraction.a;
									return (!disabled) ? A2(
										$elm$core$List$cons,
										$elm$html$Html$Attributes$tabindex(0),
										A2(
											$elm$core$List$cons,
											A2($elm$html$Html$Attributes$attribute, 'role', 'button'),
											A2(
												$elm$core$List$cons,
												$elm$html$Html$Events$onClick(msg),
												A2(
													$elm$core$List$cons,
													A2(
														$elm$html$Html$Events$on,
														'keydown',
														A2(
															$elm$json$Json$Decode$andThen,
															function (keyCode) {
																return (keyCode === 13) ? $elm$json$Json$Decode$succeed(msg) : $elm$json$Json$Decode$fail('');
															},
															$elm$html$Html$Events$keyCode)),
													attributes)))) : A2(
										$elm$core$List$cons,
										$elm$html$Html$Attributes$tabindex(-1),
										A2(
											$elm$core$List$cons,
											A2($elm$html$Html$Attributes$attribute, 'role', 'button'),
											attributes));
								} else {
									return attributes;
								}
							}())),
					nodes);
			}
		}
	});
var $author$project$Material$TextField$leadingIconElt = function (_v0) {
	var leadingIcon = _v0.cr;
	return A2($author$project$Material$TextField$iconElt, 'mdc-text-field__icon--leading', leadingIcon);
};
var $author$project$Material$TextField$lineRippleElt = A2(
	$elm$html$Html$span,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('mdc-line-ripple')
		]),
	_List_Nil);
var $author$project$Material$TextField$maxLengthProp = function (_v0) {
	var maxLength = _v0.a4;
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$Attributes$property,
			'maxLength',
			$elm$json$Json$Encode$int(
				A2($elm$core$Maybe$withDefault, -1, maxLength))));
};
var $author$project$Material$TextField$maxProp = function (_v0) {
	var max = _v0.a3;
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$Attributes$property,
			'max',
			$elm$json$Json$Encode$string(
				A2(
					$elm$core$Maybe$withDefault,
					'',
					A2($elm$core$Maybe$map, $elm$core$String$fromInt, max)))));
};
var $author$project$Material$TextField$minLengthProp = function (_v0) {
	var minLength = _v0.a6;
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$Attributes$property,
			'minLength',
			$elm$json$Json$Encode$int(
				A2($elm$core$Maybe$withDefault, -1, minLength))));
};
var $author$project$Material$TextField$minProp = function (_v0) {
	var min = _v0.a5;
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$Attributes$property,
			'min',
			$elm$json$Json$Encode$string(
				A2(
					$elm$core$Maybe$withDefault,
					'',
					A2($elm$core$Maybe$map, $elm$core$String$fromInt, min)))));
};
var $author$project$Material$TextField$noLabelCs = function (_v0) {
	var label = _v0.b;
	return _Utils_eq(label, $elm$core$Maybe$Nothing) ? $elm$core$Maybe$Just(
		$elm$html$Html$Attributes$class('mdc-text-field--no-label')) : $elm$core$Maybe$Nothing;
};
var $author$project$Material$TextField$notchedOutlineLeadingElt = A2(
	$elm$html$Html$span,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('mdc-notched-outline__leading')
		]),
	_List_Nil);
var $author$project$Material$TextField$notchedOutlineNotchElt = function (config_) {
	return A2(
		$elm$html$Html$span,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('mdc-notched-outline__notch')
			]),
		_List_fromArray(
			[
				$author$project$Material$TextField$labelElt(config_)
			]));
};
var $author$project$Material$TextField$notchedOutlineTrailingElt = A2(
	$elm$html$Html$span,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('mdc-notched-outline__trailing')
		]),
	_List_Nil);
var $author$project$Material$TextField$notchedOutlineElt = function (config_) {
	return A2(
		$elm$html$Html$span,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('mdc-notched-outline')
			]),
		_List_fromArray(
			[
				$author$project$Material$TextField$notchedOutlineLeadingElt,
				$author$project$Material$TextField$notchedOutlineNotchElt(config_),
				$author$project$Material$TextField$notchedOutlineTrailingElt
			]));
};
var $author$project$Material$TextField$outlinedCs = function (outlined_) {
	return outlined_ ? $elm$core$Maybe$Just(
		$elm$html$Html$Attributes$class('mdc-text-field--outlined')) : $elm$core$Maybe$Nothing;
};
var $elm$json$Json$Encode$null = _Json_encodeNull;
var $author$project$Material$TextField$patternProp = function (_v0) {
	var pattern = _v0.bW;
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$Attributes$property,
			'pattern',
			A2(
				$elm$core$Maybe$withDefault,
				$elm$json$Json$Encode$null,
				A2($elm$core$Maybe$map, $elm$json$Json$Encode$string, pattern))));
};
var $author$project$Material$TextField$prefixCs = $elm$html$Html$Attributes$class('mdc-text-field__affix mdc-text-field__affix--prefix');
var $author$project$Material$TextField$prefixElt = function (_v0) {
	var prefix = _v0.bY;
	if (!prefix.$) {
		var prefixStr = prefix.a;
		return A2(
			$elm$html$Html$span,
			_List_fromArray(
				[$author$project$Material$TextField$prefixCs]),
			_List_fromArray(
				[
					$elm$html$Html$text(prefixStr)
				]));
	} else {
		return $elm$html$Html$text('');
	}
};
var $author$project$Material$TextField$requiredProp = function (_v0) {
	var required = _v0.b$;
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$Attributes$property,
			'required',
			$elm$json$Json$Encode$bool(required)));
};
var $author$project$Material$TextField$rippleElt = A2(
	$elm$html$Html$span,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('mdc-text-field__ripple')
		]),
	_List_Nil);
var $author$project$Material$TextField$rootCs = $elm$core$Maybe$Just(
	$elm$html$Html$Attributes$class('mdc-text-field'));
var $author$project$Material$TextField$stepProp = function (_v0) {
	var step = _v0.b5;
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$Attributes$property,
			'step',
			$elm$json$Json$Encode$string(
				A2(
					$elm$core$Maybe$withDefault,
					'',
					A2($elm$core$Maybe$map, $elm$core$String$fromInt, step)))));
};
var $author$project$Material$TextField$suffixCs = $elm$html$Html$Attributes$class('mdc-text-field__affix mdc-text-field__affix--suffix');
var $author$project$Material$TextField$suffixElt = function (_v0) {
	var suffix = _v0.b7;
	if (!suffix.$) {
		var suffixStr = suffix.a;
		return A2(
			$elm$html$Html$span,
			_List_fromArray(
				[$author$project$Material$TextField$suffixCs]),
			_List_fromArray(
				[
					$elm$html$Html$text(suffixStr)
				]));
	} else {
		return $elm$html$Html$text('');
	}
};
var $author$project$Material$TextField$trailingIconElt = function (_v0) {
	var trailingIcon = _v0.bl;
	return A2($author$project$Material$TextField$iconElt, 'mdc-text-field__icon--trailing', trailingIcon);
};
var $author$project$Material$TextField$validProp = function (_v0) {
	var valid = _v0.cd;
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$Attributes$property,
			'valid',
			$elm$json$Json$Encode$bool(valid)));
};
var $author$project$Material$TextField$valueProp = function (_v0) {
	var value = _v0.bm;
	return A2(
		$elm$core$Maybe$map,
		A2(
			$elm$core$Basics$composeL,
			$elm$html$Html$Attributes$property('value'),
			$elm$json$Json$Encode$string),
		value);
};
var $author$project$Material$TextField$withLeadingIconCs = function (_v0) {
	var leadingIcon = _v0.cr;
	return (!_Utils_eq(leadingIcon, $elm$core$Maybe$Nothing)) ? $elm$core$Maybe$Just(
		$elm$html$Html$Attributes$class('mdc-text-field--with-leading-icon')) : $elm$core$Maybe$Nothing;
};
var $author$project$Material$TextField$withTrailingIconCs = function (_v0) {
	var trailingIcon = _v0.bl;
	return (!_Utils_eq(trailingIcon, $elm$core$Maybe$Nothing)) ? $elm$core$Maybe$Just(
		$elm$html$Html$Attributes$class('mdc-text-field--with-trailing-icon')) : $elm$core$Maybe$Nothing;
};
var $author$project$Material$TextField$textField = F2(
	function (outlined_, config_) {
		var additionalAttributes = config_.br;
		var fullwidth = config_.aj;
		return A3(
			$elm$html$Html$node,
			'mdc-text-field',
			_Utils_ap(
				A2(
					$elm$core$List$filterMap,
					$elm$core$Basics$identity,
					_List_fromArray(
						[
							$author$project$Material$TextField$rootCs,
							$author$project$Material$TextField$noLabelCs(config_),
							$author$project$Material$TextField$filledCs(outlined_),
							$author$project$Material$TextField$outlinedCs(outlined_),
							$author$project$Material$TextField$fullwidthCs(config_),
							$author$project$Material$TextField$labelFloatingCs(config_),
							$author$project$Material$TextField$foucClassNamesProp,
							$author$project$Material$TextField$disabledCs(config_),
							$author$project$Material$TextField$withLeadingIconCs(config_),
							$author$project$Material$TextField$withTrailingIconCs(config_),
							$author$project$Material$TextField$endAlignedCs(config_),
							$author$project$Material$TextField$valueProp(config_),
							$author$project$Material$TextField$disabledProp(config_),
							$author$project$Material$TextField$requiredProp(config_),
							$author$project$Material$TextField$validProp(config_),
							$author$project$Material$TextField$patternProp(config_),
							$author$project$Material$TextField$minLengthProp(config_),
							$author$project$Material$TextField$maxLengthProp(config_),
							$author$project$Material$TextField$minProp(config_),
							$author$project$Material$TextField$maxProp(config_),
							$author$project$Material$TextField$stepProp(config_)
						])),
				additionalAttributes),
			outlined_ ? _List_fromArray(
				[
					$author$project$Material$TextField$leadingIconElt(config_),
					$author$project$Material$TextField$prefixElt(config_),
					$author$project$Material$TextField$inputElt(config_),
					$author$project$Material$TextField$suffixElt(config_),
					$author$project$Material$TextField$notchedOutlineElt(config_),
					$author$project$Material$TextField$trailingIconElt(config_)
				]) : _List_fromArray(
				[
					$author$project$Material$TextField$rippleElt,
					$author$project$Material$TextField$leadingIconElt(config_),
					$author$project$Material$TextField$prefixElt(config_),
					$author$project$Material$TextField$inputElt(config_),
					$author$project$Material$TextField$suffixElt(config_),
					$author$project$Material$TextField$labelElt(config_),
					$author$project$Material$TextField$lineRippleElt,
					$author$project$Material$TextField$trailingIconElt(config_)
				]));
	});
var $author$project$Material$TextField$filled = function (config_) {
	return A2($author$project$Material$TextField$textField, false, config_);
};
var $author$project$Material$TextField$setEndAligned = F2(
	function (endAligned, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{bD: endAligned});
	});
var $author$project$Material$TextField$setLabel = F2(
	function (label, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{b: label});
	});
var $author$project$Material$TextField$setPrefix = F2(
	function (prefix, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{bY: prefix});
	});
var $author$project$Material$TextField$setSuffix = F2(
	function (suffix, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{b7: suffix});
	});
var $author$project$Demo$TextFields$textFieldContainer = _List_fromArray(
	[
		$elm$html$Html$Attributes$class('text-field-container'),
		A2($elm$html$Html$Attributes$style, 'min-width', '200px')
	]);
var $author$project$Demo$TextFields$textFieldRow = _List_fromArray(
	[
		$elm$html$Html$Attributes$class('text-field-row'),
		A2($elm$html$Html$Attributes$style, 'display', 'flex'),
		A2($elm$html$Html$Attributes$style, 'align-items', 'flex-start'),
		A2($elm$html$Html$Attributes$style, 'justify-content', 'space-between'),
		A2($elm$html$Html$Attributes$style, 'flex-wrap', 'wrap')
	]);
var $author$project$Demo$TextFields$affixedFilledTextFields = function (model) {
	return A2(
		$elm$html$Html$div,
		$author$project$Demo$TextFields$textFieldRow,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				$author$project$Demo$TextFields$textFieldContainer,
				_List_fromArray(
					[
						$author$project$Material$TextField$filled(
						A2(
							$author$project$Material$TextField$setPrefix,
							$elm$core$Maybe$Just('$'),
							A2(
								$author$project$Material$TextField$setLabel,
								$elm$core$Maybe$Just('Standard'),
								$author$project$Material$TextField$config))),
						$author$project$Demo$TextFields$demoHelperText
					])),
				A2(
				$elm$html$Html$div,
				$author$project$Demo$TextFields$textFieldContainer,
				_List_fromArray(
					[
						$author$project$Material$TextField$filled(
						A2(
							$author$project$Material$TextField$setSuffix,
							$elm$core$Maybe$Just('kg'),
							A2(
								$author$project$Material$TextField$setLabel,
								$elm$core$Maybe$Just('Standard'),
								$author$project$Material$TextField$config))),
						$author$project$Demo$TextFields$demoHelperText
					])),
				A2(
				$elm$html$Html$div,
				$author$project$Demo$TextFields$textFieldContainer,
				_List_fromArray(
					[
						$author$project$Material$TextField$filled(
						A2(
							$author$project$Material$TextField$setEndAligned,
							true,
							A2(
								$author$project$Material$TextField$setSuffix,
								$elm$core$Maybe$Just('.00'),
								A2(
									$author$project$Material$TextField$setPrefix,
									$elm$core$Maybe$Just('$'),
									A2(
										$author$project$Material$TextField$setLabel,
										$elm$core$Maybe$Just('Standard'),
										$author$project$Material$TextField$config))))),
						$author$project$Demo$TextFields$demoHelperText
					]))
			]));
};
var $author$project$Demo$TextFields$Interacted = {$: 0};
var $author$project$Material$TextField$Icon$Internal$Icon = function (a) {
	return {$: 0, a: a};
};
var $author$project$Material$TextField$Icon$customIcon = F3(
	function (node, attributes, nodes) {
		return $author$project$Material$TextField$Icon$Internal$Icon(
			{aW: attributes, ad: false, a7: node, a8: nodes, cv: $elm$core$Maybe$Nothing});
	});
var $author$project$Material$TextField$Icon$icon = function (iconName) {
	return A3(
		$author$project$Material$TextField$Icon$customIcon,
		$elm$html$Html$i,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('material-icons')
			]),
		_List_fromArray(
			[
				$elm$html$Html$text(iconName)
			]));
};
var $author$project$Material$TextField$setLeadingIcon = F2(
	function (leadingIcon, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{cr: leadingIcon});
	});
var $author$project$Material$TextField$Icon$Internal$SvgIcon = function (a) {
	return {$: 1, a: a};
};
var $author$project$Material$TextField$Icon$setOnInteraction = F2(
	function (onInteraction, icon_) {
		if (!icon_.$) {
			var data = icon_.a;
			return $author$project$Material$TextField$Icon$Internal$Icon(
				_Utils_update(
					data,
					{
						cv: $elm$core$Maybe$Just(onInteraction)
					}));
		} else {
			var data = icon_.a;
			return $author$project$Material$TextField$Icon$Internal$SvgIcon(
				_Utils_update(
					data,
					{
						cv: $elm$core$Maybe$Just(onInteraction)
					}));
		}
	});
var $author$project$Material$TextField$setTrailingIcon = F2(
	function (trailingIcon, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{bl: trailingIcon});
	});
var $author$project$Demo$TextFields$filledTextFields = function (model) {
	return A2(
		$elm$html$Html$div,
		$author$project$Demo$TextFields$textFieldRow,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				$author$project$Demo$TextFields$textFieldContainer,
				_List_fromArray(
					[
						$author$project$Material$TextField$filled(
						A2(
							$author$project$Material$TextField$setLabel,
							$elm$core$Maybe$Just('Standard'),
							$author$project$Material$TextField$config)),
						$author$project$Demo$TextFields$demoHelperText
					])),
				A2(
				$elm$html$Html$div,
				$author$project$Demo$TextFields$textFieldContainer,
				_List_fromArray(
					[
						$author$project$Material$TextField$filled(
						A2(
							$author$project$Material$TextField$setLeadingIcon,
							$elm$core$Maybe$Just(
								$author$project$Material$TextField$Icon$icon('event')),
							A2(
								$author$project$Material$TextField$setLabel,
								$elm$core$Maybe$Just('Standard'),
								$author$project$Material$TextField$config))),
						$author$project$Demo$TextFields$demoHelperText
					])),
				A2(
				$elm$html$Html$div,
				$author$project$Demo$TextFields$textFieldContainer,
				_List_fromArray(
					[
						$author$project$Material$TextField$filled(
						A2(
							$author$project$Material$TextField$setTrailingIcon,
							$elm$core$Maybe$Just(
								A2(
									$author$project$Material$TextField$Icon$setOnInteraction,
									$author$project$Demo$TextFields$Interacted,
									$author$project$Material$TextField$Icon$icon('delete'))),
							A2(
								$author$project$Material$TextField$setLabel,
								$elm$core$Maybe$Just('Standard'),
								$author$project$Material$TextField$config))),
						$author$project$Demo$TextFields$demoHelperText
					]))
			]));
};
var $author$project$Demo$TextFields$Focus = function (a) {
	return {$: 1, a: a};
};
var $author$project$Material$TextField$setAttributes = F2(
	function (additionalAttributes, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{br: additionalAttributes});
	});
var $author$project$Demo$TextFields$focusTextField = A2(
	$elm$html$Html$div,
	_List_Nil,
	_List_fromArray(
		[
			$author$project$Material$TextField$filled(
			A2(
				$author$project$Material$TextField$setAttributes,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$id('my-text-field')
					]),
				$author$project$Material$TextField$config)),
			$elm$html$Html$text('\u00A0'),
			A2(
			$author$project$Material$Button$raised,
			A2(
				$author$project$Material$Button$setOnClick,
				$author$project$Demo$TextFields$Focus('my-text-field'),
				$author$project$Material$Button$config),
			'Focus')
		]));
var $author$project$Material$TextField$setFullwidth = F2(
	function (fullwidth, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{aj: fullwidth});
	});
var $author$project$Material$TextField$setPlaceholder = F2(
	function (placeholder, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{bh: placeholder});
	});
var $author$project$Demo$TextFields$fullwidthTextField = function (model) {
	return A2(
		$elm$html$Html$div,
		$author$project$Demo$TextFields$textFieldContainer,
		_List_fromArray(
			[
				$author$project$Material$TextField$filled(
				A2(
					$author$project$Material$TextField$setFullwidth,
					true,
					A2(
						$author$project$Material$TextField$setPlaceholder,
						$elm$core$Maybe$Just('Standard'),
						$author$project$Material$TextField$config))),
				$author$project$Demo$TextFields$demoHelperText
			]));
};
var $author$project$Material$TextArea$Config = $elm$core$Basics$identity;
var $author$project$Material$TextArea$config = {br: _List_Nil, by: $elm$core$Maybe$Nothing, ad: false, aj: false, b: $elm$core$Maybe$Nothing, a4: $elm$core$Maybe$Nothing, a6: $elm$core$Maybe$Nothing, bb: $elm$core$Maybe$Nothing, bU: $elm$core$Maybe$Nothing, bh: $elm$core$Maybe$Nothing, b$: false, b1: $elm$core$Maybe$Nothing, cd: true, bm: $elm$core$Maybe$Nothing};
var $author$project$Material$TextArea$disabledCs = function (_v0) {
	var disabled = _v0.ad;
	return disabled ? $elm$core$Maybe$Just(
		$elm$html$Html$Attributes$class('mdc-text-field--disabled')) : $elm$core$Maybe$Nothing;
};
var $author$project$Material$TextArea$disabledProp = function (_v0) {
	var disabled = _v0.ad;
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$Attributes$property,
			'disabled',
			$elm$json$Json$Encode$bool(disabled)));
};
var $author$project$Material$TextArea$fullwidthCs = function (_v0) {
	var fullwidth = _v0.aj;
	return fullwidth ? $elm$core$Maybe$Just(
		$elm$html$Html$Attributes$class('mdc-text-field--fullwidth')) : $elm$core$Maybe$Nothing;
};
var $author$project$Material$TextArea$ariaLabelAttr = function (_v0) {
	var fullwidth = _v0.aj;
	var placeholder = _v0.bh;
	var label = _v0.b;
	return fullwidth ? A2(
		$elm$core$Maybe$map,
		$elm$html$Html$Attributes$attribute('aria-label'),
		label) : $elm$core$Maybe$Nothing;
};
var $author$project$Material$TextArea$changeHandler = function (_v0) {
	var onChange = _v0.bb;
	return A2(
		$elm$core$Maybe$map,
		function (f) {
			return A2(
				$elm$html$Html$Events$on,
				'change',
				A2($elm$json$Json$Decode$map, f, $elm$html$Html$Events$targetValue));
		},
		onChange);
};
var $elm$html$Html$Attributes$cols = function (n) {
	return A2(
		_VirtualDom_attribute,
		'cols',
		$elm$core$String$fromInt(n));
};
var $author$project$Material$TextArea$colsAttr = function (_v0) {
	var cols = _v0.by;
	return A2($elm$core$Maybe$map, $elm$html$Html$Attributes$cols, cols);
};
var $author$project$Material$TextArea$inputCs = $elm$core$Maybe$Just(
	$elm$html$Html$Attributes$class('mdc-text-field__input'));
var $author$project$Material$TextArea$inputHandler = function (_v0) {
	var onInput = _v0.bU;
	return A2($elm$core$Maybe$map, $elm$html$Html$Events$onInput, onInput);
};
var $author$project$Material$TextArea$maxLengthAttr = function (_v0) {
	var maxLength = _v0.a4;
	return A2(
		$elm$core$Maybe$map,
		A2(
			$elm$core$Basics$composeL,
			$elm$html$Html$Attributes$attribute('maxLength'),
			$elm$core$String$fromInt),
		maxLength);
};
var $author$project$Material$TextArea$minLengthAttr = function (_v0) {
	var minLength = _v0.a6;
	return A2(
		$elm$core$Maybe$map,
		A2(
			$elm$core$Basics$composeL,
			$elm$html$Html$Attributes$attribute('minLength'),
			$elm$core$String$fromInt),
		minLength);
};
var $author$project$Material$TextArea$placeholderAttr = function (_v0) {
	var placeholder = _v0.bh;
	return A2($elm$core$Maybe$map, $elm$html$Html$Attributes$placeholder, placeholder);
};
var $elm$html$Html$Attributes$rows = function (n) {
	return A2(
		_VirtualDom_attribute,
		'rows',
		$elm$core$String$fromInt(n));
};
var $author$project$Material$TextArea$rowsAttr = function (_v0) {
	var rows = _v0.b1;
	return A2($elm$core$Maybe$map, $elm$html$Html$Attributes$rows, rows);
};
var $elm$html$Html$textarea = _VirtualDom_node('textarea');
var $author$project$Material$TextArea$inputElt = function (config_) {
	return A2(
		$elm$html$Html$textarea,
		A2(
			$elm$core$List$filterMap,
			$elm$core$Basics$identity,
			_List_fromArray(
				[
					$author$project$Material$TextArea$inputCs,
					$author$project$Material$TextArea$ariaLabelAttr(config_),
					$author$project$Material$TextArea$rowsAttr(config_),
					$author$project$Material$TextArea$colsAttr(config_),
					$author$project$Material$TextArea$placeholderAttr(config_),
					$author$project$Material$TextArea$inputHandler(config_),
					$author$project$Material$TextArea$changeHandler(config_),
					$author$project$Material$TextArea$minLengthAttr(config_),
					$author$project$Material$TextArea$maxLengthAttr(config_)
				])),
		_List_Nil);
};
var $author$project$Material$TextArea$maxLengthProp = function (_v0) {
	var maxLength = _v0.a4;
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$Attributes$property,
			'maxLength',
			$elm$json$Json$Encode$int(
				A2($elm$core$Maybe$withDefault, -1, maxLength))));
};
var $author$project$Material$TextArea$minLengthProp = function (_v0) {
	var minLength = _v0.a6;
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$Attributes$property,
			'minLength',
			$elm$json$Json$Encode$int(
				A2($elm$core$Maybe$withDefault, -1, minLength))));
};
var $author$project$Material$TextArea$noLabelCs = function (_v0) {
	var label = _v0.b;
	return _Utils_eq(label, $elm$core$Maybe$Nothing) ? $elm$core$Maybe$Just(
		$elm$html$Html$Attributes$class('mdc-text-field--no-label')) : $elm$core$Maybe$Nothing;
};
var $author$project$Material$TextArea$notchedOutlineLeadingElt = A2(
	$elm$html$Html$div,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('mdc-notched-outline__leading')
		]),
	_List_Nil);
var $author$project$Material$TextArea$labelElt = function (_v0) {
	var label = _v0.b;
	var value = _v0.bm;
	var floatingLabelFloatAboveCs = 'mdc-floating-label--float-above';
	var floatingLabelCs = 'mdc-floating-label';
	if (!label.$) {
		var str = label.a;
		return A2(
			$elm$html$Html$span,
			_List_fromArray(
				[
					(A2($elm$core$Maybe$withDefault, '', value) !== '') ? $elm$html$Html$Attributes$class(floatingLabelCs + (' ' + floatingLabelFloatAboveCs)) : $elm$html$Html$Attributes$class(floatingLabelCs),
					A2(
					$elm$html$Html$Attributes$property,
					'foucClassNames',
					A2(
						$elm$json$Json$Encode$list,
						$elm$json$Json$Encode$string,
						_List_fromArray(
							[floatingLabelFloatAboveCs])))
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(str)
				]));
	} else {
		return $elm$html$Html$text('');
	}
};
var $author$project$Material$TextArea$notchedOutlineNotchElt = function (config_) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('mdc-notched-outline__notch')
			]),
		_List_fromArray(
			[
				$author$project$Material$TextArea$labelElt(config_)
			]));
};
var $author$project$Material$TextArea$notchedOutlineTrailingElt = A2(
	$elm$html$Html$div,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('mdc-notched-outline__trailing')
		]),
	_List_Nil);
var $author$project$Material$TextArea$notchedOutlineElt = function (config_) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('mdc-notched-outline')
			]),
		_List_fromArray(
			[
				$author$project$Material$TextArea$notchedOutlineLeadingElt,
				$author$project$Material$TextArea$notchedOutlineNotchElt(config_),
				$author$project$Material$TextArea$notchedOutlineTrailingElt
			]));
};
var $author$project$Material$TextArea$outlinedCs = function (outlined_) {
	return outlined_ ? $elm$core$Maybe$Just(
		$elm$html$Html$Attributes$class('mdc-text-field--outlined')) : $elm$core$Maybe$Nothing;
};
var $author$project$Material$TextArea$requiredProp = function (_v0) {
	var required = _v0.b$;
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$Attributes$property,
			'required',
			$elm$json$Json$Encode$bool(required)));
};
var $author$project$Material$TextArea$rootCs = $elm$core$Maybe$Just(
	$elm$html$Html$Attributes$class('mdc-text-field mdc-text-field--textarea'));
var $author$project$Material$TextArea$validProp = function (_v0) {
	var valid = _v0.cd;
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$Attributes$property,
			'valid',
			$elm$json$Json$Encode$bool(valid)));
};
var $author$project$Material$TextArea$valueProp = function (_v0) {
	var value = _v0.bm;
	return A2(
		$elm$core$Maybe$map,
		A2(
			$elm$core$Basics$composeL,
			$elm$html$Html$Attributes$property('value'),
			$elm$json$Json$Encode$string),
		value);
};
var $author$project$Material$TextArea$textArea = F2(
	function (outlined_, config_) {
		var additionalAttributes = config_.br;
		var fullwidth = config_.aj;
		return A3(
			$elm$html$Html$node,
			'mdc-text-field',
			_Utils_ap(
				A2(
					$elm$core$List$filterMap,
					$elm$core$Basics$identity,
					_List_fromArray(
						[
							$author$project$Material$TextArea$rootCs,
							$author$project$Material$TextArea$noLabelCs(config_),
							$author$project$Material$TextArea$outlinedCs(outlined_),
							$author$project$Material$TextArea$fullwidthCs(config_),
							$author$project$Material$TextArea$disabledCs(config_),
							$author$project$Material$TextArea$valueProp(config_),
							$author$project$Material$TextArea$disabledProp(config_),
							$author$project$Material$TextArea$requiredProp(config_),
							$author$project$Material$TextArea$validProp(config_),
							$author$project$Material$TextArea$minLengthProp(config_),
							$author$project$Material$TextArea$maxLengthProp(config_)
						])),
				additionalAttributes),
			_List_fromArray(
				[
					$author$project$Material$TextArea$inputElt(config_),
					$author$project$Material$TextArea$notchedOutlineElt(config_)
				]));
	});
var $author$project$Material$TextArea$outlined = function (config_) {
	return A2($author$project$Material$TextArea$textArea, true, config_);
};
var $author$project$Material$TextArea$setFullwidth = F2(
	function (fullwidth, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{aj: fullwidth});
	});
var $author$project$Material$TextArea$setLabel = F2(
	function (label, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{b: label});
	});
var $author$project$Demo$TextFields$textFieldRowFullwidth = _List_fromArray(
	[
		$elm$html$Html$Attributes$class('text-field-row text-field-row--fullwidth'),
		A2($elm$html$Html$Attributes$style, 'display', 'block')
	]);
var $author$project$Demo$TextFields$fullwidthTextareaTextField = function (model) {
	return A2(
		$elm$html$Html$div,
		$author$project$Demo$TextFields$textFieldRowFullwidth,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				$author$project$Demo$TextFields$textFieldContainer,
				_List_fromArray(
					[
						$author$project$Material$TextArea$outlined(
						A2(
							$author$project$Material$TextArea$setFullwidth,
							true,
							A2(
								$author$project$Material$TextArea$setLabel,
								$elm$core$Maybe$Just('Standard'),
								$author$project$Material$TextArea$config))),
						$author$project$Demo$TextFields$demoHelperText
					]))
			]));
};
var $author$project$Demo$TextFields$heroTextFieldContainer = _List_fromArray(
	[
		$elm$html$Html$Attributes$class('hero-text-field-container'),
		A2($elm$html$Html$Attributes$style, 'display', '-ms-flexbox'),
		A2($elm$html$Html$Attributes$style, 'display', 'flex'),
		A2($elm$html$Html$Attributes$style, '-ms-flex', '1 1 100%'),
		A2($elm$html$Html$Attributes$style, 'flex', '1 1 100%'),
		A2($elm$html$Html$Attributes$style, '-ms-flex-pack', 'distribute'),
		A2($elm$html$Html$Attributes$style, 'justify-content', 'space-around'),
		A2($elm$html$Html$Attributes$style, '-ms-flex-wrap', 'wrap'),
		A2($elm$html$Html$Attributes$style, 'flex-wrap', 'wrap')
	]);
var $author$project$Material$TextField$outlined = function (config_) {
	return A2($author$project$Material$TextField$textField, true, config_);
};
var $author$project$Demo$TextFields$textFieldContainerHero = A2(
	$elm$core$List$cons,
	A2($elm$html$Html$Attributes$style, 'padding', '20px'),
	$author$project$Demo$TextFields$textFieldContainer);
var $author$project$Demo$TextFields$heroTextFields = function (model) {
	return A2(
		$elm$html$Html$div,
		$author$project$Demo$TextFields$heroTextFieldContainer,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				$author$project$Demo$TextFields$textFieldContainerHero,
				_List_fromArray(
					[
						$author$project$Material$TextField$filled(
						A2(
							$author$project$Material$TextField$setLabel,
							$elm$core$Maybe$Just('Standard'),
							$author$project$Material$TextField$config))
					])),
				A2(
				$elm$html$Html$div,
				$author$project$Demo$TextFields$textFieldContainerHero,
				_List_fromArray(
					[
						$author$project$Material$TextField$outlined(
						A2(
							$author$project$Material$TextField$setLabel,
							$elm$core$Maybe$Just('Standard'),
							$author$project$Material$TextField$config))
					]))
			]));
};
var $author$project$Demo$TextFields$outlinedTextFields = function (model) {
	return A2(
		$elm$html$Html$div,
		$author$project$Demo$TextFields$textFieldRow,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				$author$project$Demo$TextFields$textFieldContainer,
				_List_fromArray(
					[
						$author$project$Material$TextField$outlined(
						A2(
							$author$project$Material$TextField$setLabel,
							$elm$core$Maybe$Just('Standard'),
							$author$project$Material$TextField$config)),
						$author$project$Demo$TextFields$demoHelperText
					])),
				A2(
				$elm$html$Html$div,
				$author$project$Demo$TextFields$textFieldContainer,
				_List_fromArray(
					[
						$author$project$Material$TextField$outlined(
						A2(
							$author$project$Material$TextField$setLeadingIcon,
							$elm$core$Maybe$Just(
								$author$project$Material$TextField$Icon$icon('event')),
							A2(
								$author$project$Material$TextField$setLabel,
								$elm$core$Maybe$Just('Standard'),
								$author$project$Material$TextField$config))),
						$author$project$Demo$TextFields$demoHelperText
					])),
				A2(
				$elm$html$Html$div,
				$author$project$Demo$TextFields$textFieldContainer,
				_List_fromArray(
					[
						$author$project$Material$TextField$outlined(
						A2(
							$author$project$Material$TextField$setTrailingIcon,
							$elm$core$Maybe$Just(
								A2(
									$author$project$Material$TextField$Icon$setOnInteraction,
									$author$project$Demo$TextFields$Interacted,
									$author$project$Material$TextField$Icon$icon('delete'))),
							A2(
								$author$project$Material$TextField$setLabel,
								$elm$core$Maybe$Just('Standard'),
								$author$project$Material$TextField$config))),
						$author$project$Demo$TextFields$demoHelperText
					]))
			]));
};
var $author$project$Demo$TextFields$shapedFilledTextFields = function (model) {
	return A2(
		$elm$html$Html$div,
		$author$project$Demo$TextFields$textFieldRow,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				$author$project$Demo$TextFields$textFieldContainer,
				_List_fromArray(
					[
						$author$project$Material$TextField$filled(
						A2(
							$author$project$Material$TextField$setAttributes,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'border-radius', '16px 16px 0 0')
								]),
							A2(
								$author$project$Material$TextField$setLabel,
								$elm$core$Maybe$Just('Standard'),
								$author$project$Material$TextField$config))),
						$author$project$Demo$TextFields$demoHelperText
					])),
				A2(
				$elm$html$Html$div,
				$author$project$Demo$TextFields$textFieldContainer,
				_List_fromArray(
					[
						$author$project$Material$TextField$filled(
						A2(
							$author$project$Material$TextField$setAttributes,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'border-radius', '16px 16px 0 0')
								]),
							A2(
								$author$project$Material$TextField$setLeadingIcon,
								$elm$core$Maybe$Just(
									$author$project$Material$TextField$Icon$icon('event')),
								A2(
									$author$project$Material$TextField$setLabel,
									$elm$core$Maybe$Just('Standard'),
									$author$project$Material$TextField$config)))),
						$author$project$Demo$TextFields$demoHelperText
					])),
				A2(
				$elm$html$Html$div,
				$author$project$Demo$TextFields$textFieldContainer,
				_List_fromArray(
					[
						$author$project$Material$TextField$filled(
						A2(
							$author$project$Material$TextField$setAttributes,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'border-radius', '16px 16px 0 0')
								]),
							A2(
								$author$project$Material$TextField$setTrailingIcon,
								$elm$core$Maybe$Just(
									A2(
										$author$project$Material$TextField$Icon$setOnInteraction,
										$author$project$Demo$TextFields$Interacted,
										$author$project$Material$TextField$Icon$icon('delete'))),
								A2(
									$author$project$Material$TextField$setLabel,
									$elm$core$Maybe$Just('Standard'),
									$author$project$Material$TextField$config)))),
						$author$project$Demo$TextFields$demoHelperText
					]))
			]));
};
var $author$project$Demo$TextFields$shapedOutlinedTextFields = function (model) {
	return A2(
		$elm$html$Html$div,
		$author$project$Demo$TextFields$textFieldRow,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				$author$project$Demo$TextFields$textFieldContainer,
				_List_fromArray(
					[
						$author$project$Material$TextField$outlined(
						A2(
							$author$project$Material$TextField$setLabel,
							$elm$core$Maybe$Just('Standard'),
							$author$project$Material$TextField$config)),
						$author$project$Demo$TextFields$demoHelperText
					])),
				A2(
				$elm$html$Html$div,
				$author$project$Demo$TextFields$textFieldContainer,
				_List_fromArray(
					[
						$author$project$Material$TextField$outlined(
						A2(
							$author$project$Material$TextField$setLeadingIcon,
							$elm$core$Maybe$Just(
								$author$project$Material$TextField$Icon$icon('event')),
							A2(
								$author$project$Material$TextField$setLabel,
								$elm$core$Maybe$Just('Standard'),
								$author$project$Material$TextField$config))),
						$author$project$Demo$TextFields$demoHelperText
					])),
				A2(
				$elm$html$Html$div,
				$author$project$Demo$TextFields$textFieldContainer,
				_List_fromArray(
					[
						$author$project$Material$TextField$outlined(
						A2(
							$author$project$Material$TextField$setTrailingIcon,
							$elm$core$Maybe$Just(
								A2(
									$author$project$Material$TextField$Icon$setOnInteraction,
									$author$project$Demo$TextFields$Interacted,
									$author$project$Material$TextField$Icon$icon('delete'))),
							A2(
								$author$project$Material$TextField$setLabel,
								$elm$core$Maybe$Just('Standard'),
								$author$project$Material$TextField$config))),
						$author$project$Demo$TextFields$demoHelperText
					]))
			]));
};
var $author$project$Material$HelperText$characterCounterCs = $elm$html$Html$Attributes$class('mdc-text-field-character-counter');
var $author$project$Material$HelperText$characterCounter = function (additionalAttributes) {
	return A2(
		$elm$html$Html$div,
		A2($elm$core$List$cons, $author$project$Material$HelperText$characterCounterCs, additionalAttributes),
		_List_Nil);
};
var $author$project$Demo$TextFields$demoHelperTextWithCharacterCounter = A2(
	$author$project$Material$HelperText$helperLine,
	_List_Nil,
	_List_fromArray(
		[
			A2(
			$author$project$Material$HelperText$helperText,
			A2($author$project$Material$HelperText$setPersistent, true, $author$project$Material$HelperText$config),
			'Helper Text'),
			$author$project$Material$HelperText$characterCounter(_List_Nil)
		]));
var $author$project$Material$TextField$setMaxLength = F2(
	function (maxLength, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{a4: maxLength});
	});
var $author$project$Demo$TextFields$textFieldsWithCharacterCounter = function (model) {
	return A2(
		$elm$html$Html$div,
		$author$project$Demo$TextFields$textFieldRow,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				$author$project$Demo$TextFields$textFieldContainer,
				_List_fromArray(
					[
						$author$project$Material$TextField$outlined(
						A2(
							$author$project$Material$TextField$setMaxLength,
							$elm$core$Maybe$Just(18),
							$author$project$Material$TextField$config)),
						$author$project$Demo$TextFields$demoHelperTextWithCharacterCounter
					])),
				A2(
				$elm$html$Html$div,
				$author$project$Demo$TextFields$textFieldContainer,
				_List_fromArray(
					[
						$author$project$Material$TextField$outlined(
						A2(
							$author$project$Material$TextField$setMaxLength,
							$elm$core$Maybe$Just(18),
							A2(
								$author$project$Material$TextField$setLeadingIcon,
								$elm$core$Maybe$Just(
									$author$project$Material$TextField$Icon$icon('event')),
								$author$project$Material$TextField$config))),
						$author$project$Demo$TextFields$demoHelperTextWithCharacterCounter
					])),
				A2(
				$elm$html$Html$div,
				$author$project$Demo$TextFields$textFieldContainer,
				_List_fromArray(
					[
						$author$project$Material$TextField$outlined(
						A2(
							$author$project$Material$TextField$setMaxLength,
							$elm$core$Maybe$Just(18),
							A2(
								$author$project$Material$TextField$setTrailingIcon,
								$elm$core$Maybe$Just(
									A2(
										$author$project$Material$TextField$Icon$setOnInteraction,
										$author$project$Demo$TextFields$Interacted,
										$author$project$Material$TextField$Icon$icon('delete'))),
								$author$project$Material$TextField$config))),
						$author$project$Demo$TextFields$demoHelperTextWithCharacterCounter
					]))
			]));
};
var $author$project$Material$TextField$Icon$svgIcon = F2(
	function (attributes, nodes) {
		return $author$project$Material$TextField$Icon$Internal$SvgIcon(
			{aW: attributes, ad: false, a7: $elm$svg$Svg$svg, a8: nodes, cv: $elm$core$Maybe$Nothing});
	});
var $author$project$Demo$TextFields$textFieldsWithCustomIcon = function (model) {
	return A2(
		$elm$html$Html$div,
		$author$project$Demo$TextFields$textFieldRow,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				$author$project$Demo$TextFields$textFieldContainer,
				_List_fromArray(
					[
						$author$project$Material$TextField$filled(
						A2(
							$author$project$Material$TextField$setTrailingIcon,
							$elm$core$Maybe$Just(
								A2(
									$author$project$Material$TextField$Icon$setOnInteraction,
									$author$project$Demo$TextFields$Interacted,
									$author$project$Material$TextField$Icon$icon('delete'))),
							A2(
								$author$project$Material$TextField$setLeadingIcon,
								$elm$core$Maybe$Just(
									$author$project$Material$TextField$Icon$icon('favorite')),
								A2(
									$author$project$Material$TextField$setLabel,
									$elm$core$Maybe$Just('Material Icons'),
									$author$project$Material$TextField$config))))
					])),
				A2(
				$elm$html$Html$div,
				$author$project$Demo$TextFields$textFieldContainer,
				_List_fromArray(
					[
						$author$project$Material$TextField$filled(
						A2(
							$author$project$Material$TextField$setTrailingIcon,
							$elm$core$Maybe$Just(
								A2(
									$author$project$Material$TextField$Icon$setOnInteraction,
									$author$project$Demo$TextFields$Interacted,
									A3(
										$author$project$Material$TextField$Icon$customIcon,
										$elm$html$Html$i,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('fab fa-font-awesome'),
												A2($elm$html$Html$Attributes$style, 'font-size', '24px')
											]),
										_List_Nil))),
							A2(
								$author$project$Material$TextField$setLeadingIcon,
								$elm$core$Maybe$Just(
									A3(
										$author$project$Material$TextField$Icon$customIcon,
										$elm$html$Html$i,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('fab fa-font-awesome'),
												A2($elm$html$Html$Attributes$style, 'font-size', '24px')
											]),
										_List_Nil)),
								A2(
									$author$project$Material$TextField$setLabel,
									$elm$core$Maybe$Just('Font Awesome'),
									$author$project$Material$TextField$config))))
					])),
				A2(
				$elm$html$Html$div,
				$author$project$Demo$TextFields$textFieldContainer,
				_List_fromArray(
					[
						$author$project$Material$TextField$filled(
						A2(
							$author$project$Material$TextField$setTrailingIcon,
							$elm$core$Maybe$Just(
								A2(
									$author$project$Material$TextField$Icon$setOnInteraction,
									$author$project$Demo$TextFields$Interacted,
									A2(
										$author$project$Material$TextField$Icon$svgIcon,
										_List_fromArray(
											[
												$elm$svg$Svg$Attributes$viewBox('0 0 100 100'),
												A2($elm$html$Html$Attributes$style, 'width', '24px'),
												A2($elm$html$Html$Attributes$style, 'height', '24px')
											]),
										$author$project$Demo$ElmLogo$elmLogo))),
							A2(
								$author$project$Material$TextField$setLeadingIcon,
								$elm$core$Maybe$Just(
									A2(
										$author$project$Material$TextField$Icon$svgIcon,
										_List_fromArray(
											[
												$elm$svg$Svg$Attributes$viewBox('0 0 100 100'),
												A2($elm$html$Html$Attributes$style, 'width', '24px'),
												A2($elm$html$Html$Attributes$style, 'height', '24px')
											]),
										$author$project$Demo$ElmLogo$elmLogo)),
								A2(
									$author$project$Material$TextField$setLabel,
									$elm$core$Maybe$Just('SVG'),
									$author$project$Material$TextField$config))))
					]))
			]));
};
var $author$project$Demo$TextFields$textFieldsWithoutLabel = function (model) {
	return A2(
		$elm$html$Html$div,
		$author$project$Demo$TextFields$textFieldRow,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				$author$project$Demo$TextFields$textFieldContainer,
				_List_fromArray(
					[
						$author$project$Material$TextField$outlined($author$project$Material$TextField$config),
						$author$project$Demo$TextFields$demoHelperText
					])),
				A2(
				$elm$html$Html$div,
				$author$project$Demo$TextFields$textFieldContainer,
				_List_fromArray(
					[
						$author$project$Material$TextField$outlined(
						A2(
							$author$project$Material$TextField$setLeadingIcon,
							$elm$core$Maybe$Just(
								$author$project$Material$TextField$Icon$icon('event')),
							$author$project$Material$TextField$config)),
						$author$project$Demo$TextFields$demoHelperText
					])),
				A2(
				$elm$html$Html$div,
				$author$project$Demo$TextFields$textFieldContainer,
				_List_fromArray(
					[
						$author$project$Material$TextField$outlined(
						A2(
							$author$project$Material$TextField$setTrailingIcon,
							$elm$core$Maybe$Just(
								A2(
									$author$project$Material$TextField$Icon$setOnInteraction,
									$author$project$Demo$TextFields$Interacted,
									$author$project$Material$TextField$Icon$icon('delete'))),
							$author$project$Material$TextField$config)),
						$author$project$Demo$TextFields$demoHelperText
					]))
			]));
};
var $author$project$Demo$TextFields$textareaTextField = function (model) {
	return A2(
		$elm$html$Html$div,
		$author$project$Demo$TextFields$textFieldContainer,
		_List_fromArray(
			[
				$author$project$Material$TextArea$outlined(
				A2(
					$author$project$Material$TextArea$setLabel,
					$elm$core$Maybe$Just('Standard'),
					$author$project$Material$TextArea$config)),
				$author$project$Demo$TextFields$demoHelperText
			]));
};
var $author$project$Material$TextArea$setMaxLength = F2(
	function (maxLength, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{a4: maxLength});
	});
var $author$project$Demo$TextFields$textareaWithCharacterCounter = function (model) {
	return A2(
		$elm$html$Html$div,
		$author$project$Demo$TextFields$textFieldRowFullwidth,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				$author$project$Demo$TextFields$textFieldContainer,
				_List_fromArray(
					[
						$author$project$Material$TextArea$outlined(
						A2(
							$author$project$Material$TextArea$setFullwidth,
							true,
							A2(
								$author$project$Material$TextArea$setMaxLength,
								$elm$core$Maybe$Just(300),
								$author$project$Material$TextArea$config))),
						$author$project$Demo$TextFields$demoHelperTextWithCharacterCounter
					]))
			]));
};
var $author$project$Demo$TextFields$view = function (model) {
	return {
		cS: _List_fromArray(
			[
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Filled')
					])),
				$author$project$Demo$TextFields$filledTextFields(model),
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Shaped Filled')
					])),
				$author$project$Demo$TextFields$shapedFilledTextFields(model),
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Outlined')
					])),
				$author$project$Demo$TextFields$outlinedTextFields(model),
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Shaped Outlined (TODO)')
					])),
				$author$project$Demo$TextFields$shapedOutlinedTextFields(model),
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Text Field with Affix')
					])),
				$author$project$Demo$TextFields$affixedFilledTextFields(model),
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Text Field without Label')
					])),
				$author$project$Demo$TextFields$textFieldsWithoutLabel(model),
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Text Field with Character Counter')
					])),
				$author$project$Demo$TextFields$textFieldsWithCharacterCounter(model),
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Text Field with Custom Icon')
					])),
				$author$project$Demo$TextFields$textFieldsWithCustomIcon(model),
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Textarea')
					])),
				$author$project$Demo$TextFields$textareaTextField(model),
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Full Width')
					])),
				$author$project$Demo$TextFields$fullwidthTextField(model),
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Full Width Textarea')
					])),
				$author$project$Demo$TextFields$fullwidthTextareaTextField(model),
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Textarea with Character Counter')
					])),
				$author$project$Demo$TextFields$textareaWithCharacterCounter(model),
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Focus Text Field')
					])),
				$author$project$Demo$TextFields$focusTextField
			]),
		cZ: _List_fromArray(
			[
				$author$project$Demo$TextFields$heroTextFields(model)
			]),
		c9: 'Text fields allow users to input, edit, and select text. Text fields typically reside in forms but can appear in other places, like dialog boxes and search.',
		db: {
			cT: $elm$core$Maybe$Just('https://package.elm-lang.org/packages/aforemny/material-components-web-elm/latest/Material-TextField'),
			c3: $elm$core$Maybe$Just('https://material.io/go/design-text-fields'),
			df: $elm$core$Maybe$Just('https://github.com/material-components/material-components-web/tree/master/packages/mdc-textfield')
		},
		dh: 'Text Field'
	};
};
var $author$project$Demo$Theme$heroMargin = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'margin', '16px 32px')
	]);
var $elm$html$Html$legend = _VirtualDom_node('legend');
var $author$project$Material$Theme$background = $elm$html$Html$Attributes$class('mdc-theme--background');
var $author$project$Demo$Theme$demoThemeColorGroup = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'padding', '16px 0')
	]);
var $author$project$Demo$Theme$demoThemeTextStyle = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'padding', '0 16px')
	]);
var $author$project$Demo$Theme$demoThemeIconStyle = A2(
	$elm$core$List$cons,
	$elm$html$Html$Attributes$class('material-icons'),
	$author$project$Demo$Theme$demoThemeTextStyle);
var $author$project$Demo$Theme$demoThemeTextRow = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'display', '-ms-inline-flexbox'),
		A2($elm$html$Html$Attributes$style, 'display', 'inline-flex'),
		A2($elm$html$Html$Attributes$style, '-webkit-box-sizing', 'border-box'),
		A2($elm$html$Html$Attributes$style, 'box-sizing', 'border-box'),
		A2($elm$html$Html$Attributes$style, 'padding', '16px'),
		A2($elm$html$Html$Attributes$style, 'border', '1px solid #f0f0f0'),
		A2($elm$html$Html$Attributes$style, '-ms-flex-align', 'center'),
		A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
		A2($elm$html$Html$Attributes$style, '-ms-flex-direction', 'row'),
		A2($elm$html$Html$Attributes$style, 'flex-direction', 'row')
	]);
var $author$project$Material$Theme$textDisabledOnBackground = $elm$html$Html$Attributes$class('mdc-theme--text-disabled-on-background');
var $author$project$Material$Theme$textHintOnBackground = $elm$html$Html$Attributes$class('mdc-theme--text-hint-on-background');
var $author$project$Material$Theme$textIconOnBackground = $elm$html$Html$Attributes$class('mdc-theme--text-icon-on-background');
var $author$project$Material$Theme$textPrimaryOnBackground = $elm$html$Html$Attributes$class('mdc-theme--text-primary-on-background');
var $author$project$Demo$Theme$textOnBackground = A2(
	$elm$html$Html$div,
	$author$project$Demo$Theme$demoThemeColorGroup,
	_List_fromArray(
		[
			A2(
			$elm$html$Html$div,
			A2($elm$core$List$cons, $author$project$Material$Theme$background, $author$project$Demo$Theme$demoThemeTextRow),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$span,
					A2($elm$core$List$cons, $author$project$Material$Theme$textPrimaryOnBackground, $author$project$Demo$Theme$demoThemeTextStyle),
					_List_fromArray(
						[
							$elm$html$Html$text('Primary')
						])),
					A2(
					$elm$html$Html$span,
					A2($elm$core$List$cons, $author$project$Material$Theme$textSecondaryOnBackground, $author$project$Demo$Theme$demoThemeTextStyle),
					_List_fromArray(
						[
							$elm$html$Html$text('Secondary')
						])),
					A2(
					$elm$html$Html$span,
					A2($elm$core$List$cons, $author$project$Material$Theme$textHintOnBackground, $author$project$Demo$Theme$demoThemeTextStyle),
					_List_fromArray(
						[
							$elm$html$Html$text('Hint')
						])),
					A2(
					$elm$html$Html$span,
					A2($elm$core$List$cons, $author$project$Material$Theme$textDisabledOnBackground, $author$project$Demo$Theme$demoThemeTextStyle),
					_List_fromArray(
						[
							$elm$html$Html$text('Disabled')
						])),
					A2(
					$elm$html$Html$span,
					A2($elm$core$List$cons, $author$project$Material$Theme$textIconOnBackground, $author$project$Demo$Theme$demoThemeIconStyle),
					_List_fromArray(
						[
							$elm$html$Html$text('favorite')
						]))
				]))
		]));
var $author$project$Demo$Theme$demoThemeBgCustomDark = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'background-color', '#d1d1d1')
	]);
var $author$project$Material$Theme$textDisabledOnDark = $elm$html$Html$Attributes$class('mdc-theme--text-disabled-on-dark');
var $author$project$Material$Theme$textHintOnDark = $elm$html$Html$Attributes$class('mdc-theme--text-hint-on-dark');
var $author$project$Material$Theme$textIconOnDark = $elm$html$Html$Attributes$class('mdc-theme--text-icon-on-dark');
var $author$project$Material$Theme$textPrimaryOnDark = $elm$html$Html$Attributes$class('mdc-theme--text-primary-on-dark');
var $author$project$Material$Theme$textSecondaryOnDark = $elm$html$Html$Attributes$class('mdc-theme--text-secondary-on-dark');
var $author$project$Demo$Theme$textOnDarkBackground = A2(
	$elm$html$Html$div,
	$author$project$Demo$Theme$demoThemeColorGroup,
	_List_fromArray(
		[
			A2(
			$elm$html$Html$div,
			_Utils_ap($author$project$Demo$Theme$demoThemeBgCustomDark, $author$project$Demo$Theme$demoThemeTextRow),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$span,
					A2($elm$core$List$cons, $author$project$Material$Theme$textPrimaryOnDark, $author$project$Demo$Theme$demoThemeTextStyle),
					_List_fromArray(
						[
							$elm$html$Html$text('Primary')
						])),
					A2(
					$elm$html$Html$span,
					A2($elm$core$List$cons, $author$project$Material$Theme$textSecondaryOnDark, $author$project$Demo$Theme$demoThemeTextStyle),
					_List_fromArray(
						[
							$elm$html$Html$text('Secondary')
						])),
					A2(
					$elm$html$Html$span,
					A2($elm$core$List$cons, $author$project$Material$Theme$textHintOnDark, $author$project$Demo$Theme$demoThemeTextStyle),
					_List_fromArray(
						[
							$elm$html$Html$text('Hint')
						])),
					A2(
					$elm$html$Html$span,
					A2($elm$core$List$cons, $author$project$Material$Theme$textDisabledOnDark, $author$project$Demo$Theme$demoThemeTextStyle),
					_List_fromArray(
						[
							$elm$html$Html$text('Disabled')
						])),
					A2(
					$elm$html$Html$span,
					A2($elm$core$List$cons, $author$project$Material$Theme$textIconOnDark, $author$project$Demo$Theme$demoThemeIconStyle),
					_List_fromArray(
						[
							$elm$html$Html$text('favorite')
						]))
				]))
		]));
var $author$project$Demo$Theme$demoThemeBgCustomLight = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'background-color', '#ddd')
	]);
var $author$project$Material$Theme$textDisabledOnLight = $elm$html$Html$Attributes$class('mdc-theme--text-disabled-on-light');
var $author$project$Material$Theme$textHintOnLight = $elm$html$Html$Attributes$class('mdc-theme--text-hint-on-light');
var $author$project$Material$Theme$textIconOnLight = $elm$html$Html$Attributes$class('mdc-theme--text-icon-on-light');
var $author$project$Material$Theme$textPrimaryOnLight = $elm$html$Html$Attributes$class('mdc-theme--text-primary-on-light');
var $author$project$Material$Theme$textSecondaryOnLight = $elm$html$Html$Attributes$class('mdc-theme--text-secondary-on-light');
var $author$project$Demo$Theme$textOnLightBackground = A2(
	$elm$html$Html$div,
	$author$project$Demo$Theme$demoThemeColorGroup,
	_List_fromArray(
		[
			A2(
			$elm$html$Html$div,
			_Utils_ap($author$project$Demo$Theme$demoThemeBgCustomLight, $author$project$Demo$Theme$demoThemeTextRow),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$span,
					A2($elm$core$List$cons, $author$project$Material$Theme$textPrimaryOnLight, $author$project$Demo$Theme$demoThemeTextStyle),
					_List_fromArray(
						[
							$elm$html$Html$text('Primary')
						])),
					A2(
					$elm$html$Html$span,
					A2($elm$core$List$cons, $author$project$Material$Theme$textSecondaryOnLight, $author$project$Demo$Theme$demoThemeTextStyle),
					_List_fromArray(
						[
							$elm$html$Html$text('Secondary')
						])),
					A2(
					$elm$html$Html$span,
					A2($elm$core$List$cons, $author$project$Material$Theme$textHintOnLight, $author$project$Demo$Theme$demoThemeTextStyle),
					_List_fromArray(
						[
							$elm$html$Html$text('Hint')
						])),
					A2(
					$elm$html$Html$span,
					A2($elm$core$List$cons, $author$project$Material$Theme$textDisabledOnLight, $author$project$Demo$Theme$demoThemeTextStyle),
					_List_fromArray(
						[
							$elm$html$Html$text('Disabled')
						])),
					A2(
					$elm$html$Html$span,
					A2($elm$core$List$cons, $author$project$Material$Theme$textIconOnLight, $author$project$Demo$Theme$demoThemeIconStyle),
					_List_fromArray(
						[
							$elm$html$Html$text('favorite')
						]))
				]))
		]));
var $author$project$Material$Theme$onPrimary = $elm$html$Html$Attributes$class('mdc-theme--on-primary');
var $author$project$Material$Theme$primaryBg = $elm$html$Html$Attributes$class('mdc-theme--primary-bg');
var $author$project$Demo$Theme$textOnPrimary = A2(
	$elm$html$Html$div,
	$author$project$Demo$Theme$demoThemeColorGroup,
	_List_fromArray(
		[
			A2(
			$elm$html$Html$div,
			A2($elm$core$List$cons, $author$project$Material$Theme$primaryBg, $author$project$Demo$Theme$demoThemeTextRow),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$span,
					A2($elm$core$List$cons, $author$project$Material$Theme$onPrimary, $author$project$Demo$Theme$demoThemeTextStyle),
					_List_fromArray(
						[
							$elm$html$Html$text('Text')
						])),
					A2(
					$elm$html$Html$span,
					A2($elm$core$List$cons, $author$project$Material$Theme$onPrimary, $author$project$Demo$Theme$demoThemeIconStyle),
					_List_fromArray(
						[
							$elm$html$Html$text('favorite')
						]))
				]))
		]));
var $author$project$Material$Theme$onSecondary = $elm$html$Html$Attributes$class('mdc-theme--on-secondary');
var $author$project$Material$Theme$secondaryBg = $elm$html$Html$Attributes$class('mdc-theme--secondary-bg');
var $author$project$Demo$Theme$textOnSecondary = A2(
	$elm$html$Html$div,
	$author$project$Demo$Theme$demoThemeColorGroup,
	_List_fromArray(
		[
			A2(
			$elm$html$Html$div,
			A2($elm$core$List$cons, $author$project$Material$Theme$secondaryBg, $author$project$Demo$Theme$demoThemeTextRow),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$span,
					A2($elm$core$List$cons, $author$project$Material$Theme$onSecondary, $author$project$Demo$Theme$demoThemeTextStyle),
					_List_fromArray(
						[
							$elm$html$Html$text('Text')
						])),
					A2(
					$elm$html$Html$span,
					A2($elm$core$List$cons, $author$project$Material$Theme$onSecondary, $author$project$Demo$Theme$demoThemeIconStyle),
					_List_fromArray(
						[
							$elm$html$Html$text('favorite')
						]))
				]))
		]));
var $author$project$Demo$Theme$demoThemeColorSwatch = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'display', 'inline-block'),
		A2($elm$html$Html$Attributes$style, '-webkit-box-sizing', 'border-box'),
		A2($elm$html$Html$Attributes$style, 'box-sizing', 'border-box'),
		A2($elm$html$Html$Attributes$style, 'width', '150px'),
		A2($elm$html$Html$Attributes$style, 'height', '50px'),
		A2($elm$html$Html$Attributes$style, 'line-height', '50px'),
		A2($elm$html$Html$Attributes$style, 'text-align', 'center'),
		A2($elm$html$Html$Attributes$style, 'margin-bottom', '8px'),
		A2($elm$html$Html$Attributes$style, 'border-radius', '4px')
	]);
var $author$project$Demo$Theme$demoThemeColorSwatches = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'display', '-ms-inline-flexbox'),
		A2($elm$html$Html$Attributes$style, 'display', 'inline-flex'),
		A2($elm$html$Html$Attributes$style, '-ms-flex-direction', 'column'),
		A2($elm$html$Html$Attributes$style, 'flex-direction', 'column'),
		A2($elm$html$Html$Attributes$style, 'margin-right', '16px'),
		$author$project$Material$Elevation$z2
	]);
var $author$project$Demo$Theme$themeColorsAsBackground = A2(
	$elm$html$Html$div,
	$author$project$Demo$Theme$demoThemeColorGroup,
	_List_fromArray(
		[
			A2(
			$elm$html$Html$div,
			A2(
				$elm$core$List$cons,
				$author$project$Material$Theme$primaryBg,
				A2($elm$core$List$cons, $author$project$Material$Theme$onPrimary, $author$project$Demo$Theme$demoThemeColorSwatches)),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					$author$project$Demo$Theme$demoThemeColorSwatch,
					_List_fromArray(
						[
							$elm$html$Html$text('Primary')
						]))
				])),
			A2(
			$elm$html$Html$div,
			A2(
				$elm$core$List$cons,
				$author$project$Material$Theme$secondaryBg,
				A2($elm$core$List$cons, $author$project$Material$Theme$onSecondary, $author$project$Demo$Theme$demoThemeColorSwatches)),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					$author$project$Demo$Theme$demoThemeColorSwatch,
					_List_fromArray(
						[
							$elm$html$Html$text('Secondary')
						]))
				])),
			A2(
			$elm$html$Html$div,
			A2(
				$elm$core$List$cons,
				$author$project$Material$Theme$background,
				A2($elm$core$List$cons, $author$project$Material$Theme$textPrimaryOnBackground, $author$project$Demo$Theme$demoThemeColorSwatches)),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					$author$project$Demo$Theme$demoThemeColorSwatch,
					_List_fromArray(
						[
							$elm$html$Html$text('Background')
						]))
				]))
		]));
var $author$project$Material$Theme$primary = $elm$html$Html$Attributes$class('mdc-theme--primary');
var $author$project$Material$Theme$secondary = $elm$html$Html$Attributes$class('mdc-theme--secondary');
var $author$project$Demo$Theme$themeColorsAsText = A2(
	$elm$html$Html$div,
	$author$project$Demo$Theme$demoThemeColorGroup,
	_List_fromArray(
		[
			A2(
			$elm$html$Html$div,
			A2($elm$core$List$cons, $author$project$Material$Theme$primary, $author$project$Demo$Theme$demoThemeColorSwatches),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					$author$project$Demo$Theme$demoThemeColorSwatch,
					_List_fromArray(
						[
							$elm$html$Html$text('Primary')
						]))
				])),
			A2(
			$elm$html$Html$div,
			A2($elm$core$List$cons, $author$project$Material$Theme$secondary, $author$project$Demo$Theme$demoThemeColorSwatches),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					$author$project$Demo$Theme$demoThemeColorSwatch,
					_List_fromArray(
						[
							$elm$html$Html$text('Secondary')
						]))
				]))
		]));
var $author$project$Demo$Theme$view = function (model) {
	return {
		cS: _List_fromArray(
			[
				A2(
				$elm$html$Html$legend,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Theme colors as text')
					])),
				$author$project$Demo$Theme$themeColorsAsText,
				A2(
				$elm$html$Html$legend,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Theme colors as background')
					])),
				$author$project$Demo$Theme$themeColorsAsBackground,
				A2(
				$elm$html$Html$legend,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Text on background')
					])),
				$author$project$Demo$Theme$textOnBackground,
				A2(
				$elm$html$Html$legend,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Text on primary')
					])),
				$author$project$Demo$Theme$textOnPrimary,
				A2(
				$elm$html$Html$legend,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Text on secondary')
					])),
				$author$project$Demo$Theme$textOnSecondary,
				A2(
				$elm$html$Html$legend,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Text on user-defined light background')
					])),
				$author$project$Demo$Theme$textOnLightBackground,
				A2(
				$elm$html$Html$legend,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Text on user-defined dark background')
					])),
				$author$project$Demo$Theme$textOnDarkBackground
			]),
		cZ: _List_fromArray(
			[
				A2(
				$author$project$Material$Button$text,
				A2($author$project$Material$Button$setAttributes, $author$project$Demo$Theme$heroMargin, $author$project$Material$Button$config),
				'Text'),
				A2(
				$author$project$Material$Button$raised,
				A2($author$project$Material$Button$setAttributes, $author$project$Demo$Theme$heroMargin, $author$project$Material$Button$config),
				'Raised'),
				A2(
				$author$project$Material$Button$outlined,
				A2($author$project$Material$Button$setAttributes, $author$project$Demo$Theme$heroMargin, $author$project$Material$Button$config),
				'Outlined')
			]),
		c9: 'Color in Material Design is inspired by bold hues juxtaposed with muted environments, deep shadows, and bright highlights.',
		db: {
			cT: $elm$core$Maybe$Just('https://package.elm-lang.org/packages/aforemny/material-components-web-elm/latest/Material-Theme'),
			c3: $elm$core$Maybe$Just('https://material.io/go/design-color-theming'),
			df: $elm$core$Maybe$Just('https://github.com/material-components/material-components-web/tree/master/packages/mdc-theme')
		},
		dh: 'Theme'
	};
};
var $author$project$Demo$TopAppBar$iframe = F2(
	function (title, url) {
		var stringUrl = $author$project$Demo$Url$toString(url);
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'display', 'inline-block'),
					A2($elm$html$Html$Attributes$style, '-ms-flex', '1 1 45%'),
					A2($elm$html$Html$Attributes$style, 'flex', '1 1 45%'),
					A2($elm$html$Html$Attributes$style, '-ms-flex-pack', 'distribute'),
					A2($elm$html$Html$Attributes$style, 'justify-content', 'space-around'),
					A2($elm$html$Html$Attributes$style, 'min-height', '200px'),
					A2($elm$html$Html$Attributes$style, 'min-width', '400px'),
					A2($elm$html$Html$Attributes$style, 'padding', '15px')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$elm$html$Html$a,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$href(stringUrl),
									$elm$html$Html$Attributes$target('_blank')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$h3,
									_List_fromArray(
										[$author$project$Material$Typography$subtitle1]),
									_List_fromArray(
										[
											$elm$html$Html$text(title)
										]))
								]))
						])),
					A2(
					$elm$html$Html$iframe,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'width', '100%'),
							A2($elm$html$Html$Attributes$style, 'height', '200px'),
							$elm$html$Html$Attributes$src(stringUrl)
						]),
					_List_Nil)
				]));
	});
var $author$project$Material$TopAppBar$setAttributes = F2(
	function (additionalAttributes, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{br: additionalAttributes});
	});
var $author$project$Demo$TopAppBar$view = function (model) {
	return {
		cS: _List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'display', '-ms-flexbox'),
						A2($elm$html$Html$Attributes$style, 'display', 'flex'),
						A2($elm$html$Html$Attributes$style, '-ms-flex-wrap', 'wrap'),
						A2($elm$html$Html$Attributes$style, 'flex-wrap', 'wrap'),
						A2($elm$html$Html$Attributes$style, 'min-height', '200px')
					]),
				_List_fromArray(
					[
						A2($author$project$Demo$TopAppBar$iframe, 'Standard', $author$project$Demo$Url$StandardTopAppBar),
						A2($author$project$Demo$TopAppBar$iframe, 'Fixed', $author$project$Demo$Url$FixedTopAppBar),
						A2($author$project$Demo$TopAppBar$iframe, 'Dense', $author$project$Demo$Url$DenseTopAppBar),
						A2($author$project$Demo$TopAppBar$iframe, 'Prominent', $author$project$Demo$Url$ProminentTopAppBar),
						A2($author$project$Demo$TopAppBar$iframe, 'Short', $author$project$Demo$Url$ShortTopAppBar),
						A2($author$project$Demo$TopAppBar$iframe, 'Short - Always Collapsed', $author$project$Demo$Url$ShortCollapsedTopAppBar)
					]))
			]),
		cZ: _List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'width', '480px'),
						A2($elm$html$Html$Attributes$style, 'height', '72px')
					]),
				_List_fromArray(
					[
						A2(
						$author$project$Material$TopAppBar$regular,
						A2(
							$author$project$Material$TopAppBar$setAttributes,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'position', 'static')
								]),
							$author$project$Material$TopAppBar$config),
						_List_fromArray(
							[
								A2(
								$author$project$Material$TopAppBar$section,
								_List_fromArray(
									[$author$project$Material$TopAppBar$alignStart]),
								_List_fromArray(
									[
										A2(
										$author$project$Material$IconButton$iconButton,
										A2(
											$author$project$Material$IconButton$setAttributes,
											_List_fromArray(
												[$author$project$Material$TopAppBar$navigationIcon]),
											$author$project$Material$IconButton$config),
										$author$project$Material$IconButton$icon('menu')),
										A2(
										$elm$html$Html$span,
										_List_fromArray(
											[$author$project$Material$TopAppBar$title]),
										_List_fromArray(
											[
												$elm$html$Html$text('Title')
											]))
									])),
								A2(
								$author$project$Material$TopAppBar$section,
								_List_fromArray(
									[$author$project$Material$TopAppBar$alignEnd]),
								_List_fromArray(
									[
										A2(
										$author$project$Material$IconButton$iconButton,
										A2(
											$author$project$Material$IconButton$setAttributes,
											_List_fromArray(
												[$author$project$Material$TopAppBar$actionItem]),
											$author$project$Material$IconButton$config),
										$author$project$Material$IconButton$icon('file_download')),
										A2(
										$author$project$Material$IconButton$iconButton,
										A2(
											$author$project$Material$IconButton$setAttributes,
											_List_fromArray(
												[$author$project$Material$TopAppBar$actionItem]),
											$author$project$Material$IconButton$config),
										$author$project$Material$IconButton$icon('print')),
										A2(
										$author$project$Material$IconButton$iconButton,
										A2(
											$author$project$Material$IconButton$setAttributes,
											_List_fromArray(
												[$author$project$Material$TopAppBar$actionItem]),
											$author$project$Material$IconButton$config),
										$author$project$Material$IconButton$icon('more_vert'))
									]))
							]))
					]))
			]),
		c9: 'Top App Bars are a container for items such as application title, navigation icon, and action items.',
		db: {
			cT: $elm$core$Maybe$Just('https://package.elm-lang.org/packages/aforemny/material-components-web-elm/latest/Material-TopAppBar'),
			c3: $elm$core$Maybe$Just('https://material.io/go/design-app-bar-top'),
			df: $elm$core$Maybe$Just('https://github.com/material-components/material-components-web/tree/master/packages/mdc-top-app-bar')
		},
		dh: 'Top App Bar'
	};
};
var $author$project$Demo$TopAppBarPage$demoParagraph = '\n    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod\n    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim\n    veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea\n    commodo consequat.  Duis aute irure dolor in reprehenderit in voluptate\n    velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat\n    cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id\n    est laborum.\n    ';
var $author$project$Demo$TopAppBarPage$view = F2(
	function (lift, _v0) {
		var topAppBar = _v0.di;
		var fixedAdjust = _v0.cX;
		return A2(
			$elm$html$Html$map,
			lift,
			A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'height', '200vh'),
						$author$project$Material$Typography$typography
					]),
				_List_fromArray(
					[
						topAppBar,
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[fixedAdjust]),
						A2(
							$elm$core$List$repeat,
							4,
							A2(
								$elm$html$Html$p,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text($author$project$Demo$TopAppBarPage$demoParagraph)
									]))))
					])));
	});
var $author$project$Demo$Typography$body1Paragraph = 'Body 1. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur unde suscipit, quam beatae rerum inventore consectetur, neque doloribus, cupiditate numquam dignissimos laborum fugiat deleniti? Eum quasi quidem quibusdam.';
var $author$project$Demo$Typography$body2Paragraph = 'Body 2. Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate aliquid ad quas sunt voluptatum officia dolorum cumque, possimus nihil molestias sapiente necessitatibus dolor saepe inventore, soluta id accusantium voluptas beatae.';
var $author$project$Material$Typography$button = $elm$html$Html$Attributes$class('mdc-typography--button');
var $author$project$Material$Typography$caption = $elm$html$Html$Attributes$class('mdc-typography--caption');
var $elm$html$Html$h4 = _VirtualDom_node('h4');
var $elm$html$Html$h5 = _VirtualDom_node('h5');
var $author$project$Material$Typography$headline2 = $elm$html$Html$Attributes$class('mdc-typography--headline2');
var $author$project$Material$Typography$headline3 = $elm$html$Html$Attributes$class('mdc-typography--headline3');
var $author$project$Material$Typography$headline4 = $elm$html$Html$Attributes$class('mdc-typography--headline4');
var $author$project$Material$Typography$overline = $elm$html$Html$Attributes$class('mdc-typography--overline');
var $author$project$Demo$Typography$view = function (model) {
	return {
		cS: _List_fromArray(
			[
				A2(
				$elm$html$Html$h1,
				_List_fromArray(
					[$author$project$Material$Typography$headline1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Headline 1')
					])),
				A2(
				$elm$html$Html$h2,
				_List_fromArray(
					[$author$project$Material$Typography$headline2]),
				_List_fromArray(
					[
						$elm$html$Html$text('Headline 2')
					])),
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[$author$project$Material$Typography$headline3]),
				_List_fromArray(
					[
						$elm$html$Html$text('Headline 3')
					])),
				A2(
				$elm$html$Html$h4,
				_List_fromArray(
					[$author$project$Material$Typography$headline4]),
				_List_fromArray(
					[
						$elm$html$Html$text('Headline 4')
					])),
				A2(
				$elm$html$Html$h5,
				_List_fromArray(
					[$author$project$Material$Typography$headline5]),
				_List_fromArray(
					[
						$elm$html$Html$text('Headline 5')
					])),
				A2(
				$elm$html$Html$h6,
				_List_fromArray(
					[$author$project$Material$Typography$headline6]),
				_List_fromArray(
					[
						$elm$html$Html$text('Headline 6')
					])),
				A2(
				$elm$html$Html$h6,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Subtitle 1')
					])),
				A2(
				$elm$html$Html$h6,
				_List_fromArray(
					[$author$project$Material$Typography$subtitle2]),
				_List_fromArray(
					[
						$elm$html$Html$text('Subtitle 2')
					])),
				A2(
				$elm$html$Html$p,
				_List_fromArray(
					[$author$project$Material$Typography$body1]),
				_List_fromArray(
					[
						$elm$html$Html$text($author$project$Demo$Typography$body1Paragraph)
					])),
				A2(
				$elm$html$Html$p,
				_List_fromArray(
					[$author$project$Material$Typography$body2]),
				_List_fromArray(
					[
						$elm$html$Html$text($author$project$Demo$Typography$body2Paragraph)
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[$author$project$Material$Typography$button]),
				_List_fromArray(
					[
						$elm$html$Html$text('Button text')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[$author$project$Material$Typography$caption]),
				_List_fromArray(
					[
						$elm$html$Html$text('Caption text')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[$author$project$Material$Typography$overline]),
				_List_fromArray(
					[
						$elm$html$Html$text('Overline text')
					]))
			]),
		cZ: _List_fromArray(
			[
				A2(
				$elm$html$Html$h1,
				_List_fromArray(
					[$author$project$Material$Typography$headline1]),
				_List_fromArray(
					[
						$elm$html$Html$text('Typography')
					]))
			]),
		c9: 'Roboto is the standard typeface on Android and Chrome.',
		db: {
			cT: $elm$core$Maybe$Just('https://package.elm-lang.org/packages/aforemny/material-components-web-elm/latest/Material-Typography'),
			c3: $elm$core$Maybe$Just('https://material.io/go/design-typography'),
			df: $elm$core$Maybe$Just('https://github.com/material-components/material-components-web/tree/master/packages/mdc-typography')
		},
		dh: 'Typography'
	};
};
var $author$project$Main$body = function (model) {
	var catalogPageConfig = {cl: $author$project$Main$CloseCatalogDrawer, bC: model.x, cw: $author$project$Main$OpenCatalogDrawer, a: model.a};
	var _v0 = model.a;
	switch (_v0.$) {
		case 0:
			return $author$project$Demo$Startpage$view;
		case 1:
			return A3(
				$author$project$Demo$CatalogPage$view,
				$author$project$Main$ButtonsMsg,
				catalogPageConfig,
				$author$project$Demo$Buttons$view(model.cQ));
		case 2:
			return A3(
				$author$project$Demo$CatalogPage$view,
				$author$project$Main$CardsMsg,
				catalogPageConfig,
				$author$project$Demo$Cards$view(model.W));
		case 3:
			return A3(
				$author$project$Demo$CatalogPage$view,
				$author$project$Main$CheckboxMsg,
				catalogPageConfig,
				$author$project$Demo$Checkbox$view(model.X));
		case 4:
			return A3(
				$author$project$Demo$CatalogPage$view,
				$author$project$Main$ChipsMsg,
				catalogPageConfig,
				$author$project$Demo$Chips$view(model.Z));
		case 5:
			return A3(
				$author$project$Demo$CatalogPage$view,
				$author$project$Main$CircularProgressMsg,
				catalogPageConfig,
				$author$project$Demo$CircularProgress$view(model._));
		case 6:
			return A3(
				$author$project$Demo$CatalogPage$view,
				$author$project$Main$DialogMsg,
				catalogPageConfig,
				$author$project$Demo$Dialog$view(model.ac));
		case 7:
			return A3(
				$author$project$Demo$CatalogPage$view,
				$author$project$Main$DrawerMsg,
				catalogPageConfig,
				$author$project$Demo$Drawer$view(model.cU));
		case 8:
			return A2(
				$author$project$Demo$DrawerPage$view,
				$author$project$Main$DismissibleDrawerMsg,
				$author$project$Demo$DismissibleDrawer$view(model.af));
		case 9:
			return A2(
				$author$project$Demo$DrawerPage$view,
				$author$project$Main$ModalDrawerMsg,
				$author$project$Demo$ModalDrawer$view(model.as));
		case 10:
			return A2(
				$author$project$Demo$DrawerPage$view,
				$author$project$Main$PermanentDrawerMsg,
				$author$project$Demo$PermanentDrawer$view(model.av));
		case 11:
			return A3(
				$author$project$Demo$CatalogPage$view,
				$author$project$Main$ElevationMsg,
				catalogPageConfig,
				$author$project$Demo$Elevation$view(model.ag));
		case 12:
			return A3(
				$author$project$Demo$CatalogPage$view,
				$author$project$Main$FabsMsg,
				catalogPageConfig,
				$author$project$Demo$Fabs$view(model.ah));
		case 13:
			return A3(
				$author$project$Demo$CatalogPage$view,
				$author$project$Main$IconButtonMsg,
				catalogPageConfig,
				$author$project$Demo$IconButton$view(model.al));
		case 14:
			return A3(
				$author$project$Demo$CatalogPage$view,
				$author$project$Main$ImageListMsg,
				catalogPageConfig,
				$author$project$Demo$ImageList$view(model.am));
		case 16:
			return A3(
				$author$project$Demo$CatalogPage$view,
				$author$project$Main$LinearProgressMsg,
				catalogPageConfig,
				$author$project$Demo$LinearProgress$view(model.ap));
		case 17:
			return A3(
				$author$project$Demo$CatalogPage$view,
				$author$project$Main$ListsMsg,
				catalogPageConfig,
				$author$project$Demo$Lists$view(model.aq));
		case 18:
			return A3(
				$author$project$Demo$CatalogPage$view,
				$author$project$Main$RadioButtonsMsg,
				catalogPageConfig,
				$author$project$Demo$RadioButtons$view(model.ax));
		case 20:
			return A3(
				$author$project$Demo$CatalogPage$view,
				$author$project$Main$SelectMsg,
				catalogPageConfig,
				$author$project$Demo$Selects$view(model.aA));
		case 21:
			return A3(
				$author$project$Demo$CatalogPage$view,
				$author$project$Main$MenuMsg,
				catalogPageConfig,
				$author$project$Demo$Menus$view(model.ar));
		case 22:
			return A3(
				$author$project$Demo$CatalogPage$view,
				$author$project$Main$SliderMsg,
				catalogPageConfig,
				$author$project$Demo$Slider$view(model.aD));
		case 23:
			return A3(
				$author$project$Demo$CatalogPage$view,
				$author$project$Main$SnackbarMsg,
				catalogPageConfig,
				$author$project$Demo$Snackbar$view(model.aE));
		case 24:
			return A3(
				$author$project$Demo$CatalogPage$view,
				$author$project$Main$SwitchMsg,
				catalogPageConfig,
				$author$project$Demo$Switch$view(model.aG));
		case 25:
			return A3(
				$author$project$Demo$CatalogPage$view,
				$author$project$Main$TabBarMsg,
				catalogPageConfig,
				$author$project$Demo$TabBar$view(model.aI));
		case 26:
			return A3(
				$author$project$Demo$CatalogPage$view,
				$author$project$Main$TextFieldMsg,
				catalogPageConfig,
				$author$project$Demo$TextFields$view(model.aK));
		case 27:
			return A3(
				$author$project$Demo$CatalogPage$view,
				$author$project$Main$ThemeMsg,
				catalogPageConfig,
				$author$project$Demo$Theme$view(model.aL));
		case 28:
			return A3(
				$author$project$Demo$CatalogPage$view,
				$author$project$Main$TopAppBarMsg,
				catalogPageConfig,
				$author$project$Demo$TopAppBar$view(model.di));
		case 29:
			return A2(
				$author$project$Demo$TopAppBarPage$view,
				$author$project$Main$StandardTopAppBarMsg,
				$author$project$Demo$StandardTopAppBar$view(model.aF));
		case 30:
			return A2(
				$author$project$Demo$TopAppBarPage$view,
				$author$project$Main$FixedTopAppBarMsg,
				$author$project$Demo$FixedTopAppBar$view(model.ai));
		case 32:
			return A2(
				$author$project$Demo$TopAppBarPage$view,
				$author$project$Main$ProminentTopAppBarMsg,
				$author$project$Demo$ProminentTopAppBar$view(model.aw));
		case 33:
			return A2(
				$author$project$Demo$TopAppBarPage$view,
				$author$project$Main$ShortTopAppBarMsg,
				$author$project$Demo$ShortTopAppBar$view(model.aC));
		case 31:
			return A2(
				$author$project$Demo$TopAppBarPage$view,
				$author$project$Main$DenseTopAppBarMsg,
				$author$project$Demo$DenseTopAppBar$view(model.ab));
		case 34:
			return A2(
				$author$project$Demo$TopAppBarPage$view,
				$author$project$Main$ShortCollapsedTopAppBarMsg,
				$author$project$Demo$ShortCollapsedTopAppBar$view(model.aB));
		case 15:
			return A3(
				$author$project$Demo$CatalogPage$view,
				$author$project$Main$LayoutGridMsg,
				catalogPageConfig,
				$author$project$Demo$LayoutGrid$view(model.an));
		case 19:
			return A3(
				$author$project$Demo$CatalogPage$view,
				$author$project$Main$RippleMsg,
				catalogPageConfig,
				$author$project$Demo$Ripple$view(model.az));
		case 35:
			return A3(
				$author$project$Demo$CatalogPage$view,
				$author$project$Main$TypographyMsg,
				catalogPageConfig,
				$author$project$Demo$Typography$view(model.aP));
		case 36:
			return A3(
				$author$project$Demo$CatalogPage$view,
				$author$project$Main$DataTableMsg,
				catalogPageConfig,
				$author$project$Demo$DataTable$view(model.aa));
		default:
			var requestedHash = _v0.a;
			return A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$h1,
						_List_fromArray(
							[$author$project$Material$Typography$headline1]),
						_List_fromArray(
							[
								$elm$html$Html$text('404')
							])),
						$elm$html$Html$text(requestedHash)
					]));
	}
};
var $author$project$Main$view = function (model) {
	return {
		cP: _List_fromArray(
			[
				$author$project$Main$body(model)
			]),
		dh: 'Material Components for Elm'
	};
};
var $author$project$Main$main = $elm$browser$Browser$application(
	{c2: $author$project$Main$init, c7: $author$project$Main$UrlChanged, c8: $author$project$Main$UrlRequested, dg: $author$project$Main$subscriptions, dj: $author$project$Main$update, dl: $author$project$Main$view});
_Platform_export({'Main':{'init':$author$project$Main$main(
	$elm$json$Json$Decode$succeed(0))(0)}});}(this));