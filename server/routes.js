let mongo = require('./db.js');
let util = require('./util.js');


let getEntries = (req, res) => {
  let query = {};

  console.log(req.user);

  if(!!req.user) {
    query = {username: req.user.username};
  } else {
    query = { "username" : { "$exists" : false } };
  }

  mongo.getDB().collection('entries')
    .find(query)
    .toArray(function(err, docs) {
      res.send(docs);
    });
};

let postEntry = (req, res) => {
  let weight = req.body.weight;
  let food = req.body.food;
  let date = util.getDate(new Date());

  if(!weight && !food) return res.status(500).send('No weight or food property in body!');

  let query = {date: date};

  if(!!req.user) {
    query.username = req.user.username;
  } else {
    query.username ={ "$exists" : false };
  }

  mongo.getDB().collection('entries').find(query)
    .toArray(function(err, docs) {
      console.log(docs);
      if(docs.length === 0) {
        // If date doesn't exist, then create new entry with weight or food
        console.log("Creating new entry for", date, weight, food, req.user);

        let details = {
          date: date,
          food: !!food ? [food] : [],
          weight: !!weight ? weight : null
        };

        if(!!req.user) {
          details.username = req.user.username;
        }

        mongo.getDB().collection('entries').insertOne(details).then(result => {
          console.log("Success Created!", result.insertedId);
          res.send(result.insertedId);
        });

      } else {
        // If does exist, then update db with weight or add food to food arr
        console.log("Updating entry", date, weight, food, req.user);

        let updateValues = docs[0];

        if(!!weight) updateValues.weight = weight;
        if(!!food) updateValues.food = [...updateValues.food, food];

        mongo.getDB().collection('entries').updateOne(query, updateValues)
        .then(result => {
          console.log("Success Updated!");
          res.send("Updated!" + result);
        });

      }
    });
};

let deleteEntry = (req, res) => {
  let date = req.body.date;

  if(!date) return res.status(500).send('No date property in body!');

  mongo.getDB().collection('entries').deleteOne(req.body)
    .then(result => {
      console.log("Success Removed!");
      res.send("Deleted!" + result);
    });
};

let updateEntry = (req, res) => {
  let date = req.body.date;
  let updatedValues = {};

  if(!date) return res.status(500).send('No date property in body!');
  if(!!req.body.food) updatedValues.food = req.body.food;
  if(!!req.body.weight) updatedValues.weight = req.body.weight;
  updatedValues.date = date;

  mongo.getDB().collection('entries').updateOne({date: date}, updatedValues)
    .then(result => {
      console.log("Success Updated!");
      res.send("Updated!" + result);
    });
};

module.exports = {getEntries, postEntry, deleteEntry, updateEntry};