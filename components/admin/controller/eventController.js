var User = require("../../../models/User");
var Design = require("../../../models/Design");
var Event = require("../../../models/Event");
var Speaker = require("../../../models/Speaker");
var Session = require("../../../models/Session");
var RewardsCategory = require("../../../models/rewardCategory");

var User = require("../../../models/User");
const timestamp = require('time-stamp');
created_date = timestamp.utc('YYYY-MM-DD HH:mm:ss');
var moment = require('moment');
const uniqueRandom = require('unique-random');
var moment = require('moment');
const { validationResult } = require('express-validator');

module.exports.getEvent = async (req, res) => {
  await Event.find().populate('client_id').exec(async (err, userObj) => {

    if (err) {
      $message = { message: 'Something went wrong' }
      req.flash("errors", $message)
      return res.redirect('/event-list');
    }
    else {

      let active = 'Event';
      let title = 'Event List';
      let data = userObj;
      return res.render('event/event_list', { active, title, data, moment: moment, errors: req.flash("errors"), message: req.flash("message") });

    }
  });
}


module.exports.getSession = async (req, res) => {
  let id = req.params.id;
  await Session.find({ event: id }).populate('event').populate('speakers').exec(async (err, userObj) => {
    if (err) {
      $message = { message: 'Something went wrong' }
      req.flash("errors", $message)
      return res.redirect('/session-list');
    }
    else {
      let data = userObj;
      // console.log(JSON.parse(data));
      return res.render('event/session_list', { data, moment: moment, id, errors: req.flash("errors"), message: req.flash("message") });

    }
  });
}



module.exports.addEvent = async (req, res) => {

  if (typeof req.flash('formdata') == 'undefined') {
    var formdata = {
      client_id: '',
      title: '',
      description: '',
      site_url: '',
      facebook: '',
      instagram: '',
      twitter: '',
      demand_link:'',
      rap_link:'',
      linkdin: '',
      dashboard: '',
      start_date: '',
      end_date: '',
      image_data: '',
      video_data: '',
      currentDate: new Date().toISOString().split("T")[0],
    };
    req.flash("formdata", formdata);
  }

  $where = { role: 2 };
  var data = await User.find($where).exec();
  let active = 'Event';
  let title = 'Add Event';
  res.render('event/add_event', { active, title, formdata: req.flash('formdata'), data: data, errors: req.flash('errors'), reset: req.flash("reset") });
}

module.exports.addSpeakers = async (req, res) => {

  //console.log('req.params.event_id');
  //console.log(req.params.event_id);
  if (typeof req.flash('formdata') == 'undefined') {
    var formdata = {
      title: '',
      description: '',
      article: '',
      start_date: '',
      end_date: ''
    };
    req.flash("formdata", formdata);
  }

  $where = { event: req.params.event_id };
  var data = await Speaker.find($where).exec();
  if (data.length > 0) {
    return res.redirect('/add-event/step-three/' + req.params.event_id);
  }

  ///console.log('data');
  //console.log(data);
  res.render('event/add_speakers', { formdata: req.flash('formdata'), event_id: req.params.event_id, data: data, errors: req.flash('errors'), reset: req.flash("reset") });
}


module.exports.addSession = async (req, res) => {

  $where = { role: 2 };
  var data = await User.find($where).exec();
  //console.log('req.params.event_id');
  //console.log(req.params.event_id);
  if (typeof req.flash('formdata') == 'undefined') {
    var formdata = {
      title: '',
      description: '',
      theme: '',
      dashboard: '',
      site_url: '',
      start_date: '',
      end_date: ''
    };
    req.flash("formdata", formdata);
  }
  $where = { event: req.params.event_id };
  var data = await Speaker.find($where).exec();
  // console.log(data);
  res.render('event/add_sessions', { formdata: req.flash('formdata'), event_id: req.params.event_id, data: data, errors: req.flash('errors'), reset: req.flash("reset") });
}


module.exports.imageUpload = async (req, res) => {
  // console.log(req.body,"4444",req.file,"dddfddd",req.file.size)
  try {
    if (typeof req.file == 'undefined' && typeof req.fileValidationError == 'undefined') {
      return res.json({
        status: 400,
        message: 'Please select file!'
      })
    }
    // else if (req.file.size > 1000 *1000*3) {

    //   return res.json({
    //     status: 400,
    //     message: "Filesize must less than 3MB !",
    //   });

    //   } 
    else {
      if (typeof req.file == 'undefined' && typeof req.fileValidationError) {
        return res.json({
          status: 400,
          message: 'Only upload jpeg,jpg and png file type!'
        })

      }
      else {

        return res.json({
          status: 200,
          data: req.file.filename,

          message: 'Image uploaded sucessfully'

        })
      }
    }
  }
  catch (err) {
    return res.json({
      status: 500,
      message: 'Something went wrong'
    })
  }
}


