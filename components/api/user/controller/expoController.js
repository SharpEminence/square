var User = require("./../../../../models/User");
var Appointment = require("./../../../../models/Appointment");
var SponsorHour = require("./../../../../models/SponsorHour");
var CompanyCategory = require("./../../../../models/CompanyCategory");
var Jitsi = require("./../../../../models/Jitsi");
var Agenda = require("./../../../../models/Agenda");
const { Validator } = require("node-input-validator");
var moment = require("moment");
var mongoose = require("mongoose");
var _ = require("lodash");
const timestamp = require("time-stamp");
const { slice } = require("lodash");
const { EROFS } = require("constants");
created_date = timestamp.utc("YYYY-MM-DD HH:mm:ss");

const getAgenda = async (req, res) => {
  // Yes , No
  // chat_room, 360_space
  const formData = req.body;
  const validate = new Validator(formData, {
    page: "required|integer",
    limit: "required|integer",
  });
  validate.check().then(async (matched) => {
    if (!matched) {
      res.json({ statusCode: 400, message: validate.errors });
    } else {
      var skip = formData.page * formData.limit - formData.limit;
      var current_date = moment().format("DD-MM-YYYY");
      var date = moment(current_date + "00:00", "DD/MM/YYYY HH:mm").format("X");
      var current_time = moment().format("HH:mm");

      var agendas = await Agenda.aggregate([
        {
          $match: {
            event: new mongoose.Types.ObjectId(req.params.id),
            featured: "Yes",
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
          $skip: skip,
        },
        {
          $limit: formData.limit,
        },
      ]).exec();
      var agendasTotal = await Agenda.aggregate([
        {
          $match: {
            event: new mongoose.Types.ObjectId(req.params.id),
            featured: "Yes",
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
      ]).exec();

      var sponser_data = await User.find({ event: req.params.id, role: 4 })
        .select("profile_img sponsor_name lounge_title lounge_type description")
        .populate("membership_type")
        .exec();
      res.json({
        status: 200,
        message: "agenda live data",
        data: agendas,
        sponser_data: sponser_data,
        current_time: current_time,
        page: Math.ceil(agendasTotal.length / formData.limit),
        total: agendasTotal.length,
      });
    }
  });
};

const getBooths = async (req, res) => {
  console.log("getBooths controllrer");
  try {
    let data = await CompanyCategory.find();
    res.send({
      status: 200,
      message: "Data fetched successfully",
      data: data,
    });
  } catch (error) {
    res.send({
      status: 400,
      message: error.message,
      data: [],
    });
  }
};

const getSponsorVideo = async (req, res) => {
  await User.findOne({ _id: req.params.id, role: 4 })
    .select("space_code sponsor_name")
    .exec(async (err, data) => {
      if (err) {
        console.log(err);
        return res.json({
          err: err,
          status: 500,
          message: "Something went wrong!",
        });
      } else {
        return res.json({
          status: 200,
          message: "Sponsor video data",
          data: data,
        });
      }
    });
};

const createAppointment = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Note content can not be empty",
    });
  }

  // Create a User
  const Appointments = new Appointment({
    name: req.body.name,
    message: req.body.message,
    email: req.body.email,
    user_id: req.body.user_id,
    sponsor_id: req.body.sponsor_id,
    created_at: created_date,
    updated_at: created_date,
  });
  // Save Appointment in the database
  await Appointments.save()
    .then(async (data) => {
      return res.send({
        status: 200,
        message: "Appointment added successfully",
      });
    })
    .catch((err) => {
      return res.send({ status: 500, message: "Something went wrong!" });
    });
};

const getAppointments = async (req, res) => {
  let limit = 10;
  let pageNo = 1;
  if (req.query.pageNo) {
    console.log("req.query===========?7", req.query);
    pageNo = (parseInt(req.query.pageNo) - 1) * limit;
  }
  await Appointment.find({ sponsor_id: req.params.id })
    .sort("-created_at")
    .skip(pageNo)
    .limit(limit)
    .exec(async (err, data) => {
      if (err) {
        console.log(err);
        return res.json({
          err: err,
          status: 500,
          message: "Something went wrong!",
        });
      } else {
        let totalRecords = await Appointment.find({
          sponsor_id: req.params.id,
        }).sort("-created_at");

        return res.json({
          status: 200,
          message: "Appointment data",
          data: {
            AppointmentsData: data,
            totalPage: Math.ceil(totalRecords.length / limit),
            totalRecords: totalRecords.length,
          },
        });
      }
    });
};

