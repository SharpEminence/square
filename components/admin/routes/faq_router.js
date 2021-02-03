
const faqController = require('./../controller/faqController');
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
    router.get('/add-faq/:event_id',auth.afterLogin,faqController.addFaq);

    router.post('/faqpost/:event_id',[
        check('question').not().isEmpty().withMessage("Question field is required"),
        check('answer').not().isEmpty().withMessage("Answer field is required")
    ],auth.afterLogin,faqController.addFaqPost);


    router.get('/faq-list/:event_id',auth.afterLogin,faqController.getFaq);
    router.get('/edit-faq/:id/:event_id',auth.afterLogin,faqController.editFaq);
    router.post('/update-faq/:id/:event_id',[
      check('question').not().isEmpty().withMessage("Question field is required"),
      check('answer').not().isEmpty().withMessage("Answer field is required")
  ],auth.afterLogin,faqController.updateFaq);

  router.get('/delete-faq/:id/:event_id',auth.afterLogin,faqController.delete_faq);

    
  
}




