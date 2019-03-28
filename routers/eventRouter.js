'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');

const router = express.Router();

const resize = require('../modules/resize');
const eventController = require('../controllers/eventController');

const storage = multer.diskStorage({
  destination: 'public/uploads/',
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, file.fieldname + '-' + Date.now() + file.originalname)
  }
});

const upload = multer({ storage: storage });

router.get('/all', (req, res) => {
  eventController.event_list_get().then((result) => {
    res.send(result);
  });
});

router.get('/events/:param1', (req, res) => {
  eventController.event_list_sorted(req.params.param1).then((result) => {
    res.send(result);
  });
});

router.post('/upload', upload.single('image'),(req, res, next) => {
  req.body.image = req.file.path;
  req.body.thumbNail = req.file.destination + 'thumbnails/' + 'thumbnail-' + req.file.filename;

  next();
});

router.use('/upload', (req, res, next) => {
  resize.resizeImage(req.file.path, req.file.destination + 'thumbnails/' + 'thumbnail-' + req.file.filename, next);
});

router.use('/upload', (req, res, next) => {
  eventController.event_upload(req).then((result) => {
    res.send(result);
  });
});

router.patch('/event/:id', (req, res) => {
  eventController.event_update(req).then((result) => {
    res.send(result);
  });
});

router.delete('/event/:id', (req, res) => {
  eventController.event_delete(req.params.id).then((result) => {
    res.send(result);
  });
});

module.exports = router;