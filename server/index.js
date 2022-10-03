const express = require("express");
const bodyParser = require("body-parser");
const mongodb = require("mongodb");
const app = express();
const dotenv = require("dotenv");

dotenv.config();

app.use(express.static("public"));

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}/?retryWrites=true&w=majority`;
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

app.get("/", (req, res) => res.send("Hello World!"));

app.listen(process.env.PORT || 3000);
