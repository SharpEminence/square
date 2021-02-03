const membershipController = require('./../controller/membershipController');
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
    router.get('/add-membership',auth.afterLogin,membershipController.addMembership);

    router.post('/membershippost',[
        check('membership').not().isEmpty().withMessage("Membership field is required"),
    ],auth.afterLogin,membershipController.addMembershipPost);


    router.get('/membership-list',auth.afterLogin,membershipController.getMembership);
    router.get('/edit-membership/:id',auth.afterLogin,membershipController.editMembership);
    router.post('/update-membership/:id',upload.single('logo'),[
      check('membership').not().isEmpty().withMessage("Membership field is required"),
  ],auth.afterLogin,membershipController.updateMembership);

}




