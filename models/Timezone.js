var mongoose = require("mongoose");
var Schema = mongoose.Schema;

class TimeClass {
  static register(payload) {
    return this(payload).save();
  }
}

var TimezoneSchema = new Schema(
  {
    timezone: String,
    created_at: Date,
    updated_at: Date,
  },
  { collection: "timezones" }
);
TimezoneSchema.loadClass(TimeClass);

var Timezone = mongoose.model("Timezone", TimezoneSchema);

module.exports = Timezone;
