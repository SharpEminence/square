var User = require("./../../../../models/User");
var Rewards = require("./../../../../models/rewards");
var Bakup = require("./../../../../models/Bakup");
var Event = require("./../../../../models/Event");
var AgendaFavourite = require("./../../../../models/AgendaFavourite");

var Answer = require("./../../../../models/Answer");
var Answer = require("./../../../../models/Answer");
var ReadNotification = require("./../../../../models/ReadNotification");
var hotspotTracker = require("./../../../../models/hotspotTracker");
var Broadcast = require("./../../../../models/Broadcast");
var Notification = require("./../../../../models/Notification");
var Jitsi = require("./../../../../models/Jitsi");
var Timezone = require("./../../../../models/Timezone");
const timestamp = require("time-stamp");
created_date = timestamp.utc("YYYY-MM-DD HH:mm:ss");
const ejs = require("ejs");
var Mail = require("./../../../../utilities/mail");
var fs = require("fs");
var fastcsv = require("fast-csv");
var path = require("path");
var md5 = require("md5");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const { generateRoomURL } = require("./../../../../utilities/util");
const csv = require("csv-parser");
var moment = require("moment");
var AgendaFavourite = require("./../../../../models/AgendaFavourite");
var Agenda = require("./../../../../models/Agenda");

var Rewards = require("./../../../../models/rewards");
var CompanyCategory = require("./../../../../models/CompanyCategory");

module.exports.JitsiAuth = async (req, res) => {
  //PLEASE USE THE BELOW VARIABLE IF WANT TO USE ANY LEAVING EMPTY WILL AUTO GENERATE

  const context = {
    user: {
      avatar: "", // for not include this leave this empty
      name: req.body.name, // for making name dynamic leave empty
      email: "", // for not include this leave this empty
      id: req.body.uid, // for not include this leave this empty
    },
  };
  const roomName = req.body.room; // for generating dynamic leave empty string e.g. "";
  const expiry = Math.ceil(Date.now() / 1000) + 7200; // 2 hours from now

  const streamKey = req.body.stream_key;
  // for generating dynamic leave empty string

  var data = generateRoomURL(roomName, expiry, context, streamKey);
  var jitsi_data = await Jitsi.find({ agenda: req.body.stream_key }).exec();
  if (jitsi_data.length == 0) {
    const Jitsis = new Jitsi({
      agenda: req.body.stream_key,
      event: req.body.event,
      video: data.recordingLink,
      created_at: created_date,
      updated_at: created_date,
    });
    // Save User in the database
    await Jitsis.save();
  }
  return res.json({
    status: 200,
    message: "Auth data",
    data: data,
  });
};


module.exports.login = async (req, res) => {
  var params = req.body;
  var privateKey = "vnrvjrekrke";
  //  var token_key = jwt.sign({ user: 'user' }, privateKey, {expiresIn: '14h'});
  var token_key = jwt.sign({ user: "user" }, privateKey);
  console.log(params);
  var isExist = await User.findOne({
    email: params.email,
    event: params.eventId,
    status: 1,
  }).exec();
  if (!isExist) {
    return res.json({
      status: 400,
      message: "User not found",
    });
  } else if (isExist.password !== md5(params.password)) {
    return res.json({
      status: 400,
      message: "Invalid email or password",
    });
  } else {
    await User.findOneAndUpdate(
      { email: params.email },
      { token: token_key }
    ).exec();
    var data = await User.findOne({ email: params.email }).exec();
    user = {
      _id: isExist._id,
      token: token_key,
    };
    return res.json({
      status: 200,
      message: "Login successfully",
      user: data,
    });
  }
};


module.exports.createUser = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Note content can not be empty",
    });
  }
  var user_data = await User.find({
    email: req.body.email.toLowerCase(),
    event: req.body.event,
  }).exec();
  if (user_data.length > 0) {
    return res.json({
      status: 400,
      message: "Email already exist",
    });
  } else {
    // Create a User
    const Users = new User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email.toLowerCase(),
      event: req.body.event,
      // mobile_number: req.body.mobile_number,
      // job_title: req.body.job_title,
      // user_role: req.body.user_role,
      // state: req.body.state,
      // company_name: req.body.company_name,
      // industry: req.body.industry,
      role: 3,
      status: 1,
      password: md5(req.body.password),
      password_reset_code: 0,
      profile_img: "user.png",
      created_at: created_date,
      updated_at: created_date,
    });
    // Save User in the database
    await Users.save()
      .then(async (data) => {
        let user_id = Users._id;
        // console.log(user_id);
        // let Question_d = req.body.questions;
        // await Promise.all(
        //   Question_d.map(async (item) => {
        //     if (item) {
        //       return await Answer.register({
        //         user_id: user_id,
        //         event: req.body.event,
        //         question: item.question_id,
        //         answer: item.answer,
        //         created_at: created_date,
        //         updated_at: created_date,
        //       });
        //     }
        //   })
        // );

        // return {data,...resolvedFinalArray}
        return res.send({
          status: 200,
          message: "User added successfully",
          data: data,
        });
      })
      .catch((err) => {
        console.log("error=========================>", err);
        return res.send({ status: 500, message: "Something went wrong!" });
      });
  }
};

module.exports.updateProfile = (req, res) => {
  ////////////////////////////////////////////////////////////
  if (!req.body) {
    return res.status(400).send({
      message: "Note content can not be empty",
    });
  }

  if (req.body.profile_img) {
    var where = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      profile_img: req.body.profile_img,
      updated_at: created_date,
    };
  } else {
    var where = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      updated_at: created_date,
    };
  }
  User.findByIdAndUpdate(
    { _id: req.body.user_id },
    where,
    { new: true },
    function (err, result) {
      if (err) {
        return res.send({ status: 500, message: "Something went wrong!" });
      } else {
        return res.json({
          status: 200,
          message: "User updated successfully",
          data: result,
        });
      }
    }
  );
};


