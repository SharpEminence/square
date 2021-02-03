var mongoose = require("mongoose");
var Agenda = require("./../../../../models/Agenda");
var AgendaFavourite = require("./../../../../models/AgendaFavourite");
var AgendaParticipant = require("./../../../../models/AgendaParticipant");
var AgendaJoin = require("./../../../../models/AgendaJoin");
var Review = require("./../../../../models/Review");
var Note = require("./../../../../models/Note");
let RewardController = require("./rewardsController");
var SponsorParticipant = require("./../../../../models/SponsorParticipant");

const timestamp = require("time-stamp");
const { Validator } = require("node-input-validator");
created_date = timestamp.utc("YYYY-MM-DD HH:mm:ss");
var moment = require("moment");
const { reverse } = require("dns");
const axios = require('axios');
const vox_base_url = "https://api.voxeet.com/v1/"

const getAgendaDates = async function (req, res) {
  const formData = req.body;
  const validate = new Validator(formData, {
    event_id: "required|string",
    page: "required|integer",
    limit: "required|integer",
  });
  validate.check().then(async (matched) => {
    if (!matched) {
      res.json({ statusCode: 400, message: validate.errors });
    } else {
      try {
        var skip = formData.page * formData.limit - formData.limit;
        let start = moment().startOf("date").format("X");
        // let end = moment().endOf('date').format('X');
        await Agenda.aggregate([
          {
            $match: {
              event: new mongoose.Types.ObjectId(formData.event_id),
              agenda_date: { $gte: start },
            },
          },

          {
            $group: {
              _id: { agenda_date: "$agenda_date" },
              count: { $sum: 1 },
            },
          },
          {
            $sort: {
              _id: 1,
            },
          },
          {
            $limit: formData.limit,
          },
          {
            $skip: skip,
          },
        ]).exec(async function (err, agendas) {
          if (err) {
            res.json({ status: 404, message: "No data found.", data: "" });
          } else {
            var speaker_date = await Agenda.aggregate([
              {
                $match: {
                  event: new mongoose.Types.ObjectId(formData.event_id),
                  agenda_date: { $gte: start },
                  speakers: {
                    $in: [new mongoose.Types.ObjectId(formData.user_id)],
                  },
                },
              },

              {
                $group: {
                  _id: { agenda_date: "$agenda_date" },
                  count: { $sum: 1 },
                },
              },
              {
                $sort: {
                  _id: 1,
                },
              },
              {
                $limit: formData.limit,
              },
              {
                $skip: skip,
              },
            ]).exec();

            res.json({
              status: 200,
              message: "agenda dates",
              agendas: agendas,
              speaker_date: speaker_date,
              page: formData.page,
              total: agendas.length,
            });
          }
        });
      } catch (db_error) {
        console.log("db_error ------>", db_error);
        res.json({ status: 400, message: db_error });
      }
    }
  });
};

