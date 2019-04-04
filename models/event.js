const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// create schema
const eventSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  creatorId: {
    type: String,
    required: true
  }
});

// create model
module.exports = mongoose.model('Event', eventSchema);
