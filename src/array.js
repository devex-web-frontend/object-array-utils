/**
 * @copyright Devexperts
 */

/** @namespace Array */

/**
 * @requires Object.clone
 * @requires Object.equals
 */

(function() {
	'use strict';

	/**
	 * @static
	 * @param {Array} array
	 * @return {Array} copy of array
	 * @throws {TypeError} if called with non-array
	 */
	Array.clone = function(array) {
		var clone = [];

		if (!Array.isArray(array)) {
			throw new TypeError('Array.clone called on non-array');
		}

		array.forEach(function(element, i) {
			if (Array.isArray(element)) {
				clone[i] = Array.clone(element);
			} else if (typeof element === 'object') {
				clone[i] = Object.clone(element);
			} else {
				clone[i] = element;
			}
		});

		return clone;
	};

	/**
	 * @static
	 * @param {Array} array1
	 * @param {Array} array2
	 * @return {Boolean} true if array1 equals array2, false otherwise
	 * @throws {TypeError} if called with non-array
	 */
	Array.equals = function(array1, array2) {
		var length1,
			el1,
			el2;

		if (!Array.isArray(array1) || !Array.isArray(array2)) {
			throw new TypeError('Array.equals called on non-array');
		}

		if (array1 === array2) {
			return true;
		}

		length1 = array1.length;

		if (length1 !== array2.length) {
			return false;
		}

		for (var i = 0; i < length1; i++) {
			el1 = array1[i];
			el2 = array2[i];

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
		}

		return true;
	};
})();