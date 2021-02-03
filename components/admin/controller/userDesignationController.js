var UserDesignation = require("../../../models/UserDesignation");
const timestamp = require('time-stamp');
created_date = timestamp.utc('YYYY-MM-DD HH:mm:ss');
const { validationResult } = require ('express-validator');
var moment = require('moment');

module.exports.addDesignation = (req,res)=>{
   
    if(typeof req.flash('data')=='undefined')
    {
        var data = {
            designation:'',
        };
        req.flash("data",data);
    }
    
    let active = 'Designation';
    let title = 'Add Designation';
     res.render('user_designation/add_designation',{active,title,data: req.flash('data'),errors:req.flash('errors'),reset:req.flash("reset")});
}

module.exports.addDesignationPost = (req,res)=>{

    var data = {title:req.body.title};
    ///////////// Validate request//////////////////////////
    const errors = validationResult(req);
    let errorsData = {
        name:'',
                };
    if (errors.array().length > 0)
    { 
        errors.array().forEach((value)  => 
    {
        errorsData[value.param] = value.msg;    
    });

        req.flash("errors",errorsData); 
        req.flash("data",data); 
        return res.redirect('add-designation');
     }
    ////////////////////////////////////////////////////////////
    if(!req.body) {
        return res.status(400).send({
        message: "Note content can not be empty"
     });
    }

   
$where = {title:req.body.title};
UserDesignation.findOne($where,function(err, user) 
    {
       if(user)
       {
        $message = {message:'Designation already exist!'};
            req.flash('errors', $message);   
            req.flash("data",data); 
            return res.redirect('add-designation');
       
       }
       else{
            // Create a User
    const designation = new UserDesignation({
        title:req.body.title,
       created_at:created_date,
       updated_at:created_date
    });

            // Save User in the database
            designation.save()
            .then(data => {
                $message = {msg:'Designation saved successfully!'};
                req.flash('errors', $message);    
                return res.redirect('add-designation');
            }).catch(err => {
                $message = {message:'Some error occurred!'};
                req.flash('errors', $message);  
                return res.redirect('add-designation');
            
            })
        }
    });
 

}
   

module.exports.getDesignation = (req,res)=>{
    UserDesignation.find({
        $or: [
          { isDeleted: { $exists:false } },
          { isDeleted:false }
        ]},function(err, userObj){ 
        if(err){
          $message ={message:'Something went wrong'}
        req.flash("errors",$message)
        return res.redirect('designation-list');
        } 
        else{
          let data = userObj;
          let active = 'Designation';
          let title =  'Designation List';
             return  res.render('user_designation/designation_list',{active,title,data,moment , errors:req.flash("errors"), message:req.flash("message")});
         
        }
      });
 
    
}


module.exports.editDesignation = (req,res)=>
{
    let id= req.params.id;
    UserDesignation.findOne({_id:id},function(err, user)
    { 
       if(err)
       {
          $message ={message:'Something went wrong'}
          req.flash("errors",$message)
          return res.redirect('edit-designation');
       } 
       else
       {
          
          let data = user; 
          //data.profile_img = process.env.IMAGE_URL+user.profile_img;
         // console.log(data);
         let active = 'Designation';
          let title =  'Edit Designation';
         res.render('user_designation/edit_designation',{active,title,errors:req.flash("errors"),data});
        }
    });
}


module.exports.updateDesignation = (req,res)=>{
  
  let id = req.params.id;
  ///////////// Validate request//////////////////////////
  const errors = validationResult(req);
 
  let errorsData = {
    designation:''
  };
  if (errors.array().length > 0)
  { 
    errors.array().forEach((value)  => 
    {
      errorsData[value.param] = value.msg;    
    });

    req.flash("errors",errorsData); 
    return res.redirect('edit-designation');
 }
////////////////////////////////////////////////////////////
    if(!req.body) {
        return res.status(400).send({
        message: "Note content can not be empty"
    });
    }

    var where = { title:req.body.title};
    UserDesignation.findByIdAndUpdate({ _id: id },where,{new: true}, function(err, result) {
    if (err) {
        $message ={message:'Something went wrong'}
        req.flash("errors",$message)
        return res.redirect('/edit-designation/'+id);
    } else {
        req.session.auth =result;
        $message ={msg:'Designation updated successfully'}
        req.flash("errors",$message)
        return res.redirect('/edit-designation/'+id);
    }
    });
}

module.exports.deleteDesignation = (req,res)=>{
  
    let id = req.params.id;
    if(id!=""){
        var where = { isDeleted:true};
        UserDesignation.updateOne({ _id: id },where, function(err, result) {
            if (err) {
                $message ={message:'Something went wrong'}
                req.flash("errors",$message)
                return res.redirect('/designation-list');
            } else {
                req.session.auth =result;
                $message ={msg:'Designation deleted successfully'}
                req.flash("errors",$message)
                return res.redirect('/designation-list');
            }
        });
    }else{
        $message ={message:'Designation id is missing'}
        req.flash("errors",$message)
        return res.redirect('/designation-list');
    }
  }
  

   

