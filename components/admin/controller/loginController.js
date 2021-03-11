var User = require("../../../models/User");
var md5 = require('md5');
const { validationResult } = require ('express-validator');
const uniqueRandom = require('unique-random');

module.exports.login = (req,res)=>{
    if(typeof req.session.user_data !== 'undefined')
    {
        console.log('1111111111111111111111111111111111111');
      return res.redirect('/');
    
    }
    console.log('helloooooooooooooooooooooo');
    if(typeof req.flash('formdata')=='undefined')
    {
        var formdata = {email:'',
            password:''
        };
        req.flash("formdata",formdata);
    }
    // else
     //{
        if(req.cookies)
        {
        var formdata = {email:req.cookies.email,
                password:req.cookies.password};
                req.flash("formdata",formdata);
        }
       
   //}
     res.render('login/login',{layout: 'layouts/loginLayout', formdata: req.flash('formdata'),errors:req.flash('errors'),reset:req.flash("reset")});
}

module.exports.loginPost = async(req,res)=>{
    // Validate request
    
    const errors = validationResult(req)
    var formdata = {email:req.body.email,
        password:req.body.password,    
    };
    if (!errors.isEmpty()) {
        let errorsData = {email:'' ,password:''};
        if (errors.array().length > 0)
        { 
            errors.array().forEach((value)  => 
            {
            errorsData[value.param] = value.msg;    
            });
            req.flash("errors",errorsData); 
            req.flash("formdata",formdata); 
            return res.redirect('/login');
        }
    }
    //console.log(req.oldInput);
    
    if(!req.body) {
        return res.status(400).send({
            message: "Note content can not be empty"
        });
    }
 let rember_me =req.body.inputCheckbox;
    $where = {email:req.body.email,password:md5(req.body.password)};
    // Save User in the database
    await User.findOne($where, async function(err, user) 
    {
       if(user  && user.role == '1' || user.role == '5')
       {
        var chat_token = uniqueRandom(9999999999, 999999999999);
        var tokenchat = chat_token();
        req.session.user_data = {user_id:user._id,profile_img:user.profile_img,fullname:user.first_name+' '+user.last_name,role:user.role,chat_token:tokenchat};

        await User.findOneAndUpdate({_id: user._id},{chat_token: tokenchat}).exec();

        if(rember_me){
            res.cookie('email',req.body.email);
            res.cookie('password',req.body.password);  
          }
          else{
              //console.log("cookie is not set")
              res.clearCookie('email');
              res.clearCookie('password');
          }
        return res.redirect('/');
       
       }
       else{
            $errors = { message:'Either Email or Password Incorrect!' };
            req.flash('errors', $errors);
            req.flash('formdata', (formdata)?formdata:'undefined');
            return res.redirect('/login');
       }
    });    
}


module.exports.logout = async(req,res)=>{
    await User.findOneAndUpdate({_id: req.session.user_data.user_id},{chat_token: ''}).exec();
    req.session.destroy();
    res.redirect("/login");
 

}



module.exports.AdminData = async(req,res)=>{
   
     var isExist = await User.findOne({chat_token: req.params.token}).exec();
     
        if(!isExist){
            return res.json({
                status: 400,
                message:"User not found"
            })
        }else{
   
           return res.json({
               status: 200,
               message:"Admin data",
               user: isExist
           })
        }
   
   }