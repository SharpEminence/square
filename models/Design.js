var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var designSchema = new Schema(
  {
    event: { type: Schema.Types.ObjectId, ref: "Event" },
    primary_color: String,
    secondary_color: String,
    third_color: String,
    background_image: String,
    created_at: Date,
    updated_at: Date,
  },
  { collection: "designs" }
);
var Design = mongoose.model("Design", designSchema);

module.exports = Design;
