const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
      description:{
            type:String
      },
      completed:{
            type:Boolean,
            default:false
      },
      author:{
            type:mongoose.Schema.Types.ObjectId,
            required:true
      }
},{
      timestamps:true
})

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;