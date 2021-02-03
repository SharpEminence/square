
const loginController = require('./../controller/loginController');
const dashboardController = require('./../controller/dashboardController');
const userController = require('./../controller/userController');
const auth = require('../../../helpers/admin/auth');
const { check } = require ('express-validator');




module.exports = (router)=>
{
    //Admin  Routes        
    router.get('/login',auth.beforeLogin,loginController.login);

    router.post('/loginPost',[
        check('email').not().isEmpty().withMessage("Email field is required"),
        check('password').not().isEmpty().withMessage("Password field is required")
    ],auth.beforeLogin,loginController.loginPost);
    router.get('/',auth.afterLogin,dashboardController.dashboard);

    router.post('/user/create',userController.createUser);
    router.get('/logout',auth.afterLogin,loginController.logout);


    router.get('/edit-admin',auth.afterLogin,userController.editUser);
    router.post('/user/update-admin/:id',[
        check('first_name').not().isEmpty().withMessage("First Name field is required"),
        check('last_name').not().isEmpty().withMessage("Last Name field is required"),
        check('mobile_number').not().isEmpty().withMessage("Mobile field is required").isNumeric().withMessage("Mobile number must be numeric")
    ],auth.afterLogin,userController.updateUser);


    router.get('/change-password',auth.afterLogin,userController.resetPassword);
    router.post('/update-password',[
    check('old_password').not().isEmpty().withMessage("Old Password field is required"),
    check('new_password').not().isEmpty().withMessage("New Password field is required"),
    check('confirm_password').not().isEmpty().withMessage("Confirm Password field is required")
    ],auth.afterLogin,userController.updatePassword);


    router.get('/api/admin-data/:token',loginController.AdminData);


    router.get('/user-list/:event_id',auth.afterLogin,userController.getUser);
    router.get('/add-user/:event_id',auth.afterLogin,userController.AddUser);
    router.post('/user/add-user/:event_id',[
        check('first_name').not().isEmpty().withMessage("First Name field is required"),
        check('last_name').not().isEmpty().withMessage("Last Name field is required"),
        check('email').not().isEmpty().withMessage("Email field is required")
    ],auth.afterLogin,userController.addUserPost);
    router.get('/edit-user/:id/:event_id',auth.afterLogin,userController.editFrontUser);
    router.post('/user/update-front-user/:id/:event_id',[
        check('first_name').not().isEmpty().withMessage("First Name field is required"),
        check('last_name').not().isEmpty().withMessage("Last Name field is required"),
    ],auth.afterLogin,userController.updateFrontuser);
   
    router.get('/delete-user/:id/:event_id',auth.afterLogin,userController.delete_user);

    
}




