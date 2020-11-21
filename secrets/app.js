//jshint esversion:6
require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const PORT = process.env.PORT || 3000
const ejs = require('ejs')

app.use(express.static('public'))
app.set('view engine', 'ejs')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

//connecting to database
mongoose.connect(
  `mongodb://${process.env.DB_HOST}:27017/${process.env.DB_NAME}`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => console.log('----successfully connected to database------')
)

//creating a user schema
const userSchema = {
  email: String,
  password: String,
}

//creating a model for our user schema
const User = new mongoose.model('User', userSchema)

//defining our routes
app.get('/', (req, res) => {
  res.render('home')
})
app.get('/login', (req, res) => {
  res.render('login')
})
app.get('/register', (req, res) => {
  res.render('register')
})

//handle registration
app.post('/register', (req, res) => {
  const newUser = new User({
    email: req.body.username,
    password: req.body.passord,
  })
  newUser.save(err => {
    if (!err) return res.render('secrets')
    return res.send(err)
  })
})

//handle the login
app.post('/login', (req, res) => {
  const username = req.body.username
  const password = req.body.password
  User.findOne({ email: username }, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      if (results) {
        if (results.password === password) {
          res.render('secrets')
        }
      }
    }
  })
})

//listening to server
app.listen(PORT, () => console.log(`----server is up and running-----`))
