var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var AgendaSchema = new Schema(
  {
    category: String,
    created_at: Date,
    updated_at: Date,
  },
  { collection: "agenda_categories" }
);

var AgendaCategory = mongoose.model("AgendaCategory", AgendaSchema);

module.exports = AgendaCategory;
