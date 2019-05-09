const express = require("express");
var mongo = require("mongoose");
var bodyParser = require("body-parser");
var user = require("./user.js");
var promB = require("express-prom-bundle");
var promC = requrre("prom-client");

//establish app
const app = express();
app.use(bodyParser.json());
app.get("/", (req, res) => {
  res.send("Blabber");
});
app.listen(3000, () => console.log("listening on port 3000"));

//mongo connection
//waittime start set amount of time. calling connect when its not open yet
setTimeout(function() {
  mongo.connect("mongodb://mongo:127.0.0.1");
}, 2000);
mongo.connection.on(
  "error",
  console.error.bind(console, "MongoDB connection error")
);
mongo.connection.once("open", function() {
  console.log("MongoDB open");
});

//keeps track of id
var id = 1;

// Metrics endpoint
app.get("/metrics", (req, res) => {
  res.set("Content-Type", Prometheus.register.contentType);
  res.end(Prometheus.register.metrics());
});

//functions
//post function for new user
app.post("/blabs", async function(req, res) {
  //create new user
  var u = new user({
    id: id,
    postTime: Date.now() / 1000,
    author: { email: req.body.author.email, name: req.body.author.name },
    message: req.body.message
  });

  //function for saving into mongoose
  u.save(function(err) {
    if (err) {
      return console.log(err);
    } else {
      res.status(201).send({
        status: "Blab created successfully",
        id: u.id,
        postTime: Date.now() / 1000,
        author: { email: req.body.author.email, name: req.body.author.name },
        message: req.body.message
      });
    }
  });
  id++;
});

//gets the user
app.get("/blabs", async function(req, res) {
  var createdSince = 0; //represents creation count

  if (req.query.createdSince !== undefined) {
    createdSince = parseInt(req.query.createdSince);
  }

  //finds the user
  user.find({ postTime: { $gt: createdSince } }, function(err, users) {
    var map = {};
    users.forEach(function(u) {
      map[u.id] = u;
    });
    res.status(200).send(map);
  });
});

//deletes the user
app.delete("/blabs/:id", async function(req, res) {
  user.deleteOne({ id: req.params.id }, function(err, users) {
    if (err) {
      res.status(404, { status: "Blab not found" });
    } else {
      res.status(200).send("Blab deleted successfully " + req.params.id);
    }
  });
});
