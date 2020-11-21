require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const mongoose = require('mongoose')

const app = express()

app.set('view engine', 'ejs')

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
app.use(express.static('public'))

//connecting to database
mongoose.connect(
  `mongodb://${process.env.DB_HOST}:27017/${process.env.DB_NAME}`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => console.log('----successfully connected to database------')
)

//creating schema for ouur database
const articleSchema = {
  title: String,
  content: String,
}
//creating a model to use our articleSchema
const Article = mongoose.model('Article', articleSchema)

//fetch all of our articles

app.get('/articles', (req, res) => {
  Article.find({}, (err, results) => {
    if (!err) return res.send(results)
    res.send(err)
  })
})

//creating new article
app.post('/articles', (req, res) => {
  const article = new Article({
    title: req.body.title,
    content: req.body.content,
  })
  article.save(err => {
    if (!err) {
      return res.send('successfully added a new record')
    } else {
      res.send(err)
    }
  })
})

//deleting an article
app.delete('/articles', (req, res) => {
  Article.deleteMany({}, err => {
    if (!err) return res.send('Deleted all records successfully')
    res.send(err)
  })
})

//fetch individual specific article
app
  .route('/articles/:articleTitle')
  .get((req, res) => {
    Article.findOne({ title: req.params.articleTitle }, (err, results) => {
      if (results) return res.send(results)
      res.send('No articles matching that title')
    })
  })
  .put((req, res) => {
    Article.update(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      { overwrite: true },
      err => {
        if (!err) return res.send('Successfully updated article')
      }
    )
  })
  .patch((req, res) => {
    Article.update({ title: req.params.articleTitle }, { $set: req.body }, err => {
      if (!err) return res.send('Successfully updated')
      res.send(err)
    })
  })
  .delete((req, res) => {
    Article.deleteOne({ title: req.params.articleTitle }, err => {
      if (!err) return res.send('Deleted successfully')
      res.send(err)
    })
  })
app.listen(3000, function () {
  console.log('Server started on port 3000')
})
