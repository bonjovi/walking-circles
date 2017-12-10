var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/nodeauth");

module.exports = mongoose.connection;