module.exports.UserCheck = async(req, res) => {
  ////////////////////////////////////////////////////////////
  if (!req.body) {
    return res.status(400).send({
      message: "Note content can not be empty",
    });
  }
  try {
    var where = {
      user_id: req.body.user_id,
      email: req.body.email,
    };
 
    await User.findOne({ _id: req.body.user_id }).exec(
      async (err, data) => {
        if (err) {
          console.log(err);
          return res.json({
            err: err.message,
            status: 500,
            message: "Something went wrong!",
          });
        } else {
          if(data)
          {
            return res.json({
              status: 200,
              message: "user data",
              data: data,
            });
          }
          else
          {
           var newuser =  await User.findOne({ email: req.body.email.toLowerCase() }).exec();

           const Bakups = new Bakup({
            usernew: newuser._id,
            userold:req.body.user_id,
            email: req.body.email.toLowerCase(),
            created_at: created_date,
            updated_at: created_date,
          });
          // Save User in the database
          await Bakups.save()
            .then(async (data) => {
              await Rewards.updateMany({userId: req.body.user_id}, {$set: {userId: newuser._id}});
              await AgendaFavourite.updateMany({user_id: req.body.user_id}, {$set: {user_id: newuser._id}});
              await hotspotTracker.updateMany({userId: req.body.user_id}, {$set: {userId: newuser._id}});

              return res.json({
                status: 400,
                message: "User added successfully",
                data: "",
              });
            })
            return res.json({
              status: 400,
              message: "user not data",
              data: "",
            });
          }
        }

      }
    );
  } catch (error) {
    console.log("error.message====================>", error.message);
    return res.json({
      status: 400,
      message: error.message,
      data: {},
    });
  }
};

module.exports.updateStep_one = (req, res) => {
  ////////////////////////////////////////////////////////////
  if (!req.body) {
    return res.status(400).send({
      message: "Note content can not be empty",
    });
  }

  if (req.body.profile_img) {
    var where = {
      job_title: req.body.job_title,
      company_name: req.body.company_name,
      bio: req.body.bio,
      department: req.body.department,
      user_role: req.body.role,
      time_zone: req.body.time_zone,
      url: req.body.url,
      profile_img: req.body.profile_img,
      updated_at: created_date,
    };
  } else {
    var where = {
      job_title: req.body.job_title,
      company_name: req.body.company_name,
      bio: req.body.bio,
      user_role: req.body.role,
      department: req.body.department,
      time_zone: req.body.time_zone,
      url: req.body.url,
      updated_at: created_date,
    };
  }
  User.findByIdAndUpdate(
    { _id: req.body.user_id },
    where,
    { new: true },
    function (err, result) {
      if (err) {
        return res.send({ status: 500, message: "Something went wrong!" });
      } else {
        return res.json({
          status: 200,
          message: "User updated successfully",
          data: result,
        });
      }
    }
  );
};

module.exports.updateStep_two = (req, res) => {
  ////////////////////////////////////////////////////////////
  if (!req.body) {
    return res.status(400).send({
      message: "Note content can not be empty",
    });
  }
  var where = {
    public_profile: req.body.public_profile,
    notification: req.body.notification,
    message_status: req.body.message_status,
    video_status: req.body.video_status,
    meeting_request: req.body.meeting_request,
    info_status: req.body.info_status,
    updated_at: created_date,
  };

  User.findByIdAndUpdate(
    { _id: req.body.user_id },
    where,
    { new: true },
    function (err, result) {
      if (err) {
        return res.send({ status: 500, message: "Something went wrong!" });
      } else {
        return res.json({
          status: 200,
          message: "User updated successfully",
          data: result,
        });
      }
    }
  );
};

module.exports.updateStep_three = async (req, res) => {
  ////////////////////////////////////////////////////////////
  if (!req.body) {
    return res.status(400).send({
      message: "Note content can not be empty",
    });
  }

  var where = {
    region: req.body.region,
    country: req.body.country,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    interests: req.body.interests,
    updated_at: created_date,
  };

  await User.findByIdAndUpdate(
    { _id: req.body.user_id },
    where,
    { new: true },
    function (err, result) {
      if (err) {
        return res.send({ status: 500, message: "Something went wrong!" });
      } else {
        return res.json({
          status: 200,
          message: "User updated successfully",
          data: result,
        });
      }
    }
  );
};

module.exports.EventTheme = async (req, res) => {
  await Event.findOne({ site_url: req.params.event }).exec(
    async (err, data) => {
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
          message: "Event data",
          data: data,
        });
      }
    }
  );
};

