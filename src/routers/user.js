const express = require("express");
const User = require("../models/user");
const auth = require("../middleware/auth");

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

router.post("/users/login", async (req, res) => {
      try{
            const user = await User.findByCredentials(req.body.email, req.body.password);
            const token = await user.getAuthToken();
            res.send({user, token});
      }
      catch(e) {
            res.status(400).send(e);
      }
})

router.post("/users/logout", auth, async (req, res) => {
      try{
            req.user.tokens = req.user.tokens.filter((token) => token.token!==req.token);
            await req.user.save();
            res.send();
      }
      catch(e){
            res.status(500).send();
      }
})

router.post("/users/logoutAll", auth, async (req, res) => {
      try{
            req.user.tokens = [];
            await req.user.save();
            res.send();
      }
      catch(e){
            res.status(500).send();
      }
})

router.get("/users/me", auth, async (req, res) => {
     res.send(req.user);
      // User.find({}).then((users) => res.send(users))
      // .catch((err) => res.status(500).send(err));
});

router.get("/users/:id", auth, (req, res) => {
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

router.patch("/users/me", auth, async (req, res) => {
      const updates = Object.keys(req.body);
      const allowedUpdates = ["name","email","password"];
      const isValidUpdate = updates.every((u) => allowedUpdates.includes(u));
      if(!isValidUpdate){
            res.status(400).send({error:"Invalid update properties"});
      }
      try {
            // const user = await User.findById(req.params.id);
            updates.forEach((update) => req.user[update] = req.body[update]);

            await req.user.save();

            // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new:true, runValidators:true });

            // if(!user){
            //       return res.status(404).send();
            // }
            res.send(req.user);
      }
      catch (e) {
            res.status(400).send({error:"Bad request"});
      }
})

router.delete("/users/me", auth, async (req, res) => {
      try{
            // const user = await User.findByIdAndDelete({_id:req.params.id})
            // if(!user){
            //       res.send(404).send();
            // }
            await req.user.remove()
            res.send(req.user);
      }
      catch(e){
            res.status(500).send();
      }
})

module.exports = router;