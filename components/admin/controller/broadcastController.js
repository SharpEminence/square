var User = require("../../../models/User");
var Speaker = require("../../../models/Speaker");
var Agenda = require("../../../models/Agenda");
var President = require("../../../models/President");
var Notification = require("../../../models/Notification");
var ReadNotification = require("../../../models/ReadNotification");

var Broadcast = require("../../../models/Broadcast");
var AgendaCategory = require("../../../models/AgendaCategory");
var Timezone = require("../../../models/Timezone");
const timestamp = require("time-stamp");
created_date = timestamp.utc("YYYY-MM-DD HH:mm:ss");
const { validationResult } = require("express-validator");
var moment = require("moment");
var momentTime = require("moment-timezone");

const addBroadcast = async (req, res) => {
  //console.log('req.params.event_id');
  //console.log(req.params.event_id);
  if (typeof req.flash("formdata") == "undefined") {
    var formdata = {
      title: "",
      messages: "",
      status: "",
    };
    req.flash("formdata", formdata);
  }

  let active = "Event";
  let title = "Add Broadcast";
  let right_active = "Broadcast";
  let left_side = "active";

  ///console.log('data');
  //console.log(data);
  res.render("broadcast/add_broadcast", {
    layout: "layouts/eventLayout",
    active,
    title,
    right_active,
    left_side,
    formdata: req.flash("formdata"),
    event_id: req.params.event_id,
    errors: req.flash("errors"),
    reset: req.flash("reset"),
  });
};

const addBroadcastPost = async (req, res) => {
  var formdata = {
    event: req.params.event_id,
    // agenda_type: req.body.agenda_type,
    message: req.body.messages,
    title: req.body.title,
    status: req.body.status,
  };
  ///////////// Validate request//////////////////////////
  const errors = validationResult(req);

  let errorsData = {
    messages: "",
    title: "",
    status: "",
  };
  if (errors.array().length > 0) {
    errors.array().forEach((value) => {
      errorsData[value.param] = value.msg;
    });

    req.flash("errors", errorsData);
    req.flash("formdata", formdata);
    return res.redirect("/add-broadcast/" + req.params.event_id);
  }
  ////////////////////////////////////////////////////////////
  if (!req.body) {
    return res.status(400).send({
      message: "Note content can not be empty",
    });
  }

  // if (req.body.title.trim().length == 0) {
  //   errorsData.title = "Enter a valid title.";
  //   req.flash("errors", errorsData);
  //   req.flash("formdata", formdata);
  //   return res.redirect("/add-notification/" + req.params.event_id);
  // }

  try {
    const res_data = await saveMessage(req.params.event_id, req.body);
    if (res_data.status == 200) {
      $message = {
        msg:
          req.body.status == 1
            ? "Message Broadcast successfully!"
            : "Message saved successfully!",
      };
      req.flash("errors", $message);
      return res.redirect("/add-broadcast/" + req.params.event_id);
    } else {
      throw new Error(res_data.message);
    }
  } catch (error) {
    $message = { message: "Some error occurred!" };
    req.flash("formdata", formdata);
    req.flash("errors", $err);
    return res.redirect("/add-broadcast/" + req.params.event_id);
  }
};

