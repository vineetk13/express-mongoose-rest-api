const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;

const connectionURL = "mongodb://127.0.0.1:27017";
const dbName = "task-manager";

MongoClient.connect(connectionURL, {useNewUrlParser:true , useUnifiedTopology:true}, (error, client) => {
      if(error){
            return console.log("Unbale to connect to the database: ",error);
      }
      console.log("Connected successfully to database..!!");
      const db = client.db(dbName);

      // Inserting 1 document
      // db.collection("Users").insertOne({
      //       name:"Vivek K",
      //       age:16
      // }, (error, result) => {
      //       if(error){
      //             return console.log("Cannot insert the user");
      //       }
      //       console.log(result.ops);
      // });

      // Inserting many documents
      // db.collection("Users").insertMany([
      //       {
      //             name:"Sai", 
      //             age:18
      //       },
      //       {
      //             name:"Virat",
      //             age:16
      //       }], (error, result) => {
      //             if(error){
      //                   return console.log("Cannot insert the users");
      //             }
      //             console.log(result.ops);
      //       }
      // )

      // Fetching documents
      // db.collection("Users").findOne({ name:"Vinay K" }, (error, user) => {
      //       if(error){
      //             return console.log("Unable to fetch results...");
      //       }
      //       console.log(user);
      // }) 

      // db.collection("Users").find({ age:16 }).toArray((error, users) => {
      //       console.log(users);
      // })

      // Updating documents
      // db.collection("Users").updateOne({ _id:new mongodb.ObjectID("608d999b95fb935e4866ecd4") }, {
      //       $set:{
      //             name:"Tanishq"
      //       }
      // }).then((result) => console.log(result))
      // .catch((error) => console.log(error));

      // Deleting documents 
      db.collection("Users").deleteOne({ name:"Tanishq" })
      .then((result) => console.log(result.result))
      .catch((error) => console.log(error));
})