module.exports.addtime = async (req, res) => {
  var user_data = await User.find({
    role : 3
  },{_id:1}).exec();
  

  // let resolvedFinalArray = await Promise.all(
  //   user_data.map(async (item) => {
  //       return await Rewards.register({
  //         userId: item._id,
  //         rewardCategory: "get",
  //         rewardPoints: 25,
  //         rewardFor: "6017960a63f73ed611a43bcf",
  //         created_at: created_date,
  //         updated_at: created_date,
  //       });
  //     })
  //   );
    return res.json({
      status: 200,
      message: "User updated successfully",
      data: user_data,
    });
  // var array = [
  //   "Africa/Abidjan",
  //   "Africa/Accra",
  //   "Africa/Algiers",
  //   "Africa/Bissau",
  //   "Africa/Cairo",
  //   "Africa/Casablanca",
  //   "Africa/Ceuta",
  //   "Africa/El_Aaiun",
  //   "Africa/Johannesburg",
  //   "Africa/Juba",
  //   "Africa/Khartoum",
  //   "Africa/Lagos",
  //   "Africa/Maputo",
  //   "Africa/Monrovia",
  //   "Africa/Nairobi",
  //   "Africa/Ndjamena",
  //   "Africa/Sao_Tome",
  //   "Africa/Tripoli",
  //   "Africa/Tunis",
  //   "Africa/Windhoek",
  //   "America/Adak",
  //   "America/Anchorage",
  //   "America/Araguaina",
  //   "America/Argentina/Buenos_Aires",
  //   "America/Argentina/Catamarca",
  //   "America/Argentina/Cordoba",
  //   "America/Argentina/Jujuy",
  //   "America/Argentina/La_Rioja",
  //   "America/Argentina/Mendoza",
  //   "America/Argentina/Rio_Gallegos",
  //   "America/Argentina/Salta",
  //   "America/Argentina/San_Juan",
  //   "America/Argentina/San_Luis",
  //   "America/Argentina/Tucuman",
  //   "America/Argentina/Ushuaia",
  //   "America/Asuncion",
  //   "America/Atikokan",
  //   "America/Bahia",
  //   "America/Bahia_Banderas",
  //   "America/Barbados",
  //   "America/Belem",
  //   "America/Belize",
  //   "America/Blanc-Sablon",
  //   "America/Boa_Vista",
  //   "America/Bogota",
  //   "America/Boise",
  //   "America/Cambridge_Bay",
  //   "America/Campo_Grande",
  //   "America/Cancun",
  //   "America/Caracas",
  //   "America/Cayenne",
  //   "America/Chicago",
  //   "America/Chihuahua",
  //   "America/Costa_Rica",
  //   "America/Creston",
  //   "America/Cuiaba",
  //   "America/Curacao",
  //   "America/Danmarkshavn",
  //   "America/Dawson",
  //   "America/Dawson_Creek",
  //   "America/Denver",
  //   "America/Detroit",
  //   "America/Edmonton",
  //   "America/Eirunepe",
  //   "America/El_Salvador",
  //   "America/Fort_Nelson",
  //   "America/Fortaleza",
  //   "America/Glace_Bay",
  //   "America/Goose_Bay",
  //   "America/Grand_Turk",
  //   "America/Guatemala",
  //   "America/Guayaquil",
  //   "America/Guyana",
  //   "America/Halifax",
  //   "America/Havana",
  //   "America/Hermosillo",
  //   "America/Indiana/Indianapolis",
  //   "America/Indiana/Knox",
  //   "America/Indiana/Marengo",
  //   "America/Indiana/Petersburg",
  //   "America/Indiana/Tell_City",
  //   "America/Indiana/Vevay",
  //   "America/Indiana/Vincennes",
  //   "America/Indiana/Winamac",
  //   "America/Inuvik",
  //   "America/Iqaluit",
  //   "America/Jamaica",
  //   "America/Juneau",
  //   "America/Kentucky/Louisville",
  //   "America/Kentucky/Monticello",
  //   "America/La_Paz",
  //   "America/Lima",
  //   "America/Los_Angeles",
  //   "America/Maceio",
  //   "America/Managua",
  //   "America/Manaus",
  //   "America/Martinique",
  //   "America/Matamoros",
  //   "America/Mazatlan",
  //   "America/Menominee",
  //   "America/Merida",
  //   "America/Metlakatla",
  //   "America/Mexico_City",
  //   "America/Miquelon",
  //   "America/Moncton",
  //   "America/Monterrey",
  //   "America/Montevideo",
  //   "America/Nassau",
  //   "America/New_York",
  //   "America/Nipigon",
  //   "America/Nome",
  //   "America/Noronha",
  //   "America/North_Dakota/Beulah",
  //   "America/North_Dakota/Center",
  //   "America/North_Dakota/New_Salem",
  //   "America/Nuuk",
  //   "America/Ojinaga",
  //   "America/Panama",
  //   "America/Pangnirtung",
  //   "America/Paramaribo",
  //   "America/Phoenix",
  //   "America/Port-au-Prince",
  //   "America/Port_of_Spain",
  //   "America/Porto_Velho",
  //   "America/Puerto_Rico",
  //   "America/Punta_Arenas",
  //   "America/Rainy_River",
  //   "America/Rankin_Inlet",
  //   "America/Recife",
  //   "America/Regina",
  //   "America/Resolute",
  //   "America/Rio_Branco",
  //   "America/Santarem",
  //   "America/Santiago",
  //   "America/Santo_Domingo",
  //   "America/Sao_Paulo",
  //   "America/Scoresbysund",
  //   "America/Sitka",
  //   "America/St_Johns",
  //   "America/Swift_Current",
  //   "America/Tegucigalpa",
  //   "America/Thule",
  //   "America/Thunder_Bay",
  //   "America/Tijuana",
  //   "America/Toronto",
  //   "America/Vancouver",
  //   "America/Whitehorse",
  //   "America/Winnipeg",
  //   "America/Yakutat",
  //   "America/Yellowknife",
  //   "Antarctica/Casey",
  //   "Antarctica/Davis",
  //   "Antarctica/DumontDUrville",
  //   "Antarctica/Macquarie",
  //   "Antarctica/Mawson",
  //   "Antarctica/Palmer",
  //   "Antarctica/Rothera",
  //   "Antarctica/Syowa",
  //   "Antarctica/Troll",
  //   "Antarctica/Vostok",
  //   "Asia/Almaty",
  //   "Asia/Amman",
  //   "Asia/Anadyr",
  //   "Asia/Aqtau",
  //   "Asia/Aqtobe",
  //   "Asia/Ashgabat",
  //   "Asia/Atyrau",
  //   "Asia/Baghdad",
  //   "Asia/Baku",
  //   "Asia/Bangkok",
  //   "Asia/Barnaul",
  //   "Asia/Beirut",
  //   "Asia/Bishkek",
  //   "Asia/Brunei",
  //   "Asia/Chita",
  //   "Asia/Choibalsan",
  //   "Asia/Colombo",
  //   "Asia/Damascus",
  //   "Asia/Dhaka",
  //   "Asia/Dili",
  //   "Asia/Dubai",
  //   "Asia/Dushanbe",
  //   "Asia/Famagusta",
  //   "Asia/Gaza",
  //   "Asia/Hebron",
  //   "Asia/Ho_Chi_Minh",
  //   "Asia/Hong_Kong",
  //   "Asia/Hovd",
  //   "Asia/Irkutsk",
  //   "Asia/Jakarta",
  //   "Asia/Jayapura",
  //   "Asia/Jerusalem",
  //   "Asia/Kabul",
  //   "Asia/Kamchatka",
  //   "Asia/Karachi",
  //   "Asia/Kathmandu",
  //   "Asia/Khandyga",
  //   "Asia/Kolkata",
  //   "Asia/Krasnoyarsk",
  //   "Asia/Kuala_Lumpur",
  //   "Asia/Kuching",
  //   "Asia/Macau",
  //   "Asia/Magadan",
  //   "Asia/Makassar",
  //   "Asia/Manila",
  //   "Asia/Nicosia",
  //   "Asia/Novokuznetsk",
  //   "Asia/Novosibirsk",
  //   "Asia/Omsk",
  //   "Asia/Oral",
  //   "Asia/Pontianak",
  //   "Asia/Pyongyang",
  //   "Asia/Qatar",
  //   "Asia/Qostanay",
  //   "Asia/Qyzylorda",
  //   "Asia/Riyadh",
  //   "Asia/Sakhalin",
  //   "Asia/Samarkand",
  //   "Asia/Seoul",
  //   "Asia/Shanghai",
  //   "Asia/Singapore",
  //   "Asia/Srednekolymsk",
  //   "Asia/Taipei",
  //   "Asia/Tashkent",
  //   "Asia/Tbilisi",
  //   "Asia/Tehran",
  //   "Asia/Thimphu",
  //   "Asia/Tokyo",
  //   "Asia/Tomsk",
  //   "Asia/Ulaanbaatar",
  //   "Asia/Urumqi",
  //   "Asia/Ust-Nera",
  //   "Asia/Vladivostok",
  //   "Asia/Yakutsk",
  //   "Asia/Yangon",
  //   "Asia/Yekaterinburg",
  //   "Asia/Yerevan",
  //   "Atlantic/Azores",
  //   "Atlantic/Bermuda",
  //   "Atlantic/Canary",
  //   "Atlantic/Cape_Verde",
  //   "Atlantic/Faroe",
  //   "Atlantic/Madeira",
  //   "Atlantic/Reykjavik",
  //   "Atlantic/South_Georgia",
  //   "Atlantic/Stanley",
  //   "Australia/Adelaide",
  //   "Australia/Brisbane",
  //   "Australia/Broken_Hill",
  //   "Australia/Currie",
  //   "Australia/Darwin",
  //   "Australia/Eucla",
  //   "Australia/Hobart",
  //   "Australia/Lindeman",
  //   "Australia/Lord_Howe",
  //   "Australia/Melbourne",
  //   "Australia/Perth",
  //   "Australia/Sydney",
  //   "CET",
  //   "CST6CDT",
  //   "EET",
  //   "EST",
  //   "EST5EDT",
  //   "Etc/GMT",
  //   "Etc/GMT+1",
  //   "Etc/GMT+10",
  //   "Etc/GMT+11",
  //   "Etc/GMT+12",
  //   "Etc/GMT+2",
  //   "Etc/GMT+3",
  //   "Etc/GMT+4",
  //   "Etc/GMT+5",
  //   "Etc/GMT+6",
  //   "Etc/GMT+7",
  //   "Etc/GMT+8",
  //   "Etc/GMT+9",
  //   "Etc/GMT-1",
  //   "Etc/GMT-10",
  //   "Etc/GMT-11",
  //   "Etc/GMT-12",
  //   "Etc/GMT-13",
  //   "Etc/GMT-14",
  //   "Etc/GMT-2",
  //   "Etc/GMT-3",
  //   "Etc/GMT-4",
  //   "Etc/GMT-5",
  //   "Etc/GMT-6",
  //   "Etc/GMT-7",
  //   "Etc/GMT-8",
  //   "Etc/GMT-9",
  //   "Etc/UTC",
  //   "Europe/Amsterdam",
  //   "Europe/Andorra",
  //   "Europe/Astrakhan",
  //   "Europe/Athens",
  //   "Europe/Belgrade",
  //   "Europe/Berlin",
  //   "Europe/Brussels",
  //   "Europe/Bucharest",
  //   "Europe/Budapest",
  //   "Europe/Chisinau",
  //   "Europe/Copenhagen",
  //   "Europe/Dublin",
  //   "Europe/Gibraltar",
  //   "Europe/Helsinki",
  //   "Europe/Istanbul",
  //   "Europe/Kaliningrad",
  //   "Europe/Kiev",
  //   "Europe/Kirov",
  //   "Europe/Lisbon",
  //   "Europe/London",
  //   "Europe/Luxembourg",
  //   "Europe/Madrid",
  //   "Europe/Malta",
  //   "Europe/Minsk",
  //   "Europe/Monaco",
  //   "Europe/Moscow",
  //   "Europe/Oslo",
  //   "Europe/Paris",
  //   "Europe/Prague",
  //   "Europe/Riga",
  //   "Europe/Rome",
  //   "Europe/Samara",
  //   "Europe/Saratov",
  //   "Europe/Simferopol",
  //   "Europe/Sofia",
  //   "Europe/Stockholm",
  //   "Europe/Tallinn",
  //   "Europe/Tirane",
  //   "Europe/Ulyanovsk",
  //   "Europe/Uzhgorod",
  //   "Europe/Vienna",
  //   "Europe/Vilnius",
  //   "Europe/Volgograd",
  //   "Europe/Warsaw",
  //   "Europe/Zaporozhye",
  //   "Europe/Zurich",
  //   "HST",
  //   "Indian/Chagos",
  //   "Indian/Christmas",
  //   "Indian/Cocos",
  //   "Indian/Kerguelen",
  //   "Indian/Mahe",
  //   "Indian/Maldives",
  //   "Indian/Mauritius",
  //   "Indian/Reunion",
  //   "MET",
  //   "MST",
  //   "MST7MDT",
  //   "PST8PDT",
  //   "Pacific/Apia",
  //   "Pacific/Auckland",
  //   "Pacific/Bougainville",
  //   "Pacific/Chatham",
  //   "Pacific/Chuuk",
  //   "Pacific/Easter",
  //   "Pacific/Efate",
  //   "Pacific/Enderbury",
  //   "Pacific/Fakaofo",
  //   "Pacific/Fiji",
  //   "Pacific/Funafuti",
  //   "Pacific/Galapagos",
  //   "Pacific/Gambier",
  //   "Pacific/Guadalcanal",
  //   "Pacific/Guam",
  //   "Pacific/Honolulu",
  //   "Pacific/Kiritimati",
  //   "Pacific/Kosrae",
  //   "Pacific/Kwajalein",
  //   "Pacific/Majuro",
  //   "Pacific/Marquesas",
  //   "Pacific/Nauru",
  //   "Pacific/Niue",
  //   "Pacific/Norfolk",
  //   "Pacific/Noumea",
  //   "Pacific/Pago_Pago",
  //   "Pacific/Palau",
  //   "Pacific/Pitcairn",
  //   "Pacific/Pohnpei",
  //   "Pacific/Port_Moresby",
  //   "Pacific/Rarotonga",
  //   "Pacific/Tahiti",
  //   "Pacific/Tarawa",
  //   "Pacific/Tongatapu",
  //   "Pacific/Wake",
  //   "Pacific/Wallis",
  //   "WET",
  // ];
  // let resolvedFinalArray = await Promise.all(
  //   array.map(async (item) => {
  //     return await Timezone.register({
  //       timezone: item,
  //       created_at: created_date,
  //       updated_at: created_date,
  //     });
  //   })
  // );
  // return res.json({
  //   status: 200,
  //   message: "User updated successfully",
  //   data: resolvedFinalArray,
  //   length: array.length,
  // });
};

