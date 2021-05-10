const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Task = require("./task");

// Creating a model
const userSchema = new mongoose.Schema({
      name:{
            type:String,
            required:true
      },
      email:{
            type:String,
            required:true,
            unique:true,
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
      },
      tokens:[{
            token:{
                  type:String,
                  required:true
            }
      }],
      avatar:{
            type:Buffer
      }
},{
      timestamps:true
});

userSchema.virtual("tasks",{
      ref:"Task",
      localField:"_id",
      foreignField:"author"
})

userSchema.methods.toJSON = function(){
      const user = this;
      const userObj = user.toObject();

      delete userObj.tokens;
      delete userObj.password;

      return userObj;
}

userSchema.methods.getAuthToken = async function() {
      const user = this;
      const token = await jwt.sign({_id:user._id.toString()}, process.env.JWT_SECRET);
      
      user.tokens = user.tokens.concat({token});
      await user.save();

      return token;
}

userSchema.statics.findByCredentials = async (email, password) => {
      const user = await User.findOne({email});
     
      if(!user){
            throw new Error("Unable to login");
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if(!isMatch){
            throw new Error("Invalid login credentials");
      }
      
      return user;
}

// Hash the plain text password before saving
userSchema.pre("save", async function(next) {
      const user = this;

      if(user.isModified("password")){
            user.password = await bcrypt.hash(user.password, 8);
      }

      next();
})

// Remove user tasks when user is removed
userSchema.pre("remove", async function(next){
      const user = this;

      await Task.deleteMany({author:user._id});

      next();

})

const User = mongoose.model("User", userSchema);

module.exports = User;