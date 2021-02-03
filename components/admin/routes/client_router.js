const clientController = require('./../controller/clientController');
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
    router.get('/add-client',auth.afterLogin,clientController.addClient);

    router.post('/clientpost',[
        check('company_name').not().isEmpty().withMessage("Company field is required"),
        check('email').not().isEmpty().withMessage("Email field is required"),
        check('mobile_number').not().isEmpty().withMessage("Phone field is required"),
        check('address').not().isEmpty().withMessage("Address field is required"),
        check('description').not().isEmpty().withMessage("Description field is required"),
        check('person_name').not().isEmpty().withMessage("Person name field is required"),
        check('image_data').not().isEmpty().withMessage("Logo field is required"),
    ],auth.afterLogin,clientController.addClientPost);


    router.get('/client-list',auth.afterLogin,clientController.getClient);
    router.get('/edit-client/:id',auth.afterLogin,clientController.editClient);
    router.post('/update-client/:id',upload.single('logo'),[
      check('company_name').not().isEmpty().withMessage("Company field is required"),
      check('mobile_number').not().isEmpty().withMessage("Phone field is required"),
      check('address').not().isEmpty().withMessage("Address field is required"),
      check('description').not().isEmpty().withMessage("Description field is required"),
      check('person_name').not().isEmpty().withMessage("Person name field is required"),
  ],auth.afterLogin,clientController.updateClient);



    
  
}




