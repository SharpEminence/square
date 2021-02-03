var mongoose = require("mongoose");
var Schema = mongoose.Schema;

class AnswerClass {
  static register(payload) {
    return this(payload).save();
  }
}

var answerSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User" },
    question: { type: Schema.Types.ObjectId, ref: "Question" },
    event: { type: Schema.Types.ObjectId, ref: "Event" },
    answer: String,
    created_at: Date,
    updated_at: Date,
  },
  { collection: "answers" }
);
answerSchema.loadClass(AnswerClass);

var Answer = mongoose.model("Answer", answerSchema);

module.exports = Answer;
