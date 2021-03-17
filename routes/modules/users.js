const express = require('express')
const passport = require('passport')
const router = express.Router()
const User = require('../../models/user')

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
})
)

router.post('/register', (req, res) => {
  const { name, email, password, confirmPssword } = req.body
  User.findOne({ email }).then(user => {
    if (user) {
      console.log('User already exists.')
      res.render('register', {
        name, email, password, confirmPassword
      })
    } else {
      return User.create({
        name, email, password
      })
        .then(() => res.redirect('/'))
        .catch(err => console.log(err))
    }
  })
})

router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/users/login')
})

router.get('/login', (req, res) => {
  res.render('login')
})

router.get('/register', (req, res) => {
  res.render('register')
})
module.exports = router
