const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
module.exports = mongoose.model('Event', eventSchema);