
console.log("MAIN");

var faqs = [];

college_name_to_id = function(college_name) {
  if (college_name == "MIT") {
    return 1;
  } else if (college_name == "BostonUniversity") {
    return 2;
  } else if (college_name == "Harvard") {
    return 3;
  }
};

exports.show = function(req, res){
	var pg = module.parent.pg;
	var pgconnstring = module.parent.pgconnstring;
	var faq = module.parent.faq;
	var current_college = module.parent.current_college;
	var current_college_id = college_name_to_id(current_college);
	var college_checkin = module.parent.college_checkin;
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
	        			faq.college_id.equals(current_college_id)
	        		).toQuery();

	            console.log(faqs_query);

	            client.query(faqs_query, function (err, result) {
	                if (err) {
	                    // error!
	                    console.log(err)
	                } else if (result.rows.length < 1) {
	                    // no user found with that username!
	                    console.log('OH NO');
	                } else {
	                    console.log(result.rows);
	                    for (var row in result.rows) {
	                    	faqs.push([row.question, row.answer]);
	                    }
	                    var template_engine = req.app.settings.template_engine;
						res.locals.session = req.session;
					    res.render('stats', {'faqs': faqs});
	                }
	                done();
	            });
	        }
	    });
	} else {
		res.redirect('/checkin');
	}
	console.log('ok so far');
	
	
};
