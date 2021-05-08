const express = require("express");
const Task = require("../models/task");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/tasks", auth, (req, res) => {
      // const task = new Task(req.body);
      const task = new Task({...req.body, author:req.user._id});

      task.save().then(() => res.status(201).send(task))
      .catch((err) => {
            res.status(400).send(err);
      })
});

// GET /tasks?completed=true/false
// GET /tasks?limit=10&skip=20
// GET /tasks?sortBy=createdAt:desc/asc
router.get("/tasks", auth, async (req, res) => {
      const match = {};
      const sort = {};

      if(req.query.completed){
            match.completed = req.query.completed === "true";
      }

      if(req.query.sortBy){
            const arr =  req.query.sortBy.split(":");
            sort[arr[0]] = arr[1] === "desc" ? -1 : 1;
      }

      try{
            // const tasks = await Task.find({author:req.user._id});
            // await req.user.populate("tasks").execPopulate();
            await req.user.populate({
                  path:"tasks", 
                  match, 
                  options:{
                        limit:parseInt(req.query.limit),
                        skip:parseInt(req.query.skip),
                        sort
                  }
            }).execPopulate();
            // res.status(200).send(tasks);
            res.status(200).send(req.user.tasks);
      }
      catch(e){
            res.status(500).send(e);
      }
});

router.get("/tasks/:id", auth, async (req, res) => {
      const taskId = req.params.id;
      try{
            const task = await Task.findOne({_id:taskId, author:req.user._id});
            if(!task){
                  res.status(404).send();
            }
            res.send(task);
      }
      catch(e){
            res.status(500).send();
      }
});

router.patch("/tasks/:id", auth, async (req, res) => {
      const taskId = req.params.id;
      const updates = Object.keys(req.body);
      const validUpdates = ["description", "completed"];
      const isValidOperation = updates.every((u) => validUpdates.includes(u));
      if(!isValidOperation){
            return res.status(400).send({error:"Invalid updates"});
      }
      try{
            const task = await Task.findOne({_id:taskId, author:req.user._id});
            if(!task){
                  return res.status(404).send({error:"Not found"});
            }
            updates.forEach((update) => task[update] = req.body[update]);
            await task.save();
            res.send(task);
      }
      catch(e){
            res.status(400).send();
      }
})

router.delete("/tasks/:id", auth, async (req, res) => {
      const taskId = req.params.id;
      try{
            const task = await Task.findByIdAndDelete({_id:taskId, author:req.user._id});

            if(!task){
                  res.status(404).send({error:"Not found"});
            }
            res.status(200).send(task);
      }
      catch (e){
            res.status(500).send(e);
      }
});

module.exports = router;