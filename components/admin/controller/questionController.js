
var Question = require("../../../models/Question");
const timestamp = require('time-stamp');
created_date = timestamp.utc('YYYY-MM-DD HH:mm:ss');
var md5 = require('md5');
const { validationResult } = require ('express-validator');
var moment = require('moment');

module.exports.addQuestion = (req,res)=>{
  
    if(typeof req.flash('formdata')=='undefined')
    {
        var formdata = {
            question:'',
        };
        req.flash("formdata",formdata);
    }
    let event_id= req.params.event_id;
    let active = 'Event';
    let title = 'Add Question';
    let right_active = 'Question';
    let left_side = 'active';
     res.render('question/add_question',{layout: 'layouts/eventLayout',event_id,active,title,right_active,left_side,formdata: req.flash('formdata'),errors:req.flash('errors'),reset:req.flash("reset")});
}

module.exports.addQuestionPost = async(req,res)=>{

let form_d = req.body.form;
  let resolvedAllergy= await Promise.all(form_d.map(async item =>{
      if(item){
          if(item.question_type == "Textual")
          {
                return await Question.register({event_id:req.params.event_id,  question:item.question, type:item.question_type,created_at:created_date,updated_at:created_date}); 
          }
          else if(item.question_type == "Optional")
          {
            return await Question.register({event_id:req.params.event_id,  question:item.question, type:item. question_type, options:item.options ,created_at:created_date,updated_at:created_date}); 
          }
        
      }
  }))
  if(resolvedAllergy)
  {
    $message = {msg:'Question saved successfully!'};
        req.flash('errors', $message);    
        return res.redirect('/add-question/'+req.params.event_id);
        
  }
  else
  {
        $message = {message:'Some error occurred!'};
        req.flash('errors', $message);  
        return res.redirect('/add-question/'+req.params.event_id);
  }

}
   

module.exports.getQuestion = async(req,res)=>{

    await Question.find({event_id:req.params.event_id}).sort({_id: -1}).exec(function(err, userObj){ 
        if(err){
          $message ={message:'Something went wrong'}
        req.flash("errors",$message)
        return res.redirect('/question-list/'+req.params.event_id);
        } 
        else{
          console.log("question list ======================================",userObj )
            let data = userObj;
            let event_id= req.params.event_id;
            let active = 'Event';
            let title = 'Add Question';
            let right_active = 'Question';
            let left_side = 'active';
             return  res.render('question/question_list',{layout: 'layouts/eventLayout',event_id,active,title,right_active,left_side,data,moment , errors:req.flash("errors"), message:req.flash("message")});
         
        }
      });
}


module.exports.editQuestion = (req,res)=>
{
    let id= req.params.id;
    let event_id= req.params.event_id;
    Question.findOne({_id:id},function(err, user)
    { 
       if(err)
       {
          $message ={msg:'Something went wrong'}
          req.flash("errors",$message)
          return res.redirect('/edit-question/'+id+'/'+event_id);
       } 
       else
       {
            let data = user; 
            let active = 'Event';
            let title = 'Edit Question';
            let right_active = 'Question';
            let left_side = 'active';
           
            return  res.render('question/edit_question',{layout: 'layouts/eventLayout',event_id,data,active,title,right_active,left_side,data,moment , errors:req.flash("errors"), message:req.flash("message")});
        }
    });
}


module.exports.updateQuestion = (req,res)=>{
  
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
    if(req.body.question_type == 'Textual')
    {
        var where = { question:req.body.question};
    }
    else{
        var where = { question:req.body.question,options:req.body.options};
    }
    
    
    Question.findByIdAndUpdate({ _id: id },where,{new: true}, function(err, result) {
    if (err) {
        $message ={message:'Something went wrong'}
        req.flash("errors",$message)
        return res.redirect('/edit-question/'+id+'/'+event_id);
    } else {
        req.session.auth =result;
        $message ={msg:'Question updated successfully'}
        req.flash("errors",$message)
        return res.redirect('/edit-question/'+id+'/'+event_id);
    }
    });
}


module.exports.deleteQuestion = async(req,res)=>{
    let id = req.params.id;
  let event_id = req.params.event_id;
    await Question.findOne({ '_id':  id}).exec((err,data)=>{
      if(typeof data == 'undefined' || !data){
            $message ={message:'Question does not exist!'}
            req.flash("errors",$message)
            return res.redirect('/question-list/'+event_id);
       }
        if(err){
            $message ={message:'Something went wrong'}
            req.flash("errors",$message)
            return res.redirect('/question-list/'+event_id);
        }else{
  
            
          Patient.findByIdAndUpdate({_id:id},data)
          .then(async data => {
            $message ={msg:'Question Deleted successfully'}
            req.flash("errors",$message)
            return res.redirect('/question-list/'+event_id);
          }).catch(function(err){
           
          })
            
            
        }
  
    })
  
  }

   

