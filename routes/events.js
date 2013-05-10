var eventlist = [];

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
    var college_checkin = module.parent.college_checkin;
    var current_college = module.parent.current_college;
    var current_college_id = college_name_to_id(current_college);
    var event = module.parent.event;
    var user = module.parent.user;
    var pg = module.parent.pg;
    var pgconnstring = module.parent.pgconnstring;
    console.log(req.params.date);
    console.log(req.params);

	if (college_checkin) {
	    pg.connect(pgconnstring, function (err, client, done) {
	        if (err) {
	            // error!
	            console.log(err);
	            done();
	        } else {

//	        	var event_query = event
//	        		.select(event.star())
//	        		.from(events)
//                    .where(event.college_id == current_college_id)
//                    .toQuery();

                // node-sql doesn't have good support for timestamp.
                var test_date = '2013-06-09';
                var event_query = "SELECT * FROM \"Events\" WHERE ((college_id = $1) AND ((date_trunc('day', start_time), interval '1 days')OVERLAPS(date_trunc('day', DATE '2013-06-09'), interval '1 days'))) ORDER BY start_time;"
        //         var event_query ="SELECT * FROM Events WHERE ((college_id = $1) AND ((date_trunc('day',start_time), interval '1 days') OVERLAPS
        //         		(date_trunc('day', DATE '$2'), interval '1 days')))
	    			// ORDER BY start_time;";

	            console.log(event_query);

	            client.query(event_query, [current_college_id], function (err, result) {
	                if (err) {
	                    // error!
                        console.log(err);
	                } else {
	                	console.log('wee');
	                	console.log(result.rows);
	                    for (var row in result.rows) {
	                    	console.log('boobs');
	                    	eventlist.push([result.rows[row].event_id, result.rows[row].college_id,
                                            result.rows[row].group_name,
                                            result.rows[row].start_time, result.rows[row].end_time,
                                            result.rows[row].description, result.rows[row].image_logo_file]);
	                    }
	                    var template_engine = req.app.settings.template_engine;
						res.locals.session = req.session;
					    res.render('events', { 'date': test_date, 'eventlist': eventlist });
	                }
	                done();
	            });
	        }
	    })
	} else {
		res.redirect('/checkin');
	}
	
};
