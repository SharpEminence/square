var mongoose = require("mongoose");
var Schema = mongoose.Schema;

class NewClass {
  static register(payload) {
    return this(payload).save();
  }
}

var newSchema = new Schema(
  {
    event: { type: Schema.Types.ObjectId, ref: "Event" },
    title: String,
    description: String,
    email: String,
    image: String,
    created_at: Date,
    updated_at: Date,
  },
  { collection: "news" }
);
newSchema.loadClass(NewClass);

var New = mongoose.model("New", newSchema);

module.exports = New;
