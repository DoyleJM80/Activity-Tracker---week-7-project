const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const parseurl = require('parseurl');
const passport = require('passport');
const Activities = require('./models/activities');
const BasicStrategy = require('passport-http').BasicStrategy;
mongoose.Promise = require('bluebird');

const app = express();

app.use('/static', express.static('static'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
mongoose.connect('mongodb://localhost:27017/stats');

app.get('/api/activities', (req, res) => {
  Activities.find({}).then((result) => {
    res.json(result);
  });
});

app.post('/api/activities', (req, res) => {
  const activity = new Activities({
    activityName: 'pull-ups',
    data: [{
      amount: 10
    }]
  }).save();
  res.json({});
});

app.get('/api/activities/:id', (req, res) => {
  var id = req.params.id;
  Activities.findOne({_id: id}).then((result) => {
    res.json({result});
  });
});

app.patch('/api/activities/:id', (req, res) => {
  
});

app.delete('/api/activities/:id', (req, res) => {

});

app.put('/api/activities/:id', (req, res) => {

});

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
