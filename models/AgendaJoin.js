var mongoose = require("mongoose");
var Schema = mongoose.Schema;

class AgendaJoinClass {
  static register(payload) {
    return this(payload).save();
  }
}

var AgendaJoinSchema = new Schema(
  {
    event: { type: Schema.Types.ObjectId, ref: "Event" },
    agenda: { type: Schema.Types.ObjectId, ref: "Agenda" },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    note_title: {
      type: String,
      default: null,
    },
    note_description: {
      type: String,
      default: null,
    },
    status: {
      type: String,
    },
    created_at: Date,
    updated_at: Date,
  },
  { collection: "agendajoins" }
);
AgendaJoinSchema.loadClass(AgendaJoinClass);
AgendaJoinSchema.set("timestamps", true);

var AgendaJoin = mongoose.model("AgendaJoin", AgendaJoinSchema);

module.exports = AgendaJoin;
