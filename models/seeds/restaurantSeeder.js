
const Restaurant = require('../restaurant')
const restaurantList = require('./restaurant.json')
const db = require('../../config/mongoose')

db.once('open', () => {
  console.log('mongodb connected!')
  restaurantList.results.forEach(data => {
    Restaurant.create({
      id: data.id,
      name: data.name,
      name_en: data.name_en,
      category: data.category,
      image: data.image,
      location: data.location,
      phone: data.phone,
      google_map: data.google_map,
      rating: data.rating,
      description: data.description,
    })

  });

})
