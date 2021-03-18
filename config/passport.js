const passport = require('passport')
const bcrypt = require('bcryptjs')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')

module.exports = app => {
  app.use(passport.initialize())
  app.use(passport.session())
  //本地登入
  passport.use(new LocalStrategy({ usernameField: 'email', passReqToCallback: true }, (req, email, password, done) => {
    User.findOne({ email })
      .then(user => {
        if (!user) {
          req.flash('warning_msg', 'This email is not registered.')
          return done(null, false)
        }
        return bcrypt.compare(password, user.password)
          .then(isMatch => {
            if (!isMatch) {
              req.flash('warning_msg', 'Email or password is incorrect.')
              return done(null, false)
            }
            return done(null, user)
          })
          .catch(err => done(err, false))
      })
  }))

  //設定序列化與反序列化
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then(user => done(null, user))
      .catch(err => done(err, null))
  })
}