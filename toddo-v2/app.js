//jshint esversion:6

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const app = express()

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))

/* const items = ["Buy Food", "Cook Food", "Eat Food"];
const workItems = [];
 */

//coonecting mongoose to database
mongoose.connect('mongodb://localhost:27017/todolistDB', { useNewUrlParser: true, useUnifiedTopology: true })

// creating schema
const itemsSchema = {
  name: String, //data type for name  will be string
}

//after creating schema we then create the model- model is capitalised
const Item = mongoose.model('Item', itemsSchema)

// creating default documents
const item1 = new Item({
  name: 'Welcome to your todo app',
})
const item2 = new Item({
  name: 'Hit the + button to add a list ',
})
const item3 = new Item({
  name: '<--- Hit this to delete an item',
})
const defaultItems = [item1, item2, item3]

const listSchema = {
  name: String,
  items: [itemsSchema],
}

//model for our list
const List = mongoose.model('List', listSchema)

//insert items to the item collection
Item.insertMany(defaultItems, err => {
  if (!err) {
    console.log(`successfully inserted document`)
  } else {
    console.log(err)
  }
})
app.get('/', (req, res) => {
  //get all records from database
  Item.find({}, function (err, foundItems) {
    // console.log(foundItems)
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function (err) {
        if (err) {
          console.log(err)
        } else {
          console.log('successfully saved items to db')
        }
      })
      res.redirect('/')
    } else {
      res.render('list', { listTitle: 'Today', newListItems: foundItems })
    }
  })
})

//handles creating of new items
app.post('/', function (req, res) {
  const itemName = req.body.newItem
  //model for our input
  const item = new Item({
    name: itemName,
  })
  item.save() //this will save the item to database Item collection
  res.redirect('/')
})

//handles deleting of a new item
app.post('/delete', (req, res) => {
  //console.log(req.body.checkbox)
  const checkedItemId = req.body.checkbox
  Item.findByIdAndRemove(checkedItemId, err => {
    if (!err) {
      console.log('successfully deleted an item')
      res.redirect('/')
    }
  })
})

//setting up dynmic routes
app.get('/:customListName', (req, res) => {
  let customListName = req.params.customListName
  List.findOne({ name: customListName }, (err, foundList) => {
    if (!err) {
      if (!foundList) {
        //console.log(`Doesn't exist`)
        //create a new list
        const list = new List({
          name: customListName,
          items: defaultItems,
        })
        list.save()
        res.redirect(`/${customListName}`)
      } else {
        //console.log('exists')
        //show an existing list
        res.render('list', {
          listTitle: foundList.name,
          newListItems: foundList.items,
        })
      }
    }
  })
})

app.get('/about', function (req, res) {
  res.render('about')
})

app.listen(3001, function () {
  console.log('Server started on port 3000')
})
