var mongoose = require("mongoose");
var Schema = mongoose.Schema;

class BroadcastClass {
  static register(payload) {
    return this(payload).save();
  }
}

var broadcastSchema = new Schema(
  {
    event: { type: Schema.Types.ObjectId, ref: "Event" },
    title: String,
    message: String,
    status: { type: Number, default: 0 },
    created_at: Date,
    updated_at: Date,
  },
  { collection: "broadcasts" }
);
broadcastSchema.loadClass(BroadcastClass);
broadcastSchema.set("timestamps", true);

var Broadcast = mongoose.model("Broadcast", broadcastSchema);

module.exports = Broadcast;
