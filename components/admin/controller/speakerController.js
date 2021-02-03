var User = require("../../../models/User");
var Speaker = require("../../../models/Speaker");
var CompanyCategory = require("../../../models/CompanyCategory");
const timestamp = require('time-stamp');
created_date = timestamp.utc('YYYY-MM-DD HH:mm:ss');
const { validationResult } = require ('express-validator');
var moment = require('moment');
const uniqueRandom = require('unique-random');
const ejs = require('ejs');
var Mail = require('../../../utilities/mail');
var fs = require('fs');
var path = require('path');
var md5 = require('md5');
 // 1 for admin , 2 for client, 3 for front users , 4 for sponsers, 5 for speaker
module.exports.addSpeaker = async(req,res)=>{
  
    //console.log('req.params.event_id');
    //console.log(req.params.event_id);
    if(typeof req.flash('formdata')=='undefined')
    {
        var formdata = {
            speaker_name:'',
            dob:'',
            email:'',
            contact:'',
            education:'',
            address:'',
            company_name:'',
            designation:'',
            company_type:'',
            experience:'',
            linkedin_url:'',
            facebook_url:'',
            twitter_url:'',
            image_data:'',
            bio:'',
            topic:'',
            currentDate:new Date().toISOString().split("T")[0],
        };
        req.flash("formdata",formdata);
    }
    var company_data =  await CompanyCategory.find().exec();
    $where = {event:req.params.event_id};
   

    let active = 'Event';
    let title = 'Add Speaker';
    let right_active = 'Speaker';
    let left_side = 'active';
    
    ///console.log('data');
    //console.log(data);
     res.render('speaker/add_speaker',{layout: 'layouts/eventLayout',active,title,right_active,left_side,formdata: req.flash('formdata'),event_id:req.params.event_id,company_data,errors:req.flash('errors'),reset:req.flash("reset")});
  }

module.exports.addSpeakerPost = (req,res)=>{

    var formdata = {event:req.params.event_id,first_name:req.body.first_name,last_name:req.body.last_name,dob:req.body.dob,experience:req.body.experience ,email:req.body.email,contact:req.body.contact,education:req.body.education,address:req.body.address,company_name:req.body.company_name,designation:req.body.designation,company_type:req.body.company_type,linkedin_url:req.body.linkedin_url,facebook_url:req.body.facebook_url,twitter_url:req.body.twitter_url,image_data:req.body.image_data,bio:req.body.bio,topic:req.body.topic};
    ///////////// Validate request//////////////////////////
    const errors = validationResult(req);
     
    let errorsData = {
        first_name:'',
        last_name:'',
        dob:'',
        email:'',
        contact:'',
        education:'',
        address:'',
        company_name:'',
        designation:'',
        company_type:'',
        experience:'',
        linkedin_url:'',
        facebook_url:'',
        twitter_url:'',
        image_data:'',
        bio:'',
        topic:'',
        currentDate:new Date().toISOString().split("T")[0],
            };
    if (errors.array().length > 0)
    { 
        errors.array().forEach((value)  => 
    {
        errorsData[value.param] = value.msg;    
    });

        req.flash("errors",errorsData); 
        req.flash("formdata",formdata); 
        return res.redirect('/add-speaker/'+req.params.event_id);
     }
    ////////////////////////////////////////////////////////////
    if(!req.body) {
        return res.status(400).send({
        message: "Note content can not be empty"
     });
    }


   
$where = {email:req.body.email};
User.findOne($where,function(err, user) 
    {
    //    if(user)
    //    {
    //     $message = {message:'Email already exist!'};
    //         req.flash('errors', $message);   
    //         req.flash("formdata",formdata); 
    //         return res.redirect('/add-speaker/'+req.params.event_id);
       
    //    }
    //    else{
        const random = uniqueRandom(99999999, 999999999999);
        var em = req.body.email;
        var password =random();
            // Create a Speaker
            const Users = new User({
            event:req.params.event_id,
            first_name:req.body.first_name,
            last_name:req.body.last_name,
            dob:req.body.dob,
            email:req.body.email.toLowerCase(),
            mobile_number:req.body.contact,
            education:req.body.education,
            address:req.body.address,
            company_name:req.body.company_name,
            designation:req.body.designation,
            company_type:req.body.company_type,
            experience:req.body.experience,
            linkedin_url:req.body.linkedin_url,
            facebook_url:req.body.facebook_url,
            twitter_url:req.body.twitter_url,
            bio:req.body.bio,
            role:6,
            status:1,
            password:md5(JSON.stringify(password)),
            // topic:req.body.topic,
            profile_img:req.body.image_data,
            created_at:created_date,
            updated_at:created_date
            });

            // Save Speakers in the database
            Users.save()
            .then(data => {
                if(req.body.email)
                {
                let templatePath  = path.join('./mail_template/');
                var compiled = ejs.compile(fs.readFileSync(path.resolve(templatePath + 'mail.html'),"utf8"));
                var html = compiled({
                    email: em,
                    password: password,
                    site_url: process.env.FRONT_URL,
                })
                Mail.sendMailer({email:em,body:html,subject:'Speaker Registration successfully'}); 
                }
                $message = {msg:'Speaker saved successfully!'};
                req.flash('errors', $message);    
                return res.redirect('/add-speaker/'+req.params.event_id);
            }).catch(err => {
                console.log(err);
                $message = {message:'Some error occurred!'};
                req.flash("formdata",formdata); 
                req.flash('errors', $message);  
                return res.redirect('/add-speaker/'+req.params.event_id);
            
            })
    // }
    });
 

}
   

