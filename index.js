'use strict';
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const sharp = require('sharp');

const Schema = mongoose.Schema;

const storage = multer.diskStorage({
  destination: 'public/uploads/',
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, file.fieldname + '-' + Date.now() + file.originalname)
  }
});

const upload = multer({ storage: storage });

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

const eventSchema = new Schema({
  category: String,
  title: String,
  description: String,
  image: String,
  thumbNail: String,
  coordinates: {
    latitude: String,
    longitude: String
  }
});

const Event = mongoose.model('Event', eventSchema);

mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PWD}@${process.env.DB_HOST}:${process.env.DB_PORT}/test`).then(() => {
  console.log('Connected successfully.');
  app.listen(3000);
}, err => {
  console.log('Connection to db failed: ' + err);
});

app.get('/all', (req, res) => {
  Event.find().then(all => {
    console.log(all);
    res.send(all);
  });
});

app.get('/events/:param1', (req, res) => {
  console.log(req.params.param1);
  Event.find({ category: req.params.param1}).then(all => {
    console.log(all);
    res.send(all);
  });
});

app.post('/upload', upload.single('image'),(req, res, next) => {
  console.log(req.body);
  console.log(req.file.path);
  next();
});

app.use('/upload', (req, res, next) => {
  sharp(req.file.path)
  .resize(400, 400)
  .toFile(req.file.destination + 'thumbnails/' + 'thumbnail-' + req.file.filename).then(() => {
    next();
  }).catch(err => {
    console.log(err)
  });
});

app.use('/upload', (req, res, next) => {
  console.log(req.body.latitude);
  console.log(req.body.longitude);
  console.log(req.file.path);

  const obj = {
    category: req.body.category,
    title: req.body.title,
    description: req.body.description,
    image: req.file.path,
    thumbNail: req.file.destination + 'thumbnails/' + 'thumbnail-' + req.file.filename,
    coordinates: {
      latitude: req.body.latitude,
      longitude: req.body.longitude,
    }
  };

  Event.create(obj).then(post => {
    console.log(post.id);
    res.send('Created Event');
  });
});