
const sponserController = require('./../controller/sponserController');
const hourController = require('./../controller/hourController');
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
    router.get('/add-hour/:event_id',auth.afterLogin,hourController.addHour);

    router.post('/postHour/:event_id',[
      // check('membership').not().isEmpty().withMessage("Sponsor type field is required"),
      // check('sponsor_name').not().isEmpty().withMessage("Sponsor name field is required"),
      // check('booth').not().isEmpty().withMessage("Booth field is required"),
      // check('image_data').not().isEmpty().withMessage("Logo field is required"),
    ],auth.afterLogin,hourController.addHourPost);

    router.get('/hour-list/:event_id',auth.afterLogin,hourController.getBoothhour);
    router.get('/edit-hour/:id/:event_id',auth.afterLogin,hourController.editHour);

    router.post('/update-hour/:id/:event_id',[
      // check('membership').not().isEmpty().withMessage("Sponsor type field is required"),
      // check('sponsor_name').not().isEmpty().withMessage("Sponsor name field is required"),
      // check('booth').not().isEmpty().withMessage("Booth field is required"),
    ],auth.afterLogin,hourController.updateHour);

    router.get('/delete-hour/:id/:event_id',auth.afterLogin,hourController.delete_hour);

}




