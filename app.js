// require packages used in the project
const express = require('express')
const session = require('express-session')
const usePassport = require('./config/passport')
const app = express()
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const methodOverride = require('method-override')
const routes = require('./routes')
require('./config/mongoose')

// setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(session({
  secret: 'ThisIsMySecret',
  resave: false,
  saveUninitialized: true
}))
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
usePassport(app)
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  next()
})

app.use(routes)

// start and listen on the Express server
app.listen(3000, () => {
  console.log(`Express is listening on http://localhost:3000`)
})