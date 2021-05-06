const express = require("express");
const User = require("../models/user");

const router = new express.Router();

router.post("/users", async (req, res) => {
      const user = new User(req.body);

      try {
            await user.save();
            res.status(200).send(user);
      }
      catch (e){
            res.status(400).send(e);
      }
      // user.save().then(() => res.send(user))
      // .catch((err) => {
      //       // res.status(400);
      //       // res.send(err)
      //       res.status(400).send(err);
      // });

      // res.send("Testing...");
});

router.get("/users", async (req, res) => {
      try {
            const users = await User.find({});
            res.send(users);
      }
      catch (e){
            res.status(500).send(e);
      }
      // User.find({}).then((users) => res.send(users))
      // .catch((err) => res.status(500).send(err));
});

router.get("/users/:id", (req, res) => {
      const _id = req.params.id;
      
      User.findById(_id).then((user) => {
            if(!user)
                  return res.status(404).send();

            res.send(user);
      })
      .catch((err) => {
            res.status(500).send(err);
      })
});

router.patch("/users/:id", async (req, res) => {
      const updates = Object.keys(req.body);
      const allowedUpdates = ["name","email","password"];
      const isValidUpdate = updates.every((u) => allowedUpdates.includes(u));
      if(!isValidUpdate){
            res.status(400).send({error:"Invalid update properties"});
      }
      try {
            const user = await User.findByIdAndUpdate(req.params.id, req.body, { new:true, runValidators:true });

            if(!user){
                  return res.status(404).send();
            }
            res.send(user);
      }
      catch (e) {
            res.status(400).send(e);
      }
})

module.exports = router;