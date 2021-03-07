const express = require("express");
const path = require("path");
const session = require("Express-session");
const flash = require("connect-flash");
const ejsMate = require("ejs-mate");

const app = express();
// will use for Update methods
const method = require("method-override");
const routers = require("./routes/routers");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/places-map", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
app.use(method("_method"));
app.set("view engine", "ejs");

// The default is true  , just for refrence
app.use(express.urlencoded({ extended: true }));

//load assets
app.engine("ejs", ejsMate);

app.use("/style", express.static(path.resolve(__dirname, "views/style")));
app.use("/img", express.static(path.resolve(__dirname, "views/img")));
app.use("/js", express.static(path.resolve(__dirname, "views/js")));

app.use(express.static(path.join(__dirname, "public")));

// SESSIONS
// Session expire after a week
const sessionConfig = {
  secret: "This should be secret :)",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));
app.use(flash());
//this middleware will take the value of the flash success and put in our locals at succsess value
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next()
});
// load routers

app.use("/", routers);

app.listen(3005, () => {
  console.log("Serving on Port 3005");
});
