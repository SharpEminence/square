var User = require("../../../models/User");
var Speaker = require("../../../models/Speaker");
var Agenda = require("../../../models/Agenda");
var President = require("../../../models/President");
var Demand = require("../../../models/Demand");
var AgendaCategory = require("../../../models/AgendaCategory");
var Timezone = require("../../../models/Timezone");
const timestamp = require("time-stamp");
created_date = timestamp.utc("YYYY-MM-DD HH:mm:ss");
const { validationResult } = require("express-validator");
var moment = require("moment");
var momentTime = require("moment-timezone");

module.exports.addPresident = async (req, res) => {
  //console.log('req.params.event_id');
  //console.log(req.params.event_id);
  if (typeof req.flash("formdata") == "undefined") {
    var formdata = {
      title: "",
      description: "",
      image_data: "",
      video_data: "",
    };
    req.flash("formdata", formdata);
  }
  
  let active = "Event";
  let title = "Add President";
  let right_active = "president";
  let left_side = "active";

  ///console.log('data');
  //console.log(data);
  res.render("president/add_president", {
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

module.exports.addPresidentPost = async (req, res) => {
  var formdata = {
    event: req.params.event_id,
    // agenda_type: req.body.agenda_type,
    title: req.body.title,
    description: req.body.description,
    designation: req.body.designation,
    year: req.body.year,
    image_data: req.body.image_data,
    video_data: req.body.video_data,
  };
  ///////////// Validate request//////////////////////////
  const errors = validationResult(req);

  let errorsData = {
    agenda_type: "",
    title: "",
    description: "",
    image_data: "",
    video_data: "",
  };
  if (errors.array().length > 0) {
    errors.array().forEach((value) => {
      errorsData[value.param] = value.msg;
    });

    req.flash("errors", errorsData);
    req.flash("formdata", formdata);
    return res.redirect("/add-president/" + req.params.event_id);
  }
  ////////////////////////////////////////////////////////////
  if (!req.body) {
    return res.status(400).send({
      message: "Note content can not be empty",
    });
  }

  if (req.body.title.trim().length == 0) {
    errorsData.title = "Enter a valid title.";
    req.flash("errors", errorsData);
    req.flash("formdata", formdata);
    return res.redirect("/add-president/" + req.params.event_id);
  }
 
  

    
  const Presidents = new President({
    event: req.params.event_id,
    title: req.body.title,
    description: req.body.description,
    designation: req.body.designation,
    year: req.body.year,
    video_url: req.body.video_url,
    image_data: req.body.image_data,
    video_data: req.body.video_data,
    created_at: created_date,
    updated_at: created_date,
  });

  // Save Speakers in the database
  Presidents.save()
    .then((data) => {
      $message = { msg: "Data saved successfully!" };
      req.flash("errors", $message);
      return res.redirect("/add-president/" + req.params.event_id);
    })
    .catch((err) => {
      console.log(err);
      $message = { message: "Some error occurred!" };
      req.flash("formdata", formdata);
      req.flash("errors", $err);
      return res.redirect("/add-president/" + req.params.event_id);
    });
};

module.exports.getPresident = async (req, res) => {
  $where = { event: req.params.event_id };
  await President.find($where)
    .sort({ _id: -1 })
    .exec(async (err, userObj) => {
      if (err) {
        $message = { message: "Something went wrong" };
        req.flash("errors", $message);
        return res.redirect("/president-list/" + req.params.event_id);
      } else {
        let data = userObj;
        let active = "Event";
        let title = "President List";
        let right_active = "president";
        let left_side = "active";
        return res.render("president/president_list", {
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

module.exports.editPresident = async (req, res) => {
  let id = req.params.id;
  let event_id = req.params.event_id;
  await President.findOne({ _id: id }, async function (err, user) {
    if (err) {
      $message = { msg: "Something went wrong" };
      req.flash("errors", $message);
      return res.redirect("/edit-president/" + id + "/" + event_id);
    } else {
      let data = user;
      let active = "Event";
      let title = "Edit President";
      let right_active = "president";
      let left_side = "active";
    
      res.render("president/edit_president", {
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

module.exports.updatePresident = async (req, res) => {
  let id = req.params.id;
  let event_id = req.params.event_id;
  ///////////// Validate request//////////////////////////
  const errors = validationResult(req);

  let errorsData = {
    title: "",
    description: "",
    image_data: "",
    video_data: "",
  };
  if (errors.array().length > 0) {
    errors.array().forEach((value) => {
      errorsData[value.param] = value.msg;
    });

    req.flash("errors", errorsData);
    return res.redirect("/edit-president/" + id + "/" + event_id);
  }
  ////////////////////////////////////////////////////////////
  if (!req.body) {
    return res.status(400).send({
      message: "Note content can not be empty",
    });
  }

  

  var where = {
    // agenda_type: req.body.agenda_type,
    title: req.body.title,
    description: req.body.description,
    designation: req.body.designation,
    year: req.body.year,
    video_url: req.body.video_url,
    updated_at: created_date,
  };
  if (req.body.image_data) {
    where.image_data = req.body.image_data;
  }
  if (req.body.video_data) {
    where.video_data = req.body.video_data;
  }


  President.findByIdAndUpdate({ _id: id }, where, { new: true }, function (
    err,
    result
  ) {
    if (err) {
      $message = { message: "Something went wrong" };
      req.flash("errors", $message);
      return res.redirect("/edit-president/" + id + "/" + event_id);
    } else {
      req.session.auth = result;
      $message = { msg: "Data updated successfully" };
      req.flash("errors", $message);
      return res.redirect("/edit-president/" + id + "/" + event_id);
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
