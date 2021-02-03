var mongoose = require("mongoose");
var Schema = mongoose.Schema;

class AppointmentClass {
  static register(payload) {
    return this(payload).save();
  }
}

var appointmentSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User" },
    sponsor_id: { type: Schema.Types.ObjectId, ref: "User" },
    name: String,
    email: String,
    message: String,
    created_at: Date,
    updated_at: Date,
  },
  { collection: "appointments" }
);
appointmentSchema.loadClass(AppointmentClass);

var Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
