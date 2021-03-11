var mongoose = require("mongoose");
var Schema = mongoose.Schema;

class JitsiClass {
  static register(payload) {
    return this(payload).save();
  }
}

var jitsiSchema = new Schema(
  {
    agenda: { type: Schema.Types.ObjectId, ref: "Agenda" },
    event: { type: Schema.Types.ObjectId, ref: "Event" },
    video: String,
    created_at: Date,
    updated_at: Date,
  },
  { collection: "jitsis" }
);
jitsiSchema.loadClass(JitsiClass);

var Jitsi = mongoose.model("Jitsi", jitsiSchema);

module.exports = Jitsi;
