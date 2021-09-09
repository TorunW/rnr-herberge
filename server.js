// Create express app
var express = require('express');
var passport = require('passport');
// var LocalStrategy = require("passport-local").Strategy;
var session = require('express-session');
var path = require('path');
var app = express();
var fileUpload = require('express-fileupload');
var cors = require('cors');

// Body Parser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// passport & session
app.use(
  session({ secret: 'keyboard cat', resave: false, saveUninitialized: true })
); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// cors
app.use(cors());

// Serve static files
app.use(express.static(__dirname + '/build'));
app.use(express.static(__dirname + '/uploads'));

// file upload
app.use(fileUpload());

// models
var models = require('./server/models/');

// routes
var routes = require('./server/routes/routes.js')(app, passport);

// Root endpoint
app.get(['/*', '/admin*'], (req, res, next) => {
  let reqUrlFirstSplit = req.url.split('/')[1];
  if (reqUrlFirstSplit.indexOf('db') > -1) next();
  else if (reqUrlFirstSplit.indexOf('admin') > -1) {
    console.log(req.isAuthenticated());
    if (req.isAuthenticated())
      res.sendFile(path.join(__dirname, 'build', 'index.html'));
    else res.redirect('/signin');
  } else res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// load passport strategies
require('./server/config/passport/passport.js')(passport, models.user);

// sync Database
models.sequelize
  .sync()
  .then(function () {
    console.log('Nice! Database looks fine');
  })
  .catch(function (err) {
    console.log(err, 'Something went wrong with the Database Update!');
  });

app.post('/upload', function (req, res) {
  console.log(req);
  if (!req.files) return res.status(500).send({ msg: 'file is not found' });

  // a<ccessing the file
  const myFile = req.files.file;

  const fileName =
    myFile.name.split('.')[myFile.name.split('.').length - 2] +
    '_' +
    Date.now();

  const fileExtension =
    myFile.name.split('.')[myFile.name.split('.').length - 1];
  const newFileName = fileName + '.' + fileExtension;

  let subdir = 'pictures';
  if (myFile.mimetype.indexOf('video') > -1) subdir = 'videos';

  // mv() method places the file inside public directory
  myFile.mv(
    `${__dirname}/uploads/${subdir}/${newFileName}`,
    async function (err) {
      if (err) return res.status(500).send({ msg: 'Error occured' });
      try {
        return res.send({
          name: myFile.name,
          path: `${subdir}/${newFileName}`,
          type: 'picture',
        });
      } catch (err) {
        console.error(err);
      }
    }
  );
});

// Default response for any other request
app.use(function (req, res) {
  res.status(404);
});

// Server port
var HTTP_PORT = 80;

// Start server
app.listen(HTTP_PORT, () => {
  console.log();
  console.log('Server running on port %PORT%'.replace('%PORT%', HTTP_PORT));
});

// Logout
app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});
