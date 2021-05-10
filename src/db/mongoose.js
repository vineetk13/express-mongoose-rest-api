const mongoose = require("mongoose");
const validator = require("validator");

// Connecting to database;
mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser:true,
      useUnifiedTopology:true,
      useCreateIndex:true,
      useFindAndModify:true
});

// Creating a model
const User = mongoose.model("User", {
      name:{
            type:String,
            required:true
      },
      email:{
            type:String,
            validate(value){
                  if(!validator.isEmail(value)){
                        throw new Error("Email inappropriate");
                  }
            }
      },
      age:{
            type:Number,
            validate(value){
                  if(value < 0)
                        throw new Error("Age must be positive");
            }
      }
});

// Creating instances of the model
const me = new User({
      name:"Vinay",
      email:"vinay.01@gmail.com"
});

// Performing actions on the instances 
me.save()
.then(() => console.log(me))
.catch((err) => console.log(err));