module.exports.multipleUpload = async (req, res) => {
  console.log(req.body, "4444", req, "ddd", req.fileValidationError)
  try {
    if (typeof req.files == 'undefined' && typeof req.fileValidationError == 'undefined') {
      return res.json({
        status: 400,
        message: 'Please select image!'
      })
    }
    else {
      if (typeof req.files == 'undefined' && typeof req.fileValidationError) {
        return res.json({
          status: 400,
          message: 'Only upload jpeg,jpg and png file type!'
        })

      }
      // else if (req.file.size > 1000 *1000*200) {

      //   return res.json({
      //     status: 400,
      //     message: "Filesize must less than 200 MB !",
      //   });

      //   } 
      else {

        return res.json({
          status: 200,
          data: req.files,

          message: 'Image uploaded sucessfully'

        })
      }
    }
  }
  catch (err) {
    console.log("error=========================================================================>", err)
    return res.json({
      status: 500,
      message: 'Something went wrong'
    })
  }
}





module.exports.addEventPost = async (req, res) => {

  var formdata = {
    client_id: req.body.client_id,
    title: req.body.title,
    description: req.body.description,
    site_url: req.body.site_url,
    facebook: req.body.facebook,
    instagram: req.body.instagram,
    rap_link: req.body.rap_link,
    demand_link: req.body.demand_link,
    // video_360: req.body.video_360,
    twitter: req.body.twitter,
    start_date: req.body.start_date,
    end_date: req.body.end_date,
    download: req.body.download,
    hyperlink1: req.body.hyperlink1,
    hyperlink2: req.body.hyperlink2,
    hyperlink3: req.body.hyperlink3,
    hyperlink4: req.body.hyperlink4,
    // linkdin: req.body.linkdin,
  };

  const errors = validationResult(req);

  let errorsData = {
    client_id: '',
    title: '',
    description: '',
    site_url: '',
    facebook: '',
    instagram: '',
    video_360: '',
    demand_link:'',
      rap_link:'',
    twitter: '',
    hyperlink1:'',
    hyperlink2:'',
    hyperlink3:'',
    hyperlink4:'',
    linkdin: '',
    theme: '',
    download: '',
    start_date: '',
    end_date: '',
    image_data: '',
    video_data: '',
  };
  if (errors.array().length > 0) {
    errors.array().forEach((value) => {
      errorsData[value.param] = value.msg;
    });

    req.flash("errors", errorsData);
    req.flash("formdata", formdata);
    return res.redirect('/add-event/');
  }

  if (Array.isArray(req.body.image_data) == true && req.body.image_data.length > 4) {
    $message = { message: 'Max upload 4 images!' };
    req.flash('errors', $message);
    return res.redirect("/add-event/");
  }
  let startDateData = req.body.start_date.split("-")
  let endtDateData = req.body.end_date.split("-")
  const oneDay = 24 * 60 * 60 * 1000;
  const firstDate = new Date(startDateData[0], startDateData[1], startDateData[2]);
  const secondDate = new Date(endtDateData[0], endtDateData[1], endtDateData[2]);
  const diffDays = Math.round((secondDate - firstDate) / oneDay);
  console.log("diffDays=======================================>", diffDays)
  if (diffDays < 0) {
    $message = { message: 'End date must be equal or greater than start date.' };
    req.flash('errors', $message);
    req.flash("data", data);
    return res.redirect('/add-event');
  }
  const random = uniqueRandom(99999999, 999999999999);

  var data1 = await Event.find({ site_url: req.body.site_url }).exec();

  if (data1.length > 0) {
    $message = { message: 'Same site url already exist!' };
    req.flash('errors', $message);
    req.flash("data", data);
    req.flash("formdata", formdata);
    return res.redirect('/add-event');
  }


  // $where = { registeration_id: random() };
  // var data = await Event.find($where).exec();
  // if (data.length > 0) {
  //   random = uniqueRandom(99999999, 999999999999);
  // }
  var hyperlink1 =null;
  var hyperlink2 =null;
  var hyperlink3 =null;
  var hyperlink4 =null;
  if (req.body.hyperlink1) {
    hyperlink1 = req.body.hyperlink1;
  }
  if (req.body.hyperlink2) {
    hyperlink2 = req.body.hyperlink2;
  }
  if (req.body.hyperlink3) {
    hyperlink3 = req.body.hyperlink3;
  }
  if (req.body.hyperlink4) {
    hyperlink4 = req.body.hyperlink4;
  }
  const Events = new Event({
    client_id: req.body.client_id,
    // registeration_id: random(),
    title: req.body.title,
    description: req.body.description,
    site_url: req.body.site_url,
    facebook: req.body.facebook,
    instagram: req.body.instagram,
    twitter: req.body.twitter,
    rap_link: req.body.rap_link,
    demand_link: req.body.demand_link,
    // linkdin: req.body.linkdin,
    // theme: req.body.theme,
    // dashboard: req.body.dashboard,
    hyperlink1: hyperlink1,
    hyperlink2: hyperlink2,
    hyperlink3: hyperlink3,
    hyperlink4: hyperlink4,
    download: req.body.download,
    start_date: req.body.start_date,
    end_date: req.body.end_date,
    images: req.body.image_data,
    videos: req.body.video_data,
    created_at: created_date,
    updated_at: created_date,
    // space_code: req.body.video_360
  });



  Events.save()
    .then(async data => {
      let form_d = [
        {
          "name" : "liveSession",
          "title" : "Watch sessions live",
          "rewardPoints" : 10.0
        },
        {
          "name" : "onDemand",
          "title" : "Watch sessions On-Demand",
          "rewardPoints" : 20.0
        },
        {
          "name" : "sponsorsAandLounges",
          "title" : "Visit Partner booths",
          "rewardPoints" : 30.0
        }
      ]
  let resolvedAllergy= await Promise.all(form_d.map(async item =>{
      if(item.rewardPoints){
                return await RewardsCategory.register({event:data._id, name:item.name, title:item.title, rewardPoints:item.rewardPoints,created_at:created_date,updated_at:created_date}); 
      }
  }))

      $message = { msg: 'Event added successfully' }
      req.flash("errors", $message)
      return res.redirect('/add-event');
    }).catch(err => {
      $message = { message: 'Something went wrong!' }
      req.flash("errors", $message)
      return res.redirect('/add-event');
    })


}

