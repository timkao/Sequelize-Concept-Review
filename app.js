const express = require('express')
const app = express()
const port = 3000
const db = require('./model')
const models = db.models

app.get('/products', (req, res, next) => {
  models.Product.findAll({})
  .then(result => {
    res.send(result)
  })
  .catch(next)
})

app.get('/products/:id', (req, res, next) => {
  models.Product.findById(req.params.id)
  .then(result => {
    result.name = `${result.name}x`
    return result.save() // use find and save as an alternative to update
  })
  .then(result => {
    res.send(result)
  })
})

app.use(function(err, req, res, next){
  res.status(404).send(err)
})


app.listen(port, function(){
  console.log(`listening on ${port}`)
})
