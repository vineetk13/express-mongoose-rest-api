const express = require("express");
const Task = require("../models/task");

const router = express.Router();

router.post("/tasks", (req, res) => {
      const task = new Task(req.body);
      task.save().then(() => res.send(task))
      .catch((err) => {
            res.status(400).send(err);
      })
});

router.delete("/tasks/:id", async (req, res) => {
      try{
            const user = await Task.findByIdAndDelete(req.params.id);

            if(!user){
                  res.status(404).send();
            }
            res.status(200).send(user);
      }
      catch (e){
            res.status(500).send(e);
      }
});

module.exports = router;