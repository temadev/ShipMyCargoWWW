var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/:src/:dst', function(req, res, next) {
	gsheet = req.gsheet;
	console.log(gsheet);

	console.log("src is set to " + req.params.src);
	console.log("dst is set to " + req.params.dst);
	
	gsheet.getInfo(function(err, ss_info) {
		if (err)
			console.log(err);

		console.log(ss_info.title + ' is loaded');

		// you can use the worksheet objects to add or read rows
		ss_info.worksheets[0].getRows(function(err, rows) {
			var filtrows = [];
			console.log(ss_info.worksheets[0].title);	
			for ( var i = 0; i < rows.length; i++) {
				var resultsrc = rows[i].bookingpoint.match(RegExp("("+req.params.src+"|All India)", "i"));
				var resultdst = rows[i].deliverypoints.match(RegExp("("+req.params.dst+"|All India)", "i"));
				if (resultsrc && resultdst){
					console.log('-------------------Yes!!');
					console.log(rows[i].deliverypoints);
					console.log(rows[i].bookingpoint);
					console.log(rows[i].routes);
					filtrows.push(rows[i]);
				}
			}
			console.log('filtrows has ' + filtrows.length + 'rows');
			res.render('data', {
	            "data" : filtrows
	        });
		});
	});
});

///* GET Hello World page. */
//router.get('/helloworld', function(req, res) {
//    res.render('helloworld', { title: 'Hello, World!' })
//});

module.exports = router;
