var mongoose = require("mongoose");
var Schema = mongoose.Schema;

class SessionClass {
  static register(payload) {
    return this(payload).save();
  }
}

var sessionSchema = new Schema(
  {
    event: { type: Schema.Types.ObjectId, ref: "Event" },
    speakers: [{ type: Schema.Types.ObjectId, ref: "Speaker" }],
    description: String,
    start_time: String,
    end_time: String,
    image: String,
    video: String,
    date: Date,
    created_at: Date,
    updated_at: Date,
  },
  { collection: "sessions" }
);
sessionSchema.loadClass(SessionClass);

var Session = mongoose.model("Session", sessionSchema);

module.exports = Session;
