/*
 * GET home page.
 */

exports.show = function(req, res){
	var template_engine = req.app.settings.template_engine;
	res.locals.session = req.session;
    res.render('profile');
};

pg.connect(pgconnstring, function (err, client, done) {
    if (err) {
        // error!
        done();
    } else {
        var query = user
        .select(user.star())
        .from(user)
        .where(
            user.id.equals(req.param.id)
        ).toQuery();
    }
});
