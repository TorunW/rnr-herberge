var db = require('../database/db');
var path = require('path');
const { url } = require('inspector');

var pagesController = require('../controllers/pagesController.js');
var postsController = require('../controllers/postsController.js');
var messagesController = require('../controllers/messagesController.js');
var bookingsController = require('../controllers/bookingsController.js');
var translationsController = require('../controllers/translationsController.js');

module.exports = function (app, passport) {
  app.get('/db/pages/', pagesController.getPages);
  app.post('/db/pages/', pagesController.createPage);
  app.get('/db/pages/:link', pagesController.getPageByLink);
  app.get('/db/pagesbyid/:id', pagesController.getPageById);
  app.put('/db/pages/:id', pagesController.updatePage);
  app.delete('/db/pages/:id', pagesController.deletePage);

  app.get('/db/postsbypageid/:id', postsController.getPostsByPageId);
  app.post('/db/posts/', postsController.createPost);
  app.put('/db/posts/:id', postsController.updatePost);
  app.delete('/db/posts/:id', postsController.deletePost);

  app.get('/db/messages/', messagesController.getMessages);

  app.get('/db/bookings/', bookingsController.getBookings);

  // Login
  // app.post('/db/signin/', function (req, res, next) {
  //   console.log('inside of the login', req.sessionID);
  //   // passport.authenticate with local parameter will call function that configured in passport.use(new strategyCalss)
  //   passport.authenticate('local-signin', function (err, user, info) {
  //     console.log('Inside passport.authenticate() callback');
  //     console.log(
  //       `req.session.passport: ${JSON.stringify(req.session.passport)}`
  //     );
  //     console.log(`req.user: ${JSON.stringify(req.user)}`);
  //     if (err) {
  //       return next(err);
  //     }
  //     if (!user) {
  //       return res.redirect('/signin');
  //     }
  //     //req.login calls passport.serialize user
  //     req.login(user, function (err) {
  //       console.log('Inside req.login() callback');
  //       console.log(
  //         `req.session.passport: ${JSON.stringify(req.session.passport)}`
  //       );
  //       console.log(`req.user: ${JSON.stringify(req.user)}`);
  //       if (err) {
  //         return next(err);
  //       }
  //       return res.redirect('/admin/');
  //     });
  //   })(req, res, next);
  // });

  // function isLoggedIn(req, res, next) {
  //   if (req.isAuthenticated()){
  //       return next();
  //   } else {
  //       res.redirect('/signin');
  //   }
  // }

  // // Get Admin
  // app.get("/admin/",isLoggedIn, (req, res) => {
  //   console.log('why not res send file?"?!"?§!"?§!?§!?!?§!');
  //   res.sendFile(path.join(__dirname, '../../build', 'index.html'));
  // });
};
