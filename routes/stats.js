
console.log("MAIN");

var faqs = []


exports.show = function(req, res){
	if (college_checkin) {
	    pg.connect(pgconnstring, function (err, client, done) {
	        if (err) {
	            // error!
	            console.log(err);
	            done();
	        } else {

	        	var faqs_query = faq
	        		.select(faq.question, faq.answer)
	        		.from(faq)
	        		.where(
	        			faq.college_id.equals(current_college)
	        		).toQuery();

	            console.log(faqs_query);

	            client.query(faqs_query, [], function (err, result) {
	                if (err) {
	                    // error!
	                } else if (result.rows.length < 1) {
	                    // no user found with that username!
	                } else {
	                    console.log(result.rows);
	                    for (var row in result.rows) {
	                    	faqs.push([row.question, row.answer]);
	                    }
	                }
	                done();
	            });
	        }
	    })
	} else {
		res.redirect('/checkin');
	}
	var template_engine = req.app.settings.template_engine;
	res.locals.session = req.session;
    res.render('stats', {'faqs': faqs});
};
