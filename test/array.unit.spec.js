describe('Array', function() {
	beforeEach(function() {

	});
	afterEach(function() {

	});

	describe('#clone()', function() {
		it('should throw TypeError if apply to non-array', function() {
			expect(function() { Array.clone({}) }).toThrowErrorOfType('TypeError');
			expect(function() { Array.clone(function() {}) }).toThrowErrorOfType('TypeError');
			expect(function() { Array.clone(null) }).toThrowErrorOfType('TypeError');
			expect(function() { Array.clone(undefined) }).toThrowErrorOfType('TypeError');
			expect(function() { Array.clone(1) }).toThrowErrorOfType('TypeError');
			expect(function() { Array.clone('a') }).toThrowErrorOfType('TypeError');
			expect(function() { Array.clone(false) }).toThrowErrorOfType('TypeError');
		});

		it('should clone simple array content', function() {
			var a = Array.clone(['a', 'b', 'c']);

			expect(a.length).toBe(3);
			expect(a[0]).toBe('a');
			expect(a[1]).toBe('b');
			expect(a[2]).toBe('c');
		});

		it('should clone complex array content', function() {
			var a = Array.clone(['a', ['b', ['c', 'd']]]);

			expect(a.length).toBe(2);
			expect(a[0]).toBe('a');
			expect(a[1].length).toBe(2);
			expect(a[1][0]).toBe('b');
			expect(a[1][1].length).toBe(2);
			expect(a[1][1][0]).toBe('c');
			expect(a[1][1][1]).toBe('d');
		});

		it('should clone complex array content, including objects', function() {
			var a = Array.clone(['a', {b: 1}]);

			expect(a.length).toBe(2);
			expect(a[0]).toBe('a');
			expect(a[1].b).toBe(1);
		});

		it('should create new simple array', function() {
			var a = [1, 2, 3];

			expect(Array.clone(a)).not.toBe(a);
		});

		it('should create new array for every nested array', function() {
			var a = [1, [2, [3, 4]]];
			var b = Array.clone(a);

			expect(b[1]).not.toBe(a[1]);
			expect(b[1][1]).not.toBe(a[1][1]);
		});
	});

	describe('#equals()', function() {
		it('should throw TypeError if at least one of the arguments non-array', function() {
			expect(function() { Array.equals([], {}) }).toThrowErrorOfType('TypeError');
			expect(function() { Array.equals({}, []) }).toThrowErrorOfType('TypeError');
			expect(function() { Array.equals({}, {}) }).toThrowErrorOfType('TypeError');
		});

		it('should return true if the same array', function() {
			var a = [1, 2, 3];
			var b = a;

			expect(Array.equals(a, b)).toBe(true);
		});

		it('should return false if arrays of different length', function() {
			expect(Array.equals([1], [])).toBe(false);
		});

		it('should compare content of simple array', function() {
			expect(Array.equals(['a', 'b', 'c'], ['a', 'b', 'c'])).toBe(true);
			expect(Array.equals(['a', 'b', 'c'], ['a', 'b', 3])).toBe(false);
		});

		it('should compare content of complex array', function() {
			expect(Array.equals([1, [2, [3, 4]]], [1, [2, [3, 4]]])).toBe(true);
			expect(Array.equals([1, [2, 3]], [1, [2, [3, 4]]])).toBe(false);
		});

		it('should compare content of complex array, including objects', function() {
			expect(Array.equals([1, {a: 2}], [1,{a: 2}])).toBe(true);
			expect(Array.equals([1, {a: 2}], [1, {a: 3}])).toBe(false);
		});
	});
});