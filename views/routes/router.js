const express = require("express");
const route = express.Router();
const app = express();
const Place = require("../../models/places");
const mongoose = require("mongoose");
const catchAsync = require("../../utils/catchAsync");
const ExpressError = require("../../utils/ExpressError");

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

route.get("/", async (req, res) => {
  res.render("home");
});
route.get("/places", async (req, res) => {
  //render all the data from DB
  const places = await Place.find({});
  //send rendered data to views/places/index.ejs
  res.render("places/index", { places });
});
route.post(
  "/places",
  catchAsync(async (req, res, next) => {
    if (!req.body.place) throw new ExpressError('Invalid Place data',400);
    const place = new Place(req.body.place);
    await place.save();
    // redirect the page for the new place
    res.redirect(`places/${place._id}`);
  })
);
route.get("/places/new", async (req, res) => {
  res.render("places/new");
});
route.get(
  "/places/:id",
  catchAsync(async (req, res) => {
    // looking for particular Place
    const place = await Place.findById(req.params.id);
    console.log(place);
    res.render("places/show", { place });
  })
);

// Updating

// Updating

route.get(
  "/places/:id/edit",
  catchAsync(async (req, res) => {
    const place = await Place.findById(req.params.id);

    res.render("places/edit", { place });
  })
);

route.put(
  "/places/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const place = await Place.findByIdAndUpdate(id, {
      ...req.body.place,
    });
    res.redirect(`/places/${place._id}`);
  })
);

//Delete
route.delete(
  "/places/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Place.findByIdAndDelete(id);
    res.redirect("/places");
  })
);
route.all("*", (req, res, next) => {
  next(new ExpressError("Page not founds", 404));
});
route.use((err, req, res, next) => {
  const { statuscode = 500 } = err;
  if(!err.message)err.message =' Something went Wrong';
  res.status(statuscode).render('./error',{err});
  // res.send("Something went wrong");
});
module.exports = route;
