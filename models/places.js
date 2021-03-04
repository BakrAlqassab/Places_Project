const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const placesSchema = new Schema({
  title: String,
  openingHours: String,
  description: String,
  location: String,
})

module.exports = mongoose.model("Place", placesSchema);



