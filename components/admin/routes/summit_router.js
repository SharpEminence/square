
const summitController = require('./../controller/summitController');
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
    router.get('/add-summit/:event_id',auth.afterLogin,summitController.addSummit);

    router.post('/summitpost/:event_id',[
        check('description').not().isEmpty().withMessage("Description field is required"),
        check('point').not().isEmpty().withMessage("Point field is required")
    ],auth.afterLogin,summitController.addSummitPost);


    router.get('/summit-list/:event_id',auth.afterLogin,summitController.getSummit);
    router.get('/edit-summit/:id/:event_id',auth.afterLogin,summitController.editSummit);
    router.post('/update-summit/:id/:event_id',[
      check('description').not().isEmpty().withMessage("Description field is required"),
        check('point').not().isEmpty().withMessage("Point field is required")
  ],auth.afterLogin,summitController.updateSummit);

  router.get('/delete-summit/:id/:event_id',auth.afterLogin,summitController.delete_summit);

    
  
}




