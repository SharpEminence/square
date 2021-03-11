
const sponserController = require('./../controller/sponserController');
const collaboraterController = require('./../controller/collaboraterController');
const auth = require('../../../helpers/admin/auth');
const { check } = require ('express-validator');
const multer = require('multer');



module.exports = (router)=>
{
    //Admin  Routes        
    router.get('/add-collaborater',auth.afterLogin,collaboraterController.addCollaborater);

    router.post('/postcollaborater',[
      check('first_name').not().isEmpty().withMessage("First name field is required"),
      check('last_name').not().isEmpty().withMessage("Last name field is required"),
      check('email').not().isEmpty().withMessage("Email field is required"),
      check('password').not().isEmpty().withMessage("Password field is required"),
      check('confirm_password').not().isEmpty().withMessage("Confirm password field is required"),
      check('mobile_number').not().isEmpty().withMessage("Phone field is required")
    ],auth.afterLogin,collaboraterController.addCollaboraterPost);


    router.get('/collaborater-list',auth.afterLogin,collaboraterController.getCollaborater);
    router.get('/edit-collaborater/:id',auth.afterLogin,collaboraterController.editCollaborater);

    router.post('/update-collaborater/:id',[
      check('first_name').not().isEmpty().withMessage("First name field is required"),
      check('last_name').not().isEmpty().withMessage("Last name field is required"),
      check('mobile_number').not().isEmpty().withMessage("Phone field is required")
    ],auth.afterLogin,collaboraterController.updateCollaborater);

    





}




