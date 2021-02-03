const clientController = require('./../controller/clientController');
const questionController = require('./../controller/questionController');
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
    router.get('/add-question/:event_id',auth.afterLogin,questionController.addQuestion);

    router.post('/questionpost/:event_id',[
        check('question').not().isEmpty().withMessage("Question field is required")
    ],auth.afterLogin,questionController.addQuestionPost);


    router.get('/question-list/:event_id',auth.afterLogin,questionController.getQuestion);
    router.get('/edit-question/:id/:event_id',auth.afterLogin,questionController.editQuestion);
    router.post('/update-question/:id/:event_id',[
      check('question').not().isEmpty().withMessage("Question field is required")
  ],auth.afterLogin,questionController.updateQuestion);
    
  
}