const getAgendasByDate = async function (req, res) {
  const formData = req.body;
  const validate = new Validator(formData, {
    event_id: "required|string",
    date: "required|dateFormat:DD-MM-YYYY",
    page: "required|integer",
    limit: "required|integer",
  });
  validate.check().then(async (matched) => {
    if (!matched) {
      res.json({ statusCode: 400, message: validate.errors });
    } else {
      try {
        var skip = formData.page * formData.limit - formData.limit;
        var date = moment(formData.date + "00:00", "DD/MM/YYYY HH:mm").format(
          "X"
        );
        //var end = moment(formData.date + "23:59", "DD/MM/YYYY HH:mm").format('X');

        console.log("start ------------------>", date);
        //console.log("end   ------------------>", end);

        /*await Agenda.find({
                    event: formData.event_id,
                    agenda_date: {
                        $eq: date
                    }
                }).populate('agenda_category')
                    .skip(skip)
                    .limit(formData.limit)
                */

        await Agenda.aggregate([
          {
            $match: {
              event: new mongoose.Types.ObjectId(formData.event_id),
              agenda_date: { $eq: date },
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
                    user_id: new mongoose.Types.ObjectId(formData.user_id),
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
            $sort: {
              start_time: 1,
            },
          },
          {
            $limit: formData.limit,
          },
          {
            $skip: skip,
          },
        ]).exec(async function (err, agendas) {
          if (err) {
            res.json({ status: 404, message: "No data found.", data: "" });
          } else {
            res.json({
              status: 200,
              message: "agenda data all",
              agendas: agendas,
              page: formData.page,
              total: agendas.length,
            });
          }
        });
      } catch (db_error) {
        res.json({ status: 400, message: db_error });
      }
    }
  });
};

const getFavAgendasByDate = async function (req, res) {
  const formData = req.body;
  const validate = new Validator(formData, {
    event_id: "required|string",
    date: "required|dateFormat:DD-MM-YYYY",
    page: "required|integer",
    limit: "required|integer",
  });
  validate.check().then(async (matched) => {
    if (!matched) {
      res.json({ statusCode: 400, message: validate.errors });
    } else {
      var skip = formData.page * formData.limit - formData.limit;
      var date = moment(formData.date + "00:00", "DD/MM/YYYY HH:mm").format(
        "X"
      );

      var agendas = await Agenda.aggregate([
        {
          $match: {
            event: new mongoose.Types.ObjectId(formData.event_id),
            agenda_date: { $eq: date },
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
                  user_id: new mongoose.Types.ObjectId(formData.user_id),
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
            path: "$is_favourite",
            preserveNullAndEmptyArrays: false,
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
          $sort: {
            start_time: 1,
          },
        },
        {
          $limit: formData.limit,
        },
        {
          $skip: skip,
        },
      ]).exec();

      var speakerData = await Agenda.aggregate([
        {
          $match: {
            event: new mongoose.Types.ObjectId(formData.event_id),
            agenda_date: { $eq: date },
            speakers: { $in: [new mongoose.Types.ObjectId(formData.user_id)] },
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
                  user_id: new mongoose.Types.ObjectId(formData.user_id),
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
          $limit: formData.limit,
        },
        {
          $skip: skip,
        },
      ]).exec();
      //  var speakerData =  await  Agenda.find({ "speakers": { "$in": new mongoose.Types.ObjectId(formData.user_id) } }).exec();
      res.json({
        status: 200,
        message: "agenda data all",
        agendas: agendas,
        speakerData: speakerData,
        page: formData.page,
        total: agendas.length,
      });
    }
  });
};

const getLiveAgendas = async function (req, res) {
  const formData = req.body;
  const validate = new Validator(formData, {
    event_id: "required|string",
    page: "required|integer",
    limit: "required|integer",
  });
  validate.check().then(async (matched) => {
    if (!matched) {
      res.json({ statusCode: 400, message: validate.errors });
    } else {
      try {
        var skip = formData.page * formData.limit - formData.limit;
        var current_date = moment().format("DD-MM-YYYY");
        var date = moment(current_date + "00:00", "DD/MM/YYYY HH:mm").format(
          "X"
        );
        var current_time = moment().format("HH:mm");
        console.log("sssssssssssssssssssssssssss");
        console.log(current_time);
        await Agenda.aggregate([
          {
            $match: {
              event: new mongoose.Types.ObjectId(formData.event_id),
              agenda_date: { $eq: date },
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
                    user_id: new mongoose.Types.ObjectId(formData.user_id),
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
            $limit: formData.limit,
          },
          {
            $skip: skip,
          },
        ]).exec(async function (err, agendas) {
          if (err) {
            res.json({ status: 404, message: "No data found.", data: "" });
          } else {
            res.json({
              status: 200,
              message: "agenda live data",
              agendas: agendas,
              current_time: current_time,
              page: formData.page,
              total: agendas.length,
            });
          }
        });
      } catch (db_error) {
        res.json({ status: 400, message: db_error });
      }
    }
  });
};

const getAgendasById = async function (req, res) {
  const formData = req.body;
  const validate = new Validator(formData, {
    event_id: "required|string",
    agenda_id: "required|string",
  });
  validate.check().then(async (matched) => {
    if (!matched) {
      res.json({ statusCode: 400, message: validate.errors });
    } else {
      try {
        Agenda.findOne({
          event: formData.event_id,
          _id: formData.agenda_id,
        }).populate("agenda_category")
          .populate("time_zone")
          .exec(async function (err, agenda) {
            if (err) {
              res.json({ status: 404, message: "No data found.", data: {} });
            } else {
              var attendees = await AgendaJoin.find({agenda: formData.agenda_id,
              }).populate("user").exec();
              res.json({
                status: 200,
                message: "Agenda fetched Successful",
                data: agenda,
                attendees: attendees,
              });
            }
          });
      } catch (db_error) {
        res.json({ status: 400, message: db_error });
      }
    }
  });
};

const addAgendaAsFavourite = async function (req, res) {
  const formData = req.body;
  console.log(formData);
  const validate = new Validator(formData, {
    event_id: "required|string",
    agenda_id: "required|string",
    user_id: "required|string",
    status: "required|boolean",
  });
  validate.check().then(async (matched) => {
    if (!matched) {
      res.json({ statusCode: 400, message: validate.errors });
    } else {
      try {
        var findFavourite = await AgendaFavourite.findOne({
          event: formData.event_id,
          agenda: formData.agenda_id,
          user_id: formData.user_id,
        }).exec();
        console.log("helloooooooooooooooooooo" + findFavourite);

        if (findFavourite) {
          console.log("1111111111111111111");
          var update = { status: formData.status };

          await AgendaFavourite.findByIdAndUpdate(
            { _id: findFavourite._id },
            update,
            function (err, result) {
              if (err) {
                res.json({ status: 400, message: err });
              } else {
                res.json({
                  status: 200,
                  message: formData.status == 1?"Agenda added as favorite.":"Agenda removed from favorite.",
                  data: result,
                });
              }
            }
          );
        } else {
          console.log("elseeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
          const AddFavourite = new AgendaFavourite({
            event: formData.event_id,
            agenda: formData.agenda_id,
            user_id: formData.user_id,
            status: formData.status,
          });
          await AddFavourite.save()
            .then((data) => {
              res.json({
                status: 200,
                message: "Agenda added as favorite.",
                data: data,
              });
            })
            .catch((err) => {
              res.json({ status: 400, message: err });
            });
        }
      } catch (db_error) {
        res.json({ status: 400, message: db_error });
      }
    }
  });
};

const getMyAgendas = async function (req, res) {
  const formData = req.body;
  const validate = new Validator(formData, {
    event_id: "required|string",
    date: "required|dateFormat:DD-MM-YYYY",
    page: "required|integer",
    limit: "required|integer",
  });
  validate.check().then(async (matched) => {
    if (!matched) {
      res.json({ statusCode: 400, message: validate.errors });
    } else {
      try {
        var skip = formData.page * formData.limit - formData.limit;
        var start = moment(
          formData.date + " 00:00",
          "DD/MM/YYYY HH:mm"
        ).valueOf();
        var end = moment(
          formData.date + " 23:59",
          "DD/MM/YYYY HH:mm"
        ).valueOf();
        Agenda.find({
          event: formData.event_id,
          agenda_date: {
            $gte: moment(start).format("x"),
            $lt: moment(end).format("x"),
          },
        })
          .populate("agenda_category", "timezones")
          .skip(skip)
          .limit(formData.limit)
          .exec(async function (err, agendas) {
            if (err) {
              res.json({ status: 404, message: "No data found.", data: "" });
            } else {
              let total = await Agenda.countDocuments().exec();
              res.json({
                status: 200,
                message: "agenda data",
                agendas: agendas,
                page: formData.page,
                total: total,
              });
            }
          });
      } catch (db_error) {
        res.json({ status: 400, message: db_error });
      }
    }
  });
};

const countAgendaParticipants = async function (req, res) {
  const formData = req.body;
  const validate = new Validator(formData, {
    event_id: "required|string",
    agenda_id: "required|string",
    action: "required|string",
  });
  validate.check().then(async (matched) => {
    if (!matched) {
      res.json({ statusCode: 400, message: validate.errors });
    } else {
      try {
        console.log("try ----> ");
        var data = await AgendaParticipant.find({
          event_id: formData.event_id,
          agenda_id: formData.agenda_id,
        }).exec();
        console.log("data ----> ", data);
        if (data.length > 0) {
          var no_of_participant =
            formData.action == "increment"
              ? data[0].number_of_participant + 1
              : data[0].number_of_participant - 1;
          var update_data = {
            number_of_participant:
              no_of_participant < 0 ? 0 : no_of_participant,
          };
          await AgendaParticipant.findOneAndUpdate(
            { event_id: formData.event_id, agenda_id: formData.agenda_id },
            update_data,
            function (err, result) {
              if (err) {
                res.json({ status: 400, message: err });
              } else {
                res.json({
                  status: 200,
                  message: "participant added.",
                  result: result,
                });
              }
            }
          );
        } else {
          const ParticipantCount = new AgendaParticipant({
            event_id: formData.event_id,
            agenda_id: formData.agenda_id,
            number_of_participant: 1,
          });

          await ParticipantCount.save()
            .then((data) => {
              console.log("data ---->", data);
            })
            .catch((err) => {
              console.log("err 2", err);
            });
        }
      } catch (db_error) {
        console.log("db_error ----->", db_error);
        res.json({ status: 400, message: db_error });
      }
    }
  });
};

const countSponsorParticipants = async function (req, res) {
  const formData = req.body;

  try {
    console.log("try ----> ");
    var data = await SponsorParticipant.find({
      event_id: formData.event_id,
      hour_id: formData.agenda_id,
    }).exec();

    //addRewardToJoin Presentation/expo
    let rewardData = await RewardController.saveReward(
      formData.userId,
      "sponsorsAandLounges",
      formData.agendaId
    );
    console.log("rewardData--------------->", rewardData);

    if (data.length > 0) {
      var no_of_participant =
        formData.action == "increment"
          ? data[0].number_of_participant + 1
          : data[0].number_of_participant - 1;
      var update_data = {
        number_of_participant: no_of_participant < 0 ? 0 : no_of_participant,
      };
      await SponsorParticipant.findOneAndUpdate(
        { event_id: formData.event_id, hour_id: formData.agenda_id },
        update_data,
        function (err, result) {
          if (err) {
            res.json({ status: 400, message: err });
          } else {
            res.json({
              status: 200,
              message: "participant added.",
              result: result,
            });
          }
        }
      );
    } else {
      const SponsorParticipants = new SponsorParticipant({
        event_id: formData.event_id,
        hour_id: formData.agenda_id,
        number_of_participant: 1,
      });

      await SponsorParticipants.save()
        .then((data) => {
          console.log("data ---->", data);
        })
        .catch((err) => {
          console.log("err 2", err);
        });
    }
  } catch (db_error) {
    console.log("db_error ----->", db_error);
    res.json({ status: 400, message: db_error });
  }
};

const getAgendaParticipantsCount = async function (req, res) {
  const formData = req.body;
  const validate = new Validator(formData, {
    event_id: "required|string",
    agenda_id: "required|string",
  });
  validate.check().then(async (matched) => {
    if (!matched) {
      res.json({ statusCode: 400, message: validate.errors });
    } else {
      try {
        AgendaParticipant.find({
          event_id: formData.event_id,
          agenda_id: formData.agenda_id,
        })
          .select("number_of_participant")
          .exec(function (err, AgendaParticipantCount) {
            if (err) {
              res.json({ status: 404, message: "No data found.", data: {} });
            } else {
              res.json({
                status: 200,
                message: "Agenda Participant Count",
                data: AgendaParticipantCount[0],
              });
            }
          });
      } catch (db_error) {
        console.log("db_error ----->", db_error);
        res.json({ status: 400, message: db_error });
      }
    }
  });
};

const getSponsorParticipantsCount = async function (req, res) {
  const formData = req.body;
  const validate = new Validator(formData, {
    event_id: "required|string",
    agenda_id: "required|string",
  });
  validate.check().then(async (matched) => {
    if (!matched) {
      res.json({ statusCode: 400, message: validate.errors });
    } else {
      try {
        SponsorParticipant.findOne({
          event_id: formData.event_id,
          hour_id: formData.agenda_id,
        })
          .select("number_of_participant")
          .exec(function (err, AgendaParticipantCount) {
            if (err) {
              res.json({ status: 404, message: "No data found.", data: {} });
            } else {
              res.json({
                status: 200,
                message: "Sponsor Participant Count",
                data: AgendaParticipantCount,
              });
            }
          });
      } catch (db_error) {
        console.log("db_error ----->", db_error);
        res.json({ status: 400, message: db_error });
      }
    }
  });
};

const createAgendaJoin = async function (req, res) {
  const formData = req.body;
  const validate = new Validator(formData, {
    userId: "required|string",
    agendaId: "required|string",
    eventId: "required|string",
  });
  validate.check().then(async (matched) => {
    if (!matched) {
      res.json({ statusCode: 400, message: validate.errors });
    } else {
       await AgendaJoin.find({
        user: formData.userId,
        agenda: formData.agendaId,
      }).exec(async function (err, data) {
        if (err) res.json({ status: 500, message: err });
        if (data.length == 0) {
          let rewardData = RewardController.saveReward(
            formData.userId,
            "liveSession",
            formData.agendaId
          );
          //console.log("rewardData--------------->", rewardData);
          const joinedAgenda = await AgendaJoin.create({
            event: formData.eventId,
            user: formData.userId,
            agenda: formData.agendaId,
            status: formData.status,
            created_at: created_date,
            updated_at: created_date,
          });
          res.json({
            status: 200,
            message: "Joined Agenda",
            data: joinedAgenda,
          });
        } else {
          // let rewardData = RewardController.saveReward(
          //   formData.userId,
          //   "liveSession",
          //   formData.agendaId
          // );
          // console.log("rewardData--------------->", rewardData);
          var agenda_data = await AgendaJoin.findOne({
            user: formData.userId,
            agenda: formData.agendaId,
          }).exec();
          res.json({
            status: 200,
            message: "User is already joined with agendaa",
            data: agenda_data,
          });
        }
      });
    }
  });
};
const getAgendaJoin = async function (req, res) {
  if (!req.params.id) {
    res.json({ statusCode: 400, message: "Id is requried" });
  } else {
    try {
      AgendaJoin.find({
        user: req.params.id,
      })
        .populate("agenda")
        .populate({
          path: "agenda",
          populate: {
            path: "time_zone",
          },
        })
        .exec(async function (err, joinAgendas) {
          if (err) {
            res.json({ status: 404, message: "No data found.", data: "" });
          } else {
            res.json({
              status: 200,
              message: "agenda data",
              data: joinAgendas,
            });
          }
        });
    } catch (db_error) {
      res.json({ status: 400, message: db_error });
    }
  }
};

const addReview = async function (req, res) {
  const formData = req.body;
  const validate = new Validator(formData, {
    userId: "required|string",
    agendaId: "required|string",
    joinedAgendaId: "required|string",
  });
  validate.check().then(async (matched) => {
    if (!matched) {
      res.json({ statusCode: 400, message: validate.errors });
    } else {
      await Review.find({
        user: formData.userId,
        agenda: formData.agendaId,
        agendaJoin: formData.joinedAgendaId,
      }).exec(async function (err, data) {
        if (err) res.json({ status: 500, message: err });

        let rewardData = RewardController.saveReward(
          formData.userId,
          "pollsSurvey",
          formData.agendaId
        );
        console.log("rewardData--------------->", rewardData);


        if (data.length == 0) {
          var createdReview = await Review.create({
            agendaJoin: formData.joinedAgendaId,
            agenda: formData.agendaId,
            user: formData.userId,
            answer_one: formData.answer_one,
            answer_two: formData.answer_two,
            answer_three: formData.answer_three,
            answer_four: formData.answer_four,
            answer_five: formData.answer_five,
            created_at: created_date,
            updated_at: created_date,
          });
          const update = {
            status: "done",
          };
          AgendaJoin.findByIdAndUpdate(formData.joinedAgendaId, update, {
            new: true,
          }).exec();
          res.json({
            status: 200,
            message: "Added Review",
            data: createdReview,
          });
        } else {
          res.json({
            status: 200,
            message: "User is already provided review",
          });
        }
      });
    }
  });
};
const getReview = async function (req, res) {
  const formData = req.params;
  const validate = new Validator(formData, {
    userId: "required|string",
    agendaId: "required|string",
    joinedAgendaId: "required|string",
  });
  validate.check().then(async (matched) => {
    if (!matched) {
      res.json({ statusCode: 400, message: validate.errors });
    } else {
      try {
        Review.findOne({
          user: formData.userId,
          agenda: formData.agendaId,
          agendaJoin: formData.joinedAgendaId,
        }).exec(async function (err, Review) {
          if (err) {
            res.json({ status: 404, message: "No data found.", data: "" });
          } else {
            res.json({
              status: 200,
              message: "review data",
              data: Review,
            });
          }
        });
      } catch (db_error) {
        res.json({ status: 400, message: db_error });
      }
    }
  });
};

const addNote = async function (req, res) {
  if (!req.params.id) {
    res.json({ statusCode: 400, message: "Id is requried" });
  } else {
    try {
      AgendaJoin.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec(
        async function (err, joinAgendas) {
          if (err) {
            res.json({ status: 404, message: "No data found.", data: "" });
          } else {
            res.json({
              status: 200,
              message: "agenda data",
              data: joinAgendas,
            });
          }
        }
      );
    } catch (db_error) {
      res.json({ status: 400, message: db_error });
    }
  }
};

const fetchTags = async (req, res) => {
  try {
    console.log("-------fetch tags invoked--------");
    console.log("-------req.body--------", req.body);
    console.log("-------req.params--------", req.params);

    //its also works
    // let tagList = await Agenda.aggregate([
    //   { $unwind: "$tags" },
    //   { $project: { _id: 0 } },
    //   { $group: { _id: "__v", tags: { $addToSet: "$tags" } } },
    // ]);

    let tagList2 = await Agenda.distinct("tags", { event: req.params.eventId });
    console.log("tagList===============>", tagList2);

    res.send({
      status: 200,
      message: "tags fetched",
      data: { tagsList: tagList2 },
    });
  } catch (error) {
    console.log("error.message===========", error.message);
    res.send({
      status: 400,
      message: error.message,
      data: { tagsList: [] },
    });
  }
};

const voxAuth = async (req, res) => {
  var vox_key = process.env.VOX_KEY;
  var vox_secret = process.env.VOX_SECRET;
  const baseAuth = new Buffer.from(vox_key + ':' + vox_secret).toString('base64');
  axios({
    method: 'get', //you can set what request you want to be
    url: vox_base_url+'auth/token',
    headers: {
      "Content-Type":"application/json",
      "Cache-Control":"no-cache",
      "Authorization":"Basic "+baseAuth
    }
  })
  .then(function (response) {
    res.send({
      status: 200,
      message: "Success",
      data: response.data
    });
  })
  .catch(function (error) {      
    res.send({
      status: 400,
      message: error.message,
      data: {},
    });
  });
};

const voxConferenceData = async (req, res) => {
var access_token = req.query.access_token;
var cid = req.query.cid;
var type = (req.query.type==undefined || req.query.type=="") ? req.query.type : "user";
var data = {};
axios({
  method: 'get', //you can set what request you want to be
  url: vox_base_url+'monitor/conferences/'+cid,
  headers: {
    "Content-Type":"application/json",
    "Cache-Control":"no-cache",
    "Authorization":"Bearer "+access_token
  }
})
.then(function (response) {
      console.log("aaaaaaaaaaaa",response.data);
      data.conferece = response.data
      axios({
        method: 'get', //you can set what request you want to be
        url: vox_base_url+'monitor/conferences/'+cid+'/participants?type='+type,
        headers: {
          "Content-Type":"application/json",
          "Cache-Control":"no-cache",
          "Authorization":"Bearer "+access_token
        }
      })
      .then(function (result) {
        console.log("bbbbbbbbbbbbbbbbbbb",result.data.participants);
        data.participants = result.data.participants
        res.send({
          status: 200,
          message: "Success",
          data: data
        });
      })
      .catch(function (error) {      
        res.send({
          status: 400,
          message: error.message,
          data: {},
        });
      });
})
.catch(function (error) {      
  res.send({
    status: 400,
    message: error.message,
    data: {},
  });
});
};


const GetTagAgenda = async (req, res) => {
 var tag = req.body.tag;
 
 try {
  
  await Agenda.aggregate([
    {
      $match: {
        event: new mongoose.Types.ObjectId(req.body.event_id),
        tags: { $in: [tag] },
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
      $sort: {
        agenda_date: 1,
        start_time: 1,
      },
    },
   
  ]).exec(async function (err, agendas) {
    if (err) {
      res.json({ status: 404, message: "No data found.", data: "" });
    } else {
      res.json({
        status: 200,
        message: "agenda data all",
        agendas: agendas
      });
    }
  });
} catch (db_error) {
  res.json({ status: 400, message: db_error });
}
 
    // await Agenda.find({
    //   tags: { $in: [tag] },
    // }).exec(async (err, data) => {
    //   if (err) {
    //     res.send({
    //       status: 500,
    //       message: "Something went wrong",
    //     });
    //   }
    //   if (!data) {
    //     res.send({
    //       status: 404,
    //       message: "No Data found",
    //     });
    //   } else {
    //     res.send({
    //       status: 200,
    //       message: "Success",
    //       data: data
    //     });
    //   }
    // });
  
};

module.exports = {
  addNote,
  getReview,
  addReview,
  getAgendaJoin,
  createAgendaJoin,
  getAgendaDates,
  getAgendasByDate,
  addAgendaAsFavourite,
  getMyAgendas,
  getAgendasById,
  countAgendaParticipants,
  countSponsorParticipants,
  getAgendaParticipantsCount,
  getSponsorParticipantsCount,
  getFavAgendasByDate,
  getLiveAgendas,
  fetchTags,
  voxAuth,
  voxConferenceData,
  GetTagAgenda
};
