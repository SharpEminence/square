
const presidentController = require('./../controller/presidentController');
const ondemandController = require('./../controller/ondemandController');
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
    router.get('/add-president/:event_id',auth.afterLogin,presidentController.addPresident);

    router.post('/postPresident/:event_id',[
      // check('title').not().isEmpty().withMessage("Title field is required"),
      // check('description').not().isEmpty().withMessage("Description field is required"),
      // check('image_data').not().isEmpty().withMessage("Please upload image!"),
      // check('video_data').not().isEmpty().withMessage("Please upload video!"),
    ],auth.afterLogin,presidentController.addPresidentPost);

    router.get('/president-list/:event_id',auth.afterLogin,presidentController.getPresident);
    router.get('/edit-president/:id/:event_id',auth.afterLogin,presidentController.editPresident);

    router.post('/update-president/:id/:event_id',[
      // check('title').not().isEmpty().withMessage("Title field is required"),
      // check('description').not().isEmpty().withMessage("Description field is required"),
      // check('image_data').not().isEmpty().withMessage("Please upload image!"),
      // check('video_data').not().isEmpty().withMessage("Please upload video!"),
    ],auth.afterLogin,presidentController.updatePresident);

    // router.get('/delete-agenda/:id/:event_id',auth.afterLogin,agendaController.deleteAgenda);


}




