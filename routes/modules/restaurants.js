const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')

router.get('/new', (req, res) => {
  return res.render('new')
})
router.post('/', (req, res) => {
  if (!req.body.image) { req.body.image = 'https://www.publicdomainpictures.net/pictures/280000/velka/not-found-image-15383864787lu.jpg' }
  const newItem = req.body
  return Restaurant.create(newItem)
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

router.get('/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => console.log(error))
})

router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

router.put('/:id', (req, res) => {
  const id = req.params.id
  const savedItem = req.body
  savedItem._id = id
  return Restaurant.findById(id)
    .then(restaurant => {
      restaurant = Object.assign(restaurant, savedItem)
      return restaurant.save()
    })
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch(error => console.log(error))
})

//Delete route
router.delete('/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

//Search route
router.get('/searchs', (req, res) => {
  const keyword = req.query.keyword.toLowerCase()
  Restaurant.find()
    .lean()
    .then(restaurants => {
      return restaurants.filter(restaurants =>
        restaurants.name.toLowerCase().includes(keyword)
        || restaurants.name_en.toLowerCase().includes(keyword)
        || restaurants.category.toLowerCase().includes(keyword)
      )
    })
    .then(restaurants => res.render('index', { restaurants, keyword }))
    .catch(error => console.log(error))
})

module.exports = router