module.exports.imageUpload = async (req, res) => {
  console.log(req.body, "4444", req.file, "ddd", req.fileValidationError);
  try {
    if (
      typeof req.file == "undefined" &&
      typeof req.fileValidationError == "undefined"
    ) {
      return res.json({
        status: 400,
        message: "Please select file!",
      });
    } else {
      if (typeof req.file == "undefined" && typeof req.fileValidationError) {
        return res.json({
          status: 400,
          message: "Only upload jpeg,jpg and png file type!",
        });
      } else {
        return res.json({
          status: 200,
          data: req.file.filename,

          message: "Image uploaded sucessfully",
        });
      }
    }
  } catch (err) {
    return res.json({
      status: 500,
      message: "Something went wrong",
    });
  }
};

module.exports.csvUpload = async (req, res) => {
  let regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  try {
    if (
      typeof req.file == "undefined" &&
      typeof req.fileValidationError == "undefined"
    ) {
      return res.json({
        status: 400,
        message: "Please select file!",
      });
    } else {
      const results = [];
      fs.createReadStream(process.env.GET_URL + req.file.filename)
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", async () => {
          console.log(results);
          let resolvedAllergy = await Promise.all(
            results.map(async (item) => {
              if (
                item.email &&
                item.first_name.trim() &&
                item.last_name.trim() &&
                item.email.trim()
              ) {
                var user_data = await User.find({
                  email: item.email.trim().toLowerCase(),
                  event: req.params.id.trim(),
                }).exec();
                if (user_data.length == 0) {
                  if (item.email.match(regEmail)) {
                    var data = await User.register({
                      event: req.params.id.trim(),
                      role: 3,
                      first_name: item.first_name.trim(),
                      last_name: item.last_name.trim(),
                      email: item.email.trim().toLowerCase(),
                      password: md5("samko2021"),
                      created_at: created_date,
                      updated_at: created_date,
                    });
                    console.log("dataaaaaaaaaaaaaaaaaaaa");
                    console.log(data);
                    //     let templatePath  = path.join('./mail_template/');
                    //     var compiled = ejs.compile(fs.readFileSync(path.resolve(templatePath + 'mail.html'),"utf8"));
                    //     var html = compiled({
                    //         email: item.email.trim(),
                    //         password: "samko2021",
                    //         site_url: process.env.FRONT_URL,
                    //     })
                    // var m =     Mail.sendMailer({email: item.email.trim(),body:html,subject:'User Registration successfully'});
                  }
                }
              }
            })
          );
          return res.json({
            status: 200,
            data: results,

            message: "Users added successfully",
          });
        });
      // return res.json({
      //   status: 200,
      //   data:results,

      //   message: "Csv uploaded sucessfully",
      // });
    }
  } catch (err) {
    return res.json({
      status: 500,
      message: "Something went wrong",
    });
  }
};


