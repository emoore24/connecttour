/*
 * GET home page.
 */
exports.show = function(req, res){
	var tour_checkin = module.parent.tour_checkin;
    if (!tour_checkin) {
        res.redirect('/checkin');
    } else {
        var template_engine = req.app.settings.template_engine;
        res.locals.session = req.session;
        res.render('tour_feedback');
    }
};