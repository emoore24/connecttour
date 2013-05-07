/*
 * GET home page.
 */

exports.show = function(req, res){
	var template_engine = req.app.settings.template_engine;
	res.locals.session = req.session;
    res.render('tour_feedback');
};
