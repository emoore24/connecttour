/*
 * GET home page.
 */

exports.show = function (req, res) {
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
            user.id.equals(req.param.id)
        ).toQuery();
        client.query(query, function (err, result) {
            if (err) {
               // error!
               console.log(err);
           } else {
               var template_engine = req.app.settings.template_engine;
	           res.locals.session = req.session;
               res.render('/profile', 'user': result.rows[0]);
           }
           done();
       });
    }
    });
};
