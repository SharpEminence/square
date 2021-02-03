const agendaCategoryController = require('./../controller/agendaCategoryController');
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
    router.get('/agenda/add-category',auth.afterLogin,agendaCategoryController.addCategory);

    router.post('/agenda/categorypost',[
        check('category').not().isEmpty().withMessage("Category field is required"),
    ],auth.afterLogin,agendaCategoryController.addCategoryPost);


    router.get('/agenda/category-list',auth.afterLogin,agendaCategoryController.getCategory);
    router.get('/agenda/edit-category/:id',auth.afterLogin,agendaCategoryController.editCategory);
    router.post('/agenda/update-category/:id',upload.single('logo'),[
      check('category').not().isEmpty().withMessage("Category field is required"),
  ],auth.afterLogin,agendaCategoryController.updateCategory);



    
  
}




