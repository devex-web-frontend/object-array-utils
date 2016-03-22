/**
* @copyright Devexperts
*/

/** @namespace Object */

/**
 * @requires Array.clone
 * @requires Array.equals
 */
(function() {
	'use strict';

	function isFunction(obj) {
		return typeof obj === 'function' || Object.prototype.toString.call(obj) === '[object Function]';
	}

	/**
	 * @static
	 * @param {Object} obj
	 * @return {Object} copy of obj
	 * @throws {TypeError} if called with non-object
	 */
	Object.clone = function(obj) {
		var clone = {};

		if (typeof obj !== 'object' || isFunction(obj) || Array.isArray(obj)) {
			throw new TypeError('Object.clone called on non-object');
		}

		Object.keys(obj).forEach(function(key) {
			var element = obj[key];

			if (Array.isArray(element)) {
				clone[key] = Array.clone(element);
			} else if (typeof element === 'object' && element !== null) {
				clone[key] = Object.clone(element);
			} else {
				clone[key] = obj[key];
			}
		});

		return clone;
	};

	/**
	 * @static
	 * @param {Object} obj
	 * @return {Number} number of keys in obj
	 */
	Object.getLength = function(obj) {
		return Object.keys(obj).length;
	};

	/**
	 * @static
	 * @param {Object} obj1
	 * @param {Object} obj2
	 * @return {Boolean} true if obj1 equals obj2, false otherwise
	 * @throws {TypeError} if called with non-object
	 */
	Object.equals = function(obj1, obj2) {
		var el1,
			el2;

		if (typeof obj1 !== 'object' || typeof obj2 !== 'object' ||
				Array.isArray(obj1) || Array.isArray(obj2)) {
			throw new TypeError('Object.equals called on non-object');
		}

		if (obj1 === obj2) {
			return true;
		}

		if (Object.getLength(obj1) !== Object.getLength(obj2)) {
			return false;
		}

		for (var prop in obj1) {
			if (Object.prototype.hasOwnProperty.call(obj1, prop) &&
					Object.prototype.hasOwnProperty.call(obj2, prop)) {
				el1 = obj1[prop];
				el2 = obj2[prop];

				if (Array.isArray(el1) && Array.isArray(el2)) {
					if (!Array.equals(el1, el2)) {
						return false;
					}
				} else if (typeof el1 === 'object' && typeof el2 === 'object') {
					if (!Object.equals(el1, el2)) {
						return false;
					}
				} else if (el1 !== el2) {
					return false;
				}
			} else {
				return false;
			}
		}

		return true;
	};

	/**
	 * @static
	 * @param {Object} obj
	 * @param {Function} fn
	 * @param {Object} [scope]
	 * @throws {TypeError} if called with non-object, or called with non-function
	 */
	Object.forEach = function(obj, fn, scope) {
		if (obj === null || typeof obj !== 'object' || Array.isArray(obj) || isFunction(obj)) {
			throw new TypeError('Object.forEach called on non-object');
		}

		if (!isFunction(fn)) {
			throw new TypeError(fn + ' is not a function');
		}

		for (var prop in obj) {
			if (Object.prototype.hasOwnProperty.call(obj, prop)) {
				fn.call(scope, obj[prop], prop, obj);
			}
		}
	};

	/**
	 * @static
	 * @param {Object} obj1
	 * @param {Object} obj2
	 * @return {Object} new object made by merge of obj1 and obj2
	 * @throws {TypeError} if called with non-object
	 */
	Object.merge = function(obj1, obj2) {
		var merge;

		if (obj1 === null || typeof obj1 !== 'object' || Array.isArray(obj1) || isFunction(obj1) ||
				obj2 === null || typeof obj2 !== 'object' || Array.isArray(obj2) || isFunction(obj1)) {
			throw new TypeError('Object.merge called on non-object');
		}

		merge = Object.clone(obj1);

		Object.forEach(obj2, function(value, key) {
			if (Array.isArray(value)) {
				merge[key] = Array.clone(value);
			} else if (typeof value === 'object') {
				merge[key] = Object.clone(value);
			} else {
				merge[key] = value;
			}
		});

		return merge;
	};
})();