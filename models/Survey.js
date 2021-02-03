var mongoose = require("mongoose");
var Schema = mongoose.Schema;
class SurveyClass {
  static register(payload) {
    return this(payload).save();
  }
}

var surveySchema = new Schema(
  {
    event_id: { type: Schema.Types.ObjectId, ref: "Event" },
    question: String,
    created_at: Date,
    updated_at: Date,
  },
  { collection: "surveys" }
);
surveySchema.loadClass(SurveyClass);

var Survey = mongoose.model("Survey", surveySchema);

module.exports = Survey;
