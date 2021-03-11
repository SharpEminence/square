
var Faq = require("../../../models/Faq");
const timestamp = require('time-stamp');
created_date = timestamp.utc('YYYY-MM-DD HH:mm:ss');
var md5 = require('md5');
const { validationResult } = require ('express-validator');
var moment = require('moment');

const addFaq = (req,res)=>{
  
    if(typeof req.flash('formdata')=='undefined')
    {
        var formdata = {
            question:'',
            answer:'',
        };
        req.flash("formdata",formdata);
    }
    let event_id= req.params.event_id;
    let active = 'Event';
    let title = 'Add Faq';
    let right_active = 'Faq';
    let left_side = 'active';
     res.render('faq/add_faq',{layout: 'layouts/eventLayout',event_id,active,title,right_active,left_side,formdata: req.flash('formdata'),errors:req.flash('errors')});
}

const addFaqPost = async(req,res)=>{

let form_d = req.body.form;
  let resolvedAllergy= await Promise.all(form_d.map(async item =>{
      if(item){
          
            return await Faq.register({event_id:req.params.event_id,  question:item.question,answer:item.answer,created_at:created_date,updated_at:created_date}); 
      }
  }))
  if(resolvedAllergy)
  {
    $message = {msg:'Faq question saved successfully!'};
        req.flash('errors', $message);    
        return res.redirect('/add-faq/'+req.params.event_id);
  }
  else
  {
        $message = {message:'Some error occurred!'};
        req.flash('errors', $message);  
        return res.redirect('/add-faq/'+req.params.event_id);
  }

}
   

const getFaq = async(req,res)=>{
    await Faq.find({event_id:req.params.event_id},function(err, userObj){ 
        if(err){
          $message ={message:'Something went wrong'}
        req.flash("errors",$message)
        return res.redirect('/faq-list/'+req.params.event_id);
        } 
        else{
            let data = userObj;
            let event_id= req.params.event_id;
            let active = 'Event';
            let title = 'Faq Question list';
            let right_active = 'Faq';
            let left_side = 'active';
             return  res.render('faq/faq_list',{layout: 'layouts/eventLayout',event_id,active,title,right_active,left_side,data,moment , errors:req.flash("errors")});
        }
      });
}


const editFaq = (req,res)=>
{
    let id= req.params.id;
    let event_id= req.params.event_id;
    Faq.findOne({_id:id},function(err, user)
    {
       if(err)
       {
          $message ={msg:'Something went wrong'}
          req.flash("errors",$message)
          return res.redirect('/edit-faq/'+id+'/'+event_id);
       } 
       else
       {
            let data = user; 
            let active = 'Event';
            let title = 'Edit Faq';
            let right_active = 'Faq';
            let left_side = 'active';
           
            return  res.render('faq/edit_faq',{layout: 'layouts/eventLayout',event_id,data,active,title,right_active,left_side,data,moment , errors:req.flash("errors")});
        }
    });
}


const updateFaq = (req,res)=>{
  
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


    var data = { question:req.body.question,answer:req.body.answer};
    Faq.findByIdAndUpdate({ _id: id },data,{new: true}, function(err, result) {
    if (err) {
        $message ={message:'Something went wrong'}
        req.flash("errors",$message)
        return res.redirect('/edit-faq/'+id+'/'+event_id);
    } else {
        req.session.auth =result;
        $message ={msg:'Faq updated successfully'}
        req.flash("errors",$message)
        return res.redirect('/edit-faq/'+id+'/'+event_id);
    }
    });
}

const delete_faq = (req,res)=>{
    
    Faq.findByIdAndRemove(req.params.id, (err,data)=> {
     if(typeof data == 'undefined' ){
      $message ={message:'Data not exist!'}
      req.flash("errors",$message)
      return res.redirect('/faq-list/'+req.params.event_id);
      }
      if(err){
          $message ={message:'Something went wrong'}
          req.flash("errors",$message)
          return res.redirect('/faq-list/'+req.params.event_id);
   }
      else{
        if(data){
          $message ={msg:'Faq delete successfully'}
          req.flash("errors",$message)
          return res.redirect('/faq-list/'+req.params.event_id);
        }
        }
   })
  
}

   
module.exports ={
    addFaq,
    addFaqPost,
    getFaq,
    editFaq,
    updateFaq,
    delete_faq
}
