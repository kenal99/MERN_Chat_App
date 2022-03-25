const mongoose = require("mongoose");

const connectDB = () => {
  mongoose
    .connect(process.env.Mongo_URI)
    .then(() => {
      console.log("MongoDB connected successfully");
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = connectDB;
