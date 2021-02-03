var mongoose = require("mongoose");
var Schema = mongoose.Schema;

class userDesignationClass {
  static register(payload) {
    return this(payload).save();
  }
}

var designationSchema = new Schema(
  {
    title: String,
    created_at: Date,
    updated_at: Date,
    isDeleted: { type: Boolean, default: false },
  },
  { collection: "user_designations" }
);
designationSchema.loadClass(userDesignationClass);

var UserDesignation = mongoose.model("UserDesignation", designationSchema);

module.exports = UserDesignation;
