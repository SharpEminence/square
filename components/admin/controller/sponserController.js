var User = require("../../../models/User");
var MembershipType = require("../../../models/MembershipType");
var CompanyCategory = require("../../../models/CompanyCategory");
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


module.exports.addSponser = async(req,res)=>{
  // 1 for admin , 2 for client, 3 for front users , 4 for sponsers, 5 for speaker
    if(typeof req.flash('formdata')=='undefined')
    {
        var formdata = {
            membership:'',
            sponsor_name:'',
            company_name:'',
            category:'',
            email:'',
            address:'',
            sponsor_link:'',
            demo_link:'',
            deck_link:'',
            employees:'',
            lounge_title:'',
            lounge_type:'',
            description:'',
            image_data:'',
            space_code:'',
            // game_code:'',
        };
        req.flash("formdata",formdata);
    }
    let event_id= req.params.event_id;
    var data =  await MembershipType.find().exec();
    var company_data =  await CompanyCategory.find().sort({ category: 1 }).exec();
    var event =  await Event.find().exec();
    let active = 'Event';
    let title = 'Add Sponsor';
    let right_active = 'Sponsor';
    let left_side = 'active';
     res.render('sponser/add_sponser',{layout: 'layouts/eventLayout',event_id,active,title,right_active,left_side,data,event,company_data,formdata: req.flash('formdata'),errors:req.flash('errors'),reset:req.flash("reset")});
}

module.exports.addSponserPost = (req,res)=>{

    var formdata = {event:req.params.event_id,membership:req.body.membership,sponsor_name:req.body.sponsor_name ,company_name:req.body.company_name,category:req.body.category,email:req.body.email,address:req.body.address,sponsor_link:req.body.sponsor_link,demo_link:req.body.demo_link,deck_link:req.body.deck_link,employees:req.body.employees,lounge_title:req.body.lounge_title,lounge_type:req.body.lounge_type,description:req.body.description,image_data:req.body.image_data,space_code:req.body.space_code};
    ///////////// Validate request//////////////////////////
    const errors = validationResult(req);
     
    let errorsData = {
        membership:'',
        sponsor_name:'',
        company_name:'',
        booth:'',
        email:'',
        address:'',
        employees:'',
        sponsor_link:'',
        
        demo_link:'',
        deck_link:'',
        lounge_title:'',
        lounge_type:'',
        description:'',
        image_data:'',
        space_code:'',
        // game_code:'',
    };

    if (errors.array().length > 0)
    { 
        errors.array().forEach((value)  => 
    {
        errorsData[value.param] = value.msg;    
    });

        req.flash("errors",errorsData); 
        req.flash("formdata",formdata); 
        return res.redirect('/add-sponser/'+req.params.event_id);
    }
    ////////////////////////////////////////////////////////////
    if(!req.body) {
        return res.status(400).send({
        message: "Note content can not be empty"
     });
    }


   
        // const random = uniqueRandom(99999999, 999999999);
        // // console.log("random=========================================================>",random)
        // var password =random();
        // // console.log("password=========================================================>",password)
        // // console.log("type password=========================================================>",typeof password)
        // // console.log("md5 password=========================================================>",md5(password))
        // // console.log("md5 password=========================================================>",md5(JSON.stringify(password)))
        

            // Create a User
    const Users = new User({
       event:req.params.event_id,
       sponsor_name:req.body.sponsor_name,
       booth:req.body.booth,
       role:4,
       status:1,
       password_reset_code:0,
       created_at:created_date,
       updated_at:created_date
    });

    if(req.body.hyperlink1)
    {
        Users.hyperlink1=req.body.hyperlink1;
    }
    if(req.body.image_data)
    {
        Users.profile_img=req.body.image_data;
    }
// console.log(Users);
            // Save User in the database
            Users.save()
            .then(data => {
                // let templatePath  = path.join('./mail_template/');
                // var compiled = ejs.compile(fs.readFileSync(path.resolve(templatePath + 'mail.html'),"utf8"));
                // var html = compiled({
                //     email: data.email,
                //     password: password,
                //     site_url: process.env.FRONT_URL,
                // })
                // Mail.sendMailer({email:data.email,body:html,subject:'Sponsor Registration successfully'}); 
                $message = {msg:'Partner saved successfully!'};
                req.flash('errors', $message);    
                return res.redirect('/add-sponser/'+req.params.event_id);
            }).catch(err => {
                console.log(err);
                $message = {message:'Some error occurred!'};
                req.flash("formdata",formdata); 
                req.flash('errors', $message);  
                return res.redirect('/add-sponser/'+req.params.event_id);
            
            })
 
 

}
   