const createSponsorHour = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Note content can not be empty",
    });
  }
  console.log("req.body---------------->", req.body);

  var sponsor_data = await SponsorHour.find({
    sponsor_id: req.body.sponsor_id,
    conference_date: req.body.conference_date,
    time_zone: req.body.time_zone,
    start_time: { $gte: req.body.start_time },
    start_time: { $lte: req.body.end_time },
    end_time: { $gte: req.body.start_time },
    end_time: { $lte: req.body.end_time },
  }).countDocuments();
  console.log("-------------sponsor_data------->", sponsor_data);
  if (sponsor_data > 0) {
    return res.send({
      status: 500,
      message: "Already a sponsor booth hour is added for the same time.",
    });
  }

  // Create a User
  const SponsorHours = new SponsorHour({
    event: req.body.event,
    sponsor_id: req.body.sponsor_id,
    conference_date: req.body.conference_date,
    start_time: req.body.start_time,
    end_time: req.body.end_time,
    time_zone: req.body.time_zone,
    google_meet: req.body.google_meet,
    created_at: created_date,
    updated_at: created_date,
  });
  // Save Appointment in the database
  await SponsorHours.save()
    .then(async (data) => {
      return res.send({
        status: 200,
        message: "Sponsor booth hour added successfully",
      });
    })
    .catch((err) => {
      return res.send({ status: 500, message: "Something went wrong!" });
    });
};

const deleteSponsorHour = async (req, res) => {
  console.log("deleteSponsorHour================>", req.params);
  try {
    let responseData = await SponsorHour.findOneAndUpdate(
      { _id: req.params.hourId },
      { isDeleted: true },
      { new: true }
    );
    console.log("responseData---------->", responseData);
    if (responseData) {
      res.send({
        status: 200,
        message: "Slot deleted",
        data: {
          hourData: responseData,
        },
      });
    } else {
      throw new Error("Something went wrong. Please try again later.");
    }
  } catch (error) {
    console.log("error.message----------------->", error.message);
    res.send({
      status: 400,
      message: error.message,
      data: {},
    });
  }
};

const getSponsorhour = async (req, res) => {
  var current_date = moment().format("YYYY-MM-DD");
  var date = moment(current_date + "00:00", "DD/MM/YYYY HH:mm").format("X");
  let limit = 10;
  let pageNo = 1;
  if (req.query.pageNo) {
    console.log("req.query===========?7", req.query);
    pageNo = (parseInt(req.query.pageNo) - 1) * limit;
  }
  var sponsor_data = await User.findOne({ _id: req.params.id }).exec();
  await SponsorHour.find({
    sponsor_id: req.params.id,
    conference_date: { $gte: current_date },
    isDeleted: false,
  })
    .populate("time_zone")
    .sort("conference_date")
    .skip(pageNo)
    .limit(limit)
    .exec(async (err, data) => {
      if (err) {
        console.log(err);
        return res.json({
          err: err,
          status: 500,
          message: "Something went wrong!",
        });
      } else {
        let totalRecords = await SponsorHour.find({
          sponsor_id: req.params.id,
          conference_date: { $gte: current_date },
          isDeleted: false,
        }).sort("conference_date");

        return res.json({
          status: 200,
          message: "Sponsor hour data",
          sponsor_data: sponsor_data,
          data: {
            SponsorHourData: data,
            totalPage: Math.ceil(totalRecords.length / limit),
            totalRecords: totalRecords.length,
          },
        });
      }
    });
};

const getSponsorhourFront = async (req, res) => {
  var current_date = moment().format("YYYY-MM-DD");
  var date = moment(current_date + "00:00", "DD/MM/YYYY HH:mm").format("X");

  var sponsor_data = await User.findOne({ _id: req.params.id }).exec();
  await SponsorHour.find({
    sponsor_id: req.params.id,
    conference_date: { $eq: current_date },
    isDeleted: false,
  })
    .populate("time_zone")
    .sort("conference_date")
    .exec(async (err, data) => {
      if (err) {
        console.log(err);
        return res.json({
          err: err,
          status: 500,
          message: "Something went wrong!",
        });
      } else {
        return res.json({
          status: 200,
          message: "Sponsor hour data",
          sponsor_data: sponsor_data,
          SponsorHourData: data,
        });
      }
    });
};

const editSponsorhour = async (req, res) => {
  await SponsorHour.findOne({ _id: req.params.id }).exec(async (err, data) => {
    if (err) {
      console.log(err);
      return res.json({
        err: err,
        status: 500,
        message: "Something went wrong!",
      });
    } else {
      return res.json({
        status: 200,
        message: "Sponsor hour data",
        data: data,
      });
    }
  });
};

const updateHour = (req, res) => {
  ////////////////////////////////////////////////////////////
  if (!req.body) {
    return res.status(400).send({
      message: "Note content can not be empty",
    });
  }

  var data = {
    conference_date: req.body.conference_date,
    start_time: req.body.start_time,
    end_time: req.body.end_time,
    time_zone: req.body.time_zone,
    google_meet: req.body.google_meet,
    updated_at: created_date,
  };

  SponsorHour.findByIdAndUpdate(
    { _id: req.params.id },
    data,
    { new: true },
    function (err, result) {
      if (err) {
        return res.send({ status: 500, message: "Something went wrong!" });
      } else {
        return res.json({
          status: 200,
          message: "Sposon hour updated successfully",
          data: result,
        });
      }
    }
  );
};

