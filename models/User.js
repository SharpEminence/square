var mongoose = require("mongoose");
var Schema = mongoose.Schema;
class userClass {
  static register(payload) {
    return this(payload).save();
  }
}
var userSchema = new Schema(
  {
    membership_type: { type: Schema.Types.ObjectId, ref: "MembershipType" },
    event: { type: Schema.Types.ObjectId, ref: "Event" },
    email: { type: String, required: false },
    first_name: { type: String },
    last_name: { type: String },
    password: { type: String },
    mobile_number: { type: String },
    role: Number,
    address: String,
    dob: String,
    sponsor_name: String,
    company_name: String,
    employees: String,
    education: String,
    designation: String,
    booth: { type: Schema.Types.ObjectId, ref: "CompanyCategory" },
    lounge_title: String,
    experience: String,
    sponsor_link: String,
    demo_link: String,
    deck_link: String,
    space_code: String,
    game_code: String,
    lounge_type: String,
    job_title: String,
    shop_url: String,
    user_role: String,
    state: String,
    description: String,
    person_name: String,
    industry: String,
    bio: String,
    department: String,
    chat_token: String,
    url: String,
    region: { type: String, default: "" },
    country: String,
    latitude: String,
    longitude: String,
    time_zone: String,
    linkedin_url: String,
    facebook_url: String,
    twitter_url: String,
    hyperlink1: {
      type: String,
      default: null,
    },
    hyperlink2: {
      type: String,
      default: null,
    },
    hyperlink3: {
      type: String,
      default: null,
    },
    hyperlink4: {
      type: String,
      default: null,
    },
    hyperlink5: {
      type: String,
      default: null,
    },
    hyperlink6: {
      type: String,
      default: null,
    },
    hyperlink7: {
      type: String,
      default: null,
    },
    hyperlink8: {
      type: String,
      default: null,
    },
    hyperlink9: {
      type: String,
      default: null,
    },
    hyperlink10: {
      type: String,
      default: null,
    },
    verification_code: String,
    otp: { type: String, default: null },
    topic: String,
    status: { type: Number, default: 1 },
    public_profile: { type: Number, default: 1 },
    notification: { type: Number, default: 1 },
    video_status: { type: Number, default: 1 },
    message_status: { type: Number, default: 1 },
    meeting_request: { type: Number, default: 2 },
    info_status: { type: Number, default: 1 },
    interests: [String],
    token: { type: String },
    password_reset_code: String,
    profile_img: { type: String, default: "user.png" },
    images: [String],
    created_at: Date,
    updated_at: Date,
    socketId: { type: String, deafult: "" },
  },
  { collection: "users" }
);
userSchema.loadClass(userClass);
var User = mongoose.model("User", userSchema);

module.exports = User;
