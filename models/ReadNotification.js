var mongoose = require("mongoose");
var Schema = mongoose.Schema;

class ReadNotificationClass {
  static register(payload) {
    return this(payload).save();
  }
}

var readnotificationSchema = new Schema(
  {
    event: { type: Schema.Types.ObjectId, ref: "Event" },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    notification: { type: Schema.Types.ObjectId, ref: "Notification" },
    created_at: Date,
    updated_at: Date,
  },
  { collection: "read_notifications" }
);
readnotificationSchema.loadClass(ReadNotificationClass);
readnotificationSchema.set("timestamps", true);

var ReadNotification = mongoose.model("ReadNotification", readnotificationSchema);

module.exports = ReadNotification;
