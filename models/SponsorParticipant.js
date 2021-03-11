var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var sponsorParticipantSchema = new Schema(
  {
    event_id: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    hour_id: {
      type: Schema.Types.ObjectId,
      ref: "SponsorHour",
      required: true,
    },
    number_of_participant: { type: Schema.Types.Number, required: true },
    created_at: Date,
    updated_at: Date,
  },
  { collection: "sponsor_participants" }
);

sponsorParticipantSchema.set("timestamps", true);

var SponsorParticipant = mongoose.model(
  "SponsorParticipant",
  sponsorParticipantSchema
);

module.exports = SponsorParticipant;
