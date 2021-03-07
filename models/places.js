const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

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
