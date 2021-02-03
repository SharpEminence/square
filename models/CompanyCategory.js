var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var companySchema = new Schema(
  {
    name: String,
    deck1: String,
    deck2: String,
    demo: String,
    points: { type: Number, default: 0 },
    google_meet: String,
    description: String,
    created_at: Date,
    updated_at: Date,
  },
  { collection: "company_categories" }
);

var CompanyCategory = mongoose.model("CompanyCategory", companySchema);

module.exports = CompanyCategory;
