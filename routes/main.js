

console.log("MAIN");





exports.show = function(req, res){
    var pg = module.parent.pg;
    var tour_checkin = module.parent.tour_checkin;
    var user = module.parent.user;
    var tour = module.parent.tour;
    var current_tour = module.parent.current_tour;
    console.log("HEY");
    console.log(current_tour);
    var current_college = module.parent.current_college;
    var current_guide = module.parent.current_guide;
    var pgconnstring = module.parent.pgconnstring;
    var first_name;
    var last_name;
    var pic_url;
    var start_time;
    var end_time;
    if (tour_checkin) {
        pg.connect(pgconnstring, function (err, client, done) {
            if (err) {
                // error!
                done();
            } else {

                var time_query = tour
                    .select(tour.start_time, tour.end_time)
                    .from(tour)
                    .where(
                        tour.tour_id.equals(current_tour)
                ).toQuery();

                // var guide_query = user
                //     .select(user.first_name, user.last_name, user.profile_pic)
                //     .from(user)
                //     .where(
                //         user.user_id.equals(current_guide)
                //     ).toQuery();

                // client.query(time_query, [], function (err, result) {
                //     if (err) {
                //         // error!
                //     } else if (result.rows.length < 1) {
                //         // no user found with that username!
                //     } else {
                //         console.log(result.rows[0].start_time);
                //         start_time = result.rows[0].start_time;
                //         end_time = result.rows[0].end_time;
                //     }
                //     done();
                // });


                // client.query(guide_query, [], function (err, result) {
                //     if (err) {
                //         // error!
                //     } else if (result.rows.length < 1) {
                //         // no user found with that username!
                //     } else {
                //         console.log(result.rows[0].profile_pic);
                //         first_name = result.rows[0].first_name;
                //         last_name = result.rows[0].last_name;
                //         pic_url = result.rows[0].profile_pic;
                //     }
                //     done();
                // });
            }
        })
    }
	var template_engine = req.app.settings.template_engine;
	res.locals.session = req.session;
    res.render('main', 
        {'tour_checkin': tour_checkin, 
        'tour_guide': current_guide,
        'tour': current_tour,
        'college': current_college,
    });
};
