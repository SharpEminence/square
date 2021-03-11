
const presidentController = require('./../controller/presidentController');
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
    router.get('/add-notification/:event_id',auth.afterLogin,notificationController.addNotification);

    router.post('/postNotification/:event_id',[
      check('session').not().isEmpty().withMessage("Session field is required"),
      check('messages').not().isEmpty().withMessage("Message field is required"),
      check('datetime').not().isEmpty().withMessage("Datetime field is required"),
    ],auth.afterLogin,notificationController.addNotificationPost);

    router.get('/notification-list/:event_id',auth.afterLogin,notificationController.getNotification);
    router.get('/edit-notification/:id/:event_id',auth.afterLogin,notificationController.editNotification);

    router.post('/update-notification/:id/:event_id',[
      check('session').not().isEmpty().withMessage("Session field is required"),
      check('messages').not().isEmpty().withMessage("Message field is required"),
      check('datetime').not().isEmpty().withMessage("Datetime field is required"),
    ],auth.afterLogin,notificationController.updateNotification);

    // router.get('/delete-agenda/:id/:event_id',auth.afterLogin,agendaController.deleteAgenda);


}




