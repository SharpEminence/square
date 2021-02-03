var mongoose = require("mongoose");
var Schema = mongoose.Schema;

class ReviewClass {
  static register(payload) {
    return this(payload).save();
  }
}

var ReviewSchema = new Schema(
  {
    agendaJoin: { type: Schema.Types.ObjectId, ref: "AgendaJoin" },
    agenda: { type: Schema.Types.ObjectId, ref: "Agenda" },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    answer_one: {
      type: String,
    },
    answer_two: {
      type: Number,
    },
    answer_three: {
      type: Number,
    },
    answer_four: {
      type: Number,
    },
    answer_five: {
      type: Number,
    },
    created_at: Date,
    updated_at: Date,
  },
  { collection: "reviews" }
);
ReviewSchema.loadClass(ReviewClass);
ReviewSchema.set("timestamps", true);

var Review = mongoose.model("Review", ReviewSchema);

module.exports = Review;
