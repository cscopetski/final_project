const express = require("express");
const bodyParser = require("body-parser");
const mongodb = require("mongodb");
const app = express();
const dotenv = require("dotenv");
const router = require("./routes");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const path = require("node:path");
const User = require("./models/user.schema");
const { loginUser } = require("./services/login.service");
const { getEnemies } = require("./services/encounters.service");
const { updateStats } = require("./services/user.service");
const passport = require("passport");

dotenv.config();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const auth = (req, res, next) => {
  if (req.session.email) {
    next();
  } else {
    res.redirect("/");
  }
};

app.use(express.static("public"));
app.use(express.static("./"));

app.use(cookieParser("" + process.env.COOKIE_SECRET));
app.use(
  session({
    secret: "" + process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: false,
      //cookie expires in 30 days
      maxAge: 1000 * 30 * 24 * 60 * 60,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, cb) {
  cb(null, { email: user.id });
});

passport.deserializeUser(function (email, cb) {
  cb(null, email);
});

// passport.use(
//   new GitHubStrategy(
//     {
//       clientID: process.env.GITHUB_CLIENT_ID,
//       clientSecret: process.env.GITHUB_CLIENT_SECRET,
//       callbackURL: process.env.HOST + "/auth/github/callback",
//     },
//     function (accessToken, refreshToken, profile, done) {
//       done(null, profile);
//     }
//   )
// );

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

app.get("/", (req, res) => {
  if (req.session.email) {
    res.redirect("/home");
  } else {
    res.sendFile(path.resolve(__dirname, "../public/html/login.html"));
  }
});

app.use("/home", express.static("./"));
app.get("/home", auth, (req, res) => {
  res.sendFile(path.resolve(__dirname, "../public/html/index.html"));
});

app.post("/login", async (req, res) => {
  loginUser(req.body)
    .then((data, err) => {
      req.session.email = data.email;
      res.status(200);
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(403);
    });
});

app.get("/logout", async (req, res) => {
  req.session.destroy();

  res.redirect("/");
});

app.use("/", router);

app.listen(process.env.PORT || 3000);