module.exports.getSpeaker = async(req,res)=>{
    $where = {event:req.params.event_id,role:6};
   
    await User.find($where).sort({ _id: -1 }).exec(async(err,userObj) => {
        if(err){
          $message ={message:'Something went wrong'}
        req.flash("errors",$message)
        return res.redirect('/speaker-list/'+req.params.event_id);
        } 
        else{
            let data = userObj;
            let active = 'Event';
            let title = 'Speaker List';
            let right_active = 'Speaker';
            let left_side = 'active';
             return  res.render('speaker/speaker_list',{layout: 'layouts/eventLayout',event_id:req.params.event_id,active,title,right_active,left_side,data,moment:moment , errors:req.flash("errors"), message:req.flash("message")});
         
        }
      });
}



  

module.exports.editSpeaker = async(req,res)=>
{
    let id= req.params.id;
    let event_id= req.params.event_id;
    var company_data =  await CompanyCategory.find().exec()
    User.findOne({_id:id},function(err, user)
    { 
       if(err)
       {
          $message ={msg:'Something went wrong'}
          req.flash("errors",$message)
          return res.redirect('/edit-sponser/'+id+'/'+event_id);
       } 
       else
       {
          
          let data = user; 
          let active = 'Event';
          let title = 'Edit Speaker';
          let right_active = 'Speaker';
          let left_side = 'active';
          let currentDate = new Date().toISOString().split("T")[0];
         res.render('speaker/edit_speaker',{layout: 'layouts/eventLayout',currentDate,event_id,active,title,right_active,left_side,errors:req.flash("errors"),data,company_data});
        }
    });
}






module.exports.updateSpeaker = async (req,res)=>{
  
  let id = req.params.id;
  let event_id= req.params.event_id;
  ///////////// Validate request//////////////////////////
  const errors = validationResult(req);
 
  let errorsData = {
        first_name:'',
        last_name:'',
        dob:'',
        contact:'',
        education:'',
        address:'',
        company_name:'',
        designation:'',
        company_type:'',
        experience:'',
        linkedin_url:'',
        facebook_url:'',
        twitter_url:'',
        image_data:'',
        bio:'',
        topic:'',
  };
  if (errors.array().length > 0)
  { 
    errors.array().forEach((value)  => 
    {
      errorsData[value.param] = value.msg;    
    });

    req.flash("errors",errorsData); 
    return res.redirect('/edit-speaker/'+id+'/'+event_id);
 }
////////////////////////////////////////////////////////////
const isEmailExist =await User.findOne({
    email:req.body.email
})
// if(isEmailExist){
//     $message ={message:'Failed to speaker i.e. email already exist.".'}
//         req.flash("errors",$message)
//     errorsData.email = "Email already exist."
//     req.flash("errors",errorsData); 
//     return res.redirect('/edit-speaker/'+id+'/'+event_id);
// }
    if(!req.body) {
        return res.status(400).send({
        message: "Note content can not be empty"
    });
    }
    if(req.body.image_data)
    {
        var where = { 
            first_name:req.body.first_name,
            last_name:req.body.last_name,
            dob:req.body.dob,
            mobile_number:req.body.contact,
            education:req.body.education,
            address:req.body.address,
            company_name:req.body.company_name,
            designation:req.body.designation,
            company_type:req.body.company_type,
            experience:req.body.experience,
            linkedin_url:req.body.linkedin_url,
            facebook_url:req.body.facebook_url,
            twitter_url:req.body.twitter_url,
            bio:req.body.bio,
            // topic:req.body.topic,
            profile_img:req.body.image_data,
            updated_at:created_date};
    }
    else{
        var where = { 
            first_name:req.body.first_name,
            last_name:req.body.last_name,
            dob:req.body.dob,
            mobile_number:req.body.contact,
            education:req.body.education,
            address:req.body.address,
            company_name:req.body.company_name,
            designation:req.body.designation,
            company_type:req.body.company_type,
            experience:req.body.experience,
            linkedin_url:req.body.linkedin_url,
            facebook_url:req.body.facebook_url,
            twitter_url:req.body.twitter_url,
            bio:req.body.bio,
            topic:req.body.topic,
            updated_at:created_date};
    }
    User.findByIdAndUpdate({ _id: id },where,{new: true}, function(err, result) {
    if (err) {
        $message ={message:'Something went wrong'}
        req.flash("errors",$message)
        return res.redirect('/edit-speaker/'+id+'/'+event_id);
    } else {
        req.session.auth =result;
        $message ={msg:'Speaker updated successfully'}
        req.flash("errors",$message)
        return res.redirect('/edit-speaker/'+id+'/'+event_id);
    }
    });
}

module.exports.delete_speaker = (req,res)=>{
    
      User.findByIdAndRemove(req.params.id, (err,data)=> {
       if(typeof data == 'undefined' ){
        $message ={message:'Data not exist!'}
        req.flash("errors",$message)
        return res.redirect('/speaker-list/'+req.params.event_id);
        }
        if(err){
            $message ={message:'Something went wrong'}
            req.flash("errors",$message)
            return res.redirect('/speaker-list/'+req.params.event_id);
     }
        else{
          if(data){
            $message ={msg:'Speaker delete successfully'}
            req.flash("errors",$message)
            return res.redirect('/speaker-list/'+req.params.event_id);
          }
          }
     })
    
}
