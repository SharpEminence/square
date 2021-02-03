var mongoose = require("mongoose");
var Schema = mongoose.Schema;
class PollClass {
  static register(payload) {
    return this(payload).save();
  }
}

var pollSchema = new Schema(
  {
    event_id: { type: Schema.Types.ObjectId, ref: "Event" },
    question: String,
    options: [String],
    created_at: Date,
    updated_at: Date,
  },
  { collection: "polls" }
);
pollSchema.loadClass(PollClass);

var Poll = mongoose.model("Poll", pollSchema);

module.exports = Poll;
