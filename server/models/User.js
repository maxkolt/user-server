const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: String,
  name: String,
  about: String,
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);