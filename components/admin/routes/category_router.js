const companyCategoryController = require('./../controller/companyCategoryController');
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
    router.get('/add-booth',auth.afterLogin,companyCategoryController.addBooth);

    router.post('/Boothpost',[
        check('name').not().isEmpty().withMessage("Booth name field is required"),
        // check('google_meet').not().isEmpty().withMessage("Google meet url is required"),
        // check('description').not().isEmpty().withMessage("Description field is required"),
    ],auth.afterLogin,companyCategoryController.addBoothPost);


    router.get('/booth-list',auth.afterLogin,companyCategoryController.getBooth);
    router.get('/edit-booth/:id',auth.afterLogin,companyCategoryController.editBooth);
    router.post('/update-booth/:id',upload.single('logo'),[
      check('name').not().isEmpty().withMessage("Booth name field is required"),
  ],auth.afterLogin,companyCategoryController.updateCategory);



    
  
}




