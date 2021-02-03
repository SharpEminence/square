var mongoose = require('mongoose');
var Schema = mongoose.Schema;

class AgendaClass {
  static register(payload){
    
    return this(payload).save();
   }  
 }
 

var agendaSchema = new Schema(
{
  event :{type: Schema.Types.ObjectId, ref: 'Event'},
  agenda_category :{type: Schema.Types.ObjectId, ref: 'AgendaCategory'},
  speakers :[{type: Schema.Types.ObjectId, ref: 'User'}],
  agenda_type: String,
  title: String,
  agenda_date: String,
  start_time: String,
  end_time: String,
  time_zone :{type: Schema.Types.ObjectId, ref: 'Timezone'},
  tags: [String],
  description: String,
  featured: String,
  box_image: String,
  docs: [String],
  images: [String],
  videos: [String],
  created_at: Date,
  updated_at: Date
},{ collection:'agendas'});
agendaSchema.loadClass(AgendaClass);
agendaSchema.set('timestamps', true); 




var Agenda = mongoose.model('Agenda', agendaSchema);

module.exports = Agenda;

