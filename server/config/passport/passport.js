//load bcrypt
var bCrypt = require('bcrypt-nodejs');
var md5 = require('md5');

module.exports = function (passport, user) {
  var User = user;
  var LocalStrategy = require('passport-local').Strategy;

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findByPk(id).then(function (user) {
      if (user) {
        done(null, user.get());
      } else {
        done(user.errors, null);
      }
    });
  });

  passport.use(
    'local-signin',
    new LocalStrategy(
      {
        // by default, local strategy uses username and password, we will override with username
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true, // allows us to pass back the entire request to the callback
      },

      function (req, username, password, done) {
        console.log('local-signin');
        console.log(username, password);

        var User = user;

        var isValidPassword = function (userpass, password) {
          return bCrypt.compareSync(password, userpass);
        };

        User.findOne({
          where: {
            username: username,
          },
        })
          .then(function (user) {
            if (!user) {
              return done(null, false, {
                message: 'username does not exist',
              });
            }

            if (user.password !== md5(password)) {
              return done(null, false, {
                message: 'Incorrect password.',
              });
            }

            var userinfo = user.get();
            return done(null, userinfo);
          })
          .catch(function (err) {
            console.log('Error:', err);

            return done(null, false, {
              message: 'Something went wrong with your Signin',
            });
          });
      }
    )
  );
};
