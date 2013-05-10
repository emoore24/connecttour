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
	var college = module.parent.college;
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

	        	var location_query = college
	        		.select(college.latitude, college.longitude)
	        		.from(college)
	        		.where(
	        			college.college_id.equals(current_college_id)
	        		).toQuery();

	            console.log(location_query);

	            client.query(location_query, function (err, result) {
	                if (err) {
	                    // error!
	                    console.log(err)
	                } else if (result.rows.length < 1) {
	                    // no user found with that username!
	                    console.log('OH NO');
	                } else {
	                    console.log(result.rows);
	                    var template_engine = req.app.settings.template_engine;
						res.locals.session = req.session;
					    res.render('map', {'latitude': result.rows[0].latitude, 'longitude': result.rows[0].longitude});
	                }
	                done();
	            });
	        }
	    });
	} else {
		res.redirect('/checkin');
	}
};
