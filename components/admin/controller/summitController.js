
var Summit = require("../../../models/Summit");
var RewardsCategory = require("../../../models/rewardCategory");

const timestamp = require('time-stamp');
created_date = timestamp.utc('YYYY-MM-DD HH:mm:ss');
var md5 = require('md5');
const { validationResult } = require ('express-validator');
var moment = require('moment');

const addSummit = (req,res)=>{
  
    if(typeof req.flash('formdata')=='undefined')
    {
        var formdata = {
            description:'',
        };
        req.flash("formdata",formdata);
    }
    let event_id= req.params.event_id;
    let active = 'Event';
    let title = 'Add Summit';
    let right_active = 'Summit';
    let left_side = 'active';
     res.render('summit/add_summit',{layout: 'layouts/eventLayout',event_id,active,title,right_active,left_side,formdata: req.flash('formdata'),errors:req.flash('errors'),reset:req.flash("reset")});
}

const addSummitPost = async(req,res)=>{

let form_d = req.body.form;
  let resolvedAllergy= await Promise.all(form_d.map(async item =>{
      if(item.description){
                return await Summit.register({event_id:req.params.event_id,  description:item.description, point:item.point,created_at:created_date,updated_at:created_date}); 
      }
  }))
  if(resolvedAllergy)
  {
    $message = {msg:'Summit quest saved successfully!'};
        req.flash('errors', $message);    
        return res.redirect('/add-summit/'+req.params.event_id);      
  }
  else
  {
        $message = {message:'Some error occurred!'};
        req.flash('errors', $message);  
        return res.redirect('/add-summit/'+req.params.event_id);
  }

}
   

const getSummit = async(req,res)=>{
    await RewardsCategory.find({event:req.params.event_id},function(err, userObj){ 
        if(err){
          $message ={message:'Something went wrong'}
        req.flash("errors",$message)
        return res.redirect('/summit-list/'+req.params.event_id);
        } 
        else{
            let data = userObj;
            let event_id= req.params.event_id;
            let active = 'Event';
            let title = 'Summit list';
            let right_active = 'Summit';
            let left_side = 'active';
             return  res.render('summit/summit_list',{layout: 'layouts/eventLayout',event_id,active,title,right_active,left_side,data,moment , errors:req.flash("errors"), message:req.flash("message")});
         
        }
      });
}


const editSummit = (req,res)=>
{
    let id= req.params.id;
    let event_id= req.params.event_id;
    RewardsCategory.findOne({_id:id},function(err, user)
    { 
       if(err)
       {
          $message ={msg:'Something went wrong'}
          req.flash("errors",$message)
          return res.redirect('/edit-summit/'+id+'/'+event_id);
       } 
       else
       {
            let data = user; 
            let active = 'Event';
            let title = 'Edit Summit';
            let right_active = 'Summit';
            let left_side = 'active';
           console.log('wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww')
           console.log(user)
            return  res.render('summit/edit_summit',{layout: 'layouts/eventLayout',event_id,data,active,title,right_active,left_side,data,moment , errors:req.flash("errors")});
        }
    });
}

const updateSummit = (req,res)=>{
  
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
    
    var data = { rewardPoints:req.body.rewardPoints};
    RewardsCategory.findByIdAndUpdate({ _id: id },data,{new: true}, function(err, result) {
    if (err) {
        $message ={message:'Something went wrong'}
        req.flash("errors",$message)
        return res.redirect('/edit-summit/'+id+'/'+event_id);
    } else {
        req.session.auth =result;
        $message ={msg:'Summit quest updated successfully'}
        req.flash("errors",$message)
        return res.redirect('/edit-summit/'+id+'/'+event_id);
    }
    });
}

const delete_summit = (req,res)=>{
    
    Summit.findByIdAndRemove(req.params.id, (err,data)=> {
     if(typeof data == 'undefined' ){
      $message ={message:'Data not exist!'}
      req.flash("errors",$message)
      return res.redirect('/summit-list/'+req.params.event_id);
      }
      if(err){
          $message ={message:'Something went wrong'}
          req.flash("errors",$message)
          return res.redirect('/summit-list/'+req.params.event_id);
   }
      else{
        if(data){
          $message ={msg:'Summit delete successfully'}
          req.flash("errors",$message)
          return res.redirect('/summit-list/'+req.params.event_id);
        }
        }
   })
  
}

   

module.exports = {
  addSummit,
  addSummitPost,
  getSummit,
  editSummit,
  updateSummit,
  delete_summit
}