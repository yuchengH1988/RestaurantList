// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()
const home = require('./modules/home')
const users = require('./modules/user')
const restaurants = require('./modules/restaurants')

// 準備引入路由模組
router.use('/restaurants', restaurants)
router.use('/users', users)
router.use('/', home)

// 匯出路由器
module.exports = router