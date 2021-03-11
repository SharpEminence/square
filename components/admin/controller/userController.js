var User = require("../../../models/User");
const timestamp = require('time-stamp');
created_date = timestamp.utc('YYYY-MM-DD HH:mm:ss');
var md5 = require('md5');
const { validationResult } = require ('express-validator');
var moment = require('moment');
const { sortBy } = require("async");

  // 1 for admin , 2 for client, 3 for front users , 4 for sponsers, 5 for collaborator, 6 for speakers

  module.exports.AddUser = async (req, res) => {
    //console.log('req.params.event_id');
    //console.log(req.params.event_id);
    if (typeof req.flash("formdata") == "undefined") {
      var formdata = {
        first_name: "",
        last_name: "",
        email: "",
      };
      req.flash("formdata", formdata);
    }
    
    let active = "Event";
    let title = "Add User";
    let right_active = "User";
    let left_side = "active";
  
    ///console.log('data');
    //console.log(data);
    res.render("user/add_user", {
      layout: "layouts/eventLayout",
      active,
      title,
      right_active,
      left_side,
      formdata: req.flash("formdata"),
      event_id: req.params.event_id,
      errors: req.flash("errors"),
      reset: req.flash("reset"),
    });
  };



module.exports.addUserPost = async (req, res) => {
    var formdata = {
      event: req.params.event_id,
      // agenda_type: req.body.agenda_type,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
    };
    ///////////// Validate request//////////////////////////
    const errors = validationResult(req);
  
    let errorsData = {
        first_name: "",
        last_name: "",
        email: "",
    };
    if (errors.array().length > 0) {
      errors.array().forEach((value) => {
        errorsData[value.param] = value.msg;
      });
  
      req.flash("errors", errorsData);
      req.flash("formdata", formdata);
      return res.redirect("/add-user/" + req.params.event_id);
    }
    ////////////////////////////////////////////////////////////
    if (!req.body) {
      return res.status(400).send({
        message: "Note content can not be empty",
      });
    }
  
  
    const isEmailExist =await User.findOne({
        email:req.body.email,
        event: req.params.event_id,
    })
    if(isEmailExist){
       
        errorsData.email = "Email already exist."
        req.flash("errors",errorsData); 
        req.flash("formdata", formdata);
        return res.redirect('/add-user/'+ req.params.event_id);
    }
  
      
    const Users = new User({
      event: req.params.event_id,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email.trim().toLowerCase(),
      role:3,
      password: md5("samko2021"),
      created_at: created_date,
      updated_at: created_date,
    });
  
    // Save Speakers in the database
    Users.save()
      .then((data) => {
        $message = { msg: "User added successfully!" };
        req.flash("errors", $message);
        return res.redirect("/add-user/" + req.params.event_id);
      })
      .catch((err) => {
        console.log(err);
        $message = { message: "Some error occurred!" };
        req.flash("formdata", formdata);
        req.flash("errors", $err);
        return res.redirect("/add-user/" + req.params.event_id);
      });
  };


  module.exports.editFrontUser = async (req, res) => {
    let id = req.params.id;
    let event_id = req.params.event_id;
    await User.findOne({ _id: id }, async function (err, user) {
      if (err) {
        $message = { msg: "Something went wrong" };
        req.flash("errors", $message);
        return res.redirect("/edit-user/" + id + "/" + event_id);
      } else {
        let data = user;
        let active = "Event";
        let title = "Edit User";
        let right_active = "User";
        let left_side = "active";
      
        res.render("user/edit_user", {
          layout: "layouts/eventLayout",
          event_id,
          active,
          moment,
          title,
          right_active,
          left_side,
          errors: req.flash("errors"),
          data,
        });
      }
    });
  };

  module.exports.updateFrontuser = async (req, res) => {
    let id = req.params.id;
    let event_id = req.params.event_id;
    ///////////// Validate request//////////////////////////
    const errors = validationResult(req);
  
    let errorsData = {
        first_name: "",
        last_name: "",
    };
    if (errors.array().length > 0) {
      errors.array().forEach((value) => {
        errorsData[value.param] = value.msg;
      });
  
      req.flash("errors", errorsData);
      return res.redirect("/edit-user/" + id + "/" + event_id);
    }
    ////////////////////////////////////////////////////////////
    if (!req.body) {
      return res.status(400).send({
        message: "Note content can not be empty",
      });
    }
  
    
  
    var where = {
      // agenda_type: req.body.agenda_type,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      updated_at: created_date,
    };
    
  
    User.findByIdAndUpdate({ _id: id }, where, { new: true }, function (
      err,
      result
    ) {
      if (err) {
        $message = { message: "Something went wrong" };
        req.flash("errors", $message);
        return res.redirect("/edit-user/" + id + "/" + event_id);
      } else {
        req.session.auth = result;
        $message = { msg: "User updated successfully" };
        req.flash("errors", $message);
        return res.redirect("/edit-user/" + id + "/" + event_id);
      }
    });
  };

module.exports.getUser = async(req,res)=>{
    $where = {event:req.params.event_id,role:3,status:1};
   
    await User.find($where).populate('event').sort({_id:-1}).exec(async(err,userObj) => {
        if(err){
          $message ={message:'Something went wrong'}
        req.flash("errors",$message)
        return res.redirect('/user-list/'+req.params.event_id);
        } 
        else{
            let data = userObj;
            let active = 'Event';
            let title = 'Users List';
            let right_active = 'User';
            let left_side = 'active';
             return  res.render('user/user_list',{layout: 'layouts/eventLayout',event_id:req.params.event_id,active,title,right_active,left_side,data,moment:moment , errors:req.flash("errors"), message:req.flash("message")});
         
        }
      });
}

