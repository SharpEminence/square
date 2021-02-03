
const agendaController = require('./../controller/agendaController');
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
    router.get('/add-demand/:event_id',auth.afterLogin,ondemandController.addDemand);

    router.post('/postDemand/:event_id',[
      check('title').not().isEmpty().withMessage("Title field is required"),
      check('description').not().isEmpty().withMessage("Description field is required"),
      check('hyperlink').not().isEmpty().withMessage("Hyperlink field is required"),

      // check('video_data').not().isEmpty().withMessage("Please upload video is required"),
    ],auth.afterLogin,ondemandController.addDemandPost);

    router.get('/demand-list/:event_id',auth.afterLogin,ondemandController.getDemand);
    router.get('/edit-demand/:id/:event_id',auth.afterLogin,ondemandController.editDemand);

    router.post('/update-demand/:id/:event_id',[
      check('title').not().isEmpty().withMessage("Title field is required"),
      check('description').not().isEmpty().withMessage("Description field is required"),
      check('hyperlink').not().isEmpty().withMessage("Hyperlink field is required"),
      // check('video_data').not().isEmpty().withMessage("Please upload video is required"),
    ],auth.afterLogin,ondemandController.updateDemand);

    router.get('/delete-demand/:id/:event_id',auth.afterLogin,ondemandController.deleteDemand);


}




