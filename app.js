/**
 * Module dependencies.
 *
 * Template for ConnecTour's app.js taken from 
 * https://github.com/chovy/express-template-demo
 *
 */

//change your template engine and hostname here ('ejs' or 'dust')
var domain = 'localhost';

//require the module
var sql = require('sql');

//defining our tables
var user = sql.define({
    name: 'Users',
    columns: ['user_id', 'first_name', 'last_name', 'year', 'clubs', 'college_id', 'image_profile_pic']
});
    
var story = sql.define({
    name: 'Stories',
    columns: ['story_id', 'user_id', 'college_id', 'story_text']
});
    
var college = sql.define({
    name: 'Colleges',
    columns: ['college_id', 'name']
}); 
    
var tour = sql.define({
    name: 'Tours',
    columns: ['tour_id', 'user_id', 'college_id', 'start_time', 'end_time']
});
    
var event = sql.define({
    name: 'Events',
    columns: ['event_id', 'college_id', 'start_time', 'end_time', 'description', 'image_logo_file', 'group_name']
});

var faq = sql.define({
    name: 'Faqs',
    columns: ['college_id', 'question', 'answer', 'faq_id']
});
    
var feedback = sql.define({
    name: 'Feedbacks',
    columns: ['feedback_id', 'user_id', 'overall', 'slider_value_engaging', 'slider_value_informative', 'comments']
});

var express = require('express')
        , engine = require('ejs-locals')
  , http = require('http')
        , store = new express.session.MemoryStore
  , path = require('path')
  , main     = require('./routes/main')
  , events   = require('./routes/events')
  , stories  = require('./routes/stories')
  , profile  = require('./routes/profile')
  , map      = require('./routes/map')
  , question = require('./routes/question_queue')
  , feedback = require('./routes/tour_feedback')
  , checkin  = require('./routes/checkin')
  , stats    = require('./routes/stats');

var app = express();

	app.engine('ejs', engine);

app.configure(function(){

  app.set('template_engine', 'ejs');
  app.set('domain', domain);
  app.set('port', process.env.PORT || 8080);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('wigglybits'));
    app.use(express.session({ secret: 'whatever', store: store }));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'assets')));

// //middleware
// app.use(function(req, res, next){
// 	if ( req.session.user ) {
// 		req.session.logged_in = true;
// 	}
// 	res.locals.message = req.flash();
// 	res.locals.session = req.session;
// 	res.locals.q = req.body;
// 	res.locals.err = false; 
// 	next();
// });

});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.locals.inspect = require('util').inspect;
app.get('/', main.show);
app.get('/stats', stats.show);
app.get('/map', map.show);
app.get('/events', events.show);
app.get('/stories', stories.show);
app.get('/profile', profile.show);
app.get('/question_queue', question.show);
app.get('/tour_feedback', feedback.show);
app.get('/checkin', checkin.show);

app.use(express.static(__dirname + '/public'));

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

var connectstring = "postgres://shcpmwtwyxuxax:IFYCad_h0oQi_YAvjercNOIsto@ec2-54-235-152-226.compute-1.amazonaws.com:5432/dfu6b4s2s6n3v1";