module.exports.postSpeakers = async (req, res) => {


  ////////////////////////////////////////////////////////////
  console.log(req.body.form);
  let form_d = req.body.form;
  let resolvedAllergy = await Promise.all(form_d.map(async item => {
    if (item) {
      return await Speaker.register({
        event: req.params.event_id, name: item.name, designation: item.designation, profile_pic: item.profile_pic, description: item.description, created_at: created_date,
        updated_at: created_date
      })
    }
  }))
  if (resolvedAllergy) {
    return res.send({
      status: 200,
      event_id: req.params.event_id,
      message: 'Speaker added successfully'
    });
  }
  else {
    return res.send({
      status: 500,
      message: 'Something went wrong'
    });
  }


}


module.exports.postSession = async (req, res) => {

  const Sessions = new Session({
    event: req.params.event_id,
    date: req.body.date,
    start_time: req.body.start_time,
    end_time: req.body.end_time,
    image: req.body.image,
    video: req.body.video,
    description: req.body.description,
    speakers: req.body.speakers,
    created_at: created_date,
    updated_at: created_date
  });

  Sessions.save()
    .then(async data => {
      return res.send({
        status: 200,
        data: data,
        message: 'Agenda added successfully'
      });
    }).catch(err => {
      return res.json({
        status: 500,
        message: 'Something went wrong'
      })
    })
}

module.exports.editEvent = async (req, res) => {
  let id = req.params.id;
  await Event.findOne({ _id: id }, function (err, user) {
    if (err) {
      $message = { msg: 'Something went wrong' }
      req.flash("errors", $message)
      return res.redirect('/edit-event/' + id);
    }
    else {

      let data = user;
      var url = process.env.IMAGE_URL;
      let currentDate = new Date().toISOString().split("T")[0]
      let active = 'Event';
      let title = 'Edit Event';
      res.render('event/edit_event', { active, title, errors: req.flash("errors"), data, moment, url, currentDate });
    }
  });
}


module.exports.eventDetail = async (req, res) => {
  let event_id = req.params.id;

  await Event.findOne({ _id: event_id }).populate('client_id').exec((err, user) => {
    if (err) {
      $message = { msg: 'Something went wrong' }
      req.flash("errors", $message)
      return res.redirect('/event-detail/' + event_id);
    }
    else {
      console.log(user);
      let data = user;
      var url = process.env.IMAGE_URL;
      console.log(data);
      let active = 'Event';
      let title = 'Edit Event';
      let right_active = 'Event';
      let left_side = 'active';
      res.render('event/event_detail', { layout: 'layouts/eventLayout', event_id, data, active, title, right_active, left_side, errors: req.flash("errors"), data, moment, url });
    }
  });
}

