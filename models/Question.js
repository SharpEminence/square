var mongoose = require("mongoose");
var Schema = mongoose.Schema;
class QuestionClass {
  static register(payload) {
    return this(payload).save();
  }
}

var questionSchema = new Schema(
  {
    event_id: { type: Schema.Types.ObjectId, ref: "Event" },
    question: String,
    options: [String],
    type: String,
    created_at: Date,
    updated_at: Date,
  },
  { collection: "questions" }
);
questionSchema.loadClass(QuestionClass);

var Question = mongoose.model("Question", questionSchema);

module.exports = Question;