module.exports.getSponser = async(req,res)=>{
    $where = {event:req.params.event_id,role:4};
    var event =  await Event.find().exec();
    await User.find($where).populate('event').sort({ _id: -1 }).exec(async(err,userObj) => {
        if(err){
          $message ={message:'Something went wrong'}
        req.flash("errors",$message)
        return res.redirect('/sponser-list/'+req.params.event_id);
        } 
        else{
            let data = userObj;
            let active = 'Event';
            let title = 'Sponsor List';
            let right_active = 'Sponsor';
            let left_side = 'active';
             return  res.render('sponser/sponser_list',{layout: 'layouts/eventLayout',event_id:req.params.event_id,active,title,right_active,left_side,data,event,moment:moment , errors:req.flash("errors"), message:req.flash("message")});
         
        }
      });
}

module.exports.editSponser = async(req,res)=>
{
    let id= req.params.id;
    let event_id= req.params.event_id;
    var membership_data =  await MembershipType.find().exec();
    var event =  await Event.find().exec();
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
          let title = 'Edit Sponsor';
          let right_active = 'Sponsor';
          let left_side = 'active';
         res.render('sponser/edit_sponser',{layout: 'layouts/eventLayout',event_id,active,title,right_active,left_side,errors:req.flash("errors"),data,membership_data,event,company_data});
        }
    });
}






module.exports.updateSponser = async (req,res)=>{
  
  let id = req.params.id;
  let event_id= req.params.event_id;
  ///////////// Validate request//////////////////////////
  const errors = validationResult(req);
 
  let errorsData = {
    membership:'',
    sponsor_name:'',
    company_name:'',
    category:'',
    email:'',
    address:'',
    sponsor_link:'',
        demo_link:'',
        deck_link:'',
    employees:'',
    lounge_title:'',
    lounge_type:'',
    description:'',
    space_code:'',
    // game_code:'',
  };
  if (errors.array().length > 0)
  { 
    errors.array().forEach((value)  => 
    {
      errorsData[value.param] = value.msg;    
    });

    req.flash("errors",errorsData); 
    return res.redirect('/edit-sponser/'+id+'/'+event_id);
 }
////////////////////////////////////////////////////////////

    if(!req.body) {
        return res.status(400).send({
        message: "Note content can not be empty"
    });
    }

    // const isEmailExist =await User.findOne({
    //     email:req.body.email,
    //     _id: { $ne: req.params.id }
    // })
    // if(isEmailExist){
    //     $message ={message:'Email already exist!'}
    //     req.flash("errors",$message)
    //     return res.redirect('/edit-sponser/'+id+'/'+event_id);
    // }


    // if (Array.isArray(req.body.image_data) == true && req.body.image_data.length > 4) {
    //     console.log(req.body.image_data.length);
    //     $message = { message: 'Max upload 4 images!' };
    //     req.flash('errors', $message);
    //     return res.redirect('/edit-sponser/'+id+'/'+event_id);

    //   }
    
        var where = { 
            sponsor_name:req.body.sponsor_name,
            booth:req.body.booth};


            if (req.body.hyperlink1) {
                where.hyperlink1 = req.body.hyperlink1;
            }
   
            if (req.body.image_data) {
                where.profile_img = req.body.image_data;
            }
   
    User.findByIdAndUpdate({ _id: id },where,{new: true}, function(err, result) {
    if (err) {
        $message ={message:'Something went wrong'}
        req.flash("errors",$message)
        return res.redirect('/edit-sponser/'+id+'/'+event_id);
    } else {
        req.session.auth =result;
        $message ={msg:'Partner updated successfully'}
        req.flash("errors",$message)
        return res.redirect('/edit-sponser/'+id+'/'+event_id);
    }
    });
}


module.exports.delete_sponsor = (req,res)=>{
    
    User.findByIdAndRemove(req.params.id, (err,data)=> {
     if(typeof data == 'undefined' ){
      $message ={message:'Data not exist!'}
      req.flash("errors",$message)
      return res.redirect('/sponser-list/'+req.params.event_id);
      }
      if(err){
          $message ={message:'Something went wrong'}
          req.flash("errors",$message)
          return res.redirect('/sponser-list/'+req.params.event_id);
   }
      else{
        if(data){
          $message ={msg:'Sponsor delete successfully'}
          req.flash("errors",$message)
          return res.redirect('/sponser-list/'+req.params.event_id);
        }
        }
   })
  
}