module.exports.csvExport = async (req, res) => {
//   console.log('helloooooooooooooooooooooooooooooooooooooooooo');
//   try {
//   let hotspot_data = await Rewards.find({rewardCategory: { $eq: "booth" }}).populate('userId').sort({rewardFor: 1}).exec();
//     var user_array1 = [];


    
//     var user_array = [{ "User Name": "User Name","Booth Name": "Booth Name",  "Date": "Date" ,  "Time": "Time"}];

//    for(let val of hotspot_data){
//     let user_array2 = [];
//     if(val.userId)
//     {
//       // console.log(val.agenda);
    
//         var agenda_data =  await CompanyCategory.findOne({
//             _id: val.rewardFor,
//           }).exec();
//           if(agenda_data)
//           {
//             user_array.push({"User Name":val.userId.first_name+' '+val.userId.last_name,"Booth Name":agenda_data.name,"Date": moment.utc(val.created_at).tz("America/Los_Angeles").format("MM-DD-YYYY"),  "Time": moment.utc(val.created_at).tz("America/Los_Angeles").format("hh:mm A")});
//             // user_array.push({"User Name":val.userId.first_name+' '+val.userId.last_name,"Agenda Title":agenda_data.title.split("|")[0],"Date": moment.utc(val.created_at).tz("America/Los_Angeles").format("MM-DD-YYYY"),  "Time": moment.utc(val.created_at).tz("America/Los_Angeles").format("hh:mm A"),"Agenda Time":agenda_data.title.split("|")[1]});
//           }
//     }  
//   };


//   var ws = fs.createWriteStream(process.env.PUBLIC_URL + "data.csv");
//   fastcsv.write(user_array,{hearders:true})
//   .on("finish",function(){
//     return res.json({
//       status: 200,
//       data: process.env.Admin_URL+"data.csv",
  
//       message: "Users added successfully",
//     });
    
//   }).pipe(ws);
// } catch (err) {
//   return res.json({
//     status: 500,
//     message: "Something went wrong!",
//     err: err,
//   });
// }




  try {
    let hotspot_data = await hotspotTracker.find().populate('userId').exec();
    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    console.log(hotspot_data);
    console.log(user_array);
    var user_array = [{ "First Name": "First Name",      "Last Name": "Last Name",  "Email": "Email" ,  "Hotspot": "Hotspot","Date": "Date","Time": "Time"}];
        await hotspot_data.forEach(function (val, index) {
          if(val.userId && val.timeStamp)
          {
          user_array.push({ "First Name": val.userId.first_name,      "Last Name": val.userId.last_name,  "Email": val.userId.email,  "Hotspot": val.hotspotId,  "Date": moment.utc(val.timeStamp*1000).tz("America/Los_Angeles").format("MM-DD-YYYY"),  "Time": moment.utc(val.timeStamp*1000).tz("America/Los_Angeles").format("hh:mm A")});
          }
        });

var ws = fs.createWriteStream(process.env.PUBLIC_URL + "data.csv");
fastcsv.write(user_array,{hearders:true})
.on("finish",function(){
  return res.json({
    status: 200,
    data: process.env.Admin_URL+"data.csv",

    message: "Users added successfully",
  });
  
}).pipe(ws);
} catch (err) {
  return res.json({
    status: 500,
    message: "Something went wrong!",
    err: err,
  });
}







  // const leaderBoardData = await Rewards.aggregate([
  //   {
  //     $group: {
  //       _id: "$userId",
  //       totalPoint: { $sum: "$rewardPoints" },
  //     },
  //   },
  //   {
  //     $lookup: {
  //       from: "users",
  //       localField: "_id",
  //       foreignField: "_id",
  //       as: "userDetail",
  //     },
  //   },
  //   { 
  //       $sort : { totalPoint : -1 } 
  //   }
  // ]);
 
  // console.log("data------------------->", leaderBoardData);
  // var user_array = [];
  // var user_array1 = [{ "User_id": "User_id",      "Points": "Points"}];
  // await leaderBoardData.forEach(function (val, index) {
  //   if(val.userDetail.length>0)
  //   {
  //   user_array.push(val);
  //   }
  //   else
  //   {
  //   user_array1.push({ "User_id": val._id,      "Points": val.totalPoint});

  //   }
  // });


  // var user_array = [{ "First Name": "First Name",      "Last Name": "Last Name",  "Email": "Email" ,  "Hotspot": "Hotspot","Date": "Date","Time": "Time"}];
  //         await hotspot_data.forEach(function (val, index) {
  //           if(val.userId && val.timeStamp)
  //           {
  //           user_array.push({ "First Name": val.userId.first_name,      "Last Name": val.userId.last_name,  "Email": val.userId.email,  "Hotspot": val.hotspotId,  "Date": moment.utc(val.timeStamp*1000).tz("America/Los_Angeles").format("MM-DD-YYYY"),  "Time": moment.utc(val.timeStamp*1000).tz("America/Los_Angeles").format("hh:mm A")});
  //           }
  //         });
  
  // var ws = fs.createWriteStream(process.env.PUBLIC_URL + "data.csv");
  // fastcsv.write(user_array1,{hearders:true})
  // .on("finish",function(){
  //   return res.json({
  //     status: 200,
  //     data: process.env.Admin_URL+"data.csv",
  
  //     message: "Users added successfully",
  //   });
    
  // }).pipe(ws);


  // var UserData = await AgendaFavourite.aggregate([
  //   {
     
  //     $group: {
  //       _id: "$user_id",
  //       agenda: { $push: "$agenda" },
  //     },
      
  //   },
    
  //   {
  //     $lookup: {
  //       from: "users",
  //       localField: "_id",
  //       foreignField: "_id",
  //       as: "user_data",
  //     },
  //   },

   
  
  // ]);
  // var user_array1 = [];


  //  for(let val of UserData){
  //   let user_array2 = [];
  //   if(val.user_data.length==0 )
  //   {
  //     console.log(val.agenda);
    
  //       for(let val1 of val.agenda){
          
  //       var agenda_data =  await Agenda.findOne({
  //           _id: val1,
  //         },{_id:1,title:1}).exec();
  //         if(agenda_data)
  //         {
  //           user_array2.push(agenda_data);

  //         }
  //     };
  //     user_array1.push({"user_id":val._id,"agenda":user_array2});

  //   }  
  // };



  // var user_array = [{ "User id": "User_id",      "Agenda Data": "Agenda Data"}];
        
  //           for(let val of user_array1){
  //           user_array.push({ "User": val.user_id,"Agenda Data": val.agenda});
            
  //         };
  
  // var ws = fs.createWriteStream(process.env.PUBLIC_URL + "data.csv");
  // fastcsv.write(user_array1,{hearders:true})
  // .on("finish",function(){
  //   return res.json({
  //     status: 200,
  //     data: process.env.Admin_URL+"data.csv",
  
  //     message: "Users added successfully",
  //   });
    
  // }).pipe(ws);
  // return res.json({
  //   status: 200,
  //   data: user_array1,

  //   message: "Users added successfully",
  // });

};

