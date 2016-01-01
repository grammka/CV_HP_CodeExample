angular.module('HPApp').filter('range', function() {
    return function(input, start, end, reverse) {
        for (var i=start || 1; i <= +end; i++) {
            input.push(i);
        }

        if (reverse) {
	        input = input.reverse();
        }

        return input;
    };
});
