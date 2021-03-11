
const newsController = require('./../controller/newsController');
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
    router.get('/add-news/:event_id',auth.afterLogin,newsController.addnews);

    router.post('/postnews/:event_id',[
      check('title').not().isEmpty().withMessage("Title field is required"),
      check('description').not().isEmpty().withMessage("Description field is required"),
      check('image_data').not().isEmpty().withMessage("Image field is required"),
    ],auth.afterLogin,newsController.addNewsPost);

    router.get('/news-list/:event_id',auth.afterLogin,newsController.getNews);
    router.get('/edit-news/:id/:event_id',auth.afterLogin,newsController.editNews);

    router.post('/update-news/:id/:event_id',[
      check('title').not().isEmpty().withMessage("Title field is required"),
      check('description').not().isEmpty().withMessage("Description field is required")
    ],auth.afterLogin,newsController.updateNews);

    router.get('/delete-news/:id/:event_id',auth.afterLogin,newsController.deleteNews);


    





}




