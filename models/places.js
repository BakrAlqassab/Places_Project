const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const campgroundSchema = new Schema ({
    title:String,
       openingHours:String
    description:String,
     location:String,

})