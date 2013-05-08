

console.log("MAIN");





exports.show = function(req, res){
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

                console.log(time_query);

                var guide_query = user
                    .select(user.first_name, user.last_name, user.profile_pic)
                    .from(user)
                    .where(
                        user.user_id.equals(current_guide)
                    ).toQuery();

                client.query(time_query, [], function (err, result) {
                    if (err) {
                        // error!
                    } else if (result.rows.length < 1) {
                        // no user found with that username!
                    } else {
                        console.log(result.rows[0].start_time);
                        start_time = result.rows[0].start_time;
                        end_time = result.rows[0].end_time;
                    }
                    done();
                });


                client.query(guide_query, [], function (err, result) {
                    if (err) {
                        // error!
                    } else if (result.rows.length < 1) {
                        // no user found with that username!
                    } else {
                        console.log(result.rows[0].profile_pic);
                        first_name = result.rows[0].first_name;
                        last_name = result.rows[0].last_name;
                        pic_url = result.rows[0].profile_pic;
                    }
                    done();
                });
            }
        })
    }
	var template_engine = req.app.settings.template_engine;
	res.locals.session = req.session;
    res.render('main', 
        {'tour_checkin': tour_checkin, 
        'first_name': first_name,
        'last_name': last_name,
        'pic_url': pic_url,
        'start_time': start_time, 
        'end_time': end_time
    });
};