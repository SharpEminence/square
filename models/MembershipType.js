var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var membershipSchema = new Schema(
  {
    membership: String,
    created_at: Date,
    updated_at: Date,
  },
  { collection: "membershiptypes" }
);

var MembershipType = mongoose.model("MembershipType", membershipSchema);

module.exports = MembershipType;
