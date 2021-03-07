const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");
const opts = { toJSON: { virtuals: true } };
const placesSchema = new Schema({
  title: String,
  openingHours: [],
  description: String,
  location: String,
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: { Number },
      required: true,
    },
  },
  // coordinates: [],
  image: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
},opts);

placesSchema.virtual("properties.popUpMarkup").get(function () {
  return `<h4><a href="/places/${this._id}">${this.title}</a></h4><p style='line-break: anywhere;'>${this.description.substring(0,50)}...</p>
  <h5> Lng: ${this.geometry.coordinates[0] } Lat:${this.geometry.coordinates[1]}</h5>`
});
// https://mongoosejs.com/docs/api/model.html#model_Model.findByIdAndDelete
// This middle well delete the related rating to tte deleted Place
placesSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});
module.exports = mongoose.model("Place", placesSchema);
