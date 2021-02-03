var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var hotspotTracker = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    hotspotId : String,
    dateTimestamp : Number,
    timeStamp: Number,
    date:String,
    created_at: Date,
  },
  { collection: "hotspotTracker" }
);

var hotspotTracker = mongoose.model("hotspotTracker", hotspotTracker);
module.exports = hotspotTracker;
