const getDate = () => {
  let today = new Date()
  let options = { weekday: 'long', day: 'numeric', month: 'long' }
  let day = today.toLocaleDateString('en-US', options)
  return day
}
//console.log(getDate())
module.exports = getDate
