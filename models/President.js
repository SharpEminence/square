var mongoose = require("mongoose");
var Schema = mongoose.Schema;

class PresidentClass {
  static register(payload) {
    return this(payload).save();
  }
}

var presidentSchema = new Schema(
  {
    event: { type: Schema.Types.ObjectId, ref: "Event" },
    title: String,
    designation: String,
    year: String,
    description: String,
    video_url: String,
    image_data: String,
    video_data: String,
    created_at: Date,
    updated_at: Date,
  },
  { collection: "presidents" }
);
presidentSchema.loadClass(PresidentClass);
presidentSchema.set("timestamps", true);

var President = mongoose.model("President", presidentSchema);

module.exports = President;