module.exports.createUser = (req,res)=>{

   if(!req.body) {
    return res.status(400).send({
        message: "Note content can not be empty"
    });
    }

    // Create a User
    const Users = new User({
             first_name:req.body.first_name,
            email:req.body.email,
            mobile_number:req.body.mobile_number,
            role:1,
            status:1,
            password:md5(req.body.password),
            password_reset_code:0,
            profile_img:'user.png',
            created_at:created_date,
            updated_at:created_date
    });
    // Save User in the database
    Users.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the user."
        });
    })
} 



module.exports.editUser = (req,res)=>
{
    
    let id= req.session.user_data.user_id;
    User.findOne({_id:id},function(err, user)
    { 
       if(err)
       {
          $message ={msg:'Something went wrong'}
          req.flash("errors",$message)
          return res.redirect('/edit-admin');
       } 
       else
       {
          let data = user; 
          let active = 'User';
          let title = 'Edit User';
         res.render('user/editUser',{active,title,errors:req.flash("errors"),data});
        }
    });
}


module.exports.updateUser = (req,res)=>{
        let id = req.params.id;
        ///////////// Validate request//////////////////////////
        const errors = validationResult(req);
         
        let errorsData = {first_name:'' ,last_name:'',profile_img:''  };
        if (errors.array().length > 0)
        { 
            errors.array().forEach((value)  => 
        {
            errorsData[value.param] = value.msg;    
        });

            req.flash("errors",errorsData); 
            return res.redirect('/edit-admin');
         }
        ////////////////////////////////////////////////////////////
        if(!req.body) {
            return res.status(400).send({
            message: "Note content can not be empty"
         });
     }
     
    var where = { first_name:req.body.first_name,last_name:req.body.last_name,mobile_number:req.body.mobile_number,profile_img:req.body.profile_img};
   
       
     
    User.findByIdAndUpdate({ _id: id },where,{new: true}, function(err, result) 
    {
        if (err) 
        {
            $message ={message:'Something went wrong'}
            req.flash("errors",$message)
            return res.redirect('/edit-admin');
        } 
        else 
        {
            req.session.user_data = {user_id:result._id, profile_img:result.profile_img, fullname:result.first_name+' '+result.last_name,role:result.role};
            $message ={msg:'Admin updated successfully'}
            req.flash("errors",$message)
            return res.redirect('/edit-admin');
        }
    });
}


  ////////////////////////
module.exports.resetPassword = (req,res)=>{
    let active = 'User';
          let title = 'Reset Password';
    res.render('user/resetPassword',{active,title,errors:req.flash("errors") ,success:req.flash("success") });
}
  
module.exports.updatePassword = (req,res)=>
{
      let id= req.session.user_data.user_id;
          ///////////// Validate request//////////////////////////
          const errors = validationResult(req);
          
          let errorsData = {old_password:'' ,new_password:'' ,confirm_password:''};
          if (errors.array().length > 0)
          { 
            errors.array().forEach((value)  => 
            {
              errorsData[value.param] = value.msg;    
            });
            req.flash("errors",errorsData); 
            return res.redirect('/change-password');
          }
          if(req.body.new_password != req.body.confirm_password)
          {
              $message ={message:'New password and confirm password must be matched!'}
              req.flash("errors",$message)
              return res.redirect('/change-password');
          }
        ////////////////////////////////////////////////////////////
        if(!req.body) {
         return res.status(400).send({
             message: "Note content can not be empty"
         });
      }
      $where = {password:md5(req.body.old_password)};
      User.findOne($where,function(err, user) 
      {
         if(user)
         {
              //update Password of institute
              User.findByIdAndUpdate({ _id: id },{password:md5(req.body.confirm_password)}, function(err, result)
              {
                  if (err) {
                  $message ={msg:'Something went wrong'}
                  req.flash("errors",$message)
                      return res.redirect('/change-password');
                  } else {
                      $message = {msg:'Password changed successfully!'};
                      req.flash('errors', $message); 
                     return  res.redirect('/change-password');
                  }
              });
         }
         else{
          $errors = {message:'Old password must be matched!'};
          req.flash('errors', $errors);   
          return res.redirect('/change-password');
         }
      });
  
} 
   

module.exports.delete_user = (req,res)=>{
    var where = { status:2};

    User.findByIdAndUpdate({ _id: req.params.id, },where,{new: true}, function(err, result) 
    {
        if (err) 
        {
            $message ={message:'Something went wrong'}
          req.flash("errors",$message)
          return res.redirect('/user-list/'+req.params.event_id);
        } 
        else 
        {
            $message ={msg:'User delete successfully'}
            req.flash("errors",$message)
            return res.redirect('/user-list/'+req.params.event_id);
        }
    });
    
//     User.findByIdAndRemove(req.params.id, (err,data)=> {
//      if(typeof data == 'undefined' ){
//       $message ={message:'Data not exist!'}
//       req.flash("errors",$message)
//       return res.redirect('/user-list/'+req.params.event_id);
//       }
//       if(err){
//           $message ={message:'Something went wrong'}
//           req.flash("errors",$message)
//           return res.redirect('/user-list/'+req.params.event_id);
//    }
//       else{
//         if(data){
//           $message ={msg:'User delete successfully'}
//           req.flash("errors",$message)
//           return res.redirect('/user-list/'+req.params.event_id);
//         }
//         }
//    })
  
}

   

