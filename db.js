var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:12648/nodeauth");

module.exports = mongoose.connection;