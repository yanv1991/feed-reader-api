const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FeedSchema = new Schema({
    url: {type: String, required: true},
});

module.exports = mongoose.model('Feed', FeedSchema);