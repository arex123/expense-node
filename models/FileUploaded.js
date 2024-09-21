
const { default: mongoose, Schema } = require("mongoose");

const FilesUploaded = mongoose.model(
  "filesUploaded",
  new Schema({
    url: {
      type: String,
      required: true,
    },
  })
);

module.exports = FilesUploaded;
