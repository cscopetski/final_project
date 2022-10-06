const express = require("express");
const bodyParser = require("body-parser");
const mongodb = require("mongodb");
const app = express();
const dotenv = require("dotenv");
const router = require("./routes");
const mongoose = require("mongoose");
const User = require("./models/user.schema");
dotenv.config();

app.use(express.static("public"));

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}/?retryWrites=true&w=majority`;

mongoose.connect(uri).catch((err) => {
  console.log(err);
});

const client = new mongodb.MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: mongodb.ServerApiVersion.v1,
});

let collection = null;

client
  .connect()
  .then(() => {
    return client.db("Users").collection("logins");
  })
  .then((__collection) => {
    collection = __collection;

    return collection.find({}).toArray();
  })
  .then(console.log);

// User.findOne({ email: "cscopetski@gmail.com" })
//   .then((user) => {
//     console.log(user);
//     user.set("playerStats.currHealth", user.playerStats.currHealth + 1);
//     return user;
//   })
//   .then((user1) => {
// user1.save().then(() => {
//   User.find().then((data) => {
//     console.log(data);
//   });
// });
//   });

app.get("/", (req, res) => res.send("Hello World!"));

app.use("/", router);

app.listen(process.env.PORT || 3000);