module.exports.editSpeakers = async (req, res) => {
  let id = req.params.id;
  await Speaker.findOne({ _id: id }, function (err, user) {
    if (err) {
      $message = { msg: 'Something went wrong' }
      req.flash("errors", $message)
      return res.redirect('/edit-speakers/' + id);
    }
    else {

      let data = user;
      var url = process.env.IMAGE_URL;
      console.log(data);
      res.render('event/edit_speakers', { errors: req.flash("errors"), data, moment, url, speaker_id: req.params.id });
    }
  });
}

module.exports.editSession = async (req, res) => {
  let id = req.params.id;
  await Session.findOne({ _id: id }, function (err, user) {
    if (err) {
      $message = { msg: 'Something went wrong' }
      req.flash("errors", $message)
      return res.redirect('/edit-session/' + id);
    }
    else {

      let data = user;
      var url = process.env.IMAGE_URL;
      console.log(data);
      res.render('event/edit_session', { errors: req.flash("errors"), data, moment, url, speaker_id: req.params.id });
    }
  });
}



module.exports.updateEvent = async (req, res) => {
  console.log(req.body, "in the event update")
  let id = req.params.id;
  ///////////// Validate request//////////////////////////
  const errors = validationResult(req);

  let errorsData = {
    title: '',
    description: '',
    site_url: '',
    dashboard: '',
    download: "",
    theme: '',
    start_date: '',
    end_date: '',
    image_data: '',
    video_data: '',
    video_360: ""

  };
  if (errors.array().length > 0) {
    errors.array().forEach((value) => {
      errorsData[value.param] = value.msg;
    });

    req.flash("errors", errorsData);
    return res.redirect('/edit-event/' + id);
  }

  if (Array.isArray(req.body.image_data) == true && req.body.image_data.length > 4) {
    console.log(req.body.image_data.length);
    $message = { message: 'Max upload 4 images!' };
    req.flash('errors', $message);
    return res.redirect("/edit-event/" + id);
  }
  let startDateData = req.body.start_date.split("-")
  let endtDateData = req.body.end_date.split("-")
  const oneDay = 24 * 60 * 60 * 1000;
  const firstDate = new Date(startDateData[0], startDateData[1], startDateData[2]);
  const secondDate = new Date(endtDateData[0], endtDateData[1], endtDateData[2]);
  const diffDays = Math.round((secondDate - firstDate) / oneDay);
  console.log("diffDays=======================================>", diffDays)
  if (diffDays < 0) {
    errorsData.end_date = "End date must be equal or greater than start date";
    req.flash("errors", errorsData);
    return res.redirect('/edit-event/' + id);
  }

  if (!req.body) {
    return res.status(400).send({
      message: "Note content can not be empty"
    });
  }

  var data = {
    title: req.body.title,
    description: req.body.description,
    site_url: req.body.site_url,
    facebook: req.body.facebook,
    instagram: req.body.instagram,
    twitter: req.body.twitter,
    rap_link: req.body.rap_link,
    demand_link: req.body.demand_link,
    // linkdin: req.body.linkdin,
    // dashboard: req.body.dashboard,
    download: req.body.download,
    theme: req.body.theme,
    // space_code: req.body.video_360,
    start_date: req.body.start_date,
    end_date: req.body.end_date,
    images: req.body.image_data,
    videos: req.body.video_data,
    updated_at: created_date
  };

  if (req.body.hyperlink1) {
    data.hyperlink1 = req.body.hyperlink1;
  }
  if (req.body.hyperlink2) {
    data.hyperlink2 = req.body.hyperlink2;
  }
  if (req.body.hyperlink3) {
    data.hyperlink3 = req.body.hyperlink3;
  }
  if (req.body.hyperlink4) {
    data.hyperlink4 = req.body.hyperlink4;
  }

  await Event.findByIdAndUpdate({ _id: id }, data, { new: true }, function (err, result) {
    if (err) {
      $message = { message: 'Something went wrong' }
      req.flash("errors", $message)
      return res.redirect('/edit-event/' + id);
    } else {
      req.session.auth = result;
      $message = { msg: 'Event updated successfully' }
      req.flash("errors", $message)
      return res.redirect('/edit-event/' + id);
    }
  });
}


