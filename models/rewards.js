var mongoose = require("mongoose");
var Schema = mongoose.Schema;
class RewardClass {
  static register(payload) {
    return this(payload).save();
  }
}

var rewardsSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    rewardCategory: String,
    rewardPoints: { type: Number, default: 0 },
    rewardFor: { type: Schema.Types.ObjectId },
    isDeleted: { type: Boolean, default: false },
    created_at: Date,
    updated_at: Date,
  },
  { collection: "rewards" }
);
rewardsSchema.loadClass(RewardClass);


var Rewards = mongoose.model("Rewards", rewardsSchema);

module.exports = Rewards;
