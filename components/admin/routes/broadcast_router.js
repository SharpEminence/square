
const broadcastController = require('./../controller/broadcastController');
const notificationController = require('./../controller/notificationController');
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
    router.get('/add-broadcast/:event_id',auth.afterLogin,broadcastController.addBroadcast);

    router.post('/postBroadcast/:event_id',[
      check('title').not().isEmpty().withMessage("Title field is required"),
      check('messages').not().isEmpty().withMessage("Message field is required"),
      check('status').not().isEmpty().withMessage("Please select status!"),
    ],auth.afterLogin,broadcastController.addBroadcastPost);

    router.get('/broadcast-list/:event_id',auth.afterLogin,broadcastController.getBroadCast);
    router.get('/edit-broadcast/:id/:event_id',auth.afterLogin,broadcastController.editBroadCast);

    router.post('/update-broadcast/:id/:event_id',[
      check('title').not().isEmpty().withMessage("Title field is required"),
      check('messages').not().isEmpty().withMessage("Message field is required"),
      check('status').not().isEmpty().withMessage("Please select status!"),
    ],auth.afterLogin,broadcastController.updateBroadcast);

    // router.get('/delete-agenda/:id/:event_id',auth.afterLogin,agendaController.deleteAgenda);


}




