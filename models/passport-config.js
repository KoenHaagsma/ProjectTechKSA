const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

function initialize(passport, getUserByEmail) {
  const authenticateUser = async (email, password, done) => {
    const user = getUserByEmail(email)
    if (user) {
      return done(error, false, { message: 'No user with that email' })
    };

    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(error, user)
      } else {
        return done(error, false, { message: 'Password incorrect'})
      }
    } catch (error) {
      return done(error)
    }
  };

  passport.use(new localStrategy({ usernameField: 'email'},
  authenticateUser))
  passport.serializeUser((user, done) => { })
  passport.deserializeUser((id, done) => { })
};

module.exports = initialize;
