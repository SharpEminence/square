var User = require("../../../models/User");
var MembershipType = require("../../../models/MembershipType");
var Event = require("../../../models/Event");
const timestamp = require('time-stamp');
created_date = timestamp.utc('YYYY-MM-DD HH:mm:ss');
var md5 = require('md5');
const { validationResult } = require ('express-validator');
const uniqueRandom = require('unique-random');
const ejs = require('ejs');
var Mail = require('../../../utilities/mail');
var fs = require('fs');
var path = require('path');
var moment = require('moment');


module.exports.addCollaborater = async(req,res)=>{
  // 1 for admin , 2 for client, 3 for front users , 4 for sponsers, 5  for collaborater
    if(typeof req.flash('formdata')=='undefined')
    {
        var formdata = {
            first_name:'',
            last_name:'',
            email:'',
            mobile_number:'',
            image_data:'',
        };
        req.flash("formdata",formdata);
    }
    var data =  await MembershipType.find().exec();
    var event =  await Event.find().exec();
    let active = 'Collaborater';
    let title =  'Add Collaborater';
     res.render('collaborater/add_collaborater',{active,title,data,event,formdata: req.flash('formdata'),errors:req.flash('errors'),reset:req.flash("reset")});
}

module.exports.addCollaboraterPost = async(req,res)=>{

    var formdata = {first_name:req.body.first_name,last_name:req.body.last_name,email:req.body.email ,mobile_number:req.body.mobile_number,image_data:req.body.image_data};
    ///////////// Validate request//////////////////////////
    const errors = validationResult(req);
     
    let errorsData = {
                first_name:'',
                last_name:'',
                email:'',
                mobile_number:'',
                image_data:'',
                };
    if (errors.array().length > 0)
    { 
        errors.array().forEach((value)  => 
    {
        errorsData[value.param] = value.msg;    
    });

        req.flash("errors",errorsData); 
        req.flash("formdata",formdata); 
        return res.redirect('/add-collaborater');
     }
    ////////////////////////////////////////////////////////////
    if(!req.body) {
        return res.status(400).send({
        message: "Note content can not be empty"
     });
    }
    
    if(req.body.password != req.body.confirm_password)
    {
        $message ={message:'Password and confirm password must be matched!'}
        req.flash("errors",$message)
        req.flash("formdata",formdata); 
        return res.redirect('/add-collaborater');
    }
   
$where = {email:req.body.email};
User.findOne($where,function(err, user) 
    {
       if(user)
       {
        $message = {message:'Email already exist!'};
            req.flash('errors', $message);   
            req.flash("formdata",formdata); 
            return res.redirect('/add-collaborater');
       
       }
       else{
            // Create a User
            if(req.body.image_data)
            {
                const Users = new User({
                    first_name:req.body.first_name,
                    last_name:req.body.last_name,
                    email:req.body.email.toLowerCase(),
                    password:md5(req.body.password),
                    mobile_number:req.body.mobile_number,
                    profile_img:req.body.image_data,
                    role:5,
                    status:1,
                    created_at:created_date,
                    updated_at:created_date
                 });
                  // Save User in the database
                    Users.save()
                    .then(data => {
                        let templatePath  = path.join('./mail_template/');
                        var compiled = ejs.compile(fs.readFileSync(path.resolve(templatePath + 'mail.html'),"utf8"));
                        var html = compiled({
                            email: data.email,
                            password: req.body.password
                        })
                        Mail.sendMailer({email:data.email,body:html,subject:'Collaborater registration successfully'}); 
                        $message = {msg:'Collaborater saved successfully!'};
                        req.flash('errors', $message);    
                        return res.redirect('/add-collaborater');
                    }).catch(err => {
                        $message = {message:'Some error occurred!'};
                        req.flash('errors', $message);  
                        return res.redirect('/add-collaborater');
                    
                    })
            }
            else
            {
                const Users = new User({
                    first_name:req.body.first_name,
                    last_name:req.body.last_name,
                    email:req.body.email,
                    password:md5(req.body.password),
                    mobile_number:req.body.mobile_number,
                    role:5,
                    status:1,
                    created_at:created_date,
                    updated_at:created_date
                 });
                  // Save User in the database
                    Users.save()
                    .then(data => {
                        let templatePath  = path.join('./mail_template/');
                        var compiled = ejs.compile(fs.readFileSync(path.resolve(templatePath + 'mail.html'),"utf8"));
                        var html = compiled({
                            email: data.email,
                            password: req.body.password
                        })
                        Mail.sendMailer({email:data.email,body:html,subject:'Collaborater registration successfully'}); 
                        $message = {msg:'Collaborater saved successfully!'};
                        req.flash('errors', $message);    
                        return res.redirect('/add-collaborater');
                    }).catch(err => {
                        $message = {message:'Some error occurred!'};
                        req.flash('errors', $message);  
                        return res.redirect('/add-collaborater');
                    
                    })
            }
    

           
        }
    });
 

}
   

module.exports.getCollaborater = async(req,res)=>{
    $where = {role:5};
    
    await User.find($where).exec(async(err,userObj) => {
        if(err){
          $message ={message:'Something went wrong'}
        req.flash("errors",$message)
        return res.redirect('/collaborater-list');
        } 
        else{
          let data = userObj;
          console.log(userObj);
          let active = 'Collaborater';
          let title =  'Collaborater List';
             return  res.render('collaborater/collaborater_list',{active,title,data,moment:moment , errors:req.flash("errors"), message:req.flash("message")});
         
        }
      });
}

module.exports.editCollaborater = async(req,res)=>
{
    let id= req.params.id;
    await User.findOne({_id:id},function(err, user)
    { 
       if(err)
       {
          $message ={msg:'Something went wrong'}
          req.flash("errors",$message)
          return res.redirect('/edit-collaborater/'+id);
       } 
       else
       {
          
          let data = user; 
          url = process.env.IMAGE_URL;
          let active = 'Collaborater';
          let title =  'Edit Collaborater';
         res.render('collaborater/edit_collaborater',{active,title,errors:req.flash("errors"),data,url});
        }
    });
}






module.exports.updateCollaborater = (req,res)=>{
  
  let id = req.params.id;
  ///////////// Validate request//////////////////////////
  const errors = validationResult(req);
 
  let errorsData = {
    first_name:'',
    last_name:'',
    email:'',
    mobile_number:'',
    image_data:'',
  };
  if (errors.array().length > 0)
  { 
    errors.array().forEach((value)  => 
    {
      errorsData[value.param] = value.msg;    
    });

    req.flash("errors",errorsData); 
    return res.redirect('/edit-collaborater/'+id);
 }
////////////////////////////////////////////////////////////
    if(!req.body) {
        return res.status(400).send({
        message: "Note content can not be empty"
    });
    }
    if(req.body.image_data)
    {
        var where = { first_name:req.body.first_name,
            last_name:req.body.last_name,
            mobile_number:req.body.mobile_number,
            profile_img:req.body.image_data};
    }
    else{
        var where = { first_name:req.body.first_name,
            last_name:req.body.last_name,
            mobile_number:req.body.mobile_number};
    }
    User.findByIdAndUpdate({ _id: id },where,{new: true}, function(err, result) {
    if (err) {
        $message ={message:'Something went wrong'}
        req.flash("errors",$message)
        return res.redirect('/edit-collaborater/'+id);
    } else {
        req.session.auth =result;
        $message ={msg:'Sponsor updated successfully'}
        req.flash("errors",$message)
        return res.redirect('/edit-collaborater/'+id);
    }
    });
}