module.exports.updateSpeaker = async (req, res) => {

  let id = req.params.id;
  ///////////// Validate request//////////////////////////
  const errors = validationResult(req);

  let errorsData = {
    name: '',
    designation: '',
    description: '',
    profile_pic: ''
  };
  if (errors.array().length > 0) {
    errors.array().forEach((value) => {
      errorsData[value.param] = value.msg;
    });

    req.flash("errors", errorsData);
    return res.redirect('/edit-speaker/' + id);
  }

  if (!req.body) {
    return res.status(400).send({
      message: "Note content can not be empty"
    });
  }

  var data = {
    name: req.body.name,
    designation: req.body.designation,
    description: req.body.description,
    profile_pic: req.body.profile_pic,
    updated_at: created_date
  };

  await Speaker.findByIdAndUpdate({ _id: id }, data, { new: true }, function (err, result) {
    if (err) {
      $message = { message: 'Something went wrong' }
      req.flash("errors", $message)
      return res.redirect('/edit-speaker/' + id);
    } else {
      req.session.auth = result;
      $message = { msg: 'Speaker updated successfully' }
      req.flash("errors", $message)
      return res.redirect('/edit-speaker/' + id);
    }
  });
}

module.exports.viewSponser = async (req, res) => {
  let id = req.params.id;
  await User.find({ event: id }).populate('event').populate('membership_type').exec((err, user) => {
    if (err) {
      $message = { msg: 'Something went wrong' }
      req.flash("errors", $message)
      return res.redirect('/view-sponsers/' + req.params.id);
    }
    else {
      let data = user;
      data.profile_img = process.env.IMAGE_URL + user.profile_img;
      console.log(data);
      res.render('event/view_sponser', { errors: req.flash("errors"), data, moment: moment });
    }
  });
}


module.exports.editDesign = async (req, res) => {
  let id = req.params.id;
  await Design.findOne({ event: id }, function (err, user) {
    if (err) {
      $message = { msg: 'Something went wrong' }
      req.flash("errors", $message)
      return res.redirect('/edit-design/' + req.params.evnet_id);
    }
    else {
      let data = '';
      console.log('userssssssssssssssssss');
      console.log(user);
      if (user) {
        console.log('hello');
        data = user;
      }
      else {
        console.log('1111');

        data = {};
      }

      let active = 'Event';
      let title = 'Edit Event Design';
      let right_active = 'Design';
      let left_side = 'active';
      res.render('event/edit_design', { layout: 'layouts/eventLayout', active, title, right_active, left_side, errors: req.flash("errors"), data, moment, event_id: req.params.id });
    }
  });
}



module.exports.updateDesign = async (req, res) => {

  let id = req.params.id;
  ///////////// Validate request//////////////////////////
  const errors = validationResult(req);

  let errorsData = {
    primary_color: '',
    secondary_color: '',
    third_color: '',
    background_image: ''
  };
  if (errors.array().length > 0) {
    errors.array().forEach((value) => {
      errorsData[value.param] = value.msg;
    });

    req.flash("errors", errorsData);
    return res.redirect('/edit-design/' + id);
  }

  if (!req.body) {
    return res.status(400).send({
      message: "Note content can not be empty"
    });
  }


  var data = await Design.find({ event: id }).exec();
  if (data.length > 0) {
    var data1 = {
      primary_color: req.body.primary_color,
      secondary_color: req.body.secondary_color,
      third_color: req.body.third_color,
      background_image: req.body.image_data,
      updated_at: created_date
    };

    await Design.findOneAndUpdate({ event: id }, data1, function (err, result) {
      if (err) {
        $message = { message: 'Something went wrong' }
        req.flash("errors", $message)
        return res.redirect('/edit-design/' + id);
      } else {
        req.session.auth = result;
        $message = { msg: 'Event design updated successfully' }
        req.flash("errors", $message)
        return res.redirect('/edit-design/' + id);
      }
    });
  }
  else {
    const Designs = new Design({
      event: req.params.id,
      primary_color: req.body.primary_color,
      secondary_color: req.body.secondary_color,
      third_color: req.body.third_color,
      background_image: req.body.image_data,
      created_at: created_date,
      updated_at: created_date
    });



    Designs.save()
      .then(async data => {
        $message = { msg: 'Event design updated successfully' }
        req.flash("errors", $message)
        return res.redirect('/edit-design/' + id);
      }).catch(err => {
        $message = { message: 'Something went wrong!' }
        req.flash("errors", $message)
        return res.redirect('/edit-design/' + id);
      })
  }


}
