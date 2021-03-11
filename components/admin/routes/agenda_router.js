
const agendaController = require('./../controller/agendaController');
const auth = require('../../../helpers/admin/auth');
const { check } = require ('express-validator');
const multer = require('multer');
//var up = multer();
var path = require('path');
//app.use(up.array());
const DIR = './public/uploads';
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, DIR)
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()+ '-' + file.originalname )
    }
  })
  
  let upload = multer({storage: storage});


module.exports = (router)=>
{
    //Admin  Routes        
    router.get('/add-agenda/:event_id',auth.afterLogin,agendaController.addAgenda);

    router.post('/postAgenda/:event_id',[
      // check('agenda_type').not().isEmpty().withMessage("Agenda type field is required"),
      // check('agenda_category').not().isEmpty().withMessage("Agenda category field is required"),
      check('agenda_date').not().isEmpty().withMessage("Agenda date field is required"),
      check('start_time').not().isEmpty().withMessage("Start time field is required"),
      // check('end_time').not().isEmpty().withMessage("End time field is required"),
      // check('time_zone').not().isEmpty().withMessage(" Time zone field is required"),
      // check('tags').not().isEmpty().withMessage("Tags field is required"),
      // check('featured').not().isEmpty().withMessage("Featured field is required"),
      check('google_meet').not().isEmpty().withMessage("Google meet url field is required"),
      // check('speakers').not().isEmpty().withMessage("Please select speaker"),
      // check('description').not().isEmpty().withMessage("Description field is required"),
      // check('box_image').not().isEmpty().withMessage("Box image field is required"),
      // check('file_data').not().isEmpty().withMessage("Document field is required"),
      // check('image_data').not().isEmpty().withMessage("Image field is required"),
      // check('video_data').not().isEmpty().withMessage("Video field is required"),
    ],auth.afterLogin,agendaController.addAgendaPost);

    router.get('/agenda-list/:event_id',auth.afterLogin,agendaController.getAgenda);
    router.get('/edit-agenda/:id/:event_id',auth.afterLogin,agendaController.editAgenda);

    router.post('/update-agenda/:id/:event_id',[
      // check('agenda_type').not().isEmpty().withMessage("Agenda type field is required"),
      // check('agenda_category').not().isEmpty().withMessage("Agenda category field is required"),
      check('agenda_date').not().isEmpty().withMessage("Agenda date field is required"),
      check('start_time').not().isEmpty().withMessage("Start time field is required"),
      // check('end_time').not().isEmpty().withMessage("End time field is required"),
      // check('time_zone').not().isEmpty().withMessage(" Time zone field is required"),
      // check('tags').not().isEmpty().withMessage("Tags field is required"),
      check('google_meet').not().isEmpty().withMessage("Google meet url field is required"),

      // check('featured').not().isEmpty().withMessage("Featured field is required"),
      // check('speakers').not().isEmpty().withMessage("Please select speaker"),
      // check('description').not().isEmpty().withMessage("Description field is required"),
      // check('box_image').not().isEmpty().withMessage("Box image field is required"),
      // check('file_data').not().isEmpty().withMessage("Doc field is required"),
      // check('image_data').not().isEmpty().withMessage("Image field is required"),
      // check('video_data').not().isEmpty().withMessage("Video field is required"),
    ],auth.afterLogin,agendaController.updateAgenda);

    router.get('/delete-agenda/:id/:event_id',auth.afterLogin,agendaController.deleteAgenda);


}




