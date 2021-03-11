var mongoose = require("mongoose");
var Schema = mongoose.Schema;
class SummitClass {
  static register(payload) {
    return this(payload).save();
  }
}

var summitSchema = new Schema(
  {
    event_id: { type: Schema.Types.ObjectId, ref: "Event" },
    description: String,
    point: String,
    created_at: Date,
    updated_at: Date,
  },
  { collection: "summits" }
);
summitSchema.loadClass(SummitClass);

var Summit = mongoose.model("Summit", summitSchema);

module.exports = Summit;
