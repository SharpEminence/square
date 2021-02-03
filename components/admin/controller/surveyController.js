
var Survey = require("../../../models/Survey");
const timestamp = require('time-stamp');
created_date = timestamp.utc('YYYY-MM-DD HH:mm:ss');
var md5 = require('md5');
const { validationResult } = require ('express-validator');
var moment = require('moment');

const addSurvey = (req,res)=>{
  
    if(typeof req.flash('formdata')=='undefined')
    {
        var formdata = {
            question:'',
        };
        req.flash("formdata",formdata);
    }
    let event_id= req.params.event_id;
    let active = 'Event';
    let title = 'Add Survey';
    let right_active = 'Survey';
    let left_side = 'active';
     res.render('survey/add_survey',{layout: 'layouts/eventLayout',event_id,active,title,right_active,left_side,formdata: req.flash('formdata'),errors:req.flash('errors')});
}

const addSurveyPost = async(req,res)=>{

let form_d = req.body.form;
  let resolvedAllergy= await Promise.all(form_d.map(async item =>{
      if(item){
          
            return await Survey.register({event_id:req.params.event_id,  question:item.question,created_at:created_date,updated_at:created_date}); 
      }
  }))
  if(resolvedAllergy)
  {
    $message = {msg:'Survey question saved successfully!'};
        req.flash('errors', $message);    
        return res.redirect('/add-survey/'+req.params.event_id);
  }
  else
  {
        $message = {message:'Some error occurred!'};
        req.flash('errors', $message);  
        return res.redirect('/add-survey/'+req.params.event_id);
  }

}
   

const getSurvey = async(req,res)=>{
    await Survey.find({event_id:req.params.event_id},function(err, userObj){ 
        if(err){
          $message ={message:'Something went wrong'}
        req.flash("errors",$message)
        return res.redirect('/survey-list/'+req.params.event_id);
        } 
        else{
            let data = userObj;
            let event_id= req.params.event_id;
            let active = 'Event';
            let title = 'Survey Question list';
            let right_active = 'Survey';
            let left_side = 'active';
             return  res.render('survey/survey_list',{layout: 'layouts/eventLayout',event_id,active,title,right_active,left_side,data,moment , errors:req.flash("errors"), message:req.flash("message")});
        }
      });
}


const editSurvey = (req,res)=>
{
    let id= req.params.id;
    let event_id= req.params.event_id;
    Survey.findOne({_id:id},function(err, user)
    {
       if(err)
       {
          $message ={msg:'Something went wrong'}
          req.flash("errors",$message)
          return res.redirect('/edit-survey/'+id+'/'+event_id);
       } 
       else
       {
            let data = user; 
            let active = 'Event';
            let title = 'Edit Survey';
            let right_active = 'Survey';
            let left_side = 'active';
           
            return  res.render('survey/edit_survey',{layout: 'layouts/eventLayout',event_id,data,active,title,right_active,left_side,data,moment , errors:req.flash("errors")});
        }
    });
}


const updateSurvey = (req,res)=>{
  
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


    var data = { question:req.body.question};
    Survey.findByIdAndUpdate({ _id: id },data,{new: true}, function(err, result) {
    if (err) {
        $message ={message:'Something went wrong'}
        req.flash("errors",$message)
        return res.redirect('/edit-survey/'+id+'/'+event_id);
    } else {
        req.session.auth =result;
        $message ={msg:'Survey updated successfully'}
        req.flash("errors",$message)
        return res.redirect('/edit-survey/'+id+'/'+event_id);
    }
    });
}


const delete_survey = (req,res)=>{
    
    Survey.findByIdAndRemove(req.params.id, (err,data)=> {
     if(typeof data == 'undefined' ){
      $message ={message:'Data not exist!'}
      req.flash("errors",$message)
      return res.redirect('/survey-list/'+req.params.event_id);
      }
      if(err){
          $message ={message:'Something went wrong'}
          req.flash("errors",$message)
          return res.redirect('/survey-list/'+req.params.event_id);
   }
      else{
        if(data){
          $message ={msg:'Survey delete successfully'}
          req.flash("errors",$message)
          return res.redirect('/survey-list/'+req.params.event_id);
        }
        }
   })
  
}

   
module.exports ={
    addSurvey,
    addSurveyPost,
    getSurvey,
    editSurvey,
    updateSurvey,
    delete_survey
}
