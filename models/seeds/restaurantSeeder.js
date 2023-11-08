const bcrypt = require('bcryptjs')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const db = require('../../config/mongoose')
const Restaurant = require('../restaurant')
const restaurantList = require('./restaurant.json').results
const User = require('../user')

const seedUser = [{
  email: 'user1@example.com',
  password: '12345678'
}, {
  email: 'user2@example.com',
  password: '12345678'
}]

db.once('open', async () => {
  console.log('mongodb connected!')
  await new Promise(function (resolve) {
    seedUser.forEach((user, index) => {
      bcrypt
        .genSalt(10)
        .then(salt => bcrypt.hash(user.password, salt))
        .then(hash => User.create({
          email: user.email,
          password: hash
        }))
        .then(seed => {
          const userId = seed._id
          return Promise.all(
            Array.from({ length: 3 }, (_, i) => {
              const restaurant = restaurantList[i + index * 3]
              restaurant['userId'] = userId
              return Restaurant.create(restaurant)
            })
          )
        })
        .then(() => {
          console.log('done!')
          if (index === seedUser.length - 1) resolve()
        })
        .catch(err => console.log(err))
    })
  })
  process.exit()
})
