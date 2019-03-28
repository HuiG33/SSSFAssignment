'use strict';
const Event = require('../models/eventModel');
const fs = require('file-system');

exports.event_list_get = () => {
  return Event.find().then((all) => {
    return all;
  }).catch((err) => {
    return err;
  });
};

exports.event_list_sorted = (params) => {
  return Event.find({ category: params}).then((all) => {
    return all;
  }).catch((err) => {
    return err;
  });
};

exports.event_upload = (req) => {
  return Event.create(req.body).then(post => {
    return post;
  }).catch((err) => {
    return err;
  });
};

exports.event_update = (req) => {
  return Event.findOne({_id: req.params.id}).exec().then((event) => {
    event.description = req.body.description;
    return event.save().then((updatedEvent) => {
      return updatedEvent
    }).catch((err) => {
      return err;
    });
  }).catch((err) => {
    return err;
  });
};

exports.event_delete = (id) => {
  return Event.findByIdAndDelete({_id: id}).then((event) => {
    return event;
  }).catch((err) => {
    return err;
  });
};