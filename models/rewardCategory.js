var mongoose = require("mongoose");
var Schema = mongoose.Schema;
class RewardClass {
  static register(payload) {
    return this(payload).save();
  }
}

var rewardsCategorySchema = new Schema(
  {
    event: { type: Schema.Types.ObjectId, ref: "Event" },
    name: { type: String, default: null },
    title: { type: String, default: "" },
    rewardPoints: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
    created_at: Date,
    updated_at: Date,
  },
  { collection: "rewardsCategory" }
);
rewardsCategorySchema.loadClass(RewardClass);
var RewardsCategory = mongoose.model("RewardsCategory", rewardsCategorySchema);

module.exports = RewardsCategory;
