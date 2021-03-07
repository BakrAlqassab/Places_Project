const express = require("express");
const route = express.Router();
require("dotenv").config();
const app = express();
const Place = require("../models/places");
const mongoose = require("mongoose");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

const Review = require("../models/review");

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
    if (!req.body.place) throw new ExpressError("Invalid Place data", 400);
    const geoData = await geocoder.forwardGeocode({

      query:req.body.place.location,
      autocomplete:true,
      limit:1
    }).send()
    
    const place = new Place(req.body.place);
    console.log(place);
    place.geometry = geoData.body.features[0].geometry
    await place.save();
    req.flash("success", "Succesfully made a new Place");
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
    const place = await Place.findById(req.params.id).populate("reviews");
    if (!place) {
      req.flash("error", "Cannot find that place!");
      return res.redirect("/places");
    }
    console.log(place);
    res.render("places/show", { place });
  })
);

// Reviews

route.post(
  "/places/:id/reviews",
  catchAsync(async (req, res) => {
    const place = await Place.findById(req.params.id);
    const review = new Review(req.body.review);
    place.reviews.push(review);
    await review.save();
    await place.save();
    req.flash("success", "Created New Review");
    res.redirect(`/places/${place._id}`);
  })
);

// This function will trigger the findOneAdDelete middleware
// in ./models/places
route.delete(
  "/places/:id/reviews/:reviewId",
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Place.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Succesfully deleted review");
    res.redirect(`/places/${id}`);
    // res.send("Delete me ");
  })
);

// Updating

route.get(
  "/places/:id/edit",
  catchAsync(async (req, res) => {
    const place = await Place.findById(req.params.id);
    if (!place) {
      req.flash("error", "Cannot find that place!");
      return res.redirect("/places");
    }
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
    req.flash("success", "Succesfully updated Place");
    res.redirect(`/places/${place._id}`);
  })
);

//Delete
route.delete(
  "/places/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Place.findByIdAndDelete(id);
    req.flash("success", "Succesfully deleted place");
    res.redirect("/places");
  })
);

// Error Handling

route.all("*", (req, res, next) => {
  next(new ExpressError("Page not founds", 404));
});
route.use((err, req, res, next) => {
  const { statuscode = 500 } = err;
  if (!err.message) err.message = " Something went Wrong";
  res.status(statuscode).render("./error", { err });
  // res.send("Something went wrong");
});
module.exports = route;
