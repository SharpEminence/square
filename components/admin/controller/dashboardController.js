// var User = require("../../../models/User");
// var md5 = require('md5');
// const { validationResult } = require ('express-validator');



module.exports.dashboard = (req,res)=>{
    //return; 
    // if(typeof req.flash('formdata')=='undefined')
    // {
    //     var formdata = {email:'',
    //         password:''
    //     };
    //     req.flash("formdata",formdata);
    // }
    let active = 'Dashboard';
    let title = 'Dashboard';
    // res.render('login/login',{formdata: req.flash('formdata'),errors:req.flash('errors')});
    res.render('dashboard/dashboard',{active,title,formdata: req.flash('formdata'),errors:req.flash('errors')});
}

