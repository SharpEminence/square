
const surveyController = require('./../controller/surveyController');
const auth = require('../../../helpers/admin/auth');
const { check } = require ('express-validator');
var multer = require('multer');

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
    router.get('/add-survey/:event_id',auth.afterLogin,surveyController.addSurvey);

    router.post('/surveypost/:event_id',[
        check('question').not().isEmpty().withMessage("Question field is required")
    ],auth.afterLogin,surveyController.addSurveyPost);


    router.get('/survey-list/:event_id',auth.afterLogin,surveyController.getSurvey);
    router.get('/edit-survey/:id/:event_id',auth.afterLogin,surveyController.editSurvey);
    router.post('/update-survey/:id/:event_id',[
      check('question').not().isEmpty().withMessage("Question field is required")
  ],auth.afterLogin,surveyController.updateSurvey);

  router.get('/delete-survey/:id/:event_id',auth.afterLogin,surveyController.delete_survey);

    
  
}




