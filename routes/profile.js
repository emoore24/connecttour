/*
 * GET home page.
 */

exports.show = function (req, res) {
    var pg = module.parent.pg;
    var pgconnstring = module.parent.pgconnstring;
    var user = module.parent.user;
    pg.connect(pgconnstring, function (err, client, done) {
    if (err) {
        // error!
        console.log(err);
        done();
    } else {
        var query = user
        .select(user.star())
        .from(user)
        .where(
            user.user_id.equals(req.params.id)
        ).toQuery();
        client.query(query, function (err, result) {
            if (err) {
               // error!
               console.log(err);
           } else {
               var template_engine = req.app.settings.template_engine;
	           res.locals.session = req.session;
               res.render('profile', {'user': result.rows[0]});
           }
           done();
       });
    }
    });
};
