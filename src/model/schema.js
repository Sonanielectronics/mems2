const mongoose = require("mongoose");
var validator = require("validator")

const blogSchema = new mongoose.Schema({

  username: {
    type: String,
    required: true,
    unique: [true],
    trim : true
  },
  password: {
    type: String,
    required: true
  },
  Email: {
    type: String,
    trim: true,
    required: true,
    validate(value) {
        if (!validator.isEmail(value)) {
            throw new error("Email is not valid");
        }
    }
},   
  PhoneNumber:{
    type: Number,
    required: true
  },
  post :{
    data:Buffer,
    contentType:String,
    adultphoto :Array,
    adultvideo:Array,
    kidsphoto:Array,
    kidsvideo:Array
  },
  profilepic:{
    type: String
  }

});

const blog = new mongoose.model("collections", blogSchema);

module.exports = blog;
