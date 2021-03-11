var mongoose = require("mongoose");
var Schema = mongoose.Schema;

class NotificationClass {
  static register(payload) {
    return this(payload).save();
  }
}

var notificationSchema = new Schema(
  {
    event: { type: Schema.Types.ObjectId, ref: "Event" },
    session: String,
    datetime: String,
    message: String,
    datetime_unix:String,
    created_at: Date,
    updated_at: Date,
  },
  { collection: "notifications" }
);
notificationSchema.loadClass(NotificationClass);
notificationSchema.set("timestamps", true);

var Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