module.exports.logout = (req, res) => {
  console.log(
    "eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
  );
  console.log(req.headers);
  console.log(req.headers["token"]);
  let bearer_token = req.headers["token"];
  let token = bearer_token.split(" ")[1];

  $where = { token: token };

  User.findOne($where, function (err, data) {
    if (data) {
      User.findOneAndUpdate(
        { token: data.token },
        { token: "" },
        function (err, data) {
          if (err) {
            console.log("error", err);
            return res.json({
              status: 400,
              message: "Error occured" + err,
            });
          } else {
            console.log("deleted", data);

            return res.json({
              status: 200,
              message: "Logout successfully",
            });
          }
        }
      );
    } else {
      return res.json({
        status: 400,
        message: "Token Not Found",
      });
    }
  });
};

module.exports.forgetpassword = async (req, res) => {
  var params = req.body;
  var otp = Math.random()
    .toString()
    .split("")
    .filter(function (value, index, self) {
      return self.indexOf(value) === index;
    })
    .join("")
    .substr(4, 6);

  await User.findOneAndUpdate(
    { email: params.email },
    {
      otp: otp,
    }
  ).exec(async (err, data) => {
    if (err) {
      return res.json({
        status: 500,
        message: "Something went wrong",
      });
    }
    if (!data) {
      return res.json({
        status: 404,
        message: "Email address is not found!",
      });
    } else {
      let templatePath = path.join("./mail_template/");
      var compiled = ejs.compile(
        fs.readFileSync(
          path.resolve(templatePath + "resetPassword.html"),
          "utf8"
        )
      );
      var html = compiled({
        name: data.first_name
          ? data.first_name + " " + data.last_name
          : data.sponsor_name,
        otp: otp,
      });
      Mail.sendMailer({
        email: params.email,
        body: html,
        subject: "Reset Password",
      });
      // let templatePath  = path.join('./mail_template/');
      // let mailtemplate = fs.readFileSync(path.resolve(templatePath + 'otpPassword.html'),"utf8");

      // let c  = util.format(mailtemplate,params.otp);
      // Mail.sendMailer({email:'gagan1.eminence@gmail.com',body:c,subject:'resetpassword'});

      return res.json({
        status: 200,
        message: "Otp sent successfully, please check your email address!",
      });
    }
  });
};

