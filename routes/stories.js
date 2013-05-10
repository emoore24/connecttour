var storylist = [];
var uidlist   = [];
var userlist  = {};

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
    var college_checkin = module.parent.college_checkin;
    var current_college = module.parent.current_college;
    var current_college_id = college_name_to_id(current_college);
    var story = module.parent.story;
    var user = module.parent.user;
	if (college_checkin) {
	    pg.connect(pgconnstring, function(err, client, done) {
	        if (err) {
	            // error!
	            console.log('WHAT');
	            console.log(err);
	            done();
	        } else {

	        	var story_query = story
	        		.select(story.user_id, story.college_id, story.story_text)
	        		.from(story)
                    .where(story.college_id.equals(current_college_id))
	        		.toQuery();

	            console.log(story_query);

	            client.query(story_query, function (err, result) {
	                if (err) {
	                    // error!
	                    console.log(err);
	                } else {
	                	console.log('adfsasdfsadf');
	                    for (var row in result.rows) {
                            uidlist.push(result.rows[row].user_id);
	                    	storylist.push([row.user_id, row.college_id,
                                            row.story_text]);
	                    }
	                }
	            });
                for (var i = 0; i < uidlist.length; i++) {
//                     var user_query = user
//                         .select(user.first_name, user.last_name)
//                         .from(user)
//                         .where(user.user_id.equals(userlist[i]))
//                         .toQuery();
                    var user_query = "select first_name, last_name from \"Users\" where user_id = " + uidlist[i] + ";"
                    console.log(user_query);
                    client.query(user_query, function (err, user_result) {
                        if (err) {
                          console.log(err);
                        } else {
                          console.log(user_result.rows);
                          userlist[uidlist] = [user_result.rows[0].first_name, user_result.rows[0].last_name];
                        }
                    });
                }
                console.log("userlist: " + userlist);
                var template_engine = req.app.settings.template_engine;
                res.locals.session = req.session;
                res.render('stories', { 'storylist': storylist, 'userlist': userlist});
                done();
	        }
	    });
	} else {
		res.redirect('/checkin');
	}
};
