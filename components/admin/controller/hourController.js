var User = require("../../../models/User");
var MembershipType = require("../../../models/MembershipType");
var CompanyCategory = require("../../../models/CompanyCategory");
var SponsorHour = require("../../../models/SponsorHour");

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


module.exports.addHour = async(req,res)=>{
  // 1 for admin , 2 for client, 3 for front users , 4 for sponsers, 5 for speaker
    if(typeof req.flash('formdata')=='undefined')
    {
        var data = {
            conference_date:'',
            booth:'',
            title:'',
            start_time:'',
            google_meet:'',
            // game_code:'',
        };
        req.flash("data",data);
    }
    let event_id= req.params.event_id;
    var company_data =  await CompanyCategory.find().sort({ category: 1 }).exec();
    var event =  await Event.find().exec();
    let active = 'Event';
    let title = 'Add Booth Hour';
    let right_active = 'Hour';
    let left_side = 'active';
     res.render('booth_hour/add_hour',{layout: 'layouts/eventLayout',event_id,active,title,right_active,left_side,event,company_data,data: req.flash('data'),errors:req.flash('errors'),reset:req.flash("reset")});
}

module.exports.addHourPost = (req,res)=>{

    var data = {event:req.params.event_id,conference_date:req.body.conference_date,booth:req.body.booth,title:req.body.title ,start_time:req.body.start_time,google_meet:req.body.google_meet};
    ///////////// Validate request//////////////////////////
    const errors = validationResult(req);
     
    let errorsData = {
        conference_date:'',
        booth:'',
        title:'',
        start_time:'',
        google_meet:'',
    };

    if (errors.array().length > 0)
    { 
        errors.array().forEach((value)  => 
    {
        errorsData[value.param] = value.msg;    
    });

        req.flash("errors",errorsData); 
        req.flash("data",data); 
        return res.redirect('/add-sponser/'+req.params.event_id);
    }
    ////////////////////////////////////////////////////////////
    if(!req.body) {
        return res.status(400).send({
        message: "Note content can not be empty"
     });
    }

      // Create a SponsorHour
      const SponsorHours = new SponsorHour({
        event: req.params.event_id,
        booth: req.body.booth,
        conference_date: req.body.conference_date,
        start_time: req.body.start_time,
        google_meet: req.body.google_meet,
        title: req.body.title,
        created_at: created_date,
        updated_at: created_date,
      });
      SponsorHours.save()
    .then(data => {
        $message = {msg:'Hour saved successfully!'};
        req.flash('errors', $message);    
        return res.redirect('/add-hour/'+req.params.event_id);
    }).catch(err => {
        console.log(err);
        $message = {message:'Some error occurred!'};
        req.flash("data",data); 
        req.flash('errors', $message);  
        return res.redirect('/add-hour/'+req.params.event_id);
    
    })
 
 

}
   

module.exports.getBoothhour = async(req,res)=>{
    $where = {event:req.params.event_id};
    var event =  await Event.find().exec();
    await SponsorHour.find($where).populate('booth').sort({ _id: -1 }).exec(async(err,userObj) => {
        if(err){
          $message ={message:'Something went wrong'}
        req.flash("errors",$message)
        return res.redirect('/hour-list/'+req.params.event_id);
        } 
        else{
            console.log(userObj);
            let data = userObj;
            let active = 'Event';
            let title = 'Booth hour List';
            let right_active = 'Hour';
            let left_side = 'active';
             return  res.render('booth_hour/hour_list',{layout: 'layouts/eventLayout',event_id:req.params.event_id,active,title,right_active,left_side,data,event,moment:moment , errors:req.flash("errors"), message:req.flash("message")});
         
        }
      });
}

module.exports.editHour = async(req,res)=>
{
    let id= req.params.id;
    let event_id= req.params.event_id;
    var membership_data =  await MembershipType.find().exec();
    var event =  await Event.find().exec();
    var company_data =  await CompanyCategory.find().exec()
    SponsorHour.findOne({_id:id},function(err, user)
    { 
       if(err)
       {
          $message ={msg:'Something went wrong'}
          req.flash("errors",$message)
          return res.redirect('/edit-hour/'+id+'/'+event_id);
       } 
       else
       {
          
          let data = user; 
          let active = 'Event';
          let title = 'Edit Booth Hour';
          let right_active = 'Hour';
          let left_side = 'active';
         res.render('booth_hour/edit_hour',{layout: 'layouts/eventLayout',event_id,active,title,right_active,left_side,errors:req.flash("errors"),data,membership_data,event,company_data});
        }
    });
}






module.exports.updateHour = async (req,res)=>{
  
  let id = req.params.id;
  let event_id= req.params.event_id;
  ///////////// Validate request//////////////////////////
  const errors = validationResult(req);
 
  let errorsData = {
    conference_date:'',
        booth:'',
        start_time:'',
        google_meet:'',
  };
  if (errors.array().length > 0)
  { 
    errors.array().forEach((value)  => 
    {
      errorsData[value.param] = value.msg;    
    });

    req.flash("errors",errorsData); 
    return res.redirect('/edit-hour/'+id+'/'+event_id);
 }
////////////////////////////////////////////////////////////

    if(!req.body) {
        return res.status(400).send({
        message: "Note content can not be empty"
    });
    }
    var where = { 
        booth: req.body.booth,
        conference_date: req.body.conference_date,
        start_time: req.body.start_time,
        title: req.body.title,
        google_meet: req.body.google_meet};

    SponsorHour.findByIdAndUpdate({ _id: id },where,{new: true}, function(err, result) {
    if (err) {
        $message ={message:'Something went wrong'}
        req.flash("errors",$message)
        return res.redirect('/edit-hour/'+id+'/'+event_id);
    } else {
        req.session.auth =result;
        $message ={msg:'Booth Hour updated successfully'}
        req.flash("errors",$message)
        return res.redirect('/edit-hour/'+id+'/'+event_id);
    }
    });
}


module.exports.delete_hour = (req,res)=>{
    
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