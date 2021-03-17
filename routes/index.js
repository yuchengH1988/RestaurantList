// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()
const home = require('./modules/home')
const users = require('./modules/users')
const restaurants = require('./modules/restaurants')

const { authenticator } = require('../middleware/auth')
// 準備引入路由模組
router.use('/restaurants', authenticator, restaurants)
router.use('/users', users)
router.use('/', authenticator, home)

// 匯出路由器
module.exports = router