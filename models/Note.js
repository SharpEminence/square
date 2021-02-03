var mongoose = require("mongoose");
var Schema = mongoose.Schema;

class NoteClass {
  static register(payload) {
    return this(payload).save();
  }
}

var NoteSchema = new Schema(
  {
    agenda: { type: Schema.Types.ObjectId, ref: "Agenda" },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    note: {
      type: String,
    },
    created_at: Date,
    updated_at: Date,
  },
  { collection: "notes" }
);
NoteSchema.loadClass(NoteClass);
NoteSchema.set("timestamps", true);

var Note = mongoose.model("Note", NoteSchema);

module.exports = Note;
