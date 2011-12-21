var play = require('chain.js').play;

exports['should run first only'] = function (test) {
	var o = {};
	play(o, [
		{
			valid : function (u) {true;},
			run : function (u) {
				test.ok(true,"First method is called");
				test.strictEqual(u,o);
			}
		},
		{
			valid : function (u) {true;},
			run : function (u) {
				test.ok(false,"Second method should never be called");
			}
		},
		{
			valid : function (u) {true;},
			run : function (u) {
				test.ok(false,"Third method should never be called");
			}
		}
	]);
	
    test.done();
};

exports['should run second only'] = function (test) {
	var o = {};
	play(o, [
		{
			valid : function (u) {false;},
			run : function (u) {
				test.ok(false,"First method should never be called");
			}
		},
		{
			valid : function (u) {true;},
			run : function (u) {
				test.ok(true,"Second method is called");
				test.strictEqual(u,o);
			}
		},
		{
			valid : function (u) {true;},
			run : function (u) {
				test.ok(false,"Third method should never be called");
			}
		}
	]);
		
    test.done();
};

exports['should skip first and second change value for third'] = function (test) {
	var o = {};
	var x = {};
	play(o, [
		{
			valid : function (u) {false;},
			run : function (u) {
				test.ok(false,"First method should never be called");
			}
		},
		{
			valid : function (u) {true;},
			run : function (u) {
				test.ok(true,"Second method is called");
				test.strictEqual(u,o);
				return x;
			}
		},
		{
			valid : function (u) {true;},
			run : function (u) {
				test.ok(true,"Third method is called");
				test.strictEqual(u,x);
			}
		}
	]);
	
    test.done();
};
