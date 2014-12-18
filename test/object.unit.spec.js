describe('Object', function() {
	beforeEach(function() {

	});
	afterEach(function() {

	});


	describe('#clone()', function() {
		it('should throw TypeError if applied to non-object', function() {
			expect(function() { Object.clone([]) }).toThrowErrorOfType('TypeError');
			expect(function() { Object.clone(function() {}) }).toThrowErrorOfType('TypeError');
			expect(function() { Object.clone(null) }).toThrowErrorOfType('TypeError');
			expect(function() { Object.clone(undefined) }).toThrowErrorOfType('TypeError');
			expect(function() { Object.clone(1) }).toThrowErrorOfType('TypeError');
			expect(function() { Object.clone('a') }).toThrowErrorOfType('TypeError');
			expect(function() { Object.clone(false) }).toThrowErrorOfType('TypeError');
		});

		it('should clone simple object content', function() {
			var o = Object.clone({x: 1, y: 2, z: 3});

			expect(o.x).toBe(1);
			expect(o.y).toBe(2);
			expect(o.z).toBe(3);
		});

		it('should clone complex object content', function() {
			var o = Object.clone({x: 1, y: {z: {a: 99}, b: 0}});
			var p = Object.clone({x: 1, y: [1]});

			expect(o.x).toBe(1);
			expect(o.y.b).toBe(0);
			expect(o.y.z.a).toBe(99);

			expect(p.y.length).toBe(1);
			expect(p.y[0]).toBe(1);
		});

		it('should create new object', function() {
			var o = {x: 1, y: 2, z: 3};
			var p = Object.clone(o);

			expect(o).not.toBe(p);
		});

		it('should create new object for every nested object', function() {
			var o = {x: 1, y: {z: {a: 99}, b: 0}};
			var p = Object.clone(o);

			expect(o.y).not.toBe(p.y);
			expect(o.y.z).not.toBe(p.y.z);
		});

		it('should not throw error when some property is null', function() {
			expect(function() {
				var o = {x: 2, y: 3, z: null},
					p = Object.clone(o)
			}).not.toThrow();
		});

		it('should correctly clone null property', function() {
			var o = {x: 2, y: 3, z: null},
				p = Object.clone(o);

			expect(p.z).toBeNull();
		});
	});

	describe('#getLength()', function() {
		it('should return number of keys in object', function() {
			expect(Object.getLength({})).toBe(0);
			expect(Object.getLength([])).toBe(0);
			expect(Object.getLength({x: 1, y: 2})).toBe(2);
			expect(Object.getLength(['a', 'b', 'c'])).toBe(3);
		});
	});

	describe('#equals()', function() {
		it('should throw TypeError if at least one of the arguments is non-object', function() {
			expect(function() { Object.equals([], {}) }).toThrowErrorOfType('TypeError');
			expect(function() { Object.equals({}, []) }).toThrowErrorOfType('TypeError');
			expect(function() { Object.equals([], []) }).toThrowErrorOfType('TypeError');
		});

		it('should return true if the same object', function() {
			var a = {x: 1, y: 2, z: 3};
			var b = a;

			expect(Object.equals(a, b)).toBe(true);
		});

		it('should return false if objects of different length', function() {
			expect(Object.equals({x: 1}, {})).toBe(false);
		});

		it('should compare content of simple objects', function() {
			expect(Object.equals({x: 1, y: 2}, {x: 1, y: 2})).toBe(true);
			expect(Object.equals({x: 1, y: 2}, {x: 1, y: 3})).toBe(false);
		});

		it('should compare content of complex object', function() {
			expect(Object.equals({x: 1, y: {z: 3}}, {x: 1, y: {z: 3}})).toBe(true);
			expect(Object.equals({x: 1, y: {z: 3}}, {x: 1, y: {z: {a: 99}}})).toBe(false);

			expect(Object.equals({x: 1, y: []}, {x: 1, y: []})).toBe(true);
			expect(Object.equals({x: 1, y: []}, {x: 1, y: [1]})).toBe(false);
		});

		it('should only compare own properties', function() {
			var Dot0 = function() {
				this.x = 1;
			};
			Dot0.prototype.y = 1;

			var Dot1 = function() {
				this.y = 1;
			};
			Dot1.prototype.x = 1;

			var a = new Dot0();
			var b = new Dot1();

			expect(Object.equals(a, b)).toBe(false);

		});
	});

	describe('#forEach()', function() {
		it('should throw TypeError if called on non-object', function() {
			expect(function() { Object.forEach(function() {}, function() {}) }).toThrowErrorOfType('TypeError');
			expect(function() { Object.forEach([], function() {}) }).toThrowErrorOfType('TypeError');
			expect(function() { Object.forEach(null, function() {}) }).toThrowErrorOfType('TypeError');
			expect(function() { Object.forEach(void 0, function() {}) }).toThrowErrorOfType('TypeError');
			expect(function() { Object.forEach(true, function() {}) }).toThrowErrorOfType('TypeError');
		});

		it('should throw TypeError if non-function passed as callback', function() {
			expect(function() { Object.forEach({}, {}) }).toThrowErrorOfType('TypeError');
			expect(function() { Object.forEach({}, []) }).toThrowErrorOfType('TypeError');
			expect(function() { Object.forEach({}, null) }).toThrowErrorOfType('TypeError');
			expect(function() { Object.forEach({}) }).toThrowErrorOfType('TypeError');
		});

		it('should apply callback passed to every item in object', function() {
			var result = '';

			Object.forEach({x: 1, y: 2, z: 3}, function(value, key) {
				result += key + ':' + value + ';'
			});

			expect(result).toBe('x:1;y:2;z:3;');
		});

		it('should apply callback passed only to own properties', function() {
			var result = '';

			var Dog = function(name) {
				this.name = name;
			};
			Dog.prototype.isGrey = true;

			Object.forEach(new Dog('zhoochka'), function(value, key) {
				result += key + ':' + value + ';'
			});

			expect(result).toBe('name:zhoochka;');
		});

		it('should scope if passed', function() {
			var obj = {
				x: 1,
				sum: function(y) {
					return this.x + y;
				}
			};

			var result = 0;

			Object.forEach({x: 1, y: 2, z: 3}, function(item) {
				result += this.sum(item);
			}, obj);

			expect(result).toBe(9);
		});
	});

	describe('#merge()', function() {
		it('should throw TypeError if at least one argument is non-object', function() {
			expect(function() { Object.merge({}, []) }).toThrowErrorOfType('TypeError');
			expect(function() { Object.merge([], {}) }).toThrowErrorOfType('TypeError');
			expect(function() { Object.merge([], []) }).toThrowErrorOfType('TypeError');
			expect(function() { Object.merge(function() {}, {}) }).toThrowErrorOfType('TypeError');
			expect(function() { Object.merge({}, function() {}) }).toThrowErrorOfType('TypeError');
			expect(function() { Object.merge({}, null) }).toThrowErrorOfType('TypeError');
			expect(function() { Object.merge(null, {}) }).toThrowErrorOfType('TypeError');
		});

		it('should merge simple objects', function() {
			var a = {x: 1, y: 2};
			var b = Object.merge(a, {z: 3});
			var c = Object.merge(a, {x: 99, z: 3});

			expect(b.x).toBe(1);
			expect(b.y).toBe(2);
			expect(b.z).toBe(3);

			expect(c.x).toBe(99);
			expect(b.y).toBe(2);
			expect(b.z).toBe(3);
		});

		it('should merge complex objects', function() {
			var a = {x: 1, y: {z: 2}};
			var b = Object.merge(a, {a: 3});
			var c = {x: 1};
			var d = Object.merge(c, {a: 3, b: {c: 2}});
			var e = Object.merge(c, {a: 3, b: [1]});

			expect(b.x).toBe(1);
			expect(b.y.z).toBe(2);
			expect(b.a).toBe(3);

			expect(d.a).toBe(3);
			expect(d.x).toBe(1);
			expect(d.b.c).toBe(2);

			expect(e.b.length).toBe(1);
			expect(e.b[0]).toBe(1);
		});

		it('should return new object for simple objects', function() {
			var a = {x: 1, y: 2};

			expect(Object.merge(a, {})).not.toBe(a);
		});

		it('should return new object for all nested objects', function() {
			var b = {x: 1, y: {z: 0}};
			var c = Object.merge(b, {});

			expect(c.y).not.toBe(b.y);
		});
	});
});