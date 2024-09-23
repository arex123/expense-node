
const { default: mongoose, Schema } = require("mongoose");

const FilesUploaded = mongoose.model(
  "filesUploaded",
  new Schema({
    url: {
      type: String,
      required: true,
    },
    userId:mongoose.Schema.Types.ObjectId
  })
);

module.exports = FilesUploaded;
