var mongoose = require("mongoose");
var Schema = mongoose.Schema;

class SponsorHourClass {
  static register(payload) {
    return this(payload).save();
  }
}

var sponsorHourSchema = new Schema(
  {
    event: { type: Schema.Types.ObjectId, ref: "Event" },
    booth: { type: Schema.Types.ObjectId, ref: "CompanyCategory" },
    conference_date: String,
    start_time: String,
    title: String,
    end_time: String,
    google_meet: String,
    isDeleted: { type: Boolean, default: false },
    created_at: Date,
    updated_at: Date,
  },
  { collection: "sponsor_hours" }
);
sponsorHourSchema.loadClass(SponsorHourClass);
sponsorHourSchema.set("timestamps", true);

var SponsorHour = mongoose.model("SponsorHour", sponsorHourSchema);

module.exports = SponsorHour;
