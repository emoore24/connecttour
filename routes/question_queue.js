/*
 * GET home page.
 */

exports.show = function(req, res){
	var template_engine = req.app.settings.template_engine;
	res.locals.session = req.session;
    res.render('question_queue');
};

pg.connect(pgconnstring, function (err, client, done) {
    if (err) {
        // error!
        done();
    } else {

    }
});