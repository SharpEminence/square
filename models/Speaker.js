var mongoose = require("mongoose");
var Schema = mongoose.Schema;

class SpeakerClass {
  static register(payload) {
    return this(payload).save();
  }
}

var speakerSchema = new Schema(
  {
    event: { type: Schema.Types.ObjectId, ref: "Event" },
    speaker_name: String,
    dob: String,
    email: String,
    contact: String,
    education: String,
    address: String,
    company_name: String,
    designation: String,
    company_type: { type: Schema.Types.ObjectId, ref: "CompanyCategory" },
    experience: String,
    linkedin_url: String,
    facebook_url: String,
    twitter_url: String,
    bio: String,
    topic: String,
    email: String,
    profile_img: String,
    created_at: Date,
    updated_at: Date,
  },
  { collection: "speakers" }
);
speakerSchema.loadClass(SpeakerClass);

var Speaker = mongoose.model("Speaker", speakerSchema);

module.exports = Speaker;
