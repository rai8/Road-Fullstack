const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const PORT = process.env.PORT || 3000

//handling middlewares
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
//define the home route
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})
app.get('/bmicalculator', (req, res) => {
  res.sendFile(__dirname + '/bmiCalculator.html')
})

app.post('/', (req, res) => {
  let num1 = req.body.num1
  let num2 = req.body.num2
  let sum = Number(num1) + Number(num2)
  res.send(`The result of the calculation is ${sum}`)
})
app.post('/bmicalculator', (req, res) => {
  let weight = parseFloat(req.body.weight)
  let height = parseFloat(req.body.height)
  let bmi = weight / (height * height)
  //console.log(weight, height)
  res.send(`The BMI is ${bmi}`)
})
//listening to server
app.listen(PORT, () => {
  console.log(`----------server is up and running----------`)
})
