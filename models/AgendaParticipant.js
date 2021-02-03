var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var agendaSchema = new Schema(
  {
    event_id: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    agenda_id: { type: Schema.Types.ObjectId, ref: "Agenda", required: true },
    number_of_participant: { type: Schema.Types.Number, required: true },
    created_at: Date,
    updated_at: Date,
  },
  { collection: "agenda_participants" }
);

agendaSchema.set("timestamps", true);

var agendaParticipant = mongoose.model("agendaParticipant", agendaSchema);

module.exports = agendaParticipant;
