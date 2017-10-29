let express = require('express');
let app = express();
let mongo = require('./server/db.js');
let util = require('./server/util.js');
let routes = require('./server/routes.js');
let path = require('path');

var session = require('express-session');
var flash = require('connect-flash');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var ObjectId = require('mongodb').ObjectId; 




// Middle Ware
app.use(session({ secret: process.env.SESSION_SECRET || "dietpalsecret" }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Convert req.body to json
let bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Log incoming requests
let morgan = require('morgan');
morgan('tiny');

// Serve the client
app.use(express.static(path.join(__dirname, 'client')));
app.use(express.static(path.join(__dirname, '.')));

// Serialize and Deserialize User for passport values
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  mongo.getDB().collection('users').findOne({ _id: ObjectId(id) })
    .then(user => done(null, user));
});

// Authentication method
passport.use(new LocalStrategy({ passReqToCallback : true }, 
  function(req, username, password, done) {
    mongo.getDB().collection('users').findOne({ username: username })
    .then(user => {
      if (user === null) return done(null, false, { message: 'Incorrect username.' });
      if (user.password !== password) return done(null, false, { message: 'Incorrect password.' });
      return done(null, user);
    });
  }
));

// Handle log in request, post login with username and password query params
app.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/#!/login',
                                   failureFlash: true })
);

// Handle log out request
app.post('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

// Handle sign up request
app.post('/signup', function(req, res){
  let username = req.body.username;
  let password = req.body.password;

  if(!username || !password || password === "") return res.send('Invalid Sign Up Credentials');

  mongo.getDB().collection('users').findOne({ username: username })
  .then(user => {
    if (user !== null)  return res.send('Username already taken!');
     mongo.getDB().collection('users').insertOne({
          username: username,
          password: password
        }).then(result => {
          console.log("Success Created User!", result.insertedId);
          passport.authenticate('local', { successRedirect: '/',
                                  failureRedirect: '/#!/login',
                                  failureFlash: true })(req, res);
        });
  })
});

app.get('/user', function(req, res) {
  let data = req.user;
  if(!!data) {
    delete data.password;
  }
  res.send(data);
});

app.get('/isAuth', function(req, res) {
  let data = !!req.user ? true : false;
  res.send(data);
});


// Get all entries
app.get('/entries', routes.getEntries);

// Add entry, given weight or food
app.post('/entries', routes.postEntry);

// Delete entry, given date
app.delete('/entries', routes.deleteEntry);

// Update entry, given date, food and weight
app.put('/entries', routes.updateEntry);

app.listen( process.env.PORT || 3000);
console.log("listening on port",  process.env.PORT || 3000);






