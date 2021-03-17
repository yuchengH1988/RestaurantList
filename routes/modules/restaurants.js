const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')

//Search route
router.get('/searchs', (req, res) => {
  const userId = req.user._id
  const keyword = req.query.keyword.toLowerCase()
  console.log('keyword:', keyword)
  return Restaurant.find({
    userId,
    $or: [
      {
        category: {
          $regex: keyword,
          $options: 'i'
        }
      },
      {
        name: {
          $regex: keyword,
          $options: 'i'
        }
      },
    ]
  })
    .lean()
    .then(restaurants => res.render('index', { restaurants, keyword }))
    .catch(err => res.send(err))
})

router.get('/new', (req, res) => {
  return res.render('new')
})
router.post('/', (req, res) => {

  if (!req.body.image) { req.body.image = 'https://www.publicdomainpictures.net/pictures/280000/velka/not-found-image-15383864787lu.jpg' }
  let newItem = req.body
  newItem.userId = req.user._id
  return Restaurant.create(newItem)
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

router.get('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Restaurant.findOne({ _id, userId })
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => console.log(error))
})

router.get('/:id/edit', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Restaurant.findOne({ _id, userId })
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

router.put('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  let savedItem = req.body
  savedItem._id = _id
  return Restaurant.findOne({ userId, _id })
    .then(restaurant => {
      restaurant = Object.assign(restaurant, savedItem)
      return restaurant.save()
    })
    .then(() => res.redirect(`/restaurants/${_id}`))
    .catch(error => console.log(error))
})

//Delete route
router.delete('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Restaurant.findOne({ _id, userId })
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router