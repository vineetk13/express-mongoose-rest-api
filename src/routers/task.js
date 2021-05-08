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

router.get("/tasks", auth, async (req, res) => {
      try{
            const tasks = await Task.find({author:req.user._id});
            res.status(200).send(tasks);
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