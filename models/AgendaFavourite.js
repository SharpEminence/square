var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var AgendaFavouriteSchema = new Schema(
  {
    event: { type: Schema.Types.ObjectId, ref: "Event" },
    agenda: { type: Schema.Types.ObjectId, ref: "Agenda" },
    user_id: { type: Schema.Types.ObjectId, ref: "User" },
    status: { type: Boolean, default: 0 },
  },
  { collection: "agenda_favourites" }
);

var AgendaFavourite = mongoose.model("AgendaFavourite", AgendaFavouriteSchema);

module.exports = AgendaFavourite;