module.exports.resetpassword = (req, res) => {
  var params = req.body;
  if (params.new_password != params.password_confirmation) {
    return res.json({
      status: 404,
      message: "New password and confirm password must be matched!",
    });
  }

  User.findOneAndUpdate(
    { email: params.email, otp: params.otp },
    {
      password: md5(params.new_password),
      otp: null,
    }
  ).exec(async (err, done) => {
    if (err) {
      return res.json({
        status: 500,
        message: "Something went wrong",
      });
    }
    if (!done) {
      return res.json({
        status: 404,
        message: "Otp not matched!",
      });
    } else {
      //return res.redirect('/user/forgetPassword');
      return res.json({
        status: 200,
        message: "Password reset successfully!",
      });
    }
  });
};

module.exports.updateProfileVisibility = async (req, res) => {
  console.log("------updateProfileVisibility controller------");
  console.log("req.body------>", req.body);
  try {
    const userData = await User.findOneAndUpdate(
      { _id: req.body.userId },
      { public_profile: req.body.status },
      { new: true }
    );
    console.log("userData----------->", userData);
    res.send({
      status: 200,
      message: "Visibilty updated",
      data: {
        userData: userData,
      },
    });
  } catch (error) {
    res.send({
      status: 400,
      message: error.message,
      data: {},
    });
  }
};

module.exports.addToFriendList = async (req, res) => {
  var params = req.body;
  const userData = await User.findOne({ _id: req.body.user_id });

  if (!userData) {
    throw new Error("Invalid user");
  }

  if (userData && userData.interests) {
    await User.find({
      event: params.event,
      interests: { $in: userData.interests },
    }).exec(async (err, done) => {
      if (err) {
        return res.json({
          status: 500,
          message: "Something went wrong",
        });
      }
      if (!done) {
        return res.json({
          status: 404,
          message: "Otp not matched!",
        });
      } else {
        var user_array = [];
        await done.forEach(function (val, index) {
          user_array.push(val._id);
        });
        console.log(user_array);

        if (done.length > 0) {
          axios.defaults.headers.common["appid"] = "22552e54eb4c145";
          axios.defaults.headers.common["apikey"] =
            "614b56410ed4400dc2845ef4b136d30d6cb8a51e";
          axios.defaults.headers.common["content-type"] = "application/json";

          await axios
            .post(
              "https://api-us.cometchat.io/v2.0/users/" +
                req.body.user_id +
                "/friends",
              { accepted: user_array }
            )
            .then((res) => {})
            .catch((err) => {});
        }
        return res.json({
          status: 200,
          data: done,
          user_array: user_array,
          message: "Friend data!",
        });
      }
    });
  }
};

module.exports.fetchUserHaveSameInterest = async (req, res) => {
  try {
    let params = req.body;
    const userData = await User.findOne({ _id: req.body.user_id });
    if (!userData) {
      throw new Error("Invalid user");
    }

    //if user dont have any intrest
    if (userData.interests.length > 0 == false) {
      return res.send({
        status: 401,
        message: "You must chose some interest",
        data: [],
      });
      // throw new Error("You must chose some interest")
    }

    let userHaveSameInterest = await User.find({
      event: params.event,
      interests: { $in: userData.interests },
      _id: { $ne: params.user_id },
    });

    res.send({
      status: 200,
      message: "Users have same interest has Fetched",
      data: userHaveSameInterest,
    });
  } catch (error) {
    console.log("error.message-------------->", error.message);
    res.send({
      status: 400,
      message: error.message,
      data: [],
    });
  }
};

