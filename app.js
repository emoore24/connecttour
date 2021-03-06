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

var pg = require('pg').native;
module.pg = pg;

//defining our tables
var user = sql.define({
    name: 'Users',
    columns: ['user_id', 'first_name', 'last_name', 'year', 'clubs', 'college_id', 'image_profile_pic', 'major']
});
    
var story = sql.define({
    name: 'Stories',
    columns: ['story_id', 'user_id', 'college_id', 'story_text']
});
    
var college = sql.define({
    name: 'Colleges',
    columns: ['college_id', 'name', 'latitude', 'longitude']
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


var connectstring = "postgres://shcpmwtwyxuxax:IFYCad_h0oQi_YAvjercNOIsto@ec2-54-235-152-226.compute-1.amazonaws.com:5432/dfu6b4s2s6n3v1?ssl=true";
var pgconnstring  = "postgres://shcpmwtwyxuxax:IFYCad_h0oQi_YAvjercNOIsto@ec2-54-235-152-226.compute-1.amazonaws.com:5432/dfu6b4s2s6n3v1?ssl=true";

var tour_checkin = false, college_checkin = false, current_tour, current_guide, current_college, current_tour;

module.user     = user;
module.story    = story;
module.college  = college;
module.tour     = tour;
module.event    = event;
module.faq      = faq;
module.feedback = feedback;

module.connectstring   = connectstring;
module.pgconnstring    = connectstring;
module.tour_checkin    = tour_checkin;
module.college_checkin = college_checkin;
module.current_college = current_college;
module.current_guide = current_guide;
module.current_tour = current_tour;



var express = require('express')
        , engine = require('ejs-locals')
  , http = require('http')
        , store = new express.session.MemoryStore
  , path = require('path')
  , nodemailer = require('nodemailer')
  , main     = require('./routes/main')
  , events   = require('./routes/events')
  , stories  = require('./routes/stories')
  , profile  = require('./routes/profile')
  , map      = require('./routes/map')
  , question = require('./routes/question_queue')
  , feedback = require('./routes/tour_feedback')
  , checkin  = require('./routes/checkin')
  , stats    = require('./routes/stats')
  , qq       = [];

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
app.get('/', checkin.show);
app.get('/main', main.show);
app.get('/stats', stats.show);
app.get('/map', map.show);
app.get('/events', events.show);
app.get('/events/:date', events.show);
app.get('/stories', stories.show);
app.get('/profile/:id', profile.show);
app.get('/question_queue', question.show);
app.get('/tour_feedback', feedback.show);
app.get('/checkin', checkin.show);

app.use(express.static(__dirname + '/public'));

var server = http.createServer(app);

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

var io = require('socket.io').listen(server);
module.io = io;

var num_ppl = 0;
io.sockets.on('connection', function (socket) {
    num_ppl++;
    io.sockets.emit('number of visitors', num_ppl);
    console.log('NEW CONNECTION!');
    io.sockets.emit('new_q', qq);
    socket.on('disconnect', function () {
        num_ppl-=1;
        socket.broadcast.emit('number of visitors', num_ppl);
    });
    
    socket.on('new_question', function(msg) {
        qq.push(msg);
        socket.broadcast.emit('new_q', qq);
        socket.emit('new_q', qq);
        socket.emit('ack');
    });
});

/*pg.connect(pgconnstring, function (err, client, done) {
   if (err) {
       // error!
       done();
   } else {
       client.query('SELECT password FROM users WHERE username=$1', ['tom'], function (err, result) {
           if (err) {
               // error!
           } else if (result.rows.length < 1) {
               // no user found with that username!
           } else {
               console.log(result.rows[0].password)
           }
           done();
       });
   }
});*/

app.use(express.bodyParser()); // Automatically parses form data

app.post('/confirm', function(req, res){ // Specifies which URL to listen for
    // req.body -- contains form data
    pg.connect(pgconnstring, function (err, client, done) {
    if (err) {
       // error!
        console.log(err);
        done();
    } else {
        client.query('INSERT INTO Feedbacks(user_id, overall, slider_value_engaging, slider_value_informative, comments) values($1, $2, $3, $4, $5)', [current_guide, req.body.overall, req.body.slider_value_engaging, req.body.slider_value_informative, req.body.comments], function(err, result) {
            if (err) {
               // error!
               console.log(err);
           } else {
               res.render('/confirm');
           }
           done();
       });
    }
    })
});

app.post('/main', function(req, res) {
    var select_tour_guide_harvard= req.body.select_tour_guide_harvard
      , select_tour_guide_mit = req.body.select_tour_guide_mit
      , select_tour_guide_bu = req.body.select_tour_guide_bu;
    console.log("CHECKIN");
    pg.connect(pgconnstring, function(err, client, done) {
        if (err) {
          console.log(err);
        } else {
          var select_school = req.body.select_school;
          var select_tour_guide = req.body.select_tour_guide;
          if (select_school) {
            module.college_checkin = true;
            module.current_college = select_school
          }
          if (select_school == 'Harvard') {
            console.log(select_tour_guide_harvard);
            select_tour_guide = select_tour_guide_harvard;
          }
          else if (select_school == 'MIT') {
            select_tour_guide = select_tour_guide_mit;
          }
          else if (select_school == 'BostonUniversity')  {
            select_tour_guide = select_tour_guide_bu;
          }
          var guide_query = user
            .select(user.star())
            .from(user)
            .where(
              user.first_name.equals(select_tour_guide)
            ).toQuery();
          client.query(guide_query, function(err, result) {
            if (err) {
              console.log(err);
            } else {
              // console.log(result);
              if (result.rows.length > 0) {
                module.tour_checkin = true;
                module.current_guide = result.rows[0];
                var tour_query = tour.
                  select(tour.star())
                  .from(tour)
                  .where(
                    tour.user_id.equals(module.current_guide.user_id)
                  ).toQuery();
                client.query(tour_query, function(err, tour_result) {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log('BOO');
                    console.log(tour_result);
                    if (tour_result.rows.length > 0) {
                      module.current_tour = tour_result.rows[0];
                      res.redirect('main');
                    }
                  }
                });
                
              }
            }
          });  
        };
    })
    //res.redirect('main');
});
