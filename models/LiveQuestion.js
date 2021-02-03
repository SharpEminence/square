var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var liveQuestions = new Schema(
  {
    agenda: { type: Schema.Types.ObjectId, ref: "Agenda" },
    userData: { type: Schema.Types.ObjectId, ref: "User" },
    message: { type: String, default: "" },
    created_at: Date,
    updated_at: Date,
  },
  { collection: "liveQuestions" }
);

var LiveQuestions = mongoose.model("LiveQuestions", liveQuestions);

module.exports = LiveQuestions;