module.exports.fetchAdminData = async (req, res) => {
  console.log("=============fetchAdminData=========");
  try {
    const adminData = await User.findOne({ role: 1 });
    console.log("adminData===============<", adminData);
    if (!adminData) {
      throw new Error("No admin found");
    }

    res.send({
      status: 200,
      message: "admin data fetched",
      data: {
        adminData: adminData,
      },
    });
  } catch (error) {
    console.log("error.message-------------->", error.message);
    res.send({
      status: 400,
      message: error.message,
      data: {},
    });
  }
};

module.exports.fetchSpeakerData = async (req, res) => {
  console.log("=============fetchSpeakerData=========");
  try {
    const adminData = await User.find({ role: 6, event: req.params.eventId });
    console.log("adminData===============<", adminData);
    if (adminData.length == 0) {
      throw new Error("No Speaker found");
    }

    res.send({
      status: 200,
      message: "Speaker data fetched",
      data: {
        SpeakerData: adminData,
      },
    });
  } catch (error) {
    console.log("error.message-------------->", error.message);
    res.send({
      status: 400,
      message: error.message,
      data: {},
    });
  }
};

module.exports.fetchNotification = async (req, res) => {
  console.log("=============fetchNotification=========");
  try {
    const NotificationData = await Notification.find({
      event: req.params.eventId,
    });
    console.log("NotificationData===============<", NotificationData);
    res.send({
      status: 200,
      message: "Notification Data Fetched",
      data: NotificationData,
    });
  } catch (error) {
    console.log("error.message-------------->", error.message);
    res.send({
      status: 400,
      message: error.message,
      data: [],
    });
  }
};

module.exports.saveBase64Image = async (req, res) => {
  console.log("=============fetchNotification=========");
  var base64 = req.body.image;
  var ReadableData = require("stream").Readable;
  const imageBufferData = Buffer.from(base64, "base64");
  var streamObj = new ReadableData();
  streamObj.push(imageBufferData);
  streamObj.push(null);
  // streamObj.pipe(fs.createWriteStream('testImage.jpg'));
  try {
    streamObj.pipe(fs.writeFileSync("testImage.jpg"));
    return res.send({ status: "success" });
  } catch (e) {
    return res.send({ status: e });
  }
};

module.exports.saveBase64Image = async (req, res) => {
  console.log("=============fetchNotification=========");
  var base64 = req.body.image;
  var ReadableData = require("stream").Readable;
  const imageBufferData = Buffer.from(base64, "base64");
  var streamObj = new ReadableData();
  streamObj.push(imageBufferData);
  streamObj.push(null);
  // streamObj.pipe(fs.createWriteStream('testImage.jpg'));
  try {
    streamObj.pipe(fs.writeFileSync("testImage.jpg"));
    return res.send({ status: "success" });
  } catch (e) {
    return res.send({ status: e });
  }
};

module.exports.saveHotspot = async (req, res) => {
  console.log("saveHotspot===========================", req.body);
  try {
    let today = moment().utc().startOf('day').unix();

    let isAlreadySave = await hotspotTracker.findOne({
      userId: req.body.userId,
      hotspotId: req.body.hotspotId,
      dateTimestamp: today
    });
    console.log("isAlreadysaved========",isAlreadySave)
    if(isAlreadySave){
      throw new Error("record already saved")
    }
    else{
      const hotspotData = new hotspotTracker({
        userId: req.body.userId,
        hotspotId: req.body.hotspotId,
        dateTimestamp: moment().utc().startOf('day').unix(),
        timeStamp : moment().utc().unix(),
        date: moment().utc().startOf('day').format("DD-MM-YYYY"),
        created_at: created_date,
      });
      let hotspotData1 = await hotspotData.save()
      res.send({
        status: 200,
        message: "Data saved",
        data: hotspotData1,
      });
    }
  } catch (error) {
    res.send({
      status: 400,
      message: error.message,
      data: "",
    });
  }
};



module.exports.readNotification = async (req, res) => {
  console.log("saveHotspot===========================", req.body);
  try {
 

    let isAlreadySave = await ReadNotification.findOne({
      user: req.body.userId,
      notification: req.body.notificationId,
      event: req.body.eventId
    });
    console.log("isAlreadysaved========",isAlreadySave)
    if(isAlreadySave){
      throw new Error("record already saved")
    }
    else{
      const ReadNotifications = new ReadNotification({
        user: req.body.userId,
        notification: req.body.notificationId,
        event: req.body.eventId,
        created_at: created_date,
      });
      let ReadNotifications1 = await ReadNotifications.save()
      res.send({
        status: 200,
        message: "Data saved",
        data: ReadNotifications1,
      });
    }
  } catch (error) {
    res.send({
      status: 400,
      message: error.message,
      data: "",
    });
  }
};



module.exports.CheckNotification = async (req, res) => {
  console.log("saveHotspot===========================", req.body);
  try {
 

    let isAlreadySave = await Broadcast.findOne({
      status: 1,
    });
    console.log("isAlreadysaved========",isAlreadySave)
    if(isAlreadySave){
      let isAlreadySave1 = await ReadNotification.findOne({
        user: req.body.userId,
        notification: isAlreadySave._id,
        event: req.body.eventId
      });
      // console.log("isAlreadysaved========",isAlreadySave)
      if(isAlreadySave1){
        res.send({
          status: 400,
          message: "Already read",
          data: ReadNotifications1,
        });
      }
      else
      {
        res.send({
          status: 200,
          message: "Notification data",
          data: isAlreadySave,
        });
      }
    }
    else{
      res.send({
        status: 400,
        message: "No data found",
        data: "",
      });
    }
  } catch (error) {
    res.send({
      status: 400,
      message: error.message,
      data: "",
    });
  }
};

