const express = require("express");
require("./db/tasks");

const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

const app = express();
const port = process.env.PORT || 3000;

// ********** MIDDLEWARES *******************
// app.use((req, res, next) => {
//       if(req.method==='GET'){
//             res.send("GET requests is disabled");
//       }
//       else{
//             next();
//       }
// })

// app.use((req, res, next) => {
//       res.status(503).send("The server is under maintenance");
// })

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);


app.listen(port, () => {
      console.log("App setup and running on ",port);
});

// const User = require("./models/user");

// const main = async () => {
//       const user = await User.findById("609520bf68228d6bcc6aca0e");
//       await user.populate("tasks").execPopulate();
//       console.log(user.tasks);
// }

// main();