var User = require("../../../models/User");
var Speaker = require("../../../models/Speaker");
var Agenda = require("../../../models/Agenda");
var President = require("../../../models/President");
var Notification = require("../../../models/Notification");
var AgendaCategory = require("../../../models/AgendaCategory");
var Timezone = require("../../../models/Timezone");
const timestamp = require("time-stamp");
created_date = timestamp.utc("YYYY-MM-DD HH:mm:ss");
const { validationResult } = require("express-validator");
var moment = require("moment");
var momentTime = require("moment-timezone");

module.exports.addNotification = async (req, res) => {
  //console.log('req.params.event_id');
  //console.log(req.params.event_id);
  if (typeof req.flash("formdata") == "undefined") {
    var formdata = {
      session: "",
      datetime: "",
      message: "",
      datetime_unix:"",
      currentDate: new Date().toISOString(),
    };
    req.flash("formdata", formdata);
  }
  
  let active = "Event";
  let title = "Add Notification";
  let right_active = "Notification";
  let left_side = "active";

  ///console.log('data');
  //console.log(data);
  res.render("notification/add_notification", {
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

module.exports.addNotificationPost = async (req, res) => {
  var formdata = {
    event: req.params.event_id,
    // agenda_type: req.body.agenda_type,
    message: req.body.messages,
    session: req.body.session,
    datetime: req.body.datetime,
  };
  ///////////// Validate request//////////////////////////
  const errors = validationResult(req);

  let errorsData = {
    messages: "",
    session: "",
    datetime: "",
    datetime_unix:""
  };
  if (errors.array().length > 0) {
    errors.array().forEach((value) => {
      errorsData[value.param] = value.msg;
    });

    req.flash("errors", errorsData);
    req.flash("formdata", formdata);
    return res.redirect("/add-notification/" + req.params.event_id);
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
 
  

    
  const Notifications = new Notification({
    event: req.params.event_id,
    message: req.body.messages,
    session: req.body.session,
    datetime: req.body.datetime,
    datetime_unix: moment(req.body.datetime).add(8, "hours").unix(),
    created_at: created_date,
    updated_at: created_date,
  });

  // Save Speakers in the database
  Notifications.save()
    .then((data) => {
      $message = { msg: "Notification saved successfully!" };
      req.flash("errors", $message);
      return res.redirect("/add-notification/" + req.params.event_id);
    })
    .catch((err) => {
      console.log(err);
      $message = { message: "Some error occurred!" };
      req.flash("formdata", formdata);
      req.flash("errors", $err);
      return res.redirect("/add-notification/" + req.params.event_id);
    });
};

module.exports.getNotification = async (req, res) => {
  $where = { event: req.params.event_id };
  await Notification.find($where)
    .sort({ _id: -1 })
    .exec(async (err, userObj) => {
      if (err) {
        $message = { message: "Something went wrong" };
        req.flash("errors", $message);
        return res.redirect("/notification-list/" + req.params.event_id);
      } else {
        let data = userObj;
        let active = "Event";
        let title = "Notification List";
        let right_active = "Notification";
        let left_side = "active";
        return res.render("notification/notification_list", {
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

module.exports.editNotification = async (req, res) => {
  let id = req.params.id;
  let event_id = req.params.event_id;
  await Notification.findOne({ _id: id }, async function (err, user) {
    if (err) {
      $message = { msg: "Something went wrong" };
      req.flash("errors", $message);
      return res.redirect("/edit-notification/" + id + "/" + event_id);
    } else {
      let data = user;
      let active = "Event";
      let title = "Edit Notification";
      let right_active = "Notification";
      let left_side = "active";
    
      res.render("notification/edit_notification", {
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

module.exports.updateNotification = async (req, res) => {
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
    return res.redirect("/edit-notification/" + id + "/" + event_id);
  }
  ////////////////////////////////////////////////////////////
  if (!req.body) {
    return res.status(400).send({
      message: "Note content can not be empty",
    });
  }

  

  var where = {
    // agenda_type: req.body.agenda_type,
    message: req.body.messages,
    session: req.body.session,
    datetime: req.body.datetime,
    datetime_unix: moment(req.body.datetime).add(8, "hours").unix(),
    updated_at: created_date,
  };
  

  Notification.findByIdAndUpdate({ _id: id }, where, { new: true }, function (
    err,
    result
  ) {
    if (err) {
      $message = { message: "Something went wrong" };
      req.flash("errors", $message);
      return res.redirect("/edit-notification/" + id + "/" + event_id);
    } else {
      req.session.auth = result;
      $message = { msg: "Notification updated successfully" };
      req.flash("errors", $message);
      return res.redirect("/edit-notification/" + id + "/" + event_id);
    }
  });
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
