
const speakerController = require('./../controller/speakerController');
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
    router.get('/add-speaker/:event_id',auth.afterLogin,speakerController.addSpeaker);

    router.post('/postspeaker/:event_id',[
      check('first_name').not().isEmpty().withMessage("First name field is required"),
      check('last_name').not().isEmpty().withMessage("Last name field is required"),
      // check('dob').not().isEmpty().withMessage("Dob field is required"),
      // check('contact').not().isEmpty().withMessage("Contact field is required").isLength({ min: 6 }).withMessage("Minimum 6 digits is required"),
      // check('education').not().isEmpty().withMessage("Education field is required"),
      // check('address').not().isEmpty().withMessage("Address field is required"),
      // check('company_name').not().isEmpty().withMessage("Company name field is required"),
      check('designation').not().isEmpty().withMessage("Designation field is required"),
      // check('company_type').not().isEmpty().withMessage("Company type field is required"),
      // check('experience').not().isEmpty().withMessage("Experience field is required"),
      // check('linkedin_url').not().isEmpty().withMessage("Linkedin url field is required"),
      // check('facebook_url').not().isEmpty().withMessage("Facebook url field is required"),
      // check('twitter_url').not().isEmpty().withMessage("Twitter url field is required"),
      check('image_data').not().isEmpty().withMessage("Image field is required"),
      check('bio').not().isEmpty().withMessage("Bio field is required"),
      // check('topic').not().isEmpty().withMessage("Topic field is required"),
    ],auth.afterLogin,speakerController.addSpeakerPost);

    router.get('/speaker-list/:event_id',auth.afterLogin,speakerController.getSpeaker);
    router.get('/edit-speaker/:id/:event_id',auth.afterLogin,speakerController.editSpeaker);

    router.post('/update-speaker/:id/:event_id',[
      check('first_name').not().isEmpty().withMessage("First name field is required"),
      check('last_name').not().isEmpty().withMessage("Last name field is required"),
      // check('dob').not().isEmpty().withMessage("Dob field is required"),
      // check('contact').not().isEmpty().withMessage("Contact field is required").isLength({ min: 6 }).withMessage("Minimum 6 digits is required"),
      // check('education').not().isEmpty().withMessage("Education field is required"),
      // check('address').not().isEmpty().withMessage("Address field is required"),
      // check('company_name').not().isEmpty().withMessage("Company name field is required"),
      check('designation').not().isEmpty().withMessage("Designation field is required"),
      // check('company_type').not().isEmpty().withMessage("Company type field is required"),
      // check('experience').not().isEmpty().withMessage("Experience field is required"),
      // check('linkedin_url').not().isEmpty().withMessage("Linkedin url field is required"),
      // check('facebook_url').not().isEmpty().withMessage("Facebook url field is required"),
      // check('twitter_url').not().isEmpty().withMessage("Twitter url field is required"),
      check('image_data').not().isEmpty().withMessage("Image field is required"),
      check('bio').not().isEmpty().withMessage("Bio field is required"),
      // check('topic').not().isEmpty().withMessage("Topic field is required"),
    ],auth.afterLogin,speakerController.updateSpeaker);

    router.get('/delete-speaker/:id/:event_id',auth.afterLogin,speakerController.delete_speaker);


    





}




