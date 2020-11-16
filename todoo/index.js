const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const getDate = require('./date')
const PORT = process.env.PORT || 3000
let items = ['Wash dishes', 'Buy milk']

//using the ejs templating engine
app.set('view engine', 'ejs')

//setting up static folders
app.use(express.static('public'))
//setting up middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

//setting up routes
app.get('/', (req, res) => {
  let day = getDate()

  res.render('list', { day: day, items: items })
})

//handle post request
app.post('/addtask', (req, res, next) => {
  let item = req.body.newItem
  items.push(item)
  console.log(item)
  res.redirect('/')
})

//listening to server
app.listen(PORT, () => console.log(`------server is up and running---------`))
