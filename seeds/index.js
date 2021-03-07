const Place = require("../models/places");
const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
mongoose.connect("mongodb://localhost:27017/places-map", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection Error"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];
const seedDB = async () => {
  await Place.deleteMany({});
  for (let i = 0; i < 20; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const place = new Place({
      location: `${cities[random1000].city},${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: "https://source.unsplash.com/collection/483251" ,
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur, sequi! Reprehenderit omnis aperiam dignissimos iste blanditiis numquam, corporis molestiae necessitatibus repellendus nisi non veritatis natus, voluptate autem sit voluptates! Illum.",
      geometry: {
        type: "Point",

        coordinates: [cities[random1000].longitude,cities[random1000].latitude], 
      },
    });
    await place.save();
  }
};
seedDB().then(() => {
  mongoose.connection.close();
});
