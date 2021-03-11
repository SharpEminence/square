
const pollController = require('./../controller/pollController');
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
    router.get('/add-poll/:event_id',auth.afterLogin,pollController.addPoll);

    router.post('/pollpost/:event_id',[
        check('question').not().isEmpty().withMessage("Question field is required")
    ],auth.afterLogin,pollController.addPollPost);


    router.get('/poll-list/:event_id',auth.afterLogin,pollController.getPoll);
    router.get('/edit-poll/:id/:event_id',auth.afterLogin,pollController.editPoll);
    router.post('/update-poll/:id/:event_id',[
      check('question').not().isEmpty().withMessage("Question field is required")
  ],auth.afterLogin,pollController.updatePoll);

  router.get('/delete-poll/:id/:event_id',auth.afterLogin,pollController.deletePoll);

    
  
}




