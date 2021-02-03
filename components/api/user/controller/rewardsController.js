var User = require("./../../../../models/User");
var RewardsCategory = require("./../../../../models/rewardCategory");
var Rewards = require("./../../../../models/rewards");
var AgendaFavourite = require("./../../../../models/AgendaFavourite");

var SponsorHour = require("./../../../../models/SponsorHour");
var Agenda = require("./../../../../models/Agenda");
const { Validator } = require("node-input-validator");
var _ = require('lodash');
var moment = require("moment");
var mongoose = require("mongoose");
const timestamp = require("time-stamp");
created_date = timestamp.utc("YYYY-MM-DD HH:mm:ss");

const getRewardsCategory = async (req, res) => {
  
  let id = req.params.id;
  console.log("getRewardsCategory-------------controller");
  try {
    const rewardsCategoryData = await RewardsCategory.find({
      event: id,
    });
    res.json({
      status: 200,
      message: "Rewards category fetched",
      data: {
        rewardsCategoryData: rewardsCategoryData,
      },
    });
  } catch (error) {
    console.log("error.message------------>", error.message);
    res.json({
      status: 400,
      message: error.message,
      data: {},
    });
  }
};

const AddRewardsPoint = async (req, res) => {
  try {
  const res_data = await saveReward(
    req.body.user_id,
    req.body.rewardCategory,
    req.body.points,
    req.body.rewardFor
  );
  if(res_data.status == 200 )
  {
    res.send({
      status: 200,
      message:"Data Saved",
      data: res_data.data,
    });
  }
  else
  {
    throw new Error(res_data.message)
  }
  
} catch (error) {
  console.log("error.message------------>", error.message);
  res.send({
    status: 400,
    message: error.message,
    data: {},
  });
}
};

const saveReward = async (userId, rewardCategory,points, rewardFor) => {
  console.log("--------saveReward invoked-----------");
  try {
   

    let isRewardAlreadyClaimed = await Rewards.findOne({
      rewardFor: rewardFor,
      userId:userId
    });
    console.log("isRewardAlreadyClaimed-------->", isRewardAlreadyClaimed);
    if (isRewardAlreadyClaimed) {
      throw new Error("Reward has already claimed");
    }

    let RewardData = new Rewards({
      userId: userId,
      rewardCategory: rewardCategory,
      rewardPoints: points,
      rewardFor: rewardFor,
      created_at: created_date,
      updated_at: created_date,
    });

    const savedData = await RewardData.save();
    console.log("savedData=======>", savedData);
    return {
      status: 200,
      message: "Reward claimed",
      data: {
        saveReward: savedData,
      },
    };
  } catch (error) {
    console.log("error.message------------>", error.message);
    return {
      status: 400,
      message: error.message,
      data: {},
    };
  }
};

const fetchPoints = async (req, res) => {
  console.log("--------fetchPoints invoked-----------");
  try {
    console.log("req.params=========>", req.params);

    // const data = await Rewards.aggregate([
    //   { $match: { userId: mongoose.Types.ObjectId(req.params.userId) } },
    //   { $group: { _id: "$rewardCategory", totalPoint: { $sum: "$rewardPoints" } } },
    // ]);
    const pointsPerCategort = await Rewards.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(req.params.userId) } },
      {
        $group: {
          _id: "$rewardCategory",
          pointsPerCategory: { $sum: "$rewardPoints" },
        },
      },
      {
        $lookup: {
          from: "rewardsCategory",
          localField: "_id",
          foreignField: "_id",
          as: "CategoryDetail",
        },
      },
    ]);
    console.log("data------------------->", pointsPerCategort);

    let totalPoint = await Rewards.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(req.params.userId) } },
      {
        $group: {
          _id: "",
          totalPoint: { $sum: "$rewardPoints" },
        },
      },
    ]);

    console.log("totalPoint========================>", totalPoint);

    res.send({
      status: 200,
      message: "Points data fetched",
      data: {
        pointsData: {
          pointPerCategory:pointsPerCategort,
          totalPoint:totalPoint
        },
      },
    });
  } catch (error) {
    console.log("error.message====================>", error.message);
    res.send({
      status: 400,
      message: error.message,
      data: {},
    });
  }
};

const fetchLeaderBoard = async (req, res) => {
  console.log("--------fetchLeaderBoard invoked-----------");
  try {
    console.log("req.params=========>", req.params);
    
    const leaderBoardData = await Rewards.aggregate([
      { $match: { userId: { $nin: [ mongoose.Types.ObjectId("60149defca7a5768e7ee1e2b"), mongoose.Types.ObjectId("60149defca7a5768e7ee1e2d"),mongoose.Types.ObjectId("60149defca7a5768e7ee1dd5"),mongoose.Types.ObjectId("60149deeca7a5768e7ee1ca9"),mongoose.Types.ObjectId("60149deeca7a5768e7ee1c71") ] } } },
      {
        $group: {
          _id: "$userId",
          totalPoint: { $sum: "$rewardPoints" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetail",
        },
      },
      { 
          $sort : { totalPoint : -1 } 
      }
    ]);
    let totalPoint = await Rewards.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(req.params.userId) } },
      {
        $group: {
          _id: "",
          totalPoint: { $sum: "$rewardPoints" },
        },
      },
    ]);
    console.log("data------------------->", leaderBoardData);
    var user_array = [];
    var user_array1 = [];
    await leaderBoardData.forEach(function (val, index) {
      if(val.userDetail.length>0)
      {
      user_array.push(val);
      }
      else
      {
      user_array1.push(val);

      }
    });
    console.log("hellloooooooooooooooooooooooooooooooooooooooooooooooooooooooo");
    console.log(user_array.length);
    console.log(user_array1.length);
    const userIndex= _.findIndex(user_array, function(o) { return o._id == req.params.userId; });
    console.log("userIndex========================>", userIndex);
    
    res.send({
      status: 200,
      message: "Points data fetched",
      data: {
        leaderBoard: {
          leaderBoardData:user_array.slice(0, 16),
          userRank:userIndex+1,
          totalPoint:(totalPoint.length>0)?totalPoint['0'].totalPoint:0
        },
      },
    });
  } catch (error) {
    console.log("error.message====================>", error.message);
    res.send({
      status: 400,
      message: error.message,
      data: {},
    });
  }
};




module.exports = {
  getRewardsCategory,
  saveReward,
  fetchPoints,
  fetchLeaderBoard,
  AddRewardsPoint
};
