var mongoose = require("mongoose");
var Schema = mongoose.Schema;

class DemandClass {
  static register(payload) {
    return this(payload).save();
  }
}

var demandSchema = new Schema(
  {
    event: { type: Schema.Types.ObjectId, ref: "Event" },
    title: String,
    description: String,
    hyperlink: String,
    herelink: String,
    video_data: String,
    created_at: Date,
    updated_at: Date,
  },
  { collection: "demands" }
);
demandSchema.loadClass(DemandClass);
demandSchema.set("timestamps", true);

var Demand = mongoose.model("Demand", demandSchema);

module.exports = Demand;
