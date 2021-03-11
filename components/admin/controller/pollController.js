
var Poll = require("../../../models/Poll");
const timestamp = require('time-stamp');
created_date = timestamp.utc('YYYY-MM-DD HH:mm:ss');
var md5 = require('md5');
const { validationResult } = require ('express-validator');
var moment = require('moment');

module.exports.addPoll = (req,res)=>{
  
    if(typeof req.flash('formdata')=='undefined')
    {
        var formdata = {
            question:'',
            options:'',
        };
        req.flash("formdata",formdata);
    }
    let event_id= req.params.event_id;
    let active = 'Event';
    let title = 'Add Poll';
    let right_active = 'Poll';
    let left_side = 'active';
     res.render('poll/add_poll',{layout: 'layouts/eventLayout',event_id,active,title,right_active,left_side,formdata: req.flash('formdata'),errors:req.flash('errors')});
}

module.exports.addPollPost = async(req,res)=>{

let form_d = req.body.form;
  let resolvedAllergy= await Promise.all(form_d.map(async item =>{
      if(item){
          
            return await Poll.register({event_id:req.params.event_id,  question:item.question, options:item.options ,created_at:created_date,updated_at:created_date}); 
      }
  }))
  if(resolvedAllergy)
  {
    $message = {msg:'Poll question saved successfully!'};
        req.flash('errors', $message);    
        return res.redirect('/add-poll/'+req.params.event_id);
  }
  else
  {
        $message = {message:'Some error occurred!'};
        req.flash('errors', $message);  
        return res.redirect('/add-poll/'+req.params.event_id);
  }

}
   

module.exports.getPoll = async(req,res)=>{
    await Poll.find({event_id:req.params.event_id},function(err, userObj){ 
        if(err){
          $message ={message:'Something went wrong'}
        req.flash("errors",$message)
        return res.redirect('/poll-list/'+req.params.event_id);
        } 
        else{
            let data = userObj;
            let event_id= req.params.event_id;
            let active = 'Event';
            let title = 'Poll Question list';
            let right_active = 'Poll';
            let left_side = 'active';
             return  res.render('poll/poll_list',{layout: 'layouts/eventLayout',event_id,active,title,right_active,left_side,data,moment , errors:req.flash("errors"), message:req.flash("message")});
        }
      });
}


module.exports.editPoll = (req,res)=>
{
    let id= req.params.id;
    let event_id= req.params.event_id;
    Poll.findOne({_id:id},function(err, user)
    {
       if(err)
       {
          $message ={msg:'Something went wrong'}
          req.flash("errors",$message)
          return res.redirect('/edit-poll/'+id+'/'+event_id);
       } 
       else
       {
            let data = user; 
            let active = 'Event';
            let title = 'Edit Poll';
            let right_active = 'Poll';
            let left_side = 'active';
           
            return  res.render('poll/edit_poll',{layout: 'layouts/eventLayout',event_id,data,active,title,right_active,left_side,data,moment , errors:req.flash("errors")});
        }
    });
}


module.exports.updatePoll = (req,res)=>{
  
  let id = req.params.id;
  let event_id = req.params.event_id;
  ///////////// Validate request//////////////////////////
  console.log(req.body)
////////////////////////////////////////////////////////////
    if(!req.body) {
        return res.status(400).send({
        message: "Note content can not be empty"
    });
    }


    var where = { question:req.body.question,options:req.body.options};
    Poll.findByIdAndUpdate({ _id: id },where,{new: true}, function(err, result) {
    if (err) {
        $message ={message:'Something went wrong'}
        req.flash("errors",$message)
        return res.redirect('/edit-poll/'+id+'/'+event_id);
    } else {
        req.session.auth =result;
        $message ={msg:'Poll updated successfully'}
        req.flash("errors",$message)
        return res.redirect('/edit-poll/'+id+'/'+event_id);
    }
    });
}

module.exports.deletePoll = (req,res)=>{
    
    Poll.findByIdAndRemove(req.params.id, (err,data)=> {
     if(typeof data == 'undefined' ){
      $message ={message:'Data not exist!'}
      req.flash("errors",$message)
      return res.redirect('/poll-list/'+req.params.event_id);
      }
      if(err){
          $message ={message:'Something went wrong'}
          req.flash("errors",$message)
          return res.redirect('/poll-list/'+req.params.event_id);
   }
      else{
        if(data){
          $message ={msg:'Poll question delete successfully'}
          req.flash("errors",$message)
          return res.redirect('/poll-list/'+req.params.event_id);
        }
        }
   })
  
  }

   

