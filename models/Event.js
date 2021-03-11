var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var eventSchema = new Schema(
  {
    client_id: { type: Schema.Types.ObjectId, ref: "User" },
    title: String,
    description: String,
    // registeration_id: String,
    site_url: String,
    // linkdin: String,
    facebook: String,
    twitter: String,
    // space_code: String,
    instagram: String,
    demand_link: String,
    rap_link: String,
    hyperlink1: {
      type: String,
      default: null
    },
    hyperlink2: {
      type: String,
      default: null
    },
    hyperlink3: {
      type: String,
      default: null
    },
    hyperlink4: {
      type: String,
      default: null
    },
    // theme: String,
    // dashboard: String,
    download: {
      type: Boolean,
      default: true
    },
    start_date: Date,
    end_date: Date,
    images: [String],
    videos: [String],
    created_at: Date,
    updated_at: Date,


  },
  { collection: "events" }
);

var Event = mongoose.model("Event", eventSchema);

module.exports = Event;
