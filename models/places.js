const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const placesSchema = new Schema({
  title: String,
  openingHours: [],
  description: String,
  location: String,
  coordinates: [],
  image: String,
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:'Review'
    }]
});

module.exports = mongoose.model("Place", placesSchema);
