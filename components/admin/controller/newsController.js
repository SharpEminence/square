var New = require("../../../models/New");

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


const addnews = (req,res)=>{
  // 1 for admin , 2 for client, 3 for front users , 4 for sponsers, 5 for speaker
    if(typeof req.flash('formdata')=='undefined')
    {
        var data = {
            title:'',
            description:'',
            image_data:'',
        };
        req.flash("data",data);
    }
    let event_id= req.params.event_id;
    let active = 'Event';
    let title = 'Add News';
    let right_active = 'News';
    let left_side = 'active';
     res.render('news/add_news',{layout: 'layouts/eventLayout',event_id,active,title,right_active,left_side,data: req.flash('data'),errors:req.flash('errors'),reset:req.flash("reset")});
}

const addNewsPost = (req,res)=>{

    var data = {event:req.params.event_id,title:req.body.title,description:req.body.description,image_data:req.body.image_data};
    ///////////// Validate request//////////////////////////
    const errors = validationResult(req);
     
    let errorsData = {
        title:'',
        description:'',
        image_data:'',
    };

    if (errors.array().length > 0)
    { 
        errors.array().forEach((value)  => 
    {
        errorsData[value.param] = value.msg;    
    });

        req.flash("errors",errorsData); 
        req.flash("data",data); 
        return res.redirect('/add-news/'+req.params.event_id);
    }
    ////////////////////////////////////////////////////////////
    if(!req.body) {
        return res.status(400).send({
        message: "Note content can not be empty"
     });
    }

    // Create a news
    const News = new New({
    event:req.params.event_id,
    title:req.body.title,
    description:req.body.description,
    image:req.body.image_data,
    created_at:created_date,
    updated_at:created_date
    });

    // Save User in the database
    News.save()
    .then(data => {
        
        $message = {msg:'News saved successfully!'};
        req.flash('errors', $message);    
        return res.redirect('/add-news/'+req.params.event_id);
    }).catch(err => {
        console.log(err);
        $message = {message:'Some error occurred!'};
        req.flash("data",data); 
        req.flash('errors', $message);  
        return res.redirect('/add-news/'+req.params.event_id);

    })

    
 

}
   

const getNews = async(req,res)=>{
    $where = {event:req.params.event_id};
    await New.find($where).exec(async(err,userObj) => {
        if(err){
          $message ={message:'Something went wrong'}
        req.flash("errors",$message)
        return res.redirect('/news-list/'+req.params.event_id);
        } 
        else{
            let data = userObj;
            let active = 'Event';
            let title = 'News List';
            let right_active = 'News';
            let left_side = 'active';
             return  res.render('news/news_list',{layout: 'layouts/eventLayout',event_id:req.params.event_id,active,title,right_active,left_side,data,moment:moment , errors:req.flash("errors"), message:req.flash("message")});
         
        }
      });
}

const editNews = async(req,res)=>
{
    let id= req.params.id;
    let event_id= req.params.event_id;
    New.findOne({_id:id},function(err, user)
    { 
       if(err)
       {
          $message ={msg:'Something went wrong'}
          req.flash("errors",$message)
          return res.redirect('/edit-news/'+id+'/'+event_id);
       } 
       else
       {
          
          let data = user; 
          let active = 'Event';
          let title = 'Edit News';
          let right_active = 'News';
          let left_side = 'active';
         res.render('news/edit_news',{layout: 'layouts/eventLayout',event_id,active,title,right_active,left_side,errors:req.flash("errors"),data});
        }
    });
}






const updateNews = (req,res)=>{
  
  let id = req.params.id;
  let event_id= req.params.event_id;
  ///////////// Validate request//////////////////////////
  const errors = validationResult(req);
 
  let errorsData = {
    title:'',
    description:'',
    image_data:'',
  };
  if (errors.array().length > 0)
  { 
    errors.array().forEach((value)  => 
    {
      errorsData[value.param] = value.msg;    
    });

    req.flash("errors",errorsData); 
    return res.redirect('/edit-news/'+id+'/'+event_id);
 }
////////////////////////////////////////////////////////////
    if(!req.body) {
        return res.status(400).send({
        message: "Note content can not be empty"
    });
    }
    if(req.body.image_data)
    {
        var where = { 
            title:req.body.title,
            description:req.body.description,
            image:req.body.image_data};
    }
    else{
        var where = { 
          title:req.body.title,
          description:req.body.description};
    }
    New.findByIdAndUpdate({ _id: id },where,{new: true}, function(err, result) {
    if (err) {
        $message ={message:'Something went wrong'}
        req.flash("errors",$message)
        return res.redirect('/edit-news/'+id+'/'+event_id);
    } else {
        req.session.auth =result;
        $message ={msg:'News updated successfully'}
        req.flash("errors",$message)
        return res.redirect('/edit-news/'+id+'/'+event_id);
    }
    });
}
const deleteNews = (req,res)=>{
    
  New.findByIdAndRemove(req.params.id, (err,data)=> {
   if(typeof data == 'undefined' ){
    $message ={message:'Data not exist!'}
    req.flash("errors",$message)
    return res.redirect('/news-list/'+req.params.event_id);
    }
    if(err){
        $message ={message:'Something went wrong'}
        req.flash("errors",$message)
        return res.redirect('/news-list/'+req.params.event_id);
 }
    else{
      if(data){
        $message ={msg:'News delete successfully'}
        req.flash("errors",$message)
        return res.redirect('/news-list/'+req.params.event_id);
      }
      }
 })

}

module.exports={
  addnews,
  addNewsPost,
  getNews,
  editNews,
  updateNews,
  deleteNews
}