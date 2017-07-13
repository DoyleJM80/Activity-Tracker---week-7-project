const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const parseurl = require('parseurl');
const passport = require('passport');
const Activities = require('./models/activities');
const Users = require('./models/Users');
const BasicStrategy = require('passport-http').BasicStrategy;
mongoose.Promise = require('bluebird');

const app = express();

app.use('/static', express.static('static'));
app.use((req, res, next) => {
  passport.authenticate('basic', {session: false});
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
mongoose.connect('mongodb://localhost:27017/stats');


// Show a list of all activities I am tracking, and links to their individual pages
app.get('/api/activities', (req, res) => {
  Activities.find({}).then((result) => {
    res.json(result);
  });
});

// Create a new activity for me to track.
app.post('/api/activities', (req, res) => {
  const activity = new Activities({
    activityName: req.body.activity,
    data: [{
      date: req.body.date,
      amount: req.body.amount
    }]
  }).save();
  res.json({});
});

// Show information about one activity I am tracking, and give me the data I have recorded for that activity.
app.get('/api/activities/:id', (req, res) => {
  var id = req.params.id;
  Activities.findOne({_id: id}).then((result) => {
    res.json({result});
  });
});

// Update one activity I am tracking, changing attributes such as name or type. Does not allow for changing tracked data.
app.patch('/api/activities/:id', (req, res) => {

});

// Delete one activity I am tracking. This should remove tracked data for that activity as well.
app.delete('/api/activities/:id', (req, res) => {

});

// Add tracked data for a day. The data sent with this should include the day tracked. You can also override the data for a day already recorded.
app.put('/api/activities/:id', (req, res) => {

});

// Remove tracked data for a day.
app.delete('/api/activities/:id', (req, res) => {

});

app.listen(3000, () => {
  console.log("I'm Listening");
});

// const activity = new Activities({
//   activityName: 'push-ups',
//   data: [{
//     amount: 36
//   }]
// }).save();
