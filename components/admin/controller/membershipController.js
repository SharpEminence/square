var MembershipType = require("../../../models/MembershipType");
const timestamp = require('time-stamp');
created_date = timestamp.utc('YYYY-MM-DD HH:mm:ss');
const { validationResult } = require ('express-validator');
var moment = require('moment');

module.exports.addMembership = (req,res)=>{
   
    if(typeof req.flash('data')=='undefined')
    {
        var data = {
            membership:'',
        };
        req.flash("data",data);
    }
    
    let active = 'Membership';
    let title = 'Add Membership';
     res.render('membership/add_membership',{active,title,data: req.flash('data'),errors:req.flash('errors'),reset:req.flash("reset")});
}

module.exports.addMembershipPost = (req,res)=>{

    var data = {membership:req.body.membership};
    ///////////// Validate request//////////////////////////
    const errors = validationResult(req);
     
    let errorsData = {
        membership:'',
                };
    if (errors.array().length > 0)
    { 
        errors.array().forEach((value)  => 
    {
        errorsData[value.param] = value.msg;    
    });

        req.flash("errors",errorsData); 
        req.flash("data",data); 
        return res.redirect('/add-membership');
     }
    ////////////////////////////////////////////////////////////
    if(!req.body) {
        return res.status(400).send({
        message: "Note content can not be empty"
     });
    }


   
$where = {membership:req.body.membership};
MembershipType.findOne($where,function(err, user) 
    {
       if(user)
       {
        $message = {message:'Membership already exist!'};
            req.flash('errors', $message);   
            req.flash("data",data); 
            return res.redirect('/add-membership');
       
       }
       else{
            // Create a User
    const memberships = new MembershipType({
        membership:req.body.membership,
       created_at:created_date,
       updated_at:created_date
    });

            // Save User in the database
            memberships.save()
            .then(data => {
                $message = {msg:'Membership saved successfully!'};
                req.flash('errors', $message);    
                return res.redirect('/add-membership');
            }).catch(err => {
                $message = {message:'Some error occurred!'};
                req.flash('errors', $message);  
                return res.redirect('/add-membership');
            
            })
        }
    });
 

}
   

module.exports.getMembership = (req,res)=>{
    MembershipType.find(function(err, userObj){ 
        if(err){
          $message ={message:'Something went wrong'}
        req.flash("errors",$message)
        return res.redirect('/membership-list');
        } 
        else{
          let data = userObj;
          let active = 'Membership';
          let title =  'Membership List';
             return  res.render('membership/membership_list',{active,title,data,moment , errors:req.flash("errors"), message:req.flash("message")});
         
        }
      });
}


module.exports.editMembership = (req,res)=>
{
    let id= req.params.id;
    MembershipType.findOne({_id:id},function(err, user)
    { 
       if(err)
       {
          $message ={message:'Something went wrong'}
          req.flash("errors",$message)
          return res.redirect('/edit-membership');
       } 
       else
       {
          
          let data = user; 
          //data.profile_img = process.env.IMAGE_URL+user.profile_img;
         // console.log(data);
         let active = 'Membership';
          let title =  'Edit Membership';
         res.render('membership/edit_membership',{active,title,errors:req.flash("errors"),data});
        }
    });
}


module.exports.updateMembership = (req,res)=>{
  
  let id = req.params.id;
  ///////////// Validate request//////////////////////////
  const errors = validationResult(req);
 
  let errorsData = {
    category:''
  };
  if (errors.array().length > 0)
  { 
    errors.array().forEach((value)  => 
    {
      errorsData[value.param] = value.msg;    
    });

    req.flash("errors",errorsData); 
    return res.redirect('/edit-membership');
 }
////////////////////////////////////////////////////////////
    if(!req.body) {
        return res.status(400).send({
        message: "Note content can not be empty"
    });
    }

    var where = { membership:req.body.membership};
    MembershipType.findByIdAndUpdate({ _id: id },where,{new: true}, function(err, result) {
    if (err) {
        $message ={message:'Something went wrong'}
        req.flash("errors",$message)
        return res.redirect('/edit-membership/'+id);
    } else {
        req.session.auth =result;
        $message ={msg:'Membership updated successfully'}
        req.flash("errors",$message)
        return res.redirect('/edit-membership/'+id);
    }
    });
}

   

