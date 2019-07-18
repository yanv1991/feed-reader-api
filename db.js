
const mongoose = require('mongoose');

exports.init = () => {
  let dev_db_url =
    "mongodb+srv://dev:dev@cluster0-z3ysl.mongodb.net/test?retryWrites=true&w=majority";
  let mongoDB = process.env.MONGODB_URI || dev_db_url;

  mongoose.connect(mongoDB, { useNewUrlParser: true });
  mongoose.Promise = global.Promise;
  let db = mongoose.connection;
  db.on("error", console.error.bind(console, "MongoDB connection error:"));
};
