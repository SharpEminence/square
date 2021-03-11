const userDesignationController = require('./../controller/userDesignationController');
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
    // router.get('/add-category',auth.afterLogin,userDesignationController.addCategory);

    // router.post('/categorypost',[
    //     check('category').not().isEmpty().withMessage("Category field is required"),
    // ],auth.afterLogin,userDesignationController.addCategoryPost);


    // router.get('/category-list',auth.afterLogin,userDesignationController.getCategory);
    // router.get('/edit-category/:id',auth.afterLogin,userDesignationController.editCategory);
    // router.post('/update-category/:id',upload.single('logo'),[
    //   check('category').not().isEmpty().withMessage("Category field is required"),
    router.get('/add-designation',auth.afterLogin,userDesignationController.addDesignation);

    router.post('/designationpost',[
        check('title').not().isEmpty().withMessage("Designation field is required"),
    ],auth.afterLogin,userDesignationController.addDesignationPost);


    router.get('/designation-list',auth.afterLogin,userDesignationController.getDesignation);
    router.get('/edit-designation/:id',auth.afterLogin,userDesignationController.editDesignation);
    router.post('/update-designation/:id',upload.single('logo'),[
      check('title').not().isEmpty().withMessage("Designation field is required"),
    ],auth.afterLogin,userDesignationController.updateDesignation);
    router.get('/delete-designation/:id',auth.afterLogin,userDesignationController.deleteDesignation);


    
    
}




