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

passport.use(new BasicStrategy(
  function(username, password, done) {
    Users.findOne({username: username, password: password}).then(function(user) {
      if(!user) {
        return done(null, false);
      } else {
        return done(null, username);
      }
    });
  }
));

app.use((req, res, next) => {
  passport.authenticate('basic', {session: false});
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
mongoose.connect('mongodb://localhost:27017/stats');


// Show a list of all activities I am tracking, and links to their individual pages
app.get('/api/activities', passport.authenticate('basic', {session: false}), (req, res) => {
  Activities.find({}).then((result) => {
    res.json(result);
  });
});

// Create a new activity for me to track.
app.post('/api/activities', passport.authenticate('basic', {session: false}), (req, res) => {
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
app.get('/api/activities/:id', passport.authenticate('basic', {session: false}), (req, res) => {
  var id = req.params.id;
  Activities.findOne({_id: id}).then((result) => {
    res.json({result});
  });
});

// Update one activity I am tracking, changing attributes such as name or type. Does not allow for changing tracked data.
app.patch('/api/activities/:id', passport.authenticate('basic', {session: false}), (req, res) => {
  let id = req.params.id;
  let activityName = req.body.activityName;
  Activities.findOne({_id: id}).then((result) => {
    result.activityName = activityName;
    result.save();
    res.json(result);
  });
});


// Delete one activity I am tracking. This should remove tracked data for that activity as well.
app.delete('/api/activities/:id', passport.authenticate('basic', {session: false}), (req, res) => {
  let id = req.params.id;
  Activities.deleteOne({_id: id}).then((result) => {
    res.json({});
  });
});

// Add tracked data for a day. The data sent with this should include the day tracked. You can also override the data for a day already recorded.
app.post('/api/activities/:id', passport.authenticate('basic', {session: false}), (req, res) => {
  let id = req.params.id;
  let date = req.body.date;
  let amount = req.body.amount;
  Activities.findOne({_id: id}).then((result) => {
    result.data.push({
      date: date,
      amount: amount
    });
    result.save();
    res.json(result);
  });
});

app.post('/api/activities/:id/stats', passport.authenticate('basic', {session: false}), (req, res) => {
  var id = req.params.id;
  var newDate = req.body.date;
  var newDateObject = new Date(newDate);
  var newAmount = req.body.amount;

  Activities.findOne({_id: id}).then((item) => {
    for(var i = 0; i < item.data.length; i++) {
      var dbDate = item.data[i].date;
      if (dbDate.getTime() === newDateObject.getTime()) {
        console.log('working!');
        item.data[i].amount = newAmount;
        console.log('replaced amount ', item.data[i].amount);
        item.save().then(() => {
          res.json(item);
        });
        return;
      } else {
        console.log('not going to replace');
        item.data.push({
          date: newDate,
          amount: newAmount
        });
        item.save().then(() => {
          console.log('pushed and saved');
          res.json({});
        });
        return;
      }
    }
  });
});

// Remove tracked data for a day.
app.delete('/api/stats/:id', passport.authenticate('basic', {session: false}), (req, res) => {
  let id = req.params.id;
  let dataId = req.body.dataId;
  Activities.update({_id: id}, {$pull: {data: {_id: dataId}}}).then((result) => {
    res.json(result);
  });
});

app.listen(3000, () => {
  console.log("I'm Listening");
});

// const activity = new Activities({
//   activityName: 'Pull-ups',
//   data: [{
//     amount: 36
//   }]
// }).save();
