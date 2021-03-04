const express = require("express");
const path = require("path");
const Place = require("./models/places");
const mongoose = require("mongoose");
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
const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}))

app.get("/", async (req, res) => {
  res.render("home");
});
app.get("/places", async (req, res) => {
  //render all the data from DB
  const places = await Place.find({});
  //send rendered data to views/places/index.ejs
  res.render("places/index", { places });
});
app.post("/places", async (req, res) => {
  res.send(req.body);
});
app.get("/places/new", async (req, res) => {
 res.render('places/new')
});
app.get("/places/:id", async (req, res) => {
  // looking for particular Place
  const place = await Place.findById(req.params.id);
  res.render("places/show",{place});
});




app.listen(3005, () => {
  console.log("Serving on Port 3005");
});
