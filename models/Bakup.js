var mongoose = require("mongoose");
var Schema = mongoose.Schema;

class BakupClass {
  static register(payload) {
    return this(payload).save();
  }
}

var bakupSchema = new Schema(
  {
    userold: { type: Schema.Types.ObjectId, ref: "User" },
    usernew: { type: Schema.Types.ObjectId, ref: "User" },
    email: String,
    created_at: Date,
    updated_at: Date,
  },
  { collection: "bakups" }
);
bakupSchema.loadClass(BakupClass);
bakupSchema.set("timestamps", true);

var Bakup = mongoose.model("Bakup", bakupSchema);

module.exports = Bakup;
