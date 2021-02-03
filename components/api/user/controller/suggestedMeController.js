var mongoose = require("mongoose");
var Agenda = require("./../../../../models/Agenda");
var User = require("./../../../../models/User");
var AgendaFavourite = require("./../../../../models/AgendaFavourite");
var AgendaParticipant = require("./../../../../models/AgendaParticipant");
var AgendaJoin = require("./../../../../models/AgendaJoin");
var Review = require("./../../../../models/Review");
var Note = require("./../../../../models/Note");

const timestamp = require("time-stamp");
const { Validator } = require("node-input-validator");
created_date = timestamp.utc("YYYY-MM-DD HH:mm:ss");
var moment = require("moment");
const { reverse } = require("dns");

const fetchSuggestedAgenda = async (req, res) => {
  try {
    console.log("-------fetchSuggestedAgenda invoked--------");
    console.log("-------req.body--------", req.body);
    console.log("-------req.params--------", req.params);

    const userData = await User.findOne({ _id: req.body.user_id });
    if (!userData) {
      throw new Error("Invalid user");
    }

    var agendaData = await Agenda.aggregate([
      {
        $addFields: {
          agenda_date_int: { $toDouble: "$agenda_date" },
        },
      },
      {
        $match: {
          event: new mongoose.Types.ObjectId(req.body.event_id),
          agenda_date_int: { $gte: moment().utc().startOf("day").unix() },
          tags: { $in: userData.interests },
        },
      },
      {
        $lookup: {
          from: "agenda_categories",
          localField: "agenda_category",
          foreignField: "_id",
          as: "agenda_categories",
        },
      },
      {
        $lookup: {
          from: "timezones",
          localField: "time_zone",
          foreignField: "_id",
          as: "time_zones",
        },
      },
      {
        $lookup: {
          from: "agenda_favourites",
          let: { agenda_id: "$_id" },
          pipeline: [
            {
              $match: {
                user_id: new mongoose.Types.ObjectId(req.body.user_id),
                status: true,
                $expr: { $and: [{ $eq: ["$agenda", "$$agenda_id"] }] },
              },
            },
          ],
          as: "is_favourite",
        },
      },

      {
        $unwind: {
          path: "$agenda_categories",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$time_zones",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $skip: req.body.skip,
      },
      {
        $limit: req.body.limit,
      },
    ]).exec();

    let agendaCount = await Agenda.aggregate([
      {
        $addFields: {
          agenda_date_int: { $toDouble: "$agenda_date" },
        },
      },
      {
        $match: {
          event: new mongoose.Types.ObjectId(req.body.event_id),
          agenda_date_int: { $gte: moment().utc().startOf("day").unix() },
          tags: { $in: userData.interests },
        },
      },
      {
        $lookup: {
          from: "agenda_categories",
          localField: "agenda_category",
          foreignField: "_id",
          as: "agenda_categories",
        },
      },
      {
        $lookup: {
          from: "timezones",
          localField: "time_zone",
          foreignField: "_id",
          as: "time_zones",
        },
      },
      {
        $lookup: {
          from: "agenda_favourites",
          let: { agenda_id: "$_id" },
          pipeline: [
            {
              $match: {
                user_id: new mongoose.Types.ObjectId(req.body.user_id),
                status: true,
                $expr: { $and: [{ $eq: ["$agenda", "$$agenda_id"] }] },
              },
            },
          ],
          as: "is_favourite",
        },
      },

      {
        $unwind: {
          path: "$agenda_categories",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$time_zones",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]).exec();

    console.log("agendaData------------------------->", agendaData );
    console.log("agendaCount------------------------->", agendaCount );
    res.send({
      status: 200,
      message: "suggested-me agendas fetched",
      data: { agendaData: agendaData, totalAgendas: agendaCount.length },
    });
  } catch (error) {
    console.log("error.message===========", error.message);
    res.send({
      status: 400,
      message: error.message,
      data: { agendaData: [] },
    });
  }
};

module.exports = {
  fetchSuggestedAgenda,
};