const saveMessage = async (event_id, data) => {
  console.log("--------saveMessage invoked-----------");
  try {
    const filter = { status: 1 };
    const update = { status: 0 };
    let dataup = await Broadcast.findOneAndUpdate(filter, update, {
      returnOriginal: false,
    });

    console.log("isRewardAlreadyClaimed-------->", dataup);
    // if (isRewardAlreadyClaimed) {
    //   throw new Error("Reward has already claimed");
    // }

    let Broadcasts = new Broadcast({
      event: event_id,
      message: data.messages,
      title: data.title,
      status: data.status,
      created_at: created_date,
      updated_at: created_date,
    });

    const savedData = await Broadcasts.save();
    if (data.status == 1) {
      ReadNotification.collection.drop();
      // global.io.emit("newNotification", {
      //   message: data.messages,
      //   _id: savedData._id,
      //   title: data.title,
      // });
    }
    console.log("savedData=======>", savedData);
    return {
      status: 200,
      message: "Message broadcast",
      data: {
        saveMessage: Broadcasts,
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

const getBroadCast = async (req, res) => {
  $where = { event: req.params.event_id };
  await Broadcast.find($where)
    .sort({ _id: -1 })
    .exec(async (err, userObj) => {
      if (err) {
        $message = { message: "Something went wrong" };
        req.flash("errors", $message);
        return res.redirect("/broadcast-list/" + req.params.event_id);
      } else {
        let data = userObj;
        let active = "Event";
        let title = "Broadcast Message List";
        let right_active = "Broadcast";
        let left_side = "active";
        return res.render("broadcast/broadcast_list", {
          layout: "layouts/eventLayout",
          event_id: req.params.event_id,
          active,
          title,
          right_active,
          left_side,
          data,
          moment: moment,
          errors: req.flash("errors"),
        });
      }
    });
};

const editBroadCast = async (req, res) => {
  let id = req.params.id;
  let event_id = req.params.event_id;
  await Broadcast.findOne({ _id: id }, async function (err, user) {
    if (err) {
      $message = { msg: "Something went wrong" };
      req.flash("errors", $message);
      return res.redirect("/edit-broadcast/" + id + "/" + event_id);
    } else {
      let data = user;
      let active = "Event";
      let title = "Edit Broadcast";
      let right_active = "Broadcast";
      let left_side = "active";

      res.render("broadcast/edit_broadcast", {
        layout: "layouts/eventLayout",
        event_id,
        active,
        moment,
        title,
        right_active,
        left_side,
        errors: req.flash("errors"),
        data,
      });
    }
  });
};

const updateBroadcast = async (req, res) => {
  let id = req.params.id;
  let event_id = req.params.event_id;
  ///////////// Validate request//////////////////////////
  const errors = validationResult(req);

  let errorsData = {
    messages: "",
    session: "",
    datetime: "",
  };
  if (errors.array().length > 0) {
    errors.array().forEach((value) => {
      errorsData[value.param] = value.msg;
    });

    req.flash("errors", errorsData);
    return res.redirect("/edit-broadcast/" + id + "/" + event_id);
  }
  ////////////////////////////////////////////////////////////
  if (!req.body) {
    return res.status(400).send({
      message: "Note content can not be empty",
    });
  }
  try {
    const res_data = await updateMessage(req.params.id, req.body);
    if (res_data.status == 200) {
      $message = {
        msg:
          req.body.status == 1
            ? "Message Broadcast successfully!"
            : "Message update successfully!",
      };
      req.flash("errors", $message);
      return res.redirect("/edit-broadcast/" + id + "/" + event_id);
    } else {
      throw new Error(res_data.message);
    }
  } catch (error) {
    $message = { message: "Some error occurred!" };
    req.flash("formdata", formdata);
    req.flash("errors", $err);
    return res.redirect("/edit-broadcast/" + id + "/" + event_id);
  }
};

const updateMessage = async (id, data) => {
  console.log("--------saveMessage invoked-----------");
  try {
    if (data.status == 1) {
      const filter = { status: 1 };
      const update = { status: 0 };
      let dataup = await Broadcast.findOneAndUpdate(filter, update, {
        returnOriginal: false,
      });

      ReadNotification.collection.drop();

    }

    const where = { _id: id };
    const update_data = {
      message: data.messages,
      title: data.title,
      status: data.status,
      updated_at: created_date,
    };
    let udate_datas = await Broadcast.findOneAndUpdate(where, update_data, {
      returnOriginal: false,
    });

    if (data.status == 1) {
      // global.io.emit("newNotification", {
      //   message: data.messages,
      //   _id: id,
      //   title: data.title,
      // });
    }

    return {
      status: 200,
      message: "Message broadcast",
      data: {
        saveMessage: udate_datas,
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

module.exports.deleteAgenda = (req, res) => {
  Agenda.findByIdAndRemove(req.params.id, (err, data) => {
    if (typeof data == "undefined") {
      $message = { message: "Data not exist!" };
      req.flash("errors", $message);
      return res.redirect("/agenda-list/" + req.params.event_id);
    }
    if (err) {
      $message = { message: "Something went wrong" };
      req.flash("errors", $message);
      return res.redirect("/agenda-list/" + req.params.event_id);
    } else {
      if (data) {
        $message = { msg: "Agenda delete successfully" };
        req.flash("errors", $message);
        return res.redirect("/agenda-list/" + req.params.event_id);
      }
    }
  });
};

module.exports = {
  saveMessage,
  addBroadcast,
  addBroadcastPost,
  getBroadCast,
  editBroadCast,
  updateBroadcast,
  updateMessage,
};
