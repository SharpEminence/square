const helpdeskController = require('./../controller/helpdeskController');
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
    router.get('/helpdesk',auth.afterLogin,helpdeskController.getHelp);
   


}




