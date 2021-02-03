var mongoose = require("mongoose");
var Schema = mongoose.Schema;
class FaqClass {
  static register(payload) {
    return this(payload).save();
  }
}

var faqSchema = new Schema(
  {
    event_id: { type: Schema.Types.ObjectId, ref: "Event" },
    question: String,
    answer: String,
    created_at: Date,
    updated_at: Date,
  },
  { collection: "faqs" }
);
faqSchema.loadClass(FaqClass);

var Faq = mongoose.model("Faq", faqSchema);

module.exports = Faq;
