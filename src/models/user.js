const mongoose = require("mongoose");
const validator = require("validator");

// Creating a model
const User = mongoose.model("User", {
      name:{
            type:String,
            required:true
      },
      email:{
            type:String,
            required:true,
            validate(value){
                  if(!validator.isEmail(value)){
                        throw new Error("Email inappropriate");
                  }
            }
      },
      password:{
            type:String,
            required:true,
            trim:true,
            minLength:3,
      }
});

module.exports = User;