const fetchOnDemand = async (req, res) => {
  console.log("expoController::fetchOnDemad");
  try {
    console.log("req.body=====>", req.body);

    let onDemandData = [];
    let totalReacord = 0;
    if (req.body.skip >= 0) {
      skip = parseInt(req.body.skip);
      limit = parseInt(req.body.limit);

      // both aplha filter and serach filter
      if (req.body.alphaSort && req.body.search) {
        console.log(
          "========================aplha and serach==============",
          req.body.search
        );
        let status = ["desc"];
        if (req.body.alphaSort.toUpperCase() == "ASC") {
          status = ["asc"];
        }

        let onDemandData1 = await Jitsi.find({ event: req.body.event_id })
          .populate({
            path: "agenda",
            match: { title: { $regex: new RegExp(req.body.search) } },
          })
          .populate("event");

        let filterData = [];
        for (let data of onDemandData1) {
          if (data.agenda != null) {
            filterData.push(data);
          }
        }

        let filterData2 = _.orderBy(
          filterData,
          (item) => item.agenda.title,
          status
        );
        onDemandData = filterData2.slice(skip, skip + limit);

        let onDemandData2 = await Jitsi.find({ event: req.body.event_id })
          .populate({
            path: "agenda",
            match: { title: { $regex: new RegExp(req.body.search) } },
          })
          .populate("event");

        for (let data of onDemandData2) {
          if (data.agenda != null) {
            totalReacord = totalReacord + 1;
          }
        }
      }
      //only search
      else if (!req.body.alphaSort && req.body.search) {
        console.log(
          "========================only serach==============",
          req.body.search
        );

        let onDemandData1 = await Jitsi.find({ event: req.body.event_id })
          .populate({
            path: "agenda",
            match: { title: { $regex: new RegExp(req.body.search) } },
          })
          .populate("event");

        let filterData = [];
        for (let data of onDemandData1) {
          if (data.agenda != null) {
            filterData.push(data);
          }
        }

        onDemandData = filterData.slice(skip, skip + limit);

        let onDemandData2 = await Jitsi.find({ event: req.body.event_id })
          .populate({
            path: "agenda",
            match: { title: { $regex: new RegExp(req.body.search) } },
          })
          .populate("event");

        for (let data of onDemandData2) {
          if (data.agenda != null) {
            totalReacord = totalReacord + 1;
          }
        }
      }
      //only alpha
      else if (req.body.alphaSort && !req.body.search) {
        console.log(
          "========================only aplha==============",
          req.body.search
        );

        let status = ["desc"];
        if (req.body.alphaSort.toUpperCase() == "ASC") {
          status = ["asc"];
        }

        console.log("status=================>", status);

        onDemandData1 = await Jitsi.find({ event: req.body.event_id })
          .populate("event")
          .populate({ path: "agenda" });
        // .skip(skip)
        // .limit(limit);
        onDemandDataX = _.orderBy(
          onDemandData1,
          (item) => item.agenda.title,
          status
        );

        onDemandData = onDemandDataX.slice(skip, skip + limit);

        totalReacord = await Jitsi.find({ event: req.body.event_id }).count();
      }
      //normal pagination
      else if (!req.body.alphaSort && !req.body.search) {
        console.log("<=================Normal pagination==============>");
        onDemandData = await Jitsi.find({ event: req.body.event_id })
          .populate("agenda")
          .populate("event")
          .skip(skip)
          .limit(limit);

        totalReacord = await Jitsi.find({ event: req.body.event_id }).count();
      }
    } else {
      console.log("=================default case");
      onDemandData = await Jitsi.find({ event: req.body.event_id })
        .populate("agenda")
        .populate("event");
      totalReacord = onDemandData.length;
    }

    res.send({
      status: 200,
      message: "Data fetched",
      data: {
        onDemandData: onDemandData,
        totalReacord: totalReacord,
      },
    });
  } catch (error) {
    console.log("error=======>", error.message);
    res.send({
      status: 400,
      message: error.message,
      data: {},
    });
  }
};

const boothDetail = async (req, res) => {
  try {
    console.log("expoController::fetchBooth");
    console.log("req.params");
    let current_date = moment().format("YYYY-MM-DD");

    let boothData = await CompanyCategory.findOne({ _id: req.params.boothId });
    let boothHour = await SponsorHour.find({
      booth: req.params.boothId,
      isDeleted: false,
    });
    let sponsorData = await User.find({booth:req.params.boothId,role:4})

    res.send({
      status: 200,
      message: "Data Fetched Successfully",
      data: {
        boothDetail: boothData,
        boothHours: boothHour,
        sponsorsData: sponsorData
      },
    });
  } catch (error) {
    res.send({
      status: 400,
      message: error.message,
      data: "",
    });
  }
};

module.exports = {
  getAgenda,
  getSponsorVideo,
  createAppointment,
  createSponsorHour,
  getSponsorhour,
  getSponsorhourFront,
  editSponsorhour,
  getAppointments,
  updateHour,
  deleteSponsorHour,
  fetchOnDemand,
  getBooths,
  boothDetail
};
