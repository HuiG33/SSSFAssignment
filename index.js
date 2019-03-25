'use strict';
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');

const db = require('./modules/database');
const resize = require('./modules/resize');

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

const Event = db.getEventSchema();

db.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PWD}@${process.env.DB_HOST}:${process.env.DB_PORT}/test`, app);

app.get('/all', (req, res) => {
  Event.find().then(all => {
    console.log(all);
    res.send(all);
  });
});

app.get('/events/:param1', (req, res) => {
  Event.find({ category: req.params.param1}).then(all => {
    console.log(all);
    res.send(all);
  });
});

app.post('/upload', upload.single('image'),(req, res, next) => {
  req.body.image = req.file.path;
  req.body.thumbNail = req.file.destination + 'thumbnails/' + 'thumbnail-' + req.file.filename;

  next();
});

app.use('/upload', (req, res, next) => {
  resize.resizeImage(req.file.path, req.file.destination + 'thumbnails/' + 'thumbnail-' + req.file.filename, next);
});

app.use('/upload', (req, res, next) => {
  Event.create(req.body).then(post => {
    console.log(post.id);
    res.send('Created Event');
  });
});