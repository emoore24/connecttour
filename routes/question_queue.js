/*
 * GET home page.
 */

exports.show = function(req, res){
    module.io = module.parent.io;
	var template_engine = req.app.settings.template_engine;
	res.locals.session = req.session;
    res.render('question_queue');
};