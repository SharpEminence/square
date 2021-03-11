const eventController = require('./../controller/eventController');
const auth = require('../../../helpers/admin/auth');
const { check } = require('express-validator');
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
    cb(null, Date.now() + '-' + file.originalname)
  }
})

let upload = multer({ storage: storage });


module.exports = (router) => {
  //Admin  Routes        
  router.get('/add-event', auth.afterLogin, eventController.addEvent);
  router.post('/api/image-upload', upload.single('image'), eventController.imageUpload);
  router.post('/api/multiple-upload', upload.array('image', 5), eventController.multipleUpload);
  router.post('/postevent', [
    check('client_id').not().isEmpty().withMessage("Please select client!"),
    check('title').not().isEmpty().withMessage("Event title field is required"),
    check('description').not().isEmpty().withMessage("Description field is required"),
    check('site_url').not().isEmpty().withMessage("Site url field is required"),
    check('facebook').not().isEmpty().withMessage("Facebook url field is required"),
    check('instagram').not().isEmpty().withMessage("Instagram url field is required"),
    check('demand_link').not().isEmpty().withMessage("Demand url field is required"),
    check('rap_link').not().isEmpty().withMessage("Rap video url field is required"),
    // check('video_360').not().isEmpty().withMessage("360 video url is required"),
    check('twitter').not().isEmpty().withMessage("Twitter url field is required"),
    // check('linkdin').not().isEmpty().withMessage("Linkedin url field is required"),
    check('start_date').not().isEmpty().withMessage("Start date field is required"),
    check('end_date').not().isEmpty().withMessage("End date field is required"),
    // check('theme').not().isEmpty().withMessage("Theme field is required"),
    // check('dashboard').not().isEmpty().withMessage("Dashboard field is required"),
    check('download').not().isEmpty().withMessage("Event download field is required"),
    check('image_data').not().isEmpty().withMessage("Image field is required"),
    check('video_data').not().isEmpty().withMessage("Video field is required"),
  ], eventController.addEventPost);
  router.get('/add-event/step-two/:event_id', auth.afterLogin, eventController.addSpeakers);
  router.post('/add-event/step-two-post/:event_id', eventController.postSpeakers);
  router.get('/add-event/step-three/:event_id', auth.afterLogin, eventController.addSession);
  router.post('/add-event/step-three-post/:event_id', eventController.postSession);
  router.get('/event-list', auth.afterLogin, eventController.getEvent);
  router.get('/view-sponsers/:id', auth.afterLogin, eventController.viewSponser);
  router.get('/edit-event/:id', auth.afterLogin, eventController.editEvent);
  router.get('/event-detail/:id', auth.afterLogin, eventController.eventDetail);

  router.post('/update-event/:id', [
    // check('client_id').not().isEmpty().withMessage("Please select client!"),

    check('title').not().isEmpty().withMessage("Event title field is required"),
    check('description').not().isEmpty().withMessage("Description field is required"),
    check('site_url').not().isEmpty().withMessage("Site url field is required"),
    check('demand_link').not().isEmpty().withMessage("Demand url field is required"),
    check('rap_link').not().isEmpty().withMessage("Rap video url field is required"),
    // check('theme').not().isEmpty().withMessage("Theme field is required"),
    check('facebook').not().isEmpty().withMessage("Facebook url field is required"),
    check('instagram').not().isEmpty().withMessage("Instagram url field is required"),
    // check('video_360').not().isEmpty().withMessage("360 video url is required"),
    check('twitter').not().isEmpty().withMessage("Twitter url field is required"),
    // check('linkdin').not().isEmpty().withMessage("Linkedin url field is required"),
    check('start_date').not().isEmpty().withMessage("Start date field is required"),
    check('end_date').not().isEmpty().withMessage("End date field is required"),
    // check('dashboard').not().isEmpty().withMessage("Dashboard field is required"),
    check('image_data').not().isEmpty().withMessage("Image field is required"),
    check('video_data').not().isEmpty().withMessage("Video field is required"),
    check('download').not().isEmpty().withMessage("Event download field is required"),

  ], auth.afterLogin, eventController.updateEvent);

  // router.get('/edit-speaker/:id',auth.afterLogin,eventController.editSpeakers);

  // router.post('/update-speaker/:id',[
  //   check('name').not().isEmpty().withMessage("Name field is required"),
  //   check('designation').not().isEmpty().withMessage("designation field is required"),
  //   check('description').not().isEmpty().withMessage("Description field is required"),
  //   check('profile_pic').not().isEmpty().withMessage("profile_pic field is required"),
  // ],auth.afterLogin,eventController.updateSpeaker);

  router.get('/session-list/:id', auth.afterLogin, eventController.getSession);
  router.get('/edit-design/:id', auth.afterLogin, eventController.editDesign);

  router.post('/update-design/:id', [
    check('primary_color').not().isEmpty().withMessage("Please add color code"),
    check('secondary_color').not().isEmpty().withMessage("Please add color code"),
    check('third_color').not().isEmpty().withMessage("Please add color code"),
    check('image_data').not().isEmpty().withMessage("Image field is required"),
  ], auth.afterLogin, eventController.updateDesign);










}




