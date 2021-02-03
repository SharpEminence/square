var New = require("./../../../../models/New");
var Agenda = require("./../../../../models/Agenda");
var Event = require("./../../../../models/Event");
var User = require("./../../../../models/User");

module.exports.getDashboard = async (req, res) => {
  var news_data = await New.find({ event: req.params.id })
    .sort({ title: -1 })
    .exec();
  var agenda_data = await Agenda.find({ event: req.params.id })
    .sort({ title: -1 })
    .exec();
  var event_data = await Event.findById(req.params.id).exec();
  var user_data = await User.find({
    $and: [{ event: req.params.id }, { role: 3 }],
  }).exec();
  return res.json({
    status: 200,
    message: "Dashboard data",
    news_data: news_data,
    agenda_data: agenda_data,
    event_data: event_data,
    user_data: user_data,
  });
};
