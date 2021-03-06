const express = require("express");
const path = require("path");

const ejsMate = require("ejs-mate");

const app = express();
// will use for Update methods
const method = require("method-override");
app.use(method("_method"));
app.set("view engine", "ejs");

// The default is true  , just for refrence
app.use(express.urlencoded({ extended: true }));

// const fs = require('fs');
// const folderName = process.argv[2] || 'views/places'
// const cssfolderName = process.argv[2] || 'views/places/style'
// const jsfolderName = process.argv[2] || 'views/places/js'

// fs.mkdirSync(folderName);
// // fs.writeFileSync(`${folderName}/index.html`, "");
// fs.writeFileSync(`${folderName}/app.js`, "");
// fs.writeFileSync(`${folderName}/styles.css`, "");
//load assets
app.engine("ejs", ejsMate);


app.use("/style", express.static(path.resolve(__dirname, "views/style")));
app.use("/img",express.static(path.resolve(__dirname,"views/img")));
app.use("/js", express.static(path.resolve(__dirname, "views/js")));
// app.set("views", path.join(__dirname, "views"));
app.use( express.static(path.join(__dirname, "places/style")));

// load routers

app.use("/", require("./views/routes/router"));

app.listen(3005, () => {
  console.log("Serving on Port 